"use client";

import { useState, useEffect } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { Navbar } from "@/components/navbar/navbar";
import { Trash2, ArrowLeft, ShieldCheck, UserPlus, AlertTriangle, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Toaster, toast } from "sonner"; // Optionnel : npm install sonner

export default function GererOfficielsPage() {
  const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const router = useRouter();
  const [officials, setOfficials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);

  // États pour la modal de suppression personnalisée
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    const checkAdminAndFetch = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/login"); return; }

      const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
      if (profile?.role?.toLowerCase() !== 'admin') {
        router.push("/infos/officiels");
        return;
      }
      fetchOfficials();
    };
    checkAdminAndFetch();
  }, [supabase, router]);

  const fetchOfficials = async () => {
    const { data } = await supabase.from('officials').select('*').order('name', { ascending: true });
    if (data) setOfficials(data);
    setLoading(false);
  };

  const handleAdd = async () => {
    setIsAdding(true);
    const { data, error } = await supabase.from('officials').insert({ name: "Nouveau Juge" }).select();

    if (!error && data) {
      setOfficials([...officials, data[0]]);
      toast.success("Un nouvel officiel a été ajouté en bas de liste !");

      // Petit délai pour laisser le DOM se mettre à jour puis scroll
      setTimeout(() => {
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
      }, 100);
    }
    setIsAdding(false);
  };

  const handleUpdate = async (id: string, newName: string) => {
    const { error } = await supabase.from('officials').update({ name: newName }).eq('id', id);
    if (!error) {
      setOfficials(officials.map(o => o.id === id ? { ...o, name: newName } : o));
    }
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    const { error } = await supabase.from('officials').delete().eq('id', deleteId);
    if (!error) {
      setOfficials(officials.filter(o => o.id !== deleteId));
      toast.error("Officiel supprimé avec succès");
    }
    setDeleteId(null);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center font-black italic text-slate-400 uppercase">Chargement...</div>;

  return (
      <div className="min-h-screen">
        <Toaster position="bottom-right" richColors/>
        <Navbar/>

        {/* MODAL DE SUPPRESSION PERSONNALISÉE */}
        {deleteId && (
            <div
                className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
              <div
                  className="bg-white rounded-[32px] p-8 max-w-sm w-full shadow-2xl border border-slate-100 scale-in-center">
                <div
                    className="w-16 h-16 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                  <AlertTriangle size={32}/>
                </div>
                <h3 className="text-xl font-black text-slate-900 uppercase italic text-center mb-2">Supprimer
                  ?</h3>
                <p className="text-slate-500 text-center text-sm font-medium mb-8">
                  Cette action est irréversible. Voulez-vous vraiment retirer cet officiel ?
                </p>
                <div className="flex gap-3">
                  <button
                      onClick={() => setDeleteId(null)}
                      className="flex-1 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-100 transition-colors uppercase text-xs"
                  >
                    Annuler
                  </button>
                  <button
                      onClick={confirmDelete}
                      className="flex-1 py-3 rounded-xl bg-red-600 text-white font-black hover:bg-red-700 transition-colors uppercase text-xs italic shadow-lg shadow-red-200"
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            </div>
        )}

        <main className="container mx-auto px-4 py-12 pt-32">
          <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
            <Link href="/infos/officiels"
                  className="flex items-center gap-2 text-slate-500 hover:text-red-600 transition-colors font-bold uppercase text-xs italic">
              <ArrowLeft size={16}/> Retour
            </Link>
            <h1 className="text-3xl font-black text-slate-900 uppercase italic text-center">
              Gestion du <span className="text-red-600">Jury</span>
            </h1>
            <button
                onClick={handleAdd}
                disabled={isAdding}
                className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black uppercase italic text-xs hover:bg-red-600 transition-all flex items-center gap-3 shadow-xl"
            >
              <UserPlus size={18}/> {isAdding ? "Ajout..." : "Nouveau Juge"}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto">
            {officials.map((off) => (
                <div key={off.id}
                     className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4 group animate-in slide-in-from-bottom-2 duration-300">
                  <div
                      className="bg-slate-100 p-3 rounded-xl text-slate-400 group-hover:bg-red-600 group-hover:text-white transition-all">
                    <ShieldCheck size={20}/>
                  </div>
                  <div className="flex-grow">
                    <input
                        type="text"
                        value={off.name}
                        onChange={(e) => handleUpdate(off.id, e.target.value)}
                        className="w-full bg-transparent border-none p-0 font-bold text-slate-900 focus:ring-0 text-sm"
                    />
                  </div>
                  <button onClick={() => setDeleteId(off.id)}
                          className="p-2 text-slate-200 hover:text-red-600 transition-colors">
                    <Trash2 size={18}/>
                  </button>
                </div>
            ))}
          </div>
        </main>

        <style jsx>{`
          .scale-in-center {
            animation: scale-in-center 0.2s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
          }

          @keyframes scale-in-center {
            0% {
              transform: scale(0.9);
              opacity: 0;
            }
            100% {
              transform: scale(1);
              opacity: 1;
            }
          }
        `}</style>
      </div>
  );
}