"use client";

import { useState, useEffect } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { Trash2, ArrowLeft, ShieldCheck, UserPlus, AlertTriangle, Loader2, Scale, Search } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Toaster, toast } from "sonner";

export default function GererOfficielsPage() {
  const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const router = useRouter();
  const [officials, setOfficials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const checkAdminAndFetch = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/login"); return; }

      const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
      if (profile?.role?.toLowerCase().trim() !== 'admin') {
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
    if (isAdding) return;
    setIsAdding(true);
    const { data, error } = await supabase.from('officials').insert({ name: "Nouveau Juge" }).select();

    if (!error && data) {
      setOfficials([...officials, data[0]]);
      toast.success("Membre ajouté au jury !");
      setTimeout(() => {
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
      }, 300);
    } else {
      toast.error("Erreur lors de l'ajout");
    }
    setIsAdding(false);
  };

  const handleUpdate = async (id: string, newName: string) => {
    const { error } = await supabase.from('officials').update({ name: newName }).eq('id', id);
    if (!error) {
      setOfficials(prev => prev.map(o => o.id === id ? { ...o, name: newName } : o));
    }
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    const { error } = await supabase.from('officials').delete().eq('id', deleteId);
    if (!error) {
      setOfficials(officials.filter(o => o.id !== deleteId));
      toast.success("Officiel retiré");
    }
    setDeleteId(null);
  };

  // Filtrage pour la recherche
  const filteredOfficials = officials.filter(off =>
      off.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white gap-4">
        <Loader2 className="animate-spin text-red-600" size={40} />
        <p className="text-[10px] font-black uppercase italic tracking-[0.3em] text-slate-400">Accès sécurisé jury...</p>
      </div>
  );

  return (
      <div className="min-h-screen">
        <Toaster position="bottom-right" richColors />

        {/* MODAL DE SUPPRESSION */}
        {deleteId && (
            <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-[100] flex items-center justify-center p-4">
              <div className="bg-white rounded-[2.5rem] p-10 max-w-sm w-full shadow-2xl border border-white animate-in zoom-in duration-300">
                <div className="w-20 h-20 bg-red-50 text-red-600 rounded-3xl flex items-center justify-center mb-6 mx-auto">
                  <AlertTriangle size={40} />
                </div>
                <h3 className="text-2xl font-black text-slate-900 uppercase italic text-center mb-2 tracking-tighter">Retirer ?</h3>
                <p className="text-slate-500 text-center text-sm font-medium mb-8 leading-relaxed italic">
                  Voulez-vous vraiment retirer ce membre du jury ? Cette action est définitive.
                </p>
                <div className="flex gap-3">
                  <button onClick={() => setDeleteId(null)} className="flex-1 py-4 rounded-2xl font-black text-slate-400 hover:bg-slate-100 transition-colors uppercase text-[10px] tracking-widest">
                    Annuler
                  </button>
                  <button onClick={confirmDelete} className="flex-1 py-4 rounded-2xl bg-red-600 text-white font-black hover:bg-red-700 transition-all uppercase text-[10px] italic shadow-xl shadow-red-200">
                    Supprimer
                  </button>
                </div>
              </div>
            </div>
        )}

        <main className="container mx-auto px-4 py-12 pt-32 pb-32">

          {/* HEADER SECTION */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-8">
            <Link href="/infos/officiels" className="group flex items-center gap-3 text-slate-400 hover:text-red-600 transition-all font-black uppercase text-[10px] italic tracking-widest">
              <div className="p-2 bg-white rounded-lg shadow-sm group-hover:bg-red-600 group-hover:text-white transition-all">
                <ArrowLeft size={14} />
              </div>
              Retour
            </Link>

            <div className="text-center">
              <h1 className="text-4xl font-black text-slate-900 uppercase italic tracking-tighter">
                GESTION <span className="text-red-600">JURY</span>
              </h1>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.4em] mt-2 italic">Officiels de compétition</p>
            </div>

            <button
                onClick={handleAdd}
                disabled={isAdding}
                className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black uppercase italic text-xs hover:bg-red-600 transition-all flex items-center gap-3 shadow-2xl active:scale-95"
            >
              {isAdding ? <Loader2 size={18} className="animate-spin" /> : <UserPlus size={18} />}
              Nouveau Juge
            </button>
          </div>

          {/* BARRE DE RECHERCHE */}
          <div className="max-w-md mx-auto mb-10 relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-red-600 transition-colors" size={18} />
            <input
                type="text"
                placeholder="RECHERCHER UN NOM..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white border-2 border-slate-100 rounded-2xl py-4 pl-12 pr-4 font-black italic uppercase text-[11px] tracking-widest outline-none focus:border-red-600 transition-all shadow-sm"
            />
          </div>

          {/* GRID DES OFFICIELS */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {filteredOfficials.map((off, index) => (
                <div
                    key={off.id}
                    style={{ animationDelay: `${index * 50}ms` }}
                    className="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-5 group hover:border-red-600/30 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 animate-in slide-in-from-bottom-2 fill-mode-backwards"
                >
                  <div className="bg-slate-900 text-white p-4 rounded-2xl group-hover:bg-red-600 transition-colors shadow-lg shadow-slate-200">
                    <ShieldCheck size={22} />
                  </div>

                  <div className="flex-grow">
                    <label className="text-[8px] font-black uppercase text-slate-300 tracking-[0.2em] block mb-1">Nom du Juge</label>
                    <input
                        type="text"
                        value={off.name}
                        onChange={(e) => handleUpdate(off.id, e.target.value)}
                        className="w-full bg-transparent border-none p-0 font-black italic uppercase text-slate-900 focus:ring-0 text-sm outline-none placeholder:text-slate-200"
                    />
                  </div>

                  <button
                      onClick={() => setDeleteId(off.id)}
                      className="p-3 text-slate-200 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                      title="Retirer"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
            ))}
          </div>

          {/* EMPTY STATE */}
          {filteredOfficials.length === 0 && (
              <div className="text-center py-32 bg-white/50 border-2 border-dashed border-slate-200 rounded-[3rem] max-w-2xl mx-auto mt-10">
                <Scale size={48} className="mx-auto text-slate-200 mb-6" />
                <p className="text-slate-400 font-black italic uppercase text-xs tracking-[0.2em]">
                  {searchTerm ? "Aucun résultat pour cette recherche" : "Le jury est actuellement vide"}
                </p>
                {searchTerm && (
                    <button onClick={() => setSearchTerm("")} className="mt-4 text-red-600 font-black uppercase text-[10px] italic hover:underline">
                      Effacer la recherche
                    </button>
                )}
              </div>
          )}

        </main>

        <div className="fixed bottom-8 left-8">
          <div className="bg-slate-900 text-white px-4 py-2 rounded-full font-black text-[9px] uppercase tracking-widest shadow-2xl flex items-center gap-2 border border-white/10 italic">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            Mode Édition Actif
          </div>
        </div>
      </div>
  );
}