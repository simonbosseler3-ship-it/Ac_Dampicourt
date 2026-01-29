"use client";

import { useState, useEffect } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { Trash2, ArrowLeft, AlertTriangle, UserPlus } from "lucide-react";
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

  // État pour la modal de suppression
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

      if (profile?.role?.toLowerCase() !== 'admin') {
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
      toast.success("Coach ajouté en bas de liste !");

      // Scroll vers le bas pour voir la nouvelle case
      setTimeout(() => {
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
      }, 150);
    }
    setIsAdding(false);
  };

  const handleUpdate = async (id: string, updates: any) => {
    const { error } = await supabase.from('trainers').update(updates).eq('id', id);
    if (!error) {
      setTrainers(trainers.map(t => t.id === id ? { ...t, ...updates } : t));
    }
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    const { error } = await supabase.from('trainers').delete().eq('id', deleteId);
    if (!error) {
      setTrainers(trainers.filter(t => t.id !== deleteId));
      toast.error("Entraîneur retiré");
    }
    setDeleteId(null);
  };

  if (loading) return (
      <div className="min-h-screen flex items-center justify-center font-black italic text-slate-400 uppercase">
        Chargement de l'interface admin...
      </div>
  );

  return (
      <div className="min-h-screen">
        <Toaster position="bottom-right" richColors/>

        {/* MODAL DE SUPPRESSION PERSONNALISÉE */}
        {deleteId && (
            <div
                className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
              <div
                  className="bg-white rounded-[2rem] p-8 max-w-sm w-full shadow-2xl border border-slate-100 animate-in fade-in zoom-in duration-200">
                <div
                    className="w-16 h-16 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                  <AlertTriangle size={32}/>
                </div>
                <h3 className="text-xl font-black text-slate-900 uppercase italic text-center mb-2">Supprimer
                  ?</h3>
                <p className="text-slate-500 text-center text-sm font-medium mb-8 leading-relaxed">
                  Voulez-vous vraiment retirer cet entraîneur ? Cette action est définitive.
                </p>
                <div className="flex gap-3">
                  <button
                      onClick={() => setDeleteId(null)}
                      className="flex-1 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-100 transition-colors uppercase text-[10px]"
                  >
                    Annuler
                  </button>
                  <button
                      onClick={confirmDelete}
                      className="flex-1 py-3 rounded-xl bg-red-600 text-white font-black hover:bg-red-700 transition-colors uppercase text-[10px] italic shadow-lg shadow-red-200"
                  >
                    Confirmer
                  </button>
                </div>
              </div>
            </div>
        )}

        <main className="container mx-auto px-4 py-12 pt-32">

          {/* HEADER */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
            <Link href="/infos/entraineurs"
                  className="flex items-center gap-2 text-slate-500 hover:text-red-600 transition-colors font-bold uppercase text-xs italic">
              <ArrowLeft size={16}/> Retour
            </Link>
            <h1 className="text-3xl font-black text-slate-900 uppercase italic">
              Gestion <span className="text-red-600">Entraîneurs</span>
            </h1>
            <button
                onClick={handleAdd}
                disabled={isAdding}
                className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black uppercase italic text-xs hover:bg-red-600 transition-all flex items-center gap-2 shadow-xl"
            >
              <UserPlus size={18}/> {isAdding ? "Ajout..." : "Nouveau coach"}
            </button>
          </div>

          {/* LISTE DES FORMULAIRES */}
          <div className="grid grid-cols-1 gap-4 max-w-5xl mx-auto">
            {trainers.map((t) => (
                <div key={t.id}
                     className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col lg:flex-row items-center gap-6 group hover:border-red-100 transition-all animate-in slide-in-from-bottom-4 duration-500 ease-out">

                  {/* ORDRE & SIGLE */}
                  <div className="flex gap-4 items-center">
                    <div className="flex flex-col gap-1">
                      <label
                          className="text-[9px] font-black uppercase text-slate-400 ml-1">Ordre</label>
                      <input
                          type="number"
                          value={t.order_index}
                          onChange={(e) => handleUpdate(t.id, {order_index: parseInt(e.target.value) || 0})}
                          className="w-16 bg-slate-50 border-none rounded-xl p-3 font-black text-center text-slate-700 focus:ring-2 focus:ring-red-500"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label
                          className="text-[9px] font-black uppercase text-slate-400 ml-1">Sigle</label>
                      <input
                          type="text"
                          value={t.sigle}
                          maxLength={3}
                          onChange={(e) => handleUpdate(t.id, {sigle: e.target.value.toUpperCase()})}
                          className="w-16 bg-red-600 text-white border-none rounded-xl p-3 font-black text-center italic"
                      />
                    </div>
                  </div>

                  {/* INPUTS DE DONNÉES */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-grow w-full">
                    <div className="flex flex-col gap-1">
                      <label
                          className="text-[9px] font-black uppercase text-slate-400 ml-1 leading-none">Nom
                        Complet</label>
                      <input
                          type="text"
                          value={t.name}
                          onChange={(e) => handleUpdate(t.id, {name: e.target.value})}
                          className="bg-slate-50 border-none rounded-xl p-3 font-bold text-slate-900"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label
                          className="text-[9px] font-black uppercase text-slate-400 ml-1 leading-none">Téléphone</label>
                      <input
                          type="text"
                          value={t.phone || ""}
                          placeholder="GSM"
                          onChange={(e) => handleUpdate(t.id, {phone: e.target.value})}
                          className="bg-slate-50 border-none rounded-xl p-3 font-bold text-slate-600 text-sm"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label
                          className="text-[9px] font-black uppercase text-slate-400 ml-1 leading-none">Email</label>
                      <input
                          type="email"
                          value={t.email || ""}
                          placeholder="Email"
                          onChange={(e) => handleUpdate(t.id, {email: e.target.value})}
                          className="bg-slate-50 border-none rounded-xl p-3 font-bold text-slate-600 text-sm"
                      />
                    </div>
                  </div>

                  {/* SUPPRESSION */}
                  <button
                      onClick={() => setDeleteId(t.id)}
                      className="p-4 text-slate-200 hover:text-red-600 transition-colors"
                  >
                    <Trash2 size={20}/>
                  </button>
                </div>
            ))}
          </div>
        </main>
      </div>
  );
}