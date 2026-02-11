"use client";

import { useEffect, useState, useCallback, memo, Suspense } from "react";
import { supabase } from "@/lib/supabase";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Settings, Check, X, Upload, Camera, ExternalLink,
  Calendar, MapPin, Euro, Flame, Plus, Trash2,
  Loader2, TableProperties, Info, Users, Eye, EyeOff,
  ChevronRight, Clock, Link as LinkIcon, Ghost, Menu
} from "lucide-react";

/* ============================================================
   1. COMPOSANT DE NOTIFICATION (TOAST)
   ============================================================ */
const Toast = ({ show, message, type, onClose }: any) => (
    <div className={`fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] transition-all duration-500 transform ${show ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'} w-[90%] max-w-md`}>
      <div className={`flex items-center gap-4 px-6 py-4 rounded-2xl border backdrop-blur-2xl shadow-2xl ${
          type === 'success' ? 'bg-black/90 border-red-600/50 shadow-red-600/20' : 'bg-red-900/90 border-white/20 shadow-black'
      }`}>
        <div className={`p-2 rounded-full shrink-0 ${type === 'success' ? 'bg-red-600' : 'bg-white'}`}>
          {type === 'success' ? <Check size={16} className="text-white" /> : <X size={16} className="text-red-600" />}
        </div>
        <div className="flex flex-col min-w-0">
          <span className="text-[9px] font-black uppercase tracking-[0.2em] text-red-600 truncate">Système Dampicourt</span>
          <span className="text-xs md:text-sm font-bold italic uppercase text-white truncate">{message}</span>
        </div>
        <button onClick={onClose} className="ml-auto text-white/20 hover:text-white transition-colors">
          <X size={16} />
        </button>
      </div>
    </div>
);

/* ============================================================
   2. COMPOSANT D'ÉDITION ADMIN (Responsive)
   ============================================================ */
