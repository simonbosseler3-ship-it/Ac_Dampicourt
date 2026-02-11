"use client";
import { useEffect, useState, useCallback, memo } from "react";
import { supabase } from "@/lib/supabase";
import {
  Settings, Check, X, Upload, Camera, ExternalLink,
  Calendar, MapPin, Euro, Flame, Plus, Trash2,
  Loader2, TableProperties, Info, Users, Eye, EyeOff,
  ChevronRight, Clock, Link as LinkIcon, Ghost
} from "lucide-react";

/* ============================================================
   1. COMPOSANT DE NOTIFICATION (TOAST)
   ============================================================ */
const Toast = ({ show, message, type, onClose }: any) => (
    <div className={`fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] transition-all duration-500 transform ${show ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'}`}>
      <div className={`flex items-center gap-4 px-8 py-4 rounded-2xl border backdrop-blur-2xl shadow-2xl ${
          type === 'success' ? 'bg-black/80 border-red-600/50 shadow-red-600/20' : 'bg-red-900/90 border-white/20 shadow-black'
      }`}>
        <div className={`p-2 rounded-full ${type === 'success' ? 'bg-red-600' : 'bg-white'}`}>
          {type === 'success' ? <Check size={20} className="text-white" /> : <X size={20} className="text-red-600" />}
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-red-600">Système Dampicourt</span>
          <span className="text-sm font-bold italic uppercase text-white">{message}</span>
        </div>
        <button onClick={onClose} className="ml-4 text-white/20 hover:text-white transition-colors">
          <X size={16} />
        </button>
      </div>
    </div>
);

/* ============================================================
   2. COMPOSANT D'ÉDITION ADMIN (Redessiné pour la clarté)
   ============================================================ */
