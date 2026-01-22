"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { Trash2, Edit, AlertTriangle } from "lucide-react";
import Link from "next/link";

export function AdminActions({ id }: { id: string }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Sécurité pour le rendu côté serveur (SSR)
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleDelete = async () => {
    setIsDeleting(true);
    const { error } = await supabase.from('news').delete().eq('id', id);

    if (error) {
      alert("Erreur lors de la suppression de l'actualité");
      setIsDeleting(false);
    } else {
      setShowConfirm(false);
      router.refresh();
    }
  };

  // Le contenu de la modale
  const modalContent = showConfirm && (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
        {/* Overlay - Bloque tout l'écran */}
        <div
            className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (!isDeleting) setShowConfirm(false);
            }}
        />

        {/* Card Modale */}
        <div className="relative bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl border border-slate-100 animate-in fade-in zoom-in duration-200">
          <div className="flex flex-col items-center text-center">
            <div className="bg-red-50 p-4 rounded-full mb-4">
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>

            <h3 className="text-xl font-black italic uppercase text-slate-900 mb-2">
              Supprimer l'article ?
            </h3>

            <p className="text-slate-500 text-sm mb-8">
              Voulez-vous vraiment supprimer cette actualité ? Cette action est irréversible.
            </p>

            <div className="flex gap-3 w-full">
              <button
                  onClick={() => setShowConfirm(false)}
                  className="flex-1 px-4 py-3 rounded-xl font-bold text-slate-600 hover:bg-slate-50 transition-colors"
              >
                Annuler
              </button>
              <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="flex-1 px-4 py-3 rounded-xl font-bold bg-red-600 text-white flex justify-center items-center hover:bg-red-700 transition-colors"
              >
                {isDeleting ? <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : "Supprimer"}
              </button>
            </div>
          </div>
        </div>
      </div>
  );

  return (
      <>
        <div className="flex gap-2">
          <Link
              href={`/actualites/modifier/${id}`}
              onClick={(e) => e.stopPropagation()} // Empêche de déclencher le lien de la carte news
              className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 shadow-lg transition-transform active:scale-95 flex items-center justify-center"
          >
            <Edit size={16} />
          </Link>

          <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation(); // Très important pour ne pas ouvrir l'article en même temps
                setShowConfirm(true);
              }}
              className="bg-slate-900 text-white p-2 rounded-lg hover:bg-red-600 shadow-lg transition-all active:scale-95 flex items-center justify-center"
          >
            <Trash2 size={16} />
          </button>
        </div>

        {/* On téléporte la modale dans le body pour qu'elle soit au-dessus de TOUT */}
        {mounted && createPortal(modalContent, document.body)}
      </>
  );
}