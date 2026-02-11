"use client";

import { useState, useEffect } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { Trash2, ArrowLeft, AlertTriangle, UserPlus, Loader2, Save, Hash, AtSign, Smartphone } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Toaster, toast } from "sonner";

export default function GererEntraineursPage() {
  const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const router = useRouter();
  const [trainers, setTrainers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    const checkAdminAndFetch = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/login"); return; }

      const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

      if (profile?.role?.toLowerCase().trim() !== 'admin') {
        router.push("/infos/entraineurs");
        return;
      }
      fetchTrainers();
    };
    checkAdminAndFetch();
  }, [supabase, router]);

  const fetchTrainers = async () => {
    const { data } = await supabase
    .from('trainers')
    .select('*')
    .order('order_index', { ascending: true });

    if (data) setTrainers(data);
    setLoading(false);
  };

  const handleAdd = async () => {
    if (isAdding) return;
    setIsAdding(true);
    const nextOrder = trainers.length > 0
        ? Math.max(...trainers.map(t => t.order_index)) + 1
        : 1;

    const newTrainer = {
      name: "Nouvel Entraîneur",
      sigle: "ACD",
      order_index: nextOrder,
      phone: "",
      email: ""
    };

    const { data, error } = await supabase.from('trainers').insert(newTrainer).select();

    if (!error && data) {
      setTrainers([...trainers, data[0]]);
      toast.success("Coach ajouté avec succès !");
      setTimeout(() => {
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
      }, 300);
    } else {
      toast.error("Erreur lors de l'ajout");
    }
    setIsAdding(false);
  };

  const handleUpdate = async (id: string, updates: any) => {
    const { error } = await supabase.from('trainers').update(updates).eq('id', id);
    if (!error) {
      setTrainers(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
    } else {
      toast.error("Erreur de mise à jour");
    }
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    const { error } = await supabase.from('trainers').delete().eq('id', deleteId);
    if (!error) {
      setTrainers(trainers.filter(t => t.id !== deleteId));
      toast.success("Entraîneur retiré de l'équipe");
    }
    setDeleteId(null);
  };

  if (loading) return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white gap-4">
        <Loader2 className="animate-spin text-red-600" size={40} />
        <p className="text-[10px] font-black uppercase italic tracking-[0.3em] text-slate-400">Accès sécurisé en cours...</p>
      </div>
  );

  return (
      <div className="min-h-screen bg-slate-50/50">
        <Toaster position="bottom-right" richColors />

        {/* MODAL DE SUPPRESSION */}
        {deleteId && (
            <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-[100] flex items-center justify-center p-4">
              <div className="bg-white rounded-[2.5rem] p-10 max-w-sm w-full shadow-2xl border border-white animate-in fade-in zoom-in duration-300">
                <div className="w-20 h-20 bg-red-50 text-red-600 rounded-3xl flex items-center justify-center mb-6 mx-auto">
                  <AlertTriangle size={40} />
                </div>
                <h3 className="text-2xl font-black text-slate-900 uppercase italic text-center mb-2 tracking-tighter">Confirmer ?</h3>
                <p className="text-slate-500 text-center text-sm font-medium mb-8 leading-relaxed italic">
                  Cette action retirera définitivement cet entraîneur de la liste publique.
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
          {/* NAVIGATION & HEADER */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-8">
            <Link href="/infos/entraineurs" className="group flex items-center gap-3 text-slate-400 hover:text-red-600 transition-all font-black uppercase text-[10px] italic tracking-widest">
              <div className="p-2 bg-white rounded-lg shadow-sm group-hover:bg-red-600 group-hover:text-white transition-all">
                <ArrowLeft size={14} />
              </div>
              Retour
            </Link>

            <div className="text-center">
              <h1 className="text-4xl font-black text-slate-900 uppercase italic tracking-tighter">
                GESTION <span className="text-red-600 italic">STAFF</span>
              </h1>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.4em] mt-2">Console d'administration</p>
            </div>

            <button
                onClick={handleAdd}
                disabled={isAdding}
                className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black uppercase italic text-xs hover:bg-red-600 transition-all flex items-center gap-3 shadow-2xl active:scale-95 disabled:opacity-50"
            >
              {isAdding ? <Loader2 size={18} className="animate-spin" /> : <UserPlus size={18} />}
              {isAdding ? "Création..." : "Ajouter un coach"}
            </button>
          </div>

          {/* LISTE DES FORMULAIRES */}
          <div className="grid grid-cols-1 gap-6 max-w-6xl mx-auto">
            {trainers.map((t) => (
                <div key={t.id}
                     className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm flex flex-col lg:flex-row items-center gap-8 group hover:border-red-600/30 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-500 animate-in slide-in-from-bottom-4">

                  {/* SECTION ORDRE & IDENTITÉ VISUELLE */}
                  <div className="flex gap-4 items-center shrink-0">
                    <div className="flex flex-col gap-2">
                      <label className="flex items-center gap-1 text-[9px] font-black uppercase text-slate-400 ml-1 italic"><Hash size={10}/> Rang</label>
                      <input
                          type="number"
                          value={t.order_index}
                          onChange={(e) => handleUpdate(t.id, { order_index: parseInt(e.target.value) || 0 })}
                          className="w-16 bg-slate-50 border-2 border-slate-50 rounded-2xl p-4 font-black text-center text-slate-900 focus:border-red-600 focus:bg-white outline-none transition-all shadow-inner"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-[9px] font-black uppercase text-slate-400 ml-1 italic">Initials</label>
                      <input
                          type="text"
                          value={t.sigle}
                          maxLength={3}
                          onChange={(e) => handleUpdate(t.id, { sigle: e.target.value.toUpperCase() })}
                          className="w-16 bg-slate-900 text-white border-2 border-slate-900 rounded-2xl p-4 font-black text-center italic focus:bg-red-600 focus:border-red-600 outline-none transition-all shadow-lg"
                      />
                    </div>
                  </div>

                  {/* INPUTS DE DONNÉES */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-grow w-full">
                    <div className="flex flex-col gap-2">
                      <label className="text-[9px] font-black uppercase text-slate-400 ml-1 italic tracking-widest">Nom complet</label>
                      <input
                          type="text"
                          value={t.name}
                          placeholder="Ex: Jean Dupont"
                          onChange={(e) => handleUpdate(t.id, { name: e.target.value })}
                          className="bg-slate-50 border-2 border-slate-50 rounded-2xl p-4 font-bold text-slate-900 focus:border-red-600 focus:bg-white outline-none transition-all"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="flex items-center gap-1 text-[9px] font-black uppercase text-slate-400 ml-1 italic tracking-widest"><Smartphone size={10}/> Téléphone</label>
                      <input
                          type="text"
                          value={t.phone || ""}
                          placeholder="04xx / xx.xx.xx"
                          onChange={(e) => handleUpdate(t.id, { phone: e.target.value })}
                          className="bg-slate-50 border-2 border-slate-50 rounded-2xl p-4 font-bold text-slate-600 outline-none focus:border-red-600 focus:bg-white transition-all"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="flex items-center gap-1 text-[9px] font-black uppercase text-slate-400 ml-1 italic tracking-widest"><AtSign size={10}/> Email</label>
                      <input
                          type="email"
                          value={t.email || ""}
                          placeholder="coach@acd.be"
                          onChange={(e) => handleUpdate(t.id, { email: e.target.value })}
                          className="bg-slate-50 border-2 border-slate-50 rounded-2xl p-4 font-bold text-slate-600 outline-none focus:border-red-600 focus:bg-white transition-all"
                      />
                    </div>
                  </div>

                  {/* ACTIONS */}
                  <div className="flex lg:flex-col gap-2">
                    <button
                        onClick={() => setDeleteId(t.id)}
                        className="p-4 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-2xl transition-all"
                        title="Supprimer"
                    >
                      <Trash2 size={22} />
                    </button>
                  </div>
                </div>
            ))}
          </div>
        </main>
      </div>
  );
}