const AdminForm = ({ initialData, activeId, onCancel, showNotification, onDelete }: any) => {
  const [editData, setEditData] = useState({
    ...initialData,
    competition_type: initialData.competition_type || 'Compétition',
    events_table: initialData.events_table || [],
    gallery_links: initialData.gallery_links || [],
    extra_info: initialData.extra_info || []
  });
  const [loading, setLoading] = useState(false);

  // Gestion Upload Image
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

  // Sauvegarde
  const submitSave = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const { error } = await supabase.from('competition_config').update(editData).eq('id', activeId);
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
      <div className="bg-[#0f172a]/95 backdrop-blur-3xl p-4 md:p-10 rounded-[2rem] md:rounded-[2.5rem] border border-white/10 max-w-6xl mx-auto shadow-2xl space-y-8 animate-in fade-in zoom-in-95 duration-300 relative z-50">

        {/* HEADER FORMULAIRE */}
        <div className="flex flex-col md:flex-row justify-between items-start border-b border-white/5 pb-8 gap-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-black italic uppercase flex items-center gap-3 mb-2 text-white">
              <Settings className="text-red-600 shrink-0" size={24}/> Configuration
            </h2>

            {/* SÉLECTEUR TYPE */}
            <div className="mt-4">
              <div className="grid grid-cols-2 gap-2 p-1 bg-black/40 rounded-xl w-full md:w-64">
                {['Compétition', 'Annonce'].map((type) => (
                    <button
                        key={type}
                        onClick={() => setEditData({ ...editData, competition_type: type, subtitle_badge: type })}
                        className={`py-2 rounded-lg text-[10px] font-black uppercase italic transition-all ${editData.competition_type === type ? 'bg-red-600 text-white' : 'text-white/40'}`}
                    >
                      {type}
                    </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <button
                onClick={() => setEditData({...editData, hidden: !editData.hidden})}
                className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-[10px] font-black uppercase transition-all ${editData.hidden ? 'bg-orange-500/10 text-orange-500 border border-orange-500/30' : 'bg-green-500/10 text-green-500 border border-green-500/30'}`}
            >
              {editData.hidden ? <><EyeOff size={14}/> Masqué</> : <><Eye size={14}/> Public</>}
            </button>
            <button onClick={() => onDelete(activeId)} className="p-3 bg-white/5 hover:bg-red-600 hover:text-white rounded-xl transition-colors text-white/40">
              <Trash2 size={18}/>
            </button>
            <button onClick={onCancel} className="p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-all text-white">
              <X size={18} />
            </button>
          </div>
        </div>

        {/* CONTENU PRINCIPAL */}
        <div className="grid gap-8 grid-cols-1 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-500 ml-2">Titre</label>
                <input className="w-full bg-black/40 p-4 rounded-2xl border border-white/10 text-white font-bold" value={editData.title || ""} onChange={e => setEditData({ ...editData, title: e.target.value })} />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-500 ml-2">Badge</label>
                <input className="w-full bg-black/40 p-4 rounded-2xl border border-white/10 text-red-600 font-bold" value={editData.subtitle_badge || ""} onChange={e => setEditData({ ...editData, subtitle_badge: e.target.value })} />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-500 ml-2">Sous-titre</label>
              <input className="w-full bg-black/40 p-4 rounded-2xl border border-white/10 text-white italic" value={editData.subtitle || ""} onChange={e => setEditData({ ...editData, subtitle: e.target.value })} />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-500 ml-2">Description</label>
              <textarea rows={6} className="w-full bg-black/40 p-5 rounded-2xl border border-white/10 text-sm text-gray-300" value={editData.description || ""} onChange={e => setEditData({ ...editData, description: e.target.value })} />
            </div>
          </div>

          {/* SIDEBAR */}
          <div className="bg-white/5 p-6 rounded-[2rem] border border-white/10 space-y-6">
            <h4 className="text-[10px] font-black uppercase text-red-600 tracking-widest border-b border-red-600/20 pb-2">Configuration</h4>

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-slate-400">Date</label>
                <input className="w-full bg-black/20 p-3 rounded-xl border border-white/5 text-sm text-white" value={editData.event_date || ""} onChange={e => setEditData({ ...editData, event_date: e.target.value })} />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-slate-400">Lieu</label>
                <input className="w-full bg-black/20 p-3 rounded-xl border border-white/5 text-sm text-white" value={editData.location || ""} onChange={e => setEditData({ ...editData, location: e.target.value })} />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-slate-400">Lien Inscription</label>
                <input className="w-full bg-black/20 p-3 rounded-xl border border-white/5 text-sm text-blue-400" value={editData.registration_url || ""} onChange={e => setEditData({ ...editData, registration_url: e.target.value })} />
              </div>

              <div className="pt-2">
                <label className="w-full cursor-pointer flex flex-col items-center justify-center gap-3 p-6 rounded-2xl border-2 border-dashed border-white/10 hover:border-red-600/50 transition-all text-white text-center">
                  <input type="file" onChange={handleFileUpload} className="hidden" accept="image/*" />
                  <Upload size={20} className="text-red-600" />
                  <span className="text-[9px] font-black uppercase">Changer Image</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* PIED DE PAGE FORMULAIRE */}
        <div className="flex pt-6">
          <button onClick={submitSave} disabled={loading} className="w-full bg-red-600 p-4 rounded-[1.5rem] font-black uppercase italic text-white hover:bg-red-700 transition-all flex items-center justify-center gap-3 shadow-xl">
            {loading ? <Loader2 className="animate-spin" /> : <><Check size={20}/> Sauvegarder</>}
          </button>
        </div>
      </div>
  );
};

/* ============================================================
   3. VUE PUBLIQUE (100% RESPONSIVE FIX)
   ============================================================ */
const PublicView = memo(({ config }: any) => {
  if (!config) return null;

  return (
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000 relative z-10 w-full overflow-hidden">

        {/* HERO SECTION */}
        <div className="max-w-6xl mx-auto mb-16 px-4 md:px-0">
          <div className="inline-flex items-center gap-3 px-4 py-2 bg-red-600 text-[10px] font-black uppercase tracking-[0.3em] mb-6 shadow-2xl skew-x-[-10deg]">
             <span className="skew-x-[10deg] flex items-center gap-2 text-white">
                <Flame size={12} fill="currentColor"/> {config.competition_type || "Événement"}
             </span>
          </div>

          {/* TITRE RESPONSIVE : break-words pour éviter le débordement */}
          <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-[9rem] font-black italic uppercase leading-[0.85] tracking-tighter mb-8 drop-shadow-2xl break-words hyphens-auto">
            <span className="text-white block">{config.title.split(' ')[0]}</span>
            <span className="text-red-600 block">{config.title.split(' ').slice(1).join(' ')}</span>
          </h1>

          <div className="flex flex-col md:flex-row md:items-center gap-8 mt-12">
            <p className="text-xl md:text-3xl font-black italic text-white max-w-2xl uppercase border-l-4 md:border-l-8 border-red-600 pl-6 py-2">
              {config.subtitle}
            </p>
            {config.registration_url && config.competition_type !== 'Annonce' && (
                <a href={config.registration_url} target="_blank" rel="noopener noreferrer"
                   className="w-full md:w-auto text-center group bg-white text-black px-10 py-5 rounded-full font-black italic uppercase text-lg hover:bg-red-600 hover:text-white transition-all shadow-2xl flex items-center justify-center gap-3">
                  S'inscrire <ChevronRight size={20}/>
                </a>
            )}
          </div>
        </div>

        {/* CARTES INFO */}
        {config.competition_type !== "Annonce" && (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 mb-24 px-4 md:px-0">
              {[
                { icon: Calendar, label: "Date", val: config.event_date },
                { icon: MapPin, label: "Lieu", val: config.location },
                { icon: Euro, label: "Tarif", val: `Dès ${config.events_table?.[0]?.tests?.[0]?.price || "6"}€` }
              ].map((item, i) => (
                  <div key={i} className="bg-white/5 backdrop-blur-2xl p-6 md:p-8 rounded-[2rem] border border-white/10">
                    <item.icon className="text-red-600 mb-4" size={32} />
                    <h3 className="font-black uppercase text-[10px] text-red-600 mb-1 tracking-widest">{item.label}</h3>
                    <p className="text-xl md:text-2xl font-black italic uppercase text-white leading-none break-words">{item.val}</p>
                  </div>
              ))}
            </div>
        )}

        {/* CONTENT GRID */}
        <div className="grid lg:grid-cols-12 gap-12 items-start px-4 md:px-0">

          {/* TEXTE & DESCRIPTION */}
          <div className="lg:col-span-5 space-y-10">
            <div>
              <div className="flex items-center gap-4 mb-6">
                <div className="h-[2px] w-12 bg-red-600" />
                <h2 className="text-3xl md:text-4xl font-black italic uppercase tracking-tighter text-white">L'événement</h2>
              </div>
              <p className="text-gray-300 leading-relaxed text-lg font-medium italic whitespace-pre-line">
                {config.description || "Aucune description disponible."}
              </p>
            </div>

            {/* INFO CARDS */}
            {config.extra_info?.map((info: any, idx: number) => (
                <div key={idx} className="bg-white/5 border-l-4 border-red-600 p-6 rounded-r-3xl">
                  <h4 className="text-xs font-black uppercase text-white tracking-widest mb-2 flex items-center gap-2">
                    <Info size={14} className="text-red-600"/> {info.title}
                  </h4>
                  <p className="text-sm text-gray-400 italic pl-6">{info.content}</p>
                </div>
            ))}

            {/* GALERIE */}
            {config.gallery_links?.length > 0 && (
                <div className="grid grid-cols-1 gap-3 pt-6">
                  {config.gallery_links.map((link: any, idx: number) => (
                      <a key={idx} href={link.url} target="_blank" className="flex items-center justify-between bg-white/5 hover:bg-red-600 p-5 rounded-2xl transition-all group border border-white/10">
                        <span className="font-bold italic uppercase text-sm text-white">{link.label}</span>
                        <ExternalLink size={16} className="text-white opacity-50 group-hover:opacity-100" />
                      </a>
                  ))}
                </div>
            )}
          </div>

          {/* TABLEAU PROGRAMME (RESPONSIVE FIX) */}
          {config.competition_type !== "Annonce" && (
              <div className="lg:col-span-7">
                <div className="bg-[#111] rounded-[2.5rem] border border-white/10 overflow-hidden shadow-2xl">
                  <div className="bg-gradient-to-r from-red-600 to-red-800 px-8 py-6 flex items-center gap-4">
                    <Clock size={24} className="text-white" />
                    <h3 className="font-black uppercase italic text-xl text-white">Programme</h3>
                  </div>

                  <div className="p-4 md:p-6 space-y-4">
                    {config.events_table?.map((cat: any, i: number) => (
                        <div key={i} className="flex flex-col sm:flex-row gap-4 bg-white/5 rounded-[2rem] p-6 border border-white/5">

                          {/* Colonne Gauche : Catégorie */}
                          <div className="sm:w-32 shrink-0 flex items-center sm:items-start gap-3">
                            <div className="p-2 bg-red-600/20 text-red-600 rounded-lg"><Users size={18}/></div>
                            <span className="font-black italic text-sm text-white uppercase">{cat.category}</span>
                          </div>

                          {/* Colonne Droite : Liste Epreuves */}
                          <div className="flex-1 space-y-4">
                            {cat.tests.map((test: any, j: number) => (
                                <div key={j} className="flex flex-col border-l-2 border-white/10 pl-4">
                                  <span className="text-[10px] uppercase font-black text-red-600 tracking-widest">{test.name}</span>
                                  <span className="text-base font-bold text-white italic">{test.sub}</span>
                                </div>
                            ))}
                          </div>

                          {/* Prix Mobile */}
                          <div className="mt-4 sm:mt-0 pt-4 sm:pt-0 sm:pl-4 border-t sm:border-t-0 sm:border-l border-white/10 flex sm:flex-col justify-between items-center sm:justify-center">
                            <span className="text-[9px] font-black uppercase text-white/40">Prix</span>
                            <span className="font-black italic text-red-600 text-2xl">{cat.tests[0]?.price}€</span>
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
   4. PAGE PRINCIPALE (NAVIGATION PAR URL + SUSPENSE)
   ============================================================ */
function SpeedNightContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const activeIdFromUrl = searchParams.get("id");

  const [config, setConfig] = useState<any>(null);
  const [allEvents, setAllEvents] = useState<any[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [loadingConfig, setLoadingConfig] = useState(true);
  const [toast, setToast] = useState({ show: false, message: "", type: 'success' as 'success' | 'error' });

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast(prev => ({ ...prev, show: false })), 4000);
  };

  // 1. Initialisation
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

      const { data, error } = await supabase.from('competition_config').select('id, title, hidden').order('id', { ascending: true });
      if (!error && data) {
        setAllEvents(data);
        // Si pas d'ID dans l'URL, on redirige vers le premier event valide
        if (!activeIdFromUrl && data.length > 0) {
          const defaultEvent = adminStatus ? data[0] : data.find(e => !e.hidden);
          if (defaultEvent) {
            router.replace(`?id=${defaultEvent.id}`);
          }
        }
      }
      setLoadingConfig(false);
    };
    init();
  }, [activeIdFromUrl, router]);

  // 2. Fetch Event Data quand l'URL change
  useEffect(() => {
    if (activeIdFromUrl) {
      const fetchSelected = async () => {
        const { data } = await supabase.from('competition_config').select('*').eq('id', activeIdFromUrl).single();
        if (data) {
          // Sécurité visibilité
          if (data.hidden && !isAdmin) {
            setConfig(null);
          } else {
            setConfig({
              ...data,
              events_table: Array.isArray(data.events_table) ? data.events_table : [],
              gallery_links: Array.isArray(data.gallery_links) ? data.gallery_links : [],
              extra_info: Array.isArray(data.extra_info) ? data.extra_info : []
            });
          }
        }
      };
      fetchSelected();
    }
  }, [activeIdFromUrl, isAdmin]);

  const handleAddNewEvent = async () => {
    // (Logique de création identique...)
    const newEvent = { title: "Nouvel événement", competition_type: "Compétition", hidden: true };
    const { data } = await supabase.from('competition_config').insert([newEvent]).select();
    if (data && data[0]) {
      showNotification("Créé !");
      router.push(`?id=${data[0].id}`); // Redirection URL
    }
  };

  const handleDelete = async (id: number) => {
    if(!confirm("Supprimer ?")) return;
    await supabase.from('competition_config').delete().eq('id', id);
    window.location.href = window.location.pathname; // Reload simple
  };

  if (loadingConfig) return <div className="min-h-screen bg-black flex items-center justify-center"><Loader2 className="animate-spin text-red-600" size={40} /></div>;

  const visibleEvents = isAdmin ? allEvents : allEvents.filter(e => !e.hidden);

  return (
      <div className={`min-h-screen relative text-white selection:bg-red-600 overflow-x-hidden ${config ? 'bg-[#050505]' : 'bg-black'}`}>

        {/* BACKGROUND */}
        {config && (
            <div className="fixed inset-0 z-0 bg-black pointer-events-none">
              {config.background_url ? (
                  <div className="absolute inset-0 bg-cover bg-center animate-in fade-in duration-1000"
                       style={{ backgroundImage: `url(${config.background_url})`, opacity: isEditing ? 0.2 : 0.6 }} />
              ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-black opacity-80" />
              )}
              <div className="absolute inset-0 bg-gradient-to-b from-black via-black/40 to-black z-10" />
            </div>
        )}

        <main className="relative z-10 container mx-auto px-4 pt-24 pb-32 min-h-screen">

          {/* NAVIGATION TABS (Mobile Scrollable) */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-12">
            <div className="w-full md:w-auto overflow-x-auto pb-4 md:pb-0 no-scrollbar">
              <div className="flex gap-2 bg-white/5 p-1.5 rounded-2xl border border-white/10 backdrop-blur-xl w-max">
                {visibleEvents.map((ev) => (
                    <button key={ev.id}
                            onClick={() => { router.push(`?id=${ev.id}`); setIsEditing(false); }}
                            className={`px-5 py-3 rounded-xl font-black italic uppercase transition-all text-[10px] tracking-widest whitespace-nowrap flex items-center gap-2 ${Number(activeIdFromUrl) === ev.id ? 'bg-red-600 text-white shadow-xl shadow-red-600/20' : 'hover:bg-white/10 text-white/40'}`}>
                      {isAdmin && ev.hidden && <EyeOff size={10} className="opacity-50"/>}
                      {ev.title}
                    </button>
                ))}
                {isAdmin && (
                    <button onClick={handleAddNewEvent} className="px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all"><Plus size={16}/></button>
                )}
              </div>
            </div>

            {isAdmin && !isEditing && config && (
                <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 bg-white text-black px-6 py-3 rounded-xl font-black uppercase text-[10px] hover:bg-red-600 hover:text-white transition-all shadow-xl">
                  <Settings size={14}/> Configurer
                </button>
            )}
          </div>

          {isEditing ? (
              <AdminForm initialData={config} activeId={activeIdFromUrl} onCancel={() => setIsEditing(false)} showNotification={showNotification} onDelete={handleDelete} />
          ) : (
              config ? <PublicView config={config}/> : (
                  <div className="flex flex-col items-center justify-center py-32 opacity-30">
                    <Ghost size={64} className="mb-4" />
                    <p className="font-black italic uppercase text-xl">Aucun événement</p>
                  </div>
              )
          )}
        </main>
        <Toast show={toast.show} message={toast.message} type={toast.type} onClose={() => setToast({...toast, show: false})}/>
      </div>
  );
}

// WRAPPER SUSPENSE OBLIGATOIRE
export default function SpeedNightPage() {
  return (
      <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center"><Loader2 className="animate-spin text-red-600"/></div>}>
        <SpeedNightContent />
      </Suspense>
  );
}