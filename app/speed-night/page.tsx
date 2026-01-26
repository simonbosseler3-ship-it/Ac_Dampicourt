"use client";
import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import {
  Settings, Check, X, Upload, Camera, ExternalLink,
  Trophy, Calendar, MapPin, Euro, Zap, Flame,
  Target, Users, Plus, Trash2
} from "lucide-react";

export default function SpeedNightPage() {
  const [config, setConfig] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editData, setEditData] = useState<any>(null);
  const [activeId, setActiveId] = useState(1);

  // Mémorisation pour éviter les recréations de fonctions qui causeraient des boucles
  const checkPermissions = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data } = await supabase.from('profiles').select('role').eq('id', user.id).single();
      if (data?.role === 'admin' || data?.role === 'redacteur') setIsAdmin(true);
    }
  }, []);

  const fetchConfig = useCallback(async (id: number) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
      .from('competition_config')
      .select('*')
      .eq('id', id)
      .single();

      if (error) throw error;

      if (data) {
        // Sécurisation immédiate du champ JSONB
        const safeData = {
          ...data,
          gallery_links: Array.isArray(data.gallery_links) ? data.gallery_links : []
        };
        setConfig(safeData);
        setEditData(safeData);
      }
    } catch (err) {
      console.error("Erreur de chargement:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchConfig(activeId);
    checkPermissions();
  }, [activeId, fetchConfig, checkPermissions]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editData) return;

    setLoading(true);
    const fileExt = file.name.split('.').pop();
    const fileName = `bg-comp-${activeId}-${Date.now()}.${fileExt}`;

    try {
      const { error: uploadError } = await supabase.storage
      .from('news-images')
      .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
      .from('news-images')
      .getPublicUrl(fileName);

      setEditData({ ...editData, background_url: publicUrl });
    } catch (err: any) {
      alert("Erreur upload: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const addAlbumLink = () => {
    const currentLinks = Array.isArray(editData.gallery_links) ? editData.gallery_links : [];
    setEditData({
      ...editData,
      gallery_links: [...currentLinks, { title: "", url: "" }]
    });
  };

  const updateAlbumLink = (index: number, field: string, value: string) => {
    const updatedLinks = [...editData.gallery_links];
    updatedLinks[index] = { ...updatedLinks[index], [field]: value };
    setEditData({ ...editData, gallery_links: updatedLinks });
  };

  const removeAlbumLink = (index: number) => {
    const updatedLinks = editData.gallery_links.filter((_: any, i: number) => i !== index);
    setEditData({ ...editData, gallery_links: updatedLinks });
  };

  const saveChanges = async () => {
    if (!editData) return;
    setLoading(true);

    try {
      // 1. Extraction propre des données à modifier
      // On ignore délibérément id, created_at et updated_at s'ils existent dans editData
      const payload = {
        title: editData.title,
        subtitle: editData.subtitle,
        event_date: editData.event_date,
        location: editData.location,
        registration_url: editData.registration_url,
        competition_type: editData.competition_type,
        background_url: editData.background_url,
        gallery_links: editData.gallery_links
      };

      // 2. Mise à jour dans Supabase
      const { data, error } = await supabase
      .from('competition_config')
      .update(payload)
      .eq('id', activeId)
      .select()
      .single(); // On récupère la ligne mise à jour pour être sûr

      if (error) throw error;

      // 3. Mise à jour de l'état local avec la réponse du serveur
      // Comme ça, on est sûr d'avoir les données exactes de la DB
      setConfig(data);
      setEditData(data);
      setIsEditing(false);

      // Feedback utilisateur
      alert("Configuration mise à jour avec succès !");

    } catch (error: any) {
      console.error("Erreur complète:", error);
      // On affiche un message plus clair si c'est un problème de permission
      const message = error.code === "42501"
          ? "Erreur de permission : Vous n'avez pas les droits suffisants."
          : error.message;
      alert("Erreur : " + message);
    } finally {
      setLoading(false);
    }
  };

  // Sécurité d'affichage
  if (!config || !editData) return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-red-600"></div>
      </div>
  );

  return (
      <div className="min-h-screen relative bg-black text-white selection:bg-red-600">
        {/* Background avec Overlay */}
        <div
            className="fixed inset-0 z-0 bg-cover bg-center transition-all duration-1000"
            style={{ backgroundImage: `url(${config.background_url})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/50 to-black" />
        </div>

        <main className="relative z-10 container mx-auto px-4 pt-32 pb-20">
          {/* Nav & Admin Button */}
          <div className="flex flex-wrap items-center justify-between gap-6 mb-16">
            <div className="flex gap-3 bg-white/5 p-1.5 rounded-full border border-white/10 backdrop-blur-md">
              {[1, 2].map((id) => (
                  <button
                      key={id}
                      onClick={() => { setActiveId(id); setIsEditing(false); }}
                      className={`px-8 py-2.5 rounded-full font-black italic uppercase transition-all text-xs tracking-widest ${activeId === id ? 'bg-red-600 text-white shadow-lg shadow-red-600/40' : 'hover:bg-white/10 text-white/60'}`}
                  >
                    {id === 1 ? 'Speed Night' : 'Speed Race'}
                  </button>
              ))}
            </div>

            {isAdmin && !isEditing && (
                <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2 bg-white text-black px-6 py-2.5 rounded-full font-black uppercase text-[10px] hover:bg-red-600 hover:text-white transition-all"
                >
                  <Settings size={14} /> Configurer
                </button>
            )}
          </div>

          {isEditing ? (
              /* FORMULAIRE D'ÉDITION */
              <div className="bg-slate-900/95 backdrop-blur-2xl p-6 md:p-10 rounded-[2rem] border border-white/20 max-w-4xl mx-auto shadow-2xl space-y-8 animate-in fade-in zoom-in duration-300">
                <div className="flex justify-between items-center border-b border-white/10 pb-6">
                  <h2 className="text-2xl font-black italic uppercase">Modif. <span className="text-red-600">{config.title}</span></h2>
                  <X className="cursor-pointer opacity-50 hover:opacity-100" onClick={() => setIsEditing(false)} />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-[10px] font-black uppercase text-red-500 tracking-widest">Badge Haut</label>
                    <input
                        className="w-full bg-white/5 p-4 rounded-xl border border-white/10 focus:border-red-600 outline-none"
                        value={editData.competition_type || ""}
                        onChange={e => setEditData({ ...editData, competition_type: e.target.value })}
                    />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400">Sous-titre</label>
                    <input className="w-full bg-white/5 p-4 rounded-xl border border-white/10 focus:border-red-600 outline-none" value={editData.subtitle || ""} onChange={e => setEditData({ ...editData, subtitle: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400">Date</label>
                    <input className="w-full bg-white/5 p-4 rounded-xl border border-white/10 focus:border-red-600 outline-none" value={editData.event_date || ""} onChange={e => setEditData({ ...editData, event_date: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400">Lieu</label>
                    <input className="w-full bg-white/5 p-4 rounded-xl border border-white/10 focus:border-red-600 outline-none" value={editData.location || ""} onChange={e => setEditData({ ...editData, location: e.target.value })} />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400">Lien Inscription URL</label>
                    <input className="w-full bg-white/5 p-4 rounded-xl border border-white/10 focus:border-red-600 outline-none text-red-500" value={editData.registration_url || ""} onChange={e => setEditData({ ...editData, registration_url: e.target.value })} />
                  </div>
                </div>

                {/* ALBUMS */}
                <div className="space-y-4 pt-4 border-t border-white/10">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-black uppercase italic text-red-600">Albums Photos</h3>
                    <button onClick={addAlbumLink} className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg text-[10px] font-bold uppercase transition-all">
                      <Plus size={14} /> Ajouter
                    </button>
                  </div>

                  <div className="space-y-3">
                    {editData.gallery_links.map((album: any, index: number) => (
                        <div key={index} className="flex gap-4 items-end bg-white/5 p-4 rounded-xl border border-white/5">
                          <div className="flex-1 space-y-1">
                            <label className="text-[8px] font-bold uppercase text-slate-500">Titre</label>
                            <input className="w-full bg-black/40 border border-white/10 p-2 rounded text-sm outline-none focus:border-red-600" value={album.title} onChange={e => updateAlbumLink(index, 'title', e.target.value)} />
                          </div>
                          <div className="flex-[2] space-y-1">
                            <label className="text-[8px] font-bold uppercase text-slate-500">URL Facebook</label>
                            <input className="w-full bg-black/40 border border-white/10 p-2 rounded text-sm outline-none focus:border-red-600" value={album.url} onChange={e => updateAlbumLink(index, 'url', e.target.value)} />
                          </div>
                          <button onClick={() => removeAlbumLink(index)} className="p-2 text-red-500 hover:bg-red-500/10 rounded transition-colors">
                            <Trash2 size={20} />
                          </button>
                        </div>
                    ))}
                  </div>
                </div>

                <div className="border-2 border-dashed border-white/10 p-6 rounded-2xl text-center bg-white/5">
                  <input type="file" onChange={handleFileUpload} className="hidden" id="bg-upload" accept="image/*" />
                  <label htmlFor="bg-upload" className="cursor-pointer flex flex-col items-center gap-3">
                    <Upload className="text-red-600" />
                    <span className="font-bold uppercase text-xs">Changer l'image de fond</span>
                  </label>
                </div>

                <button
                    onClick={saveChanges}
                    disabled={loading}
                    className="w-full bg-red-600 p-5 rounded-2xl font-black uppercase italic tracking-widest hover:bg-red-700 transition-all flex items-center justify-center gap-3 shadow-xl"
                >
                  {loading ? <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-white"></div> : <><Check /> Enregistrer</>}
                </button>
              </div>
          ) : (
              /* VUE PUBLIQUE (Identique à ton design mais avec gallery_links sécurisé) */
              <div className="animate-in fade-in slide-in-from-bottom-12 duration-1000">
                <div className="max-w-5xl mb-24">
                  <div className="inline-flex items-center gap-2 px-4 py-1 bg-red-600 text-[10px] font-black uppercase tracking-[0.3em] mb-6">
                    <Flame size={12} fill="currentColor" /> {config.competition_type}
                  </div>
                  <h1 className="text-6xl md:text-[8rem] font-black italic uppercase leading-[0.85] tracking-tighter mb-8">
                    Dampicourt <br />
                    <span className="text-red-600">{config.title}</span>
                  </h1>
                  <p className="text-xl md:text-2xl font-bold italic text-gray-300 max-w-3xl uppercase border-l-4 border-red-600 pl-6">
                    {config.subtitle}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-24">
                  <div className="bg-white/5 backdrop-blur-xl p-8 rounded-3xl border border-white/10 group hover:bg-white/10 transition-all">
                    <Calendar className="text-red-600 mb-6" size={32} />
                    <h3 className="font-black uppercase text-[10px] text-white/40 mb-1">Date</h3>
                    <p className="text-xl font-black italic uppercase">{config.event_date}</p>
                  </div>
                  <div className="bg-white/5 backdrop-blur-xl p-8 rounded-3xl border border-white/10 group hover:bg-white/10 transition-all">
                    <MapPin className="text-red-600 mb-6" size={32} />
                    <h3 className="font-black uppercase text-[10px] text-white/40 mb-1">Lieu</h3>
                    <p className="text-xl font-black italic uppercase">{config.location}</p>
                  </div>
                  <div className="bg-white/5 backdrop-blur-xl p-8 rounded-3xl border border-white/10 group hover:bg-white/10 transition-all">
                    <Euro className="text-red-600 mb-6" size={32} />
                    <h3 className="font-black uppercase text-[10px] text-white/40 mb-1">Tarif</h3>
                    <p className="text-xl font-black italic uppercase">6€ / épreuve</p>
                  </div>
                  <a href={config.registration_url} target="_blank" className="bg-red-600 p-8 rounded-3xl flex flex-col items-center justify-center text-center group hover:scale-[1.05] transition-all">
                    <Zap size={40} fill="white" className="mb-4 group-hover:animate-pulse" />
                    <span className="text-2xl font-black italic uppercase">S'inscrire</span>
                  </a>
                </div>

                {/* Galerie Médias */}
                <div className="pt-12 border-t border-white/10">
                  <h2 className="text-4xl font-black italic uppercase mb-10 flex items-center gap-4">
                    <Camera className="text-red-600" size={32} /> Galerie & Médias
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {config.gallery_links.length > 0 ? (
                        config.gallery_links.map((album: any, i: number) => (
                            <a key={i} href={album.url} target="_blank" className="group relative overflow-hidden rounded-3xl aspect-video flex items-center justify-center border border-white/10 bg-white/5 hover:bg-red-600/10 transition-all">
                              <div className="text-center">
                                <p className="text-red-500 text-[10px] font-black uppercase mb-1 italic">Album Facebook</p>
                                <p className="text-2xl font-black italic uppercase">{album.title}</p>
                                <ExternalLink size={14} className="mx-auto mt-4 opacity-40 group-hover:opacity-100" />
                              </div>
                            </a>
                        ))
                    ) : (
                        <div className="col-span-full py-12 text-center border border-dashed border-white/10 rounded-3xl opacity-30 italic uppercase font-black">
                          Aucun album pour le moment
                        </div>
                    )}
                  </div>
                </div>
              </div>
          )}
        </main>
      </div>
  );
}