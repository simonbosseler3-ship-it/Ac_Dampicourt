"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Navbar } from "@/components/navbar/navbar";
import { Settings, Check, X, Upload, Camera, ExternalLink, Trophy } from "lucide-react";

export default function SpeedNightPage() {
  const [config, setConfig] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editData, setEditData] = useState<any>({});

  // On gère l'ID actif (1 = Night, 2 = Race)
  const [activeId, setActiveId] = useState(1);

  useEffect(() => {
    fetchConfig(activeId);
    checkPermissions();
  }, [activeId]);

  const fetchConfig = async (id: number) => {
    const { data } = await supabase.from('competition_config').select('*').eq('id', id).single();
    if (data) {
      setConfig(data);
      setEditData(data);
    }
  };

  const checkPermissions = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data } = await supabase.from('profiles').select('role').eq('id', user.id).single();
      if (data?.role === 'admin') setIsAdmin(true);
    }
  };

  const handleFileUpload = async (e: any) => {
    const file = e.target.files[0];
    if (!file) return;
    setLoading(true);

    const fileExt = file.name.split('.').pop();
    const fileName = `bg-competition-${activeId}-${Math.random()}.${fileExt}`;
    const { error } = await supabase.storage.from('news-images').upload(fileName, file);

    if (!error) {
      const { data: { publicUrl } } = supabase.storage.from('news-images').getPublicUrl(fileName);
      setEditData({ ...editData, background_url: publicUrl });
    }
    setLoading(false);
  };

  const saveChanges = async () => {
    setLoading(true);
    // On met à jour la ligne correspondant à l'ID actif
    const { error } = await supabase.from('competition_config').update(editData).eq('id', activeId);

    if (!error) {
      setConfig(editData);
      setIsEditing(false);
    }
    setLoading(false);
  };

  if (!config) return null;

  return (
      <div className="min-h-screen relative">

        {/* Fond d'écran dynamique selon la config chargée */}
        <div
            className="fixed inset-0 z-0 bg-cover bg-center transition-all duration-1000"
            style={{ backgroundImage: `url(${config.background_url})` }}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />
        </div>

        <main className="relative z-10 container mx-auto px-4 pt-32 pb-20 text-white">

          {/* SÉLECTEUR DE MODÈLE (Navigation entre ID 1 et ID 2) */}
          <div className="flex gap-3 mb-12">
            <button
                onClick={() => { setActiveId(1); setIsEditing(false); }}
                className={`px-6 py-2 rounded-full font-black italic uppercase transition-all text-sm border ${activeId === 1 ? 'bg-red-600 border-red-600 shadow-lg shadow-red-600/20' : 'bg-white/5 border-white/10 opacity-60 hover:opacity-100'}`}
            >
              Speed Night
            </button>
            <button
                onClick={() => { setActiveId(2); setIsEditing(false); }}
                className={`px-6 py-2 rounded-full font-black italic uppercase transition-all text-sm border ${activeId === 2 ? 'bg-red-600 border-red-600 shadow-lg shadow-red-600/20' : 'bg-white/5 border-white/10 opacity-60 hover:opacity-100'}`}
            >
              Speed Race
            </button>
          </div>

          {isAdmin && !isEditing && (
              <button
                  onClick={() => setIsEditing(true)}
                  className="mb-8 flex items-center gap-2 bg-white/20 hover:bg-white/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/30 transition-all text-xs font-bold uppercase"
              >
                <Settings className="h-4 w-4" /> Modifier la {config.title}
              </button>
          )}

          {isEditing ? (
              /* FORMULAIRE D'ÉDITION */
              <div className="bg-slate-900/90 backdrop-blur-xl p-8 rounded-3xl border border-white/20 max-w-2xl space-y-6 animate-in fade-in zoom-in duration-300">
                <h2 className="text-2xl font-black italic uppercase flex items-center gap-2">
                  <Trophy className="text-red-600" /> Configuration {config.title}
                </h2>

                <div className="grid gap-4">
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold uppercase text-slate-400 ml-1">Sous-titre</p>
                    <input className="w-full bg-white/10 p-3 rounded-xl border border-white/10 focus:border-red-600 outline-none transition-colors" value={editData.subtitle} onChange={e => setEditData({ ...editData, subtitle: e.target.value })} />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold uppercase text-slate-400 ml-1">Date</p>
                      <input className="w-full bg-white/10 p-3 rounded-xl border border-white/10 focus:border-red-600 outline-none transition-colors" value={editData.event_date} onChange={e => setEditData({ ...editData, event_date: e.target.value })} />
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold uppercase text-slate-400 ml-1">Lieu</p>
                      <input className="w-full bg-white/10 p-3 rounded-xl border border-white/10 focus:border-red-600 outline-none transition-colors" value={editData.location} onChange={e => setEditData({ ...editData, location: e.target.value })} />
                    </div>
                  </div>

                  <div className="border-2 border-dashed border-white/20 p-6 rounded-2xl text-center bg-white/5">
                    <input type="file" onChange={handleFileUpload} className="hidden" id="bg-upload" />
                    <label htmlFor="bg-upload" className="cursor-pointer bg-white/10 px-6 py-2 rounded-lg hover:bg-white/20 inline-flex items-center gap-2 transition-all">
                      <Upload className="h-4 w-4" /> Remplacer l'image de fond
                    </label>
                    <p className="text-[9px] text-slate-500 mt-3 uppercase font-bold tracking-widest">Format recommandé: 1920x1080</p>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button onClick={saveChanges} disabled={loading} className="flex-1 bg-red-600 p-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-red-700 transition-colors shadow-lg shadow-red-600/20">
                    <Check className="h-4 w-4" /> Enregistrer les changements
                  </button>
                  <button onClick={() => setIsEditing(false)} className="bg-white/10 p-4 rounded-xl hover:bg-white/20 transition-colors">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
          ) : (
              /* AFFICHAGE PUBLIC */
              <div className="max-w-4xl animate-in fade-in slide-in-from-bottom-8 duration-700">
                <h1 className="text-6xl md:text-8xl font-black italic uppercase leading-none tracking-tighter">
                  Dampicourt <span className="text-red-600">{config.title}</span>
                </h1>

                <p className="mt-6 text-xl md:text-2xl font-bold italic text-gray-200 max-w-2xl uppercase">
                  {config.subtitle}
                </p>

                <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20">
                    <h3 className="font-black italic text-xs uppercase text-red-500">Date</h3>
                    <p className="text-2xl font-bold">{config.event_date}</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20">
                    <h3 className="font-black italic text-xs uppercase text-red-500">Lieu</h3>
                    <p className="text-2xl font-bold">{config.location}</p>
                  </div>
                  <div className="bg-red-600 p-6 rounded-2xl shadow-xl hover:scale-105 transition-transform cursor-pointer flex items-center justify-center">
                    <p className="text-2xl font-black italic uppercase tracking-tighter">S'inscrire</p>
                  </div>
                </div>

                <div className="mt-16">
                  <h2 className="text-2xl font-black italic uppercase mb-6 flex items-center gap-3">
                    <Camera className="text-red-600" /> Albums Photos
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {config.photos_url_1 && (
                        <a href={config.photos_url_1} target="_blank" rel="noopener noreferrer"
                           className="group bg-white/5 hover:bg-white/10 border border-white/10 p-5 rounded-2xl flex items-center justify-between transition-all">
                          <div>
                            <p className="text-red-500 text-[10px] font-black uppercase">Édition précédente</p>
                            <p className="text-lg font-bold italic uppercase">Photos {config.title} 2024</p>
                          </div>
                          <ExternalLink size={20} className="text-white/30 group-hover:text-red-600 transition-colors" />
                        </a>
                    )}
                    {config.photos_url_2 && (
                        <a href={config.photos_url_2} target="_blank" rel="noopener noreferrer"
                           className="group bg-white/5 hover:bg-white/10 border border-white/10 p-5 rounded-2xl flex items-center justify-between transition-all">
                          <div>
                            <p className="text-red-500 text-[10px] font-black uppercase">Dernière édition</p>
                            <p className="text-lg font-bold italic uppercase">Photos {config.title} 2025</p>
                          </div>
                          <ExternalLink size={20} className="text-white/30 group-hover:text-red-600 transition-colors" />
                        </a>
                    )}
                  </div>
                </div>
              </div>
          )}
        </main>
      </div>
  );
}