const AdminForm = ({ initialData, activeId, onCancel, showNotification, onDelete }: any) => {
  const [editData, setEditData] = useState({
    ...initialData,
    competition_type: initialData.competition_type || 'Compétition', // Valeur par défaut
    events_table: initialData.events_table || [],
    gallery_links: initialData.gallery_links || [],
    extra_info: initialData.extra_info || []
  });
  const [loading, setLoading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    const fileExt = file.name.split('.').pop();
    const fileName = `bg-comp-${activeId}-${Date.now()}.${fileExt}`;
    try {
      const { error: uploadError } = await supabase.storage.from('news-images').upload(fileName, file);
      if (uploadError) throw uploadError;
      const { data: { publicUrl } } = supabase.storage.from('news-images').getPublicUrl(fileName);
      setEditData({ ...editData, background_url: publicUrl });
      showNotification("Image mise à jour !");
    } catch (err: any) {
      showNotification(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const addCategory = () => {
    const newTable = [...(editData.events_table || [])];
    newTable.push({ category: "", tests: [{ name: "", sub: "", price: "6,00" }] });
    setEditData({ ...editData, events_table: newTable });
  };

  const addTestRow = (catIndex: number) => {
    const newTable = [...editData.events_table];
    newTable[catIndex].tests.push({ name: "", sub: "", price: "6,00" });
    setEditData({ ...editData, events_table: newTable });
  };

  const removeCategory = (catIndex: number) => {
    const newTable = editData.events_table.filter((_: any, i: number) => i !== catIndex);
    setEditData({ ...editData, events_table: newTable });
  };

  const submitSave = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const payload = {
        title: editData.title,
        description: editData.description,
        competition_type: editData.competition_type,
        location: editData.location,
        subtitle: editData.subtitle,
        subtitle_badge: editData.subtitle_badge, // Ajout du champ manquant
        event_date: editData.event_date,
        registration_url: editData.registration_url,
        background_url: editData.background_url,
        hidden: editData.hidden,
        events_table: editData.events_table,
        gallery_links: editData.gallery_links,
        extra_info: editData.extra_info
      };
      const { error } = await supabase.from('competition_config').update(payload).eq('id', activeId);
      if (error) throw error;
      showNotification("Modifications enregistrées !");
      setTimeout(() => window.location.reload(), 500);
    } catch (error: any) {
      showNotification(error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
      <div className="bg-[#0f172a]/95 backdrop-blur-3xl p-6 md:p-10 rounded-[2.5rem] border border-white/10 max-w-6xl mx-auto shadow-2xl space-y-8 animate-in fade-in zoom-in-95 duration-300 relative z-50">
        {/* HEADER */}
        <div className="flex justify-between items-start border-b border-white/5 pb-8">
          <div>
            <h2 className="text-3xl font-black italic uppercase flex items-center gap-3 mb-2 text-white">
              <Settings className="text-red-600" size={28}/> Panneau de Configuration
            </h2>

            <div>
              <label className="text-[10px] font-black uppercase text-red-500 tracking-widest block mb-4 italic">
                Type de Publication
              </label>
              <div className="grid grid-cols-2 gap-2 p-1 bg-black/40 rounded-xl">
                <button
                    onClick={() => setEditData({
                      ...editData,
                      competition_type: 'Compétition',
                      subtitle_badge: 'Compétition'
                    })}
                    className={`py-3 rounded-lg text-[10px] font-black uppercase italic transition-all ${editData.competition_type === 'Compétition' ? 'bg-red-600 text-white' : 'text-white/40'}`}>Compétition
                </button>

                <button
                    onClick={() => setEditData({
                      ...editData,
                      competition_type: 'Annonce',
                      subtitle_badge: 'Annonce'
                    })}
                    className={`py-3 rounded-lg text-[10px] font-black uppercase italic transition-all ${editData.competition_type === 'Annonce' ? 'bg-red-600 text-white' : 'text-white/40'}`}
                >
                  Annonce
                </button>
              </div>
            </div>

            <p className="text-slate-400 text-sm font-medium italic mt-4">
              Personnalisez chaque aspect de l'événement "{editData.title}"
            </p>
          </div>

          <div className="flex items-center gap-4">
            <button
                onClick={() => setEditData({...editData, hidden: !editData.hidden})}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${editData.hidden ? 'bg-orange-500/10 text-orange-500 border border-orange-500/30' : 'bg-green-500/10 text-green-500 border border-green-500/30'}`}
            >
              {editData.hidden ? <><EyeOff size={14}/> Masqué</> : <><Eye size={14}/> Public</>}
            </button>
            <button onClick={() => onDelete(activeId)}
                    className="p-2 text-white/20 hover:text-red-500 transition-colors">
              <Trash2 size={20}/>
            </button>
            <button onClick={onCancel}
                    className="p-2 bg-white/5 hover:bg-white/10 rounded-full transition-all">
              <X size={20} />
            </button>
          </div>
        </div>

        {/* GRILLE PRINCIPALE */}
        <div className="grid gap-8 grid-cols-1 lg:grid-cols-3">

          {/* COLONNE INFOS PRINCIPALES (Prend 2 colonnes sur 3) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-500 ml-2">Titre de l'événement</label>
                <input
                    className="w-full bg-black/40 p-4 rounded-2xl border border-white/10 outline-none focus:border-red-600 transition-all font-bold text-white"
                    value={editData.title || ""}
                    onChange={e => setEditData({ ...editData, title: e.target.value })} />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-500 ml-2">
                  Badge (ex: SPEED NIGHT)
                </label>
                <input
                    className="w-full bg-black/40 p-4 rounded-2xl border border-white/10 outline-none focus:border-red-600 transition-all font-bold text-red-600"
                    placeholder="EX: SPEED NIGHT"
                    value={editData.subtitle_badge || ""}
                    onChange={e => setEditData({ ...editData, subtitle_badge: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-500 ml-2">Sous-titre accrocheur</label>
              <input
                  className="w-full bg-black/40 p-4 rounded-2xl border border-white/10 outline-none focus:border-red-600 transition-all italic text-white"
                  value={editData.subtitle || ""}
                  onChange={e => setEditData({ ...editData, subtitle: e.target.value })} />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-500 ml-2">Description complète</label>
              <textarea rows={5} className="w-full bg-black/40 p-5 rounded-2xl border border-white/10 focus:border-red-600 outline-none text-sm text-gray-300 leading-relaxed" value={editData.description || ""} onChange={e => setEditData({ ...editData, description: e.target.value })} />
            </div>
          </div>

          {/* COLONNE DROITE (Logistique OU Image seule pour Annonce) */}
          <div className="bg-white/5 p-6 rounded-[2rem] border border-white/10 space-y-6 animate-in slide-in-from-right duration-500">
            <h4 className="text-[10px] font-black uppercase text-red-600 tracking-widest border-b border-red-600/20 pb-2">
              {editData.competition_type === 'Compétition' ? 'Logistique' : 'Visuel'}
            </h4>

            <div className="space-y-4">
              {/* Champs logistiques affichés uniquement pour Compétition */}
              {editData.competition_type === 'Compétition' && (
                  <>
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-slate-400 flex items-center gap-2"><Calendar size={12} /> Date de l'événement</label>
                      <input className="w-full bg-black/20 p-3 rounded-xl border border-white/5 text-sm text-white" value={editData.event_date || ""} onChange={e => setEditData({ ...editData, event_date: e.target.value })} />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-slate-400 flex items-center gap-2"><MapPin size={12} /> Localisation</label>
                      <input className="w-full bg-black/20 p-3 rounded-xl border border-white/5 text-sm text-white" value={editData.location || ""} onChange={e => setEditData({ ...editData, location: e.target.value })} />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-slate-400 flex items-center gap-2"><LinkIcon size={12} /> Lien Inscription (ROBA)</label>
                      <input className="w-full bg-black/20 p-3 rounded-xl border border-white/5 text-sm text-blue-400" value={editData.registration_url || ""} onChange={e => setEditData({ ...editData, registration_url: e.target.value })} />
                    </div>
                  </>
              )}

              {/* Le bouton d'upload est maintenant disponible pour les deux types */}
              <div className="pt-2">
                <input type="file" onChange={handleFileUpload} className="hidden" id="bg-upload" accept="image/*" />
                <label htmlFor="bg-upload" className="w-full cursor-pointer flex flex-col items-center justify-center gap-3 p-6 rounded-2xl border-2 border-dashed border-white/10 hover:border-red-600/50 hover:bg-red-600/5 transition-all text-white text-center">
                  <Upload size={24} className="text-red-600" />
                  <div className="space-y-1">
                    <span className="text-[10px] font-black uppercase block">Visuel de fond</span>
                    <span className="text-[8px] text-slate-500 uppercase">Image JPG/PNG de haute qualité</span>
                  </div>
                </label>
                {/* Petit indicateur de succès si une image est déjà présente */}
                {editData.background_url && (
                    <p className="text-[8px] text-green-500 mt-2 text-center font-bold uppercase italic">✓ Image actuelle détectée</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* BAS DU FORMULAIRE - CONDITIONNEL */}
        {editData.competition_type === 'Compétition' && (
            <div className="space-y-8 animate-in fade-in duration-700">
              {/* SECTION PROGRAMME */}
              <div className="pt-8 border-t border-white/5">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-lg font-black uppercase italic text-white flex items-center gap-3">
                    <div className="p-2 bg-red-600 rounded-lg"><TableProperties size={20} /></div>
                    Programme des Épreuves
                  </h3>
                  <button onClick={addCategory} className="bg-white text-black hover:bg-red-600 hover:text-white px-6 py-2.5 rounded-xl text-[10px] font-black uppercase transition-all flex items-center gap-2">
                    <Plus size={14} /> Nouvelle Catégorie
                  </button>
                </div>

                <div className="flex flex-wrap gap-6">
                  {editData.events_table?.map((cat: any, cIdx: number) => (
                      <div key={cIdx} className="flex-1 min-w-full md:min-w-[48%] bg-black/40 p-6 rounded-[2rem] border border-white/10 relative group">
                        <button onClick={() => removeCategory(cIdx)} className="absolute top-6 right-6 text-white/10 group-hover:text-red-500 transition-colors">
                          <Trash2 size={18}/>
                        </button>
                        <div className="mb-6">
                          <label className="text-[9px] font-black text-red-600 uppercase mb-1 block">Catégorie / Groupe</label>
                          <input
                              className="bg-transparent text-xl font-black italic uppercase outline-none border-b-2 border-white/5 focus:border-red-600 w-full text-white pb-1"
                              value={cat.category} onChange={e => {
                            const nt = [...editData.events_table];
                            nt[cIdx].category = e.target.value;
                            setEditData({...editData, events_table: nt});
                          }}/>
                        </div>

                        <div className="space-y-3">
                          {cat.tests.map((test: any, tIdx: number) => (
                              <div key={tIdx} className="flex gap-2 items-center">
                                <input placeholder="Épreuve" className="flex-[2] bg-white/5 p-3 rounded-xl border border-white/5 text-xs text-white"
                                       value={test.name} onChange={e => {
                                  const nt = [...editData.events_table];
                                  nt[cIdx].tests[tIdx].name = e.target.value;
                                  setEditData({...editData, events_table: nt});
                                }}/>
                                <input placeholder="Détails" className="flex-[3] bg-white/5 p-3 rounded-xl border border-white/5 text-xs text-white/60"
                                       value={test.sub} onChange={e => {
                                  const nt = [...editData.events_table];
                                  nt[cIdx].tests[tIdx].sub = e.target.value;
                                  setEditData({...editData, events_table: nt});
                                }}/>
                                <input placeholder="Prix" className="w-16 bg-red-600/10 p-3 rounded-xl border border-red-600/20 text-xs text-center font-black text-red-500"
                                       value={test.price} onChange={e => {
                                  const nt = [...editData.events_table];
                                  nt[cIdx].tests[tIdx].price = e.target.value;
                                  setEditData({...editData, events_table: nt});
                                }}/>
                                <button onClick={() => {
                                  const nt = [...editData.events_table];
                                  nt[cIdx].tests = nt[cIdx].tests.filter((_: any, i: number) => i !== tIdx);
                                  setEditData({...editData, events_table: nt});
                                }} className="p-2 text-white/10 hover:text-red-500"><X size={14}/></button>
                              </div>
                          ))}
                          <button onClick={() => addTestRow(cIdx)} className="text-[10px] font-black uppercase text-white/40 hover:text-red-600 mt-4 flex items-center gap-2 transition-colors">
                            <Plus size={14}/> Ajouter une ligne d'épreuve
                          </button>
                        </div>
                      </div>
                  ))}
                </div>
              </div>

              {/* GALERIE & INFOS */}
              <div className="grid md:grid-cols-2 gap-8 pt-8 border-t border-white/5">
                <div className="space-y-4">
                  <h3 className="text-sm font-black uppercase italic text-red-600 flex items-center gap-2">
                    <Camera size={18} /> Albums Photos & Résultats
                  </h3>
                  <div className="space-y-3">
                    {editData.gallery_links?.map((link: any, idx: number) => (
                        <div key={idx} className="flex gap-2 items-center bg-black/40 p-3 rounded-2xl border border-white/5">
                          <input placeholder="Label (ex: Photos 2024)" className="flex-1 bg-transparent text-xs outline-none font-bold text-white" value={link.label}
                                 onChange={e => {
                                   const nl = [...editData.gallery_links]; nl[idx].label = e.target.value; setEditData({...editData, gallery_links: nl});
                                 }} />
                          <input placeholder="URL" className="flex-[2] bg-transparent text-xs outline-none text-blue-400" value={link.url}
                                 onChange={e => {
                                   const nl = [...editData.gallery_links]; nl[idx].url = e.target.value; setEditData({...editData, gallery_links: nl});
                                 }} />
                          <button onClick={() => setEditData({...editData, gallery_links: editData.gallery_links.filter((_:any, i:number) => i !== idx)})} className="text-white/20 hover:text-red-500"><X size={14}/></button>
                        </div>
                    ))}
                    <button onClick={() => setEditData({...editData, gallery_links: [...(editData.gallery_links || []), { label: "", url: "" }]})}
                            className="w-full border border-dashed border-white/10 p-3 rounded-2xl text-[9px] font-black uppercase text-white hover:bg-white/5 transition-all">
                      + Ajouter un lien
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-black uppercase italic text-red-600 flex items-center gap-2">
                    <Info size={18} /> Infos pratiques & Horaires
                  </h3>
                  <div className="space-y-3">
                    {editData.extra_info?.map((info: any, idx: number) => (
                        <div key={idx} className="bg-black/40 p-4 rounded-2xl border border-white/5 relative">
                          <button onClick={() => setEditData({...editData, extra_info: editData.extra_info.filter((_:any, i:number) => i !== idx)})}
                                  className="absolute top-4 right-4 text-white/20 hover:text-red-500"><X size={14}/></button>
                          <input placeholder="Titre de l'info" className="w-full bg-transparent text-[10px] font-black uppercase outline-none text-white mb-2" value={info.title}
                                 onChange={e => {
                                   const ni = [...editData.extra_info]; ni[idx].title = e.target.value; setEditData({...editData, extra_info: ni});
                                 }} />
                          <textarea placeholder="Description..." rows={2} className="w-full bg-transparent text-xs outline-none text-gray-400 focus:text-white" value={info.content}
                                    onChange={e => {
                                      const ni = [...editData.extra_info]; ni[idx].content = e.target.value; setEditData({...editData, extra_info: ni});
                                    }} />
                        </div>
                    ))}
                    <button onClick={() => setEditData({...editData, extra_info: [...(editData.extra_info || []), { title: "", content: "" }]})}
                            className="w-full border border-dashed border-white/10 p-3 rounded-2xl text-[9px] font-black uppercase text-white hover:bg-white/5 transition-all">
                      + Ajouter un bloc d'info
                    </button>
                  </div>
                </div>
              </div>
            </div>
        )}

        {/* PIED DE FORMULAIRE */}
        <div className="flex gap-4 pt-4">
          <button onClick={submitSave} disabled={loading} className="flex-1 bg-red-600 p-5 rounded-[1.5rem] font-black uppercase italic tracking-widest text-white hover:bg-red-700 transition-all flex items-center justify-center gap-3 shadow-xl shadow-red-600/20">
            {loading ? <Loader2 className="animate-spin" /> : <><Check size={20}/> Sauvegarder les modifications</>}
          </button>
        </div>
      </div>
  );
};

/* ============================================================
   3. COMPOSANT VUE PUBLIQUE (Design Modernisé)
   ============================================================ */
const PublicView = memo(({ config }: any) => {
  if (!config) return null;

  return (
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000 relative z-10">
        {/* HERO SECTION REDESSINÉ */}
        <div className="max-w-6xl mb-16">
          <div
              className="inline-flex items-center gap-3 px-5 py-2 bg-red-600 text-[11px] font-black uppercase tracking-[0.4em] mb-8 shadow-2xl shadow-red-600/40 skew-x-[-10deg]">
          <span className="skew-x-[10deg] flex items-center gap-2">
            <Flame size={14} fill="currentColor"/> {config.competition_type || "Événement"}
          </span>
          </div>

          <h1 className="text-7xl md:text-[9rem] font-black italic uppercase leading-[0.8] tracking-tighter mb-8 drop-shadow-[0_15px_15px_rgba(0,0,0,0.9)]">
            <span className="text-white">
              {config.title.split(' ')[0]}
            </span>
            <br/>
            <span className="text-red-600 drop-shadow-[0_0_30px_rgba(220,38,38,0.4)]">
              {config.title.split(' ').slice(1).join(' ')}
            </span>
          </h1>

          <div className="flex flex-col md:flex-row md:items-center gap-8 mt-12">
            <p className="text-2xl md:text-3xl font-black italic text-white max-w-2xl uppercase border-l-8 border-red-600 pl-8 py-2">
              {config.subtitle}
            </p>
            {config.registration_url && config.competition_type !== 'Annonce' && (
                <a
                    href={config.registration_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative group overflow-hidden bg-white text-black px-12 py-6 rounded-full font-black italic uppercase text-xl tracking-tighter hover:bg-red-600 hover:text-white transition-all duration-500 shadow-2xl"
                >
              <span className="relative z-10 flex items-center gap-3">
                S'inscrire <ChevronRight size={24}/>
              </span>
                  <div
                      className="absolute inset-0 bg-red-600 translate-y-full group-hover:translate-y-0 transition-transform duration-500"/>
                </a>
            )}
          </div>
        </div>

        {config.competition_type !== "Annonce" && (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-24">
              <div
                  className="bg-white/5 backdrop-blur-2xl p-8 rounded-[2.5rem] border border-white/10 hover:bg-white/10 transition-all flex flex-col justify-between group">
                <div>
                  <Calendar className="text-red-600 mb-6 group-hover:scale-110 transition-transform" size={40} />
                  <h3 className="font-black uppercase text-[10px] text-red-600 mb-1 tracking-widest">Date Officielle</h3>
                  <p className="text-2xl font-black italic uppercase text-white leading-none">{config.event_date}</p>
                </div>
              </div>

              <div className="bg-white/5 backdrop-blur-2xl p-8 rounded-[2.5rem] border border-white/10 hover:bg-white/10 transition-all flex flex-col justify-between group">
                <div>
                  <MapPin className="text-red-600 mb-6 group-hover:scale-110 transition-transform" size={40} />
                  <h3 className="font-black uppercase text-[10px] text-red-600 mb-1 tracking-widest">Localisation</h3>
                  <p className="text-2xl font-black italic uppercase text-white leading-none">{config.location}</p>
                </div>
              </div>

              <div className="bg-white/5 backdrop-blur-2xl p-8 rounded-[2.5rem] border border-white/10 hover:bg-white/10 transition-all flex flex-col justify-between group">
                <div>
                  <Euro className="text-red-600 mb-6 group-hover:scale-110 transition-transform" size={40} />
                  <h3 className="font-black uppercase text-[10px] text-red-600 mb-1 tracking-widest">Tarification</h3>
                  <p className="text-2xl font-black italic uppercase text-white leading-none">
                    Dès {config.events_table?.[0]?.tests?.[0]?.price || "6"}€
                  </p>
                </div>
              </div>
            </div>
        )}

        {/* MAIN CONTENT AREA */}
        <div className="grid lg:grid-cols-12 gap-12 items-start">

          {/* LEFT: DESCRIPTION & INFOS */}
          <div className="lg:col-span-5 space-y-12">
            <section>
              <div className="flex items-center gap-4 mb-8">
                <div className="h-[2px] w-12 bg-red-600" />
                <h2 className="text-4xl font-black italic uppercase tracking-tighter">L'événement</h2>
              </div>
              <p className="text-gray-300 leading-relaxed text-xl font-medium italic mb-8 whitespace-pre-line">
                {config.description || "Aucune description disponible."}
              </p>

              {/* EXTRA INFOS */}
              {config.extra_info && config.extra_info.length > 0 && (
                  <div className="grid gap-4 mt-10">
                    {config.extra_info.map((info: any, idx: number) => (
                        <div key={idx} className="bg-white/5 border-l-4 border-red-600 p-6 rounded-r-3xl backdrop-blur-sm group hover:bg-white/10 transition-all">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="p-1.5 bg-red-600/20 rounded-lg"><Info size={14} className="text-red-600"/></div>
                            <h4 className="text-xs font-black uppercase text-white tracking-widest">{info.title}</h4>
                          </div>
                          <p className="text-sm text-gray-400 italic leading-relaxed pl-8">{info.content}</p>
                        </div>
                    ))}
                  </div>
              )}
            </section>

            {/* GALLERY LINKS */}
            {config.gallery_links && config.gallery_links.length > 0 && (
                <section className="pt-8">
                  <h3 className="text-xl font-black italic uppercase mb-6 flex items-center gap-3">
                    <Camera className="text-red-600" size={20} /> Galerie & Résultats
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {config.gallery_links.map((link: any, idx: number) => (
                        <a key={idx} href={link.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between bg-white/5 hover:bg-red-600 border border-white/10 p-5 rounded-2xl transition-all group">
                          <span className="font-bold italic uppercase text-sm group-hover:text-white">{link.label}</span>
                          <ExternalLink size={16} className="text-red-600 group-hover:text-white" />
                        </a>
                    ))}
                  </div>
                </section>
            )}
          </div>

          {config.competition_type !== "Annonce" && (
              <div className="lg:col-span-7">
                <div className="bg-[#111] rounded-[3rem] border border-white/10 overflow-hidden shadow-2xl relative">
                  {/* Header */}
                  <div className="bg-gradient-to-r from-red-600 to-red-800 px-10 py-8 relative overflow-hidden">
                    <div className="relative z-10 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-white/20 backdrop-blur-md rounded-2xl text-white">
                          <Clock size={24} />
                        </div>
                        <div>
                          <h3 className="font-black uppercase italic text-2xl tracking-tighter text-white">Programme</h3>
                          <p className="text-[10px] font-bold uppercase text-white/60 tracking-widest">Épreuves & Horaires indicatifs</p>
                        </div>
                      </div>
                    </div>
                    <TableProperties size={120} className="absolute -right-10 -bottom-10 text-white/5 -rotate-12" />
                  </div>

                  {/* Liste des catégories (Structure Flex sans vide inutile) */}
                  <div className="p-6 space-y-4">
                    {config.events_table?.map((cat: any, i: number) => (
                        <div key={i} className="flex flex-col md:flex-row gap-4 bg-white/5 rounded-[2rem] overflow-hidden group border border-white/5">

                          {/* Gauche : Nom de la catégorie (Affiche uniquement si le texte existe) */}
                          <div className={`px-6 py-6 flex flex-row md:flex-col items-center md:items-start gap-3 shrink-0 ${cat.category ? 'md:w-32 bg-white/5' : 'w-12'}`}>
                            <Users size={18} className="text-red-600" />
                            {cat.category && (
                                <span className="font-black italic text-xs text-white uppercase leading-tight">
                      {cat.category}
                    </span>
                            )}
                          </div>

                          {/* Centre : Liste des épreuves */}
                          <div className="flex-1 px-6 py-6 space-y-6">
                            {cat.tests.map((test: any, j: number) => (
                                <div key={j} className="flex flex-col border-l-2 border-white/10 pl-6 group-hover:border-red-600/50 transition-colors">
                                  <div className="text-[10px] uppercase font-black text-red-600 mb-1 tracking-widest">{test.name}</div>
                                  <div className="text-lg font-bold text-white italic drop-shadow-sm">{test.sub}</div>
                                </div>
                            ))}
                          </div>

                          {/* Droite : Prix */}
                          <div className="px-8 py-6 flex md:flex-col items-center justify-between md:justify-center md:text-right bg-black/20 md:bg-transparent border-t md:border-t-0 border-white/5">
                            <span className="text-[9px] font-black uppercase text-white/40 md:mb-1">Prix</span>
                            <span className="font-black italic text-red-600 text-3xl tracking-tighter">
                  {cat.tests[0]?.price || "6"}€
                </span>
                          </div>
                        </div>
                    ))}
                  </div>
                </div>
              </div>
          )}
        </div>
      </div>
  );
});

/* ============================================================
   4. PAGE PRINCIPALE (CONTRÔLEUR)
   ============================================================ */
export default function SpeedNightPage() {
  const [config, setConfig] = useState<any>(null);
  const [allEvents, setAllEvents] = useState<any[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [loadingConfig, setLoadingConfig] = useState(true);
  const [activeId, setActiveId] = useState<number | null>(null);
  const [toast, setToast] = useState({ show: false, message: "", type: 'success' as 'success' | 'error' });

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast(prev => ({ ...prev, show: false })), 4000);
  };

  const fetchEventsList = useCallback(async (currentAdmin: boolean) => {
    try {
      const { data, error } = await supabase.from('competition_config').select('id, title, hidden').order('id', { ascending: true });
      if (error) throw error;
      setAllEvents(data || []);

      if (data && data.length > 0) {
        // Chercher le premier événement visible par défaut si non admin
        const firstVisible = data.find(e => !e.hidden);

        if (currentAdmin) {
          // Si admin, on montre le premier de la liste (même caché)
          setActiveId(data[0].id);
        } else if (firstVisible) {
          // Sinon le premier public
          setActiveId(firstVisible.id);
        } else {
          // Aucun événement public
          setActiveId(null);
        }
      } else {
        setActiveId(null);
      }
    } catch (err) { console.error(err); }
  }, []);

  useEffect(() => {
    const init = async () => {
      setLoadingConfig(true);
      const { data: { session } } = await supabase.auth.getSession();
      let adminStatus = false;
      if (session) {
        const { data } = await supabase.from('profiles').select('role').eq('id', session.user.id).single();
        if (data?.role === 'admin') adminStatus = true;
      }
      setIsAdmin(adminStatus);
      await fetchEventsList(adminStatus);
      setLoadingConfig(false);
    };
    init();
  }, [fetchEventsList]);

  useEffect(() => {
    if (activeId) {
      const fetchSelected = async () => {
        const { data } = await supabase.from('competition_config').select('*').eq('id', activeId).single();
        if (data) setConfig({
          ...data,
          events_table: Array.isArray(data.events_table) ? data.events_table : [],
          gallery_links: Array.isArray(data.gallery_links) ? data.gallery_links : [],
          extra_info: Array.isArray(data.extra_info) ? data.extra_info : []
        });
      };
      fetchSelected();
    } else {
      setConfig(null);
    }
  }, [activeId]);

  const handleAddNewEvent = async () => {
    try {
      const newEvent = {
        title: "Nouvel événement",
        subtitle: "Sous-titre à définir",
        competition_type: "Compétition",
        description: "Description de l'événement à remplir...",
        location: "Stade de Dampicourt",
        event_date: "01/01/2026",
        registration_url: "https://",
        background_url: "",
        hidden: true,
        events_table: [],
        gallery_links: [],
        extra_info: []
      };

      const { data, error } = await supabase.from('competition_config').insert([newEvent]).select();
      if (error) throw error;
      if (data && data[0]) {
        setAllEvents(prev => [...prev, data[0]]);
        setActiveId(data[0].id);
        setConfig(data[0]);
        setIsEditing(true);
        showNotification("Événement créé avec succès !");
      }
    } catch (err: any) {
      showNotification(`Erreur : ${err.message}`, 'error');
    }
  };

  const handleDeleteEvent = async (id: number) => {
    if(!window.confirm("Supprimer définitivement ?")) return;
    try {
      await supabase.from('competition_config').delete().eq('id', id);
      showNotification("Événement supprimé");
      window.location.reload();
    } catch (err: any) { showNotification(err.message, 'error'); }
  };

  if (loadingConfig) return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="animate-spin text-red-600" size={48} />
      </div>
  );

  const visibleEvents = isAdmin ? allEvents : allEvents.filter(e => !e.hidden);
  // Correction ici : On vérifie si activeId existe ET si on a une config chargée
  const isViewingActiveEvent = activeId && config && (isAdmin || !config.hidden);

  return (
      <div className={`min-h-screen relative text-white selection:bg-red-600 overflow-x-hidden transition-colors duration-1000 ${isViewingActiveEvent ? 'bg-[#050505]' : 'bg-black'}`}>

        {/* FOND D'ÉCRAN GLOBAL */}
        {isViewingActiveEvent && (
            <div className="fixed inset-0 z-0 bg-black pointer-events-none">
              {config.background_url ? (
                  <div
                      key={config.background_url}
                      className="absolute inset-0 bg-cover bg-center animate-in fade-in duration-1000"
                      style={{
                        backgroundImage: `url(${config.background_url})`,
                        opacity: isEditing ? 0.2 : 0.6
                      }}
                  />
              ) : (
                  // Fallback si pas d'image
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-black opacity-80" />
              )}
              <div className="absolute inset-0 bg-gradient-to-b from-black via-black/40 to-black z-10" />
            </div>
        )}

        <main className="relative z-10 container mx-auto px-6 pt-24 pb-32 font-sans min-h-screen">
          <div className="flex flex-wrap items-center justify-between gap-8 mb-16">
            {(visibleEvents.length > 0 || isAdmin) && (
                <div className="flex flex-wrap gap-2 bg-white/5 p-2 rounded-2xl border border-white/10 backdrop-blur-xl">
                  {visibleEvents.map((ev) => (
                      <button key={ev.id} onClick={() => { setActiveId(ev.id); setIsEditing(false); }}
                              className={`px-6 py-3 rounded-xl font-black italic uppercase transition-all text-[10px] tracking-widest flex items-center gap-3 ${activeId === ev.id ? 'bg-red-600 text-white shadow-xl shadow-red-600/20' : 'hover:bg-white/10 text-white/40'}`}>
                        {isAdmin && ev.hidden && <EyeOff size={12} className="opacity-50"/>}
                        {ev.title}
                      </button>
                  ))}
                  {isAdmin && (
                      <button onClick={handleAddNewEvent} className="p-3 rounded-xl bg-white/10 hover:bg-red-600 text-white transition-all">
                        <Plus size={18}/>
                      </button>
                  )}
                </div>
            )}

            {isAdmin && !isEditing && (
                <button onClick={() => setIsEditing(true)} className="flex items-center gap-3 bg-white text-black px-8 py-4 rounded-2xl font-black uppercase text-xs hover:bg-red-600 hover:text-white transition-all shadow-2xl">
                  <Settings size={18}/> Editer l'événement
                </button>
            )}
          </div>

          {isEditing ? (
              <AdminForm
                  initialData={config}
                  activeId={activeId}
                  onSave={(newData: any) => { setConfig(newData); setIsEditing(false); }}
                  onCancel={() => setIsEditing(false)}
                  showNotification={showNotification}
                  onDelete={handleDeleteEvent}
              />
          ) : (
              config ? <PublicView key={activeId} config={config}/> : (
                  <div className="flex flex-col items-center justify-center py-40 text-center">
                    <Ghost size={80} className="text-white/10 mb-6" />
                    <h2 className="text-4xl font-black italic uppercase text-white/20">Aucun événement <br/>public disponible</h2>
                  </div>
              )
          )}
        </main>

        <Toast show={toast.show} message={toast.message} type={toast.type} onClose={() => setToast({...toast, show: false})}/>
      </div>
  );
}