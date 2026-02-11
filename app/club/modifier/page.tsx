"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { Save, ArrowLeft, Plus, Trash2, Loader2, Check } from "lucide-react";

export default function ModifierClubPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const [info, setInfo] = useState({
    history_text: "",
    quote_text: "",
    stade_location: "",
    kbpm_coordinator: "",
    sport_coordinator: ""
  });
  const [comite, setComite] = useState<any[]>([]);

  const checkAdminAndFetch = useCallback(async () => {
    try {
      // 1. Vérification rapide de la session
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        router.replace("/login");
        return;
      }

      // 2. Vérification du rôle et chargement des données en parallèle
      const [profileRes, infoRes, comiteRes] = await Promise.all([
        supabase.from('profiles').select('role').eq('id', session.user.id).single(),
        supabase.from('club_info').select('*').single(),
        supabase.from('club_comite').select('*').order('order_index', { ascending: true })
      ]);

      if (profileRes.data?.role?.toLowerCase().trim() !== 'admin') {
        router.replace("/club");
        return;
      }

      if (infoRes.data) setInfo(infoRes.data);
      if (comiteRes.data) setComite(comiteRes.data);

    } catch (error) {
      console.error("Erreur de chargement:", error);
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    checkAdminAndFetch();
  }, [checkAdminAndFetch]);

  const handleSave = async () => {
    if (saving) return;
    setSaving(true);

    try {
      // 1. Update des infos textuelles (on utilise l'ID fixe 'main_info')
      const { error: infoErr } = await supabase
      .from('club_info')
      .update({
        history_text: info.history_text,
        quote_text: info.quote_text,
        stade_location: info.stade_location,
        kbpm_coordinator: info.kbpm_coordinator,
        sport_coordinator: info.sport_coordinator
      })
      .eq('id', 'main_info');

      if (infoErr) throw infoErr;

      // 2. Gestion du comité : On vide et on remplace
      // On utilise une approche simple : delete all then insert
      const { error: delErr } = await supabase
      .from('club_comite')
      .delete()
      .neq('name', 'COMMITE_PROTECTED_DUMMY'); // Condition bidon pour supprimer tout le monde

      if (delErr) throw delErr;

      if (comite.length > 0) {
        const comiteToInsert = comite.map((member, index) => ({
          role: member.role,
          name: member.name,
          tel: member.tel,
          email: member.email,
          order_index: index
        }));

        const { error: insErr } = await supabase.from('club_comite').insert(comiteToInsert);
        if (insErr) throw insErr;
      }

      setSuccess(true);
      router.refresh();

      setTimeout(() => {
        setSuccess(false);
        router.push("/club");
      }, 1500);

    } catch (error: any) {
      console.error(error);
      alert("Erreur : " + error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
      <div className="flex h-screen flex-col items-center justify-center bg-white gap-4">
        <Loader2 className="animate-spin text-red-600 h-12 w-12" />
        <p className="text-[10px] font-black uppercase italic text-slate-400 tracking-widest">Accès sécurisé...</p>
      </div>
  );

  return (
      <div className="min-h-screen">
        <main className="container mx-auto px-4 py-32 max-w-6xl">

          {/* HEADER FIXE */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
            <div>
              <button
                  onClick={() => router.back()}
                  className="flex items-center gap-2 text-slate-400 hover:text-red-600 transition-colors font-black uppercase italic text-[10px] mb-4 tracking-widest"
              >
                <ArrowLeft size={14}/> Retour
              </button>
              <h1 className="text-4xl font-black text-slate-900 uppercase italic tracking-tighter">
                Modifier le <span className="text-red-600">Club</span>
              </h1>
            </div>

            <button
                onClick={handleSave}
                disabled={saving}
                className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-black uppercase italic transition-all shadow-xl hover:-translate-y-1 active:scale-95 ${
                    success ? 'bg-green-600 text-white' : 'bg-slate-900 text-white hover:bg-red-600'
                }`}
            >
              {saving ? <Loader2 className="animate-spin" size={20}/> : success ? <Check size={20}/> : <Save size={20}/>}
              {success ? "Modifications enregistrées" : "Sauvegarder la page"}
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

            {/* INFOS TEXTUELLES */}
            <div className="space-y-8">
              <section className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
                <h2 className="text-lg font-black uppercase italic mb-8 flex items-center gap-3">
                  <span className="w-2 h-6 bg-red-600"></span>
                  Identité du Club
                </h2>

                <div className="space-y-6">
                  <div>
                    <label className="text-[9px] font-black uppercase text-slate-400 tracking-[0.2em] mb-2 block">Histoire du club</label>
                    <textarea
                        className="w-full p-5 rounded-2xl border border-slate-50 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-red-600 outline-none transition-all min-h-[300px] text-sm text-slate-700 leading-relaxed font-medium"
                        value={info.history_text}
                        onChange={(e) => setInfo({...info, history_text: e.target.value})}
                    />
                  </div>

                  <div>
                    <label className="text-[9px] font-black uppercase text-slate-400 tracking-[0.2em] mb-2 block">Slogan / Citation</label>
                    <input
                        type="text"
                        className="w-full p-5 rounded-2xl border border-slate-50 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-red-600 outline-none transition-all font-bold italic text-red-600"
                        value={info.quote_text}
                        onChange={(e) => setInfo({...info, quote_text: e.target.value})}
                    />
                  </div>
                </div>
              </section>

              <section className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
                <h2 className="text-lg font-black uppercase italic mb-8 flex items-center gap-3">
                  <span className="w-2 h-6 bg-red-600"></span>
                  Infrastructures
                </h2>
                <div className="space-y-6">
                  <div>
                    <label className="text-[9px] font-black uppercase text-slate-400 tracking-[0.2em] mb-2 block">Localisation du Stade</label>
                    <input
                        type="text"
                        className="w-full p-5 rounded-2xl border border-slate-50 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-red-600 outline-none text-sm font-bold"
                        value={info.stade_location}
                        onChange={(e) => setInfo({...info, stade_location: e.target.value})}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-[9px] font-black uppercase text-slate-400 tracking-[0.2em] mb-2 block">Coord. KBPM</label>
                      <input
                          type="text"
                          className="w-full p-4 rounded-2xl border border-slate-50 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-red-600 outline-none text-sm font-bold"
                          value={info.kbpm_coordinator}
                          onChange={(e) => setInfo({...info, kbpm_coordinator: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="text-[9px] font-black uppercase text-slate-400 tracking-[0.2em] mb-2 block">Coord. Sportif</label>
                      <input
                          type="text"
                          className="w-full p-4 rounded-2xl border border-slate-50 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-red-600 outline-none text-sm font-bold"
                          value={info.sport_coordinator}
                          onChange={(e) => setInfo({...info, sport_coordinator: e.target.value})}
                      />
                    </div>
                  </div>
                </div>
              </section>
            </div>

            {/* LE COMITÉ */}
            <div className="space-y-6">
              <div className="flex justify-between items-center bg-slate-900 p-8 rounded-[2rem] text-white shadow-xl overflow-hidden relative">
                <div className="relative z-10">
                  <span className="text-[8px] font-black text-red-600 uppercase tracking-[0.3em] block mb-1">Administration</span>
                  <h2 className="text-2xl font-black uppercase italic tracking-tighter">Membres du Comité</h2>
                </div>
                <button
                    onClick={() => setComite([...comite, {role: "", name: "", tel: "", email: ""}])}
                    className="relative z-10 bg-red-600 hover:bg-white hover:text-red-600 p-4 rounded-2xl transition-all active:scale-90 shadow-lg"
                >
                  <Plus size={24}/>
                </button>
                {/* Déco fond */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/10 rounded-full -mr-16 -mt-16"></div>
              </div>

              <div className="space-y-4">
                {comite.map((member, index) => (
                    <div key={index} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm relative group animate-in zoom-in-95 duration-300">
                      <button
                          onClick={() => setComite(comite.filter((_, i) => i !== index))}
                          className="absolute top-4 right-4 text-slate-300 hover:text-red-600 transition-colors p-2"
                      >
                        <Trash2 size={18}/>
                      </button>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-[8px] font-black uppercase text-slate-300 ml-1 mb-1 block">Rôle / Fonction</label>
                          <input
                              placeholder="Ex: Secrétaire"
                              className="w-full p-3 rounded-xl border border-slate-50 bg-slate-50 focus:bg-white focus:ring-1 focus:ring-red-600 outline-none font-black text-red-600 uppercase italic text-[11px]"
                              value={member.role}
                              onChange={(e) => {
                                const newC = [...comite];
                                newC[index].role = e.target.value;
                                setComite(newC);
                              }}
                          />
                        </div>
                        <div>
                          <label className="text-[8px] font-black uppercase text-slate-300 ml-1 mb-1 block">Nom Complet</label>
                          <input
                              placeholder="Prénom Nom"
                              className="w-full p-3 rounded-xl border border-slate-50 bg-slate-50 focus:bg-white focus:ring-1 focus:ring-red-600 outline-none font-bold text-slate-800 text-[11px]"
                              value={member.name}
                              onChange={(e) => {
                                const newC = [...comite];
                                newC[index].name = e.target.value;
                                setComite(newC);
                              }}
                          />
                        </div>
                        <div>
                          <label className="text-[8px] font-black uppercase text-slate-300 ml-1 mb-1 block">Gsm</label>
                          <input
                              placeholder="+32..."
                              className="w-full p-3 rounded-xl border border-slate-50 bg-slate-50 focus:bg-white focus:ring-1 focus:ring-red-600 outline-none text-[11px] font-medium"
                              value={member.tel}
                              onChange={(e) => {
                                const newC = [...comite];
                                newC[index].tel = e.target.value;
                                setComite(newC);
                              }}
                          />
                        </div>
                        <div>
                          <label className="text-[8px] font-black uppercase text-slate-300 ml-1 mb-1 block">Email</label>
                          <input
                              placeholder="contact@acd.be"
                              className="w-full p-3 rounded-xl border border-slate-50 bg-slate-50 focus:bg-white focus:ring-1 focus:ring-red-600 outline-none text-[11px] font-medium"
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
                    <div className="text-center py-16 border-4 border-dashed border-slate-100 rounded-[2rem]">
                      <p className="text-slate-300 font-black uppercase italic text-xs tracking-widest">Le comité est vide</p>
                    </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
  );
}