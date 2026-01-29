"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { Trash2, Edit, AlertTriangle, EyeOff, Eye } from "lucide-react";
import Link from "next/link";

export function AdminActions({ id, isHidden }: { id: string, isHidden?: boolean }) {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false); // Renommé pour être plus générique
  const [showConfirm, setShowConfirm] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    const getRole = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();
        setUserRole(data?.role || null);
      }
    };
    getRole();
  }, []);

  // --- NOUVELLE FONCTION : Remettre en ligne ---
  const handleRestore = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsProcessing(true);

    const { error } = await supabase
    .from('news')
    .update({ is_hidden: false })
    .eq('id', id);

    if (error) {
      alert("Erreur lors de la remise en ligne");
    } else {
      router.refresh();
    }
    setIsProcessing(false);
  };

  // --- FONCTION EXISTANTE : Cacher ou Supprimer ---
  const handleAction = async () => {
    setIsProcessing(true);

    if (userRole === 'admin') {
      const { error } = await supabase.from('news').delete().eq('id', id);
      if (error) alert("Erreur lors de la suppression définitive");
      else finishAction();
    } else {
      const { error } = await supabase.from('news').update({ is_hidden: true }).eq('id', id);
      if (error) alert("Erreur lors de l'archivage");
      else finishAction();
    }
  };

  const finishAction = () => {
    setShowConfirm(false);
    setIsProcessing(false);
    router.refresh();
  };

  const modalContent = showConfirm && (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm" onClick={() => !isProcessing && setShowConfirm(false)} />
        <div className="relative bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl border border-slate-100 animate-in fade-in zoom-in duration-200">
          <div className="flex flex-col items-center text-center">
            <div className={`p-4 rounded-full mb-4 ${userRole === 'admin' ? 'bg-red-50' : 'bg-orange-50'}`}>
              {userRole === 'admin' ? <AlertTriangle className="h-8 w-8 text-red-600" /> : <EyeOff className="h-8 w-8 text-orange-600" />}
            </div>
            <h3 className="text-xl font-black italic uppercase text-slate-900 mb-2">
              {userRole === 'admin' ? "Supprimer ?" : "Cacher ?"}
            </h3>
            <p className="text-slate-500 text-sm mb-8">
              {userRole === 'admin' ? "Action irréversible en base de données." : "L'article sera masqué pour le public."}
            </p>
            <div className="flex gap-3 w-full">
              <button onClick={() => setShowConfirm(false)} className="flex-1 px-4 py-3 rounded-xl font-bold text-slate-600 hover:bg-slate-50 transition-colors">Annuler</button>
              <button onClick={handleAction} disabled={isProcessing} className={`flex-1 px-4 py-3 rounded-xl font-bold text-white transition-colors ${userRole === 'admin' ? 'bg-red-600 hover:bg-red-700' : 'bg-orange-600 hover:bg-orange-700'}`}>
                {isProcessing ? "..." : (userRole === 'admin' ? "Supprimer" : "Cacher")}
              </button>
            </div>
          </div>
        </div>
      </div>
  );

  return (
      <>
        <div className="flex gap-2">
          {/* --- BOUTON RESTAURER (Visible uniquement si l'article est caché et utilisateur Admin) --- */}
          {isHidden && userRole === 'admin' && (
              <button
                  onClick={handleRestore}
                  disabled={isProcessing}
                  className="bg-green-600 text-white p-2 rounded-lg hover:bg-green-700 shadow-lg transition-all active:scale-95 flex items-center justify-center"
                  title="Remettre en ligne"
              >
                <Eye size={16} />
              </button>
          )}

          <Link
              href={`/actualites/modifier/${id}`}
              onClick={(e) => e.stopPropagation()}
              className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 shadow-lg transition-transform active:scale-95 flex items-center justify-center"
          >
            <Edit size={16} />
          </Link>

          <button
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowConfirm(true); }}
              className="bg-slate-900 text-white p-2 rounded-lg hover:bg-red-600 shadow-lg transition-all active:scale-95 flex items-center justify-center"
          >
            <Trash2 size={16} />
          </button>
        </div>
        {mounted && createPortal(modalContent, document.body)}
      </>
  );
}