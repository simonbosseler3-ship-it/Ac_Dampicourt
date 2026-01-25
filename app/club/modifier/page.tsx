"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/navbar/navbar";
import { Save, ArrowLeft, Plus, Trash2, Loader2, Check } from "lucide-react";

export default function ModifierClubPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  // États pour les données
  const [info, setInfo] = useState({
    history_text: "",
    quote_text: "",
    stade_location: "",
    kbpm_coordinator: "",
    sport_coordinator: ""
  });
  const [comite, setComite] = useState<any[]>([]);

  useEffect(() => {
    const checkAdminAndFetch = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
          router.push("/login");
          return;
        }

        const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

        if (profile?.role?.toLowerCase().trim() !== 'admin') {
          router.push("/club");
          return;
        }

        // Récupération des données
        const { data: infoData } = await supabase.from('club_info').select('*').single();
        const { data: comiteData } = await supabase.from('club_comite').select('*').order('order_index', { ascending: true });

        if (infoData) setInfo(infoData);
        if (comiteData) setComite(comiteData);

      } catch (error) {
        console.error("Erreur de chargement:", error);
      } finally {
        setLoading(false);
      }
    };

    checkAdminAndFetch();
  }, [router]);

  const handleSave = async () => {
    setSaving(true);
    try {
      // 1. Mise à jour des infos textuelles
      await supabase.from('club_info').update(info).eq('id', 'main_info');

      // 2. Mise à jour du comité (on vide et on réinsère pour gérer l'ordre et les suppressions)
      await supabase.from('club_comite').delete().neq('role', 'FORCE_DELETE_CATCH_ALL');

      const comiteToInsert = comite.map((member, index) => ({
        role: member.role,
        name: member.name,
        tel: member.tel,
        email: member.email,
        order_index: index
      }));

      if (comiteToInsert.length > 0) {
        await supabase.from('club_comite').insert(comiteToInsert);
      }

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        router.push("/club");
        router.refresh();
      }, 1500);
    } catch (error) {
      console.error(error);
      alert("Une erreur est survenue lors de la sauvegarde.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
      <div className="flex h-screen items-center justify-center bg-white">
        <Loader2 className="animate-spin text-red-600 h-12 w-12" />
      </div>
  );

  return (
      <div className="min-h-screen">

        <main className="container mx-auto px-4 py-32">
          {/* HEADER DE MODIFICATION */}
          <div
              className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
            <div>
              <button
                  onClick={() => router.back()}
                  className="flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-colors font-bold uppercase italic text-xs mb-4"
              >
                <ArrowLeft size={16}/> Retour à la page club
              </button>
              <h1 className="text-4xl font-black text-slate-900 uppercase italic">
                Modifier le <span className="text-red-600">Club</span>
              </h1>
            </div>

            <button
                onClick={handleSave}
                disabled={saving}
                className={`flex items-center gap-3 px-10 py-4 rounded-xl font-black uppercase italic transition-all shadow-lg ${
                    success ? 'bg-green-600 text-white' : 'bg-red-600 text-white hover:bg-red-700 active:scale-95'
                }`}
            >
              {saving ? <Loader2 className="animate-spin" size={20}/> : success ?
                  <Check size={20}/> : <Save size={20}/>}
              {success ? "Enregistré" : "Enregistrer les modifications"}
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

            {/* COLONNE GAUCHE : CONTENU TEXTUEL */}
            <div className="space-y-8">
              <section className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                <h2 className="text-xl font-black uppercase italic mb-6 flex items-center gap-2">
                  <div className="w-1.5 h-6 bg-red-600"></div>
                  Présentation générale
                </h2>

                <div className="space-y-6">
                  <div className="flex flex-col gap-2">
                    <label
                        className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Histoire
                      du club</label>
                    <textarea
                        className="w-full p-4 rounded-2xl border border-slate-100 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-red-600 outline-none transition-all min-h-[250px] text-slate-700 leading-relaxed"
                        value={info.history_text}
                        onChange={(e) => setInfo({...info, history_text: e.target.value})}
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label
                        className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Citation
                      / Slogan</label>
                    <input
                        type="text"
                        className="w-full p-4 rounded-2xl border border-slate-100 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-red-600 outline-none transition-all font-medium italic"
                        value={info.quote_text}
                        onChange={(e) => setInfo({...info, quote_text: e.target.value})}
                    />
                  </div>
                </div>
              </section>

              <section className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                <h2 className="text-xl font-black uppercase italic mb-6 flex items-center gap-2">
                  <div className="w-1.5 h-6 bg-red-600"></div>
                  Infrastructures & Coordination
                </h2>
                <div className="space-y-6">
                  <div className="flex flex-col gap-2">
                    <label
                        className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Adresse
                      du Stade</label>
                    <input
                        type="text"
                        className="w-full p-4 rounded-2xl border border-slate-100 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-red-600 outline-none"
                        value={info.stade_location}
                        onChange={(e) => setInfo({...info, stade_location: e.target.value})}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                      <label
                          className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Coord.
                        KBPM</label>
                      <input
                          type="text"
                          className="w-full p-4 rounded-2xl border border-slate-100 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-red-600 outline-none"
                          value={info.kbpm_coordinator}
                          onChange={(e) => setInfo({...info, kbpm_coordinator: e.target.value})}
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label
                          className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Coord.
                        Sportif</label>
                      <input
                          type="text"
                          className="w-full p-4 rounded-2xl border border-slate-100 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-red-600 outline-none"
                          value={info.sport_coordinator}
                          onChange={(e) => setInfo({...info, sport_coordinator: e.target.value})}
                      />
                    </div>
                  </div>
                </div>
              </section>
            </div>

            {/* COLONNE DROITE : LE COMITÉ */}
            <div className="space-y-6">
              <div
                  className="flex justify-between items-center bg-slate-900 p-6 rounded-3xl text-white shadow-lg">
                <div className="flex flex-col">
                  <span
                      className="text-[10px] font-black text-red-600 uppercase tracking-widest">Gestion</span>
                  <h2 className="text-xl font-black uppercase italic">Membres du Comité</h2>
                </div>
                <button
                    onClick={() => setComite([...comite, {role: "", name: "", tel: "", email: ""}])}
                    className="bg-red-600 hover:bg-white hover:text-red-600 p-3 rounded-full transition-all active:scale-90 shadow-lg"
                >
                  <Plus size={24}/>
                </button>
              </div>

              <div className="space-y-4">
                {comite.map((member, index) => (
                    <div key={index}
                         className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm relative group animate-in fade-in slide-in-from-right-4">
                      <button
                          onClick={() => setComite(comite.filter((_, i) => i !== index))}
                          className="absolute -top-2 -right-2 bg-white border border-slate-200 text-slate-300 hover:text-red-600 hover:border-red-600 p-2 rounded-full transition-all shadow-sm"
                      >
                        <Trash2 size={16}/>
                      </button>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1">
                          <label
                              className="text-[9px] font-black uppercase text-slate-300 ml-1">Rôle</label>
                          <input
                              placeholder="Ex: Président"
                              className="w-full p-3 rounded-xl border border-slate-50 bg-slate-50 focus:bg-white focus:ring-1 focus:ring-red-600 outline-none font-bold text-red-600 uppercase italic text-xs"
                              value={member.role}
                              onChange={(e) => {
                                const newC = [...comite];
                                newC[index].role = e.target.value;
                                setComite(newC);
                              }}
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <label
                              className="text-[9px] font-black uppercase text-slate-300 ml-1">Nom</label>
                          <input
                              placeholder="Prénom Nom"
                              className="w-full p-3 rounded-xl border border-slate-50 bg-slate-50 focus:bg-white focus:ring-1 focus:ring-red-600 outline-none font-bold text-slate-800 text-xs"
                              value={member.name}
                              onChange={(e) => {
                                const newC = [...comite];
                                newC[index].name = e.target.value;
                                setComite(newC);
                              }}
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <label
                              className="text-[9px] font-black uppercase text-slate-300 ml-1">Téléphone</label>
                          <input
                              placeholder="+32..."
                              className="w-full p-3 rounded-xl border border-slate-50 bg-slate-50 focus:bg-white focus:ring-1 focus:ring-red-600 outline-none text-xs"
                              value={member.tel}
                              onChange={(e) => {
                                const newC = [...comite];
                                newC[index].tel = e.target.value;
                                setComite(newC);
                              }}
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <label
                              className="text-[9px] font-black uppercase text-slate-300 ml-1">Email</label>
                          <input
                              placeholder="nom@acdampicourt.be"
                              className="w-full p-3 rounded-xl border border-slate-50 bg-slate-50 focus:bg-white focus:ring-1 focus:ring-red-600 outline-none text-xs"
                              value={member.email}
                              onChange={(e) => {
                                const newC = [...comite];
                                newC[index].email = e.target.value;
                                setComite(newC);
                              }}
                          />
                        </div>
                      </div>
                    </div>
                ))}

                {comite.length === 0 && (
                    <div
                        className="text-center py-10 border-2 border-dashed border-slate-200 rounded-3xl">
                      <p className="text-slate-400 font-bold uppercase italic text-xs">Aucun membre
                        enregistré</p>
                    </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
  );
}