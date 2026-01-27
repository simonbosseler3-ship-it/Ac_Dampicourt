"use client";
import { useEffect, useState, useCallback, memo } from "react";
import { supabase } from "@/lib/supabase";
import {
  Settings, Check, X, Upload, Camera, ExternalLink,
  Calendar, MapPin, Euro, Zap, Flame, Plus, Trash2,
  Loader2, AlignLeft, TableProperties, Info, Users
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
   2. COMPOSANT D'ÉDITION ADMIN
   ============================================================ */
const AdminForm = ({ initialData, activeId, onSave, onCancel, showNotification }: any) => {
  const [editData, setEditData] = useState(initialData);
  const [loading, setLoading] = useState(false);

  // Upload d'image de fond
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

  // Fonctions de gestion du programme (JSONB)
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
      // On prépare l'objet à sauvegarder.
      // NOTE: gallery_links n'est pas inclus ici pour ne pas écraser tes modifs manuelles en base de données.
      const payload = {
        description: editData.description,
        competition_type: editData.competition_type,
        location: editData.location,
        subtitle: editData.subtitle,
        event_date: editData.event_date,
        registration_url: editData.registration_url,
        background_url: editData.background_url,
        events_table: JSON.parse(JSON.stringify(editData.events_table))
      };

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Session expirée");

      const { error } = await supabase
      .from('competition_config')
      .update(payload)
      .eq('id', activeId);

      if (error) throw error;

      showNotification("Modifications enregistrées !");
      setTimeout(() => {
        window.location.reload();
      }, 500);

    } catch (error: any) {
      console.error("Erreur sauvegarde:", error);
      showNotification(error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
      <div className="bg-slate-900/95 backdrop-blur-2xl p-6 md:p-10 rounded-[2rem] border border-white/20 max-w-5xl mx-auto shadow-2xl space-y-10 animate-in fade-in zoom-in-95 duration-300">
        <div className="flex justify-between items-center border-b border-white/10 pb-6">
          <h2 className="text-2xl font-black italic uppercase flex items-center gap-3">
            <Settings className="text-red-600" /> Edition : {editData.title}
          </h2>
          <X className="cursor-pointer opacity-50 hover:opacity-100" onClick={onCancel} />
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase text-slate-400">Description générale</label>
            <textarea
                rows={6}
                className="w-full bg-white/5 p-4 rounded-xl border border-white/10 focus:border-red-600 outline-none text-sm text-gray-300"
                value={editData.description || ""}
                onChange={e => setEditData({ ...editData, description: e.target.value })}
            />
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400">Badge Type (Ex: NIGHT)</label>
                <input className="w-full bg-white/5 p-3 rounded-xl border border-white/10 outline-none focus:border-red-600" value={editData.competition_type || ""} onChange={e => setEditData({ ...editData, competition_type: e.target.value })} />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400">Lieu</label>
                <input className="w-full bg-white/5 p-3 rounded-xl border border-white/10 outline-none focus:border-red-600" value={editData.location || ""} onChange={e => setEditData({ ...editData, location: e.target.value })} />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400">Sous-titre</label>
              <input className="w-full bg-white/5 p-3 rounded-xl border border-white/10 outline-none focus:border-red-600" value={editData.subtitle || ""} onChange={e => setEditData({ ...editData, subtitle: e.target.value })} />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400">Date</label>
              <input className="w-full bg-white/5 p-3 rounded-xl border border-white/10 outline-none text-red-500 font-bold focus:border-red-600" value={editData.event_date || ""} onChange={e => setEditData({ ...editData, event_date: e.target.value })} />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400">URL Inscription</label>
              <input className="w-full bg-white/5 p-3 rounded-xl border border-white/10 outline-none text-blue-400 focus:border-red-600" value={editData.registration_url || ""} onChange={e => setEditData({ ...editData, registration_url: e.target.value })} />
            </div>
            <div className="border-2 border-dashed border-white/10 p-4 rounded-2xl bg-white/5 text-center">
              <input type="file" onChange={handleFileUpload} className="hidden" id="bg-upload" accept="image/*" />
              <label htmlFor="bg-upload" className="cursor-pointer flex items-center justify-center gap-3 text-xs font-bold uppercase">
                <Upload size={16} className="text-red-600" /> Changer l'image de fond
              </label>
            </div>
          </div>
        </div>

        {/* TABLEAU DES ÉPREUVES */}
        <div className="pt-8 border-t border-white/10">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-sm font-black uppercase italic text-red-600 flex items-center gap-2">
              <TableProperties size={18} /> Configuration du programme
            </h3>
            <button onClick={addCategory} className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg text-[10px] font-bold uppercase transition-all flex items-center gap-2">
              <Plus size={14} /> Ajouter une catégorie
            </button>
          </div>
          <div className="grid grid-cols-1 gap-6">
            {editData.events_table?.map((cat: any, cIdx: number) => (
                <div key={cIdx} className="bg-white/5 p-6 rounded-2xl border border-white/5 relative">
                  <button onClick={() => removeCategory(cIdx)} className="absolute top-4 right-4 text-white/20 hover:text-red-500 transition-colors">
                    <Trash2 size={18} />
                  </button>
                  <input
                      className="bg-transparent text-xl font-black italic uppercase outline-none border-b border-red-600/30 focus:border-red-600 mb-6 w-full max-w-md"
                      value={cat.category}
                      onChange={e => {
                        const nt = [...editData.events_table]; nt[cIdx].category = e.target.value; setEditData({ ...editData, events_table: nt });
                      }}
                  />
                  <div className="space-y-3">
                    {cat.tests.map((test: any, tIdx: number) => (
                        <div key={tIdx} className="grid grid-cols-12 gap-3 items-center">
                          <input placeholder="Épreuve" className="col-span-3 bg-black/40 p-2 rounded border border-white/10 text-xs" value={test.name} onChange={e => {
                            const nt = [...editData.events_table]; nt[cIdx].tests[tIdx].name = e.target.value; setEditData({ ...editData, events_table: nt });
                          }} />
                          <input placeholder="Détails" className="col-span-6 bg-black/40 p-2 rounded border border-white/10 text-xs" value={test.sub} onChange={e => {
                            const nt = [...editData.events_table]; nt[cIdx].tests[tIdx].sub = e.target.value; setEditData({ ...editData, events_table: nt });
                          }} />
                          <input placeholder="Prix" className="col-span-2 bg-black/40 p-2 rounded border border-white/10 text-xs text-center font-bold text-red-500" value={test.price} onChange={e => {
                            const nt = [...editData.events_table]; nt[cIdx].tests[tIdx].price = e.target.value; setEditData({ ...editData, events_table: nt });
                          }} />
                          <button onClick={() => {
                            const nt = [...editData.events_table]; nt[cIdx].tests = nt[cIdx].tests.filter((_:any, i:number) => i !== tIdx); setEditData({ ...editData, events_table: nt });
                          }} className="col-span-1 text-white/20 hover:text-red-500 flex justify-center"><X size={14}/></button>
                        </div>
                    ))}
                    <button onClick={() => addTestRow(cIdx)} className="text-[9px] font-black uppercase text-red-600/60 hover:text-red-600 mt-2 flex items-center gap-1 italic">
                      <Plus size={10}/> Ajouter une épreuve
                    </button>
                  </div>
                </div>
            ))}
          </div>
        </div>

        <button onClick={submitSave} disabled={loading} className="w-full bg-red-600 p-5 rounded-2xl font-black uppercase italic tracking-widest hover:bg-red-700 transition-all flex items-center justify-center gap-3 shadow-xl">
          {loading ? <Loader2 className="animate-spin" /> : <><Check /> Enregistrer les configurations</>}
        </button>
      </div>
  );
};

/* ============================================================
   3. COMPOSANT VUE PUBLIQUE
   ============================================================ */
const PublicView = memo(({ config }: any) => {
  return (
      <div className="animate-in fade-in duration-700">
        <div className="max-w-5xl mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-1 bg-red-600 text-[10px] font-black uppercase tracking-[0.3em] mb-6">
            <Flame size={12} fill="currentColor" /> {config.competition_type}
          </div>
          <h1 className="text-6xl md:text-[8rem] font-black italic uppercase leading-[0.85] tracking-tighter mb-8 drop-shadow-2xl">
            Dampicourt <br /> <span className="text-red-600">{config.title}</span>
          </h1>
          <p className="text-xl md:text-2xl font-bold italic text-gray-300 max-w-3xl uppercase border-l-4 border-red-600 pl-6 mb-10">
            {config.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-24">
          <div className="bg-white/5 backdrop-blur-xl p-8 rounded-3xl border border-white/10 shadow-2xl group hover:bg-white/10 transition-all">
            <Calendar className="text-red-600 mb-6 group-hover:scale-110 transition-transform" size={32} />
            <h3 className="font-black uppercase text-[10px] text-white/40 mb-1 tracking-widest">Date</h3>
            <p className="text-xl font-black italic uppercase">{config.event_date}</p>
          </div>
          <div className="bg-white/5 backdrop-blur-xl p-8 rounded-3xl border border-white/10 shadow-2xl group hover:bg-white/10 transition-all">
            <MapPin className="text-red-600 mb-6 group-hover:scale-110 transition-transform" size={32} />
            <h3 className="font-black uppercase text-[10px] text-white/40 mb-1 tracking-widest">Lieu</h3>
            <p className="text-xl font-black italic uppercase">{config.location}</p>
          </div>
          <div className="bg-white/5 backdrop-blur-xl p-8 rounded-3xl border border-white/10 shadow-2xl group hover:bg-white/10 transition-all">
            <Euro className="text-red-600 mb-6 group-hover:scale-110 transition-transform" size={32} />
            <h3 className="font-black uppercase text-[10px] text-white/40 mb-1 tracking-widest">Tarif</h3>
            <p className="text-xl font-black italic uppercase">Dès {config.events_table?.[0]?.tests?.[0]?.price || "6"}€</p>
          </div>
          <a href={config.registration_url} target="_blank" className="bg-red-600 p-8 rounded-3xl flex flex-col items-center justify-center text-center hover:scale-[1.05] hover:-rotate-1 transition-all shadow-2xl group shadow-red-600/20">
            <Zap size={40} fill="white" className="mb-4 group-hover:animate-pulse" />
            <span className="text-2xl font-black italic uppercase tracking-tighter">S'inscrire</span>
          </a>
        </div>

        {/* PROGRAMME & ÉPREUVES */}
        <div className="grid lg:grid-cols-2 gap-16 items-start mt-20">
          <div className="bg-white/5 rounded-[2.5rem] border border-white/10 overflow-hidden shadow-2xl backdrop-blur-md">
            <div className="bg-gradient-to-r from-red-600 to-red-700 px-8 py-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <TableProperties size={20} className="text-white" />
                <h3 className="font-black uppercase italic text-sm tracking-widest">Programme & Épreuves</h3>
              </div>
            </div>
            <table className="w-full text-left border-collapse">
              <tbody className="divide-y divide-white/5">
              {config.events_table?.map((cat: any, i: number) => (
                  <tr key={i} className="group hover:bg-white/5 transition-colors">
                    <td className="p-6 align-top border-r border-white/5 bg-white/5 w-1/3">
                      <div className="flex items-center gap-2 font-black italic text-[11px] text-red-600 uppercase tracking-tighter">
                        <Users size={14} /> {cat.category}
                      </div>
                    </td>
                    <td className="p-6">
                      {cat.tests.map((test: any, j: number) => (
                          <div key={j} className="mb-4 last:mb-0">
                            <div className="text-[10px] uppercase font-black text-white/30 mb-1 tracking-widest">{test.name}</div>
                            <div className="text-sm font-bold text-gray-200 italic">{test.sub}</div>
                          </div>
                      ))}
                    </td>
                    <td className="p-6 align-middle text-right font-black italic text-red-600 text-lg">
                      {cat.tests[0]?.price}€
                    </td>
                  </tr>
              ))}
              </tbody>
            </table>
          </div>

          <div className="space-y-12">
            <div className="relative">
              <div className="absolute -left-8 top-0 bottom-0 w-1.5 bg-red-600 shadow-[0_0_20px_rgba(220,38,38,0.6)]" />
              <h2 className="text-4xl font-black italic uppercase mb-8 flex items-center gap-4">
                <AlignLeft className="text-red-600" size={32} /> L'événement
              </h2>
              <p className="text-gray-300 leading-relaxed text-xl whitespace-pre-line font-medium italic opacity-90">
                {config.description || "Aucune description disponible."}
              </p>
            </div>

            <div className="bg-white/5 p-8 rounded-[2rem] border border-white/10 space-y-5">
              <h3 className="text-red-600 font-black uppercase text-xs tracking-[0.2em] flex items-center gap-2 mb-2">
                <Info size={16} /> Bon à savoir
              </h3>
              <div className="grid grid-cols-1 gap-4">
                {["Prize Money pour les podiums scratch", "Chronométrage électronique (FinishLynx)", "Buvette et restauration sur place", "Entrée spectateurs gratuite"].map((info, idx) => (
                    <div key={idx} className="flex items-center gap-3 text-xs font-black uppercase italic text-gray-400">
                      <div className="h-1.5 w-1.5 bg-red-600 rounded-full" />
                      {info}
                    </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* SECTION GALERIE (Toujours présente en vue publique) */}
        <div className="pt-24 mt-24 border-t border-white/10">
          <h2 className="text-4xl font-black italic uppercase mb-12 flex items-center gap-4 justify-center">
            <Camera className="text-red-600" size={36} /> Galerie & Souvenirs
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {config.gallery_links && config.gallery_links.length > 0 ? (
                config.gallery_links.map((album: any, i: number) => {
                  let finalUrl = album.url;
                  try {
                    if (album.url && !album.url.startsWith('http')) {
                      finalUrl = atob(album.url);
                    }
                  } catch (e) {
                    finalUrl = album.url;
                  }

                  return (
                      <a key={i} href={finalUrl} target="_blank" rel="noopener noreferrer" className="group relative overflow-hidden rounded-[2rem] aspect-video flex items-center justify-center border border-white/10 bg-white/5 hover:bg-red-600/10 transition-all shadow-xl">
                        <div className="text-center p-8">
                          <p className="text-red-500 text-[10px] font-black uppercase mb-2 tracking-[0.3em] italic">Album Officiel</p>
                          <p className="text-3xl font-black italic uppercase leading-none tracking-tighter">{album.title}</p>
                          <ExternalLink size={18} className="mx-auto mt-6 opacity-30 group-hover:opacity-100 group-hover:text-red-600 transition-all" />
                        </div>
                      </a>
                  );
                })
            ) : (
                <div className="col-span-full py-20 text-center border border-dashed border-white/10 rounded-[2rem] opacity-30 italic uppercase font-black text-sm tracking-widest">
                  Les photos arriveront après l'événement
                </div>
            )}
          </div>
        </div>
      </div>
  );
});

/* ============================================================
   4. PAGE PRINCIPALE (CONTRÔLEUR)
   ============================================================ */
export default function SpeedNightPage() {
  const [config, setConfig] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [loadingConfig, setLoadingConfig] = useState(true);
  const [activeId, setActiveId] = useState(1);
  const [toast, setToast] = useState({ show: false, message: "", type: 'success' as 'success' | 'error' });

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast(prev => ({ ...prev, show: false })), 4000);
  };

  const checkPermissions = useCallback(async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      const { data } = await supabase.from('profiles').select('role').eq('id', session.user.id).single();
      if (data?.role === 'admin' || data?.role === 'redacteur') setIsAdmin(true);
    } catch (e) { console.warn("Auth check failed", e); }
  }, []);

  const fetchConfig = useCallback(async (id: number) => {
    setLoadingConfig(true);
    try {
      const { data, error } = await supabase.from('competition_config').select('*').eq('id', id).single();
      if (error) throw error;
      setConfig({
        ...data,
        gallery_links: Array.isArray(data.gallery_links) ? data.gallery_links : [],
        events_table: Array.isArray(data.events_table) ? data.events_table : []
      });
    } catch (err) { console.error(err); } finally { setLoadingConfig(false); }
  }, []);

  useEffect(() => {
    setIsEditing(false);
    fetchConfig(activeId);
    checkPermissions();
  }, [activeId, fetchConfig, checkPermissions]);

  if (loadingConfig && !config) return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="animate-spin text-red-600" size={48} />
      </div>
  );

  return (
      <div className="min-h-screen relative bg-black text-white selection:bg-red-600 overflow-x-hidden">
        <div className="fixed inset-0 z-0 bg-black">
          <div
              key={config.background_url}
              className="absolute inset-0 bg-cover bg-center animate-in fade-in duration-1000 ease-in-out"
              style={{
                backgroundImage: `url(${config.background_url})`,
                opacity: isEditing ? 0.3 : 1
              }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/40 to-black z-10" />
        </div>

        <main className="relative z-10 container mx-auto px-4 pt-32 pb-20 font-sans">
          <div className="flex flex-wrap items-center justify-between gap-6 mb-16">
            <div className="flex gap-3 bg-white/5 p-1.5 rounded-full border border-white/10 backdrop-blur-md">
              {[1, 2].map((id) => (
                  <button
                      key={id}
                      onClick={() => { if (activeId !== id) setActiveId(id); setIsEditing(false); }}
                      className={`px-8 py-2.5 rounded-full font-black italic uppercase transition-all text-xs tracking-widest ${activeId === id ? 'bg-red-600 text-white shadow-lg' : 'hover:bg-white/10 text-white/60'}`}
                  >
                    {id === 1 ? 'Speed Night' : 'Speed Race'}
                  </button>
              ))}
            </div>

            {isAdmin && !isEditing && (
                <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 bg-white text-black px-6 py-2.5 rounded-full font-black uppercase text-[10px] hover:bg-red-600 hover:text-white transition-all">
                  <Settings size={14}/> Configurer l'événement
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
              />
          ) : (
              <PublicView key={activeId} config={config}/>
          )}
        </main>

        <Toast show={toast.show} message={toast.message} type={toast.type} onClose={() => setToast({...toast, show: false})}/>
      </div>
  );
}