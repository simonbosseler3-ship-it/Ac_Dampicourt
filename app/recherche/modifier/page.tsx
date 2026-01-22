"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import {
  User, Search as SearchIcon, Loader2, Plus,
  Pencil, Trash2, X, Save, ArrowLeft, AlertTriangle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function ModifierContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get("q") || "";

  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [localQuery, setLocalQuery] = useState(query);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAthlete, setEditingAthlete] = useState<any>(null);

  // ÉTATS POUR LA SUPPRESSION
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [athleteToDelete, setAthleteToDelete] = useState<any>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    annee_naissance: "",
    categorie: "",
    num_dossard: "",
    life_number: ""
  });

  const fetchAthletes = async () => {
    setLoading(true);
    let q = supabase.from("athletes").select("*");
    if (query) {
      q = q.or(`nom.ilike.%${query}%,prenom.ilike.%${query}%`);
    }
    const { data, error } = await q.order("nom", { ascending: true }).limit(50);
    if (!error) setResults(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchAthletes();
  }, [query]);

  const handleLocalSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/recherche/modifier?q=${encodeURIComponent(localQuery)}`);
  };

  const openModal = (athlete: any = null) => {
    if (athlete) {
      setEditingAthlete(athlete);
      setFormData({
        nom: athlete.nom,
        prenom: athlete.prenom,
        annee_naissance: athlete.annee_naissance?.toString() || "",
        categorie: athlete.categorie || "",
        num_dossard: athlete.num_dossard || "",
        life_number: athlete.life_number || ""
      });
    } else {
      setEditingAthlete(null);
      setFormData({ nom: "", prenom: "", annee_naissance: "", categorie: "", num_dossard: "", life_number: "" });
    }
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    const payload = {
      ...formData,
      annee_naissance: parseInt(formData.annee_naissance) || null
    };
    if (editingAthlete) {
      const { error } = await supabase.from("athletes").update(payload).eq("id", editingAthlete.id);
      if (error) alert("Erreur modification");
    } else {
      const { error } = await supabase.from("athletes").insert([payload]);
      if (error) alert("Erreur ajout");
    }
    setIsModalOpen(false);
    fetchAthletes();
  };

  // NOUVELLE FONCTION DE SUPPRESSION STYLISÉE
  const confirmDelete = async () => {
    if (!athleteToDelete) return;
    setIsDeleting(true);
    const { error } = await supabase.from("athletes").delete().eq("id", athleteToDelete.id);

    if (error) {
      alert("Erreur lors de la suppression");
    } else {
      fetchAthletes();
      setShowDeleteConfirm(false);
    }
    setIsDeleting(false);
  };

  return (
      <main className="container mx-auto px-4 pt-32 pb-20 min-h-screen">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div className="flex items-center gap-4">
            <Button
                variant="outline"
                onClick={() => router.push('/recherche')}
                className="rounded-xl border-slate-200 text-slate-500 hover:text-red-600"
            >
              <ArrowLeft size={18} className="mr-2" /> Retour
            </Button>
            <h1 className="text-2xl font-black uppercase italic tracking-tighter">
              Mode <span className="text-red-600">Edition</span>
            </h1>
          </div>

          <form onSubmit={handleLocalSearch} className="flex gap-2">
            <Input
                placeholder="Filtrer la liste..."
                value={localQuery}
                onChange={(e) => setLocalQuery(e.target.value)}
                className="w-64 rounded-xl bg-white shadow-sm"
            />
            <Button type="submit" className="bg-slate-900 rounded-xl">Filtrer</Button>
          </form>
        </div>

        <div
            onClick={() => openModal()}
            className="mb-8 p-6 border-2 border-dashed border-slate-200 rounded-[32px] flex items-center justify-center gap-3 text-slate-400 hover:text-red-600 hover:border-red-200 hover:bg-red-50/30 transition-all cursor-pointer group"
        >
          <Plus className="group-hover:scale-125 transition-transform" />
          <span className="font-black uppercase italic text-sm">Ajouter manuellement un nouvel athlète</span>
        </div>

        {loading ? (
            <div className="flex justify-center py-20"><Loader2 className="animate-spin text-red-600" size={40} /></div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.map((athlete) => (
                  <div key={athlete.id} className="bg-white border border-slate-100 p-6 rounded-[32px] shadow-sm hover:shadow-md transition-all relative">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex gap-2">
                        <button onClick={() => openModal(athlete)} className="p-2 bg-slate-100 text-slate-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all">
                          <Pencil size={16} />
                        </button>
                        {/* BOUTON SUPPRIMER MODIFIÉ */}
                        <button
                            onClick={() => {
                              setAthleteToDelete(athlete);
                              setShowDeleteConfirm(true);
                            }}
                            className="p-2 bg-slate-100 text-slate-600 rounded-xl hover:bg-red-600 hover:text-white transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <span className="text-[10px] font-black text-slate-400">#{athlete.num_dossard || 'N/A'}</span>
                    </div>

                    <h3 className="text-lg font-black uppercase italic text-slate-900 leading-tight">
                      {athlete.prenom} {athlete.nom}
                    </h3>

                    <div className="mt-4 pt-4 border-t border-slate-50 flex gap-4">
                      <p className="text-[10px] font-bold text-slate-500 uppercase">{athlete.categorie}</p>
                      <p className="text-[10px] font-bold text-slate-500 uppercase">{athlete.annee_naissance}</p>
                    </div>
                  </div>
              ))}
            </div>
        )}

        {/* MODALE DE CONFIRMATION DE SUPPRESSION (Warning stylisé) */}
        {showDeleteConfirm && (
            <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
              <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => !isDeleting && setShowDeleteConfirm(false)} />
              <div className="relative bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl border border-slate-100 animate-in fade-in zoom-in duration-200">
                <div className="flex flex-col items-center text-center">
                  <div className="bg-red-50 p-4 rounded-full mb-4">
                    <AlertTriangle className="h-8 w-8 text-red-600" />
                  </div>
                  <h3 className="text-xl font-black italic uppercase text-slate-900 mb-2">Supprimer l'athlète ?</h3>
                  <p className="text-slate-500 text-sm mb-8">
                    Voulez-vous vraiment supprimer **{athleteToDelete?.prenom} {athleteToDelete?.nom}** ? Cette action est irréversible.
                  </p>
                  <div className="flex gap-3 w-full">
                    <button onClick={() => setShowDeleteConfirm(false)} disabled={isDeleting} className="flex-1 px-4 py-3 rounded-xl font-bold text-slate-600 hover:bg-slate-100 transition-colors">
                      Annuler
                    </button>
                    <button onClick={confirmDelete} disabled={isDeleting} className="flex-1 px-4 py-3 rounded-xl font-bold bg-red-600 text-white hover:bg-red-700 transition-all flex justify-center items-center">
                      {isDeleting ? <Loader2 className="h-5 w-5 animate-spin" /> : "Supprimer"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
        )}

        {/* MODALE D'ÉDITION */}
        {isModalOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
              <div className="bg-white w-full max-w-lg rounded-[40px] shadow-2xl overflow-hidden border-t-8 border-red-600">
                <div className="p-8">
                  <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-black uppercase italic">{editingAthlete ? "Modifier" : "Ajouter"}</h2>
                    <button onClick={() => setIsModalOpen(false)}><X size={24} /></button>
                  </div>
                  <div className="space-y-4">
                    <Input placeholder="Prénom" value={formData.prenom} onChange={(e) => setFormData({...formData, prenom: e.target.value})} className="rounded-xl py-6" />
                    <Input placeholder="Nom" value={formData.nom} onChange={(e) => setFormData({...formData, nom: e.target.value})} className="rounded-xl py-6" />
                    <div className="grid grid-cols-2 gap-4">
                      <Input placeholder="Année (ex: 1995)" type="number" value={formData.annee_naissance} onChange={(e) => setFormData({...formData, annee_naissance: e.target.value})} className="rounded-xl py-6" />
                      <Input placeholder="Catégorie (ex: SEN H)" value={formData.categorie} onChange={(e) => setFormData({...formData, categorie: e.target.value})} className="rounded-xl py-6" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <Input placeholder="N° Dossard" value={formData.num_dossard} onChange={(e) => setFormData({...formData, num_dossard: e.target.value})} className="rounded-xl py-6" />
                      <Input placeholder="ID BeAthletics" value={formData.life_number} onChange={(e) => setFormData({...formData, life_number: e.target.value})} className="rounded-xl py-6" />
                    </div>
                  </div>
                  <Button onClick={handleSave} className="w-full mt-8 bg-red-600 hover:bg-red-700 py-8 rounded-2xl font-black uppercase italic text-lg">
                    Sauvegarder les modifications
                  </Button>
                </div>
              </div>
            </div>
        )}
      </main>
  );
}

export default function ModifierPage() {
  return (
      <Suspense fallback={<div className="pt-32 text-center">Chargement...</div>}>
        <ModifierContent />
      </Suspense>
  );
}