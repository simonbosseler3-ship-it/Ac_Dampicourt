"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/app/context/authContext";
import { AdminActions } from "@/components/admin/adminAction";
import Link from "next/link";
import { User, EyeOff, Calendar, Heart, Loader2 } from "lucide-react";

interface NewsItem {
  id: string;
  title: string;
  content: string;
  image_url: string;
  date_text: string;
  is_hidden: boolean;
  author?: {
    full_name: string;
  };
}

export default function ActualitesPage() {
  const { profile } = useAuth();
  const [news, setNews] = useState<NewsItem[]>([]);
  const [redacteurs, setRedacteurs] = useState<any[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [imagePositions, setImagePositions] = useState<Record<string, string>>({});

  const role = profile?.role?.toLowerCase().trim();
  const isAdmin = role === 'admin';
  const canManage = isAdmin || role === 'redacteur';

  const handleImageLoad = (id: string, event: React.SyntheticEvent<HTMLImageElement>) => {
    const { naturalWidth, naturalHeight } = event.currentTarget;
    const position = naturalHeight > naturalWidth ? "center 35%" : "center center";
    setImagePositions(prev => ({ ...prev, [id]: position }));
  };

  /**
   * 1. FONCTION DE CHARGEMENT DES DONNÉES
   * Mémorisée pour être appelée lors du montage et des mises à jour temps réel
   */
  const fetchNewsData = useCallback(async () => {
    try {
      // Chargement des rédacteurs (pour le footer)
      const { data: redacData } = await supabase
      .from('profiles')
      .select('full_name')
      .eq('role', 'redacteur')
      .order('full_name');

      if (redacData) setRedacteurs(redacData);

      // Chargement des news
      let newsQuery = supabase
      .from('news')
      .select('*, author:profiles(full_name)')
      .order('date_text', { ascending: false });

      // Filtrage côté client/serveur pour les utilisateurs lambdas
      if (!isAdmin) {
        newsQuery = newsQuery.eq('is_hidden', false);
      }

      const { data: newsData, error } = await newsQuery;
      if (error) throw error;

      setNews(newsData || []);
    } catch (err) {
      console.error("Erreur lors de la récupération des news:", err);
    } finally {
      setDataLoading(false);
    }
  }, [isAdmin]);

  /**
   * 2. MISE EN PLACE DU TEMPS RÉEL (REALTIME)
   * Écoute toutes les modifications (INSERT, UPDATE, DELETE) sur la table 'news'
   */
  useEffect(() => {
    // Premier chargement
    fetchNewsData();

    // Abonnement aux changements de la table 'news'
    const channel = supabase
    .channel('news_realtime_changes')
    .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'news' },
        () => {
          // À chaque changement (Ajout, Modif, Cache, Suppr), on rafraîchit la liste
          fetchNewsData();
        }
    )
    .subscribe();

    // Nettoyage de l'abonnement quand on quitte la page
    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchNewsData]);

  if (dataLoading) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-slate-50">
          <Loader2 className="animate-spin text-red-600" size={40} />
          <p className="text-[10px] font-black uppercase italic text-slate-400 tracking-widest">Chargement des actus...</p>
        </div>
    );
  }

  return (
      <div className="min-h-screen">
        <main className="container mx-auto px-4 py-12 pt-24 animate-in fade-in duration-700">

          {/* BOUTON NOUVELLE ACTU */}
          {canManage && (
              <div className="mb-8 animate-in slide-in-from-left duration-500">
                <Link href="/actualites/nouveau">
                  <button className="bg-slate-900 text-white px-8 py-3 rounded-2xl font-black uppercase italic text-[10px] tracking-widest hover:bg-red-600 transition-all flex items-center gap-3 shadow-xl hover:-translate-y-1 active:scale-95">
                    <span className="bg-white/20 p-1 rounded-md">+</span> Nouvelle actu
                  </button>
                </Link>
              </div>
          )}

          {/* TITRE DE SECTION */}
          <div className="flex flex-col mb-16">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-[2px] w-8 bg-red-600"></div>
              <span className="text-red-600 font-black uppercase italic text-[10px] tracking-[0.3em]">Le Flux</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-slate-900 uppercase italic tracking-tighter leading-none">
              Toute l'actualité <span className="text-red-600 text-stroke-sm">ACD</span>
            </h1>
          </div>

          {/* GRILLE DES ACTUALITÉS */}
          {news.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mb-20">
                {news.map((item) => (
                    <article
                        key={item.id}
                        className={`relative group transition-all duration-500 animate-in fade-in slide-in-from-bottom-4 ${item.is_hidden ? 'opacity-70 grayscale-[0.5]' : ''}`}
                    >
                      {/* Badge Masqué */}
                      {item.is_hidden && (
                          <div className="absolute top-6 left-6 z-40 flex items-center gap-2 bg-slate-900 text-white text-[9px] font-black px-4 py-2 rounded-full uppercase italic tracking-widest shadow-2xl border border-white/10">
                            <EyeOff size={12} className="text-orange-400" /> Hors-ligne
                          </div>
                      )}

                      {/* Actions Admin (Boutons Modifier / Supprimer / Cacher) */}
                      {canManage && (
                          <div className="absolute top-6 right-6 z-50 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                            <AdminActions id={item.id} isHidden={item.is_hidden} />
                          </div>
                      )}

                      <Link href={`/actualites/${item.id}`} className="block h-full">
                        <div className="h-full bg-white rounded-[2.5rem] overflow-hidden border-2 border-slate-50 group-hover:border-red-500 group-hover:shadow-[0_20px_50px_rgba(220,38,38,0.15)] transition-all duration-500 flex flex-col">

                          {/* Image */}
                          <div className="relative h-64 overflow-hidden bg-slate-100">
                            <img
                                src={item.image_url}
                                alt={item.title}
                                onLoad={(e) => handleImageLoad(item.id, e)}
                                className="w-full h-full object-cover scale-105 group-hover:scale-110 transition-transform duration-1000"
                                style={{
                                  objectPosition: imagePositions[item.id] || "center 40%"
                                }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                          </div>

                          {/* Contenu */}
                          <div className="p-8 flex flex-col flex-grow">
                            <div className="flex items-center gap-2 mb-4">
                              <span className="text-[9px] font-black text-red-600 uppercase tracking-widest bg-red-50 px-3 py-1 rounded-full">News</span>
                            </div>

                            <h2 className="text-2xl font-black text-slate-900 mb-4 group-hover:text-red-600 transition-colors uppercase italic tracking-tighter leading-tight line-clamp-2">
                              {item.title}
                            </h2>

                            <p className="text-slate-500 text-sm leading-relaxed mb-8 line-clamp-3 font-medium">
                              {item.content}
                            </p>

                            {/* Meta */}
                            <div className="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-red-600 group-hover:text-white transition-all">
                                  <User size={14} />
                                </div>
                                <span className="text-[10px] font-black uppercase italic tracking-tighter text-slate-900">
                            {item.author?.full_name || "ACD Staff"}
                          </span>
                              </div>

                              <div className="flex items-center gap-2 text-slate-400">
                                <Calendar size={14} className="text-red-600" />
                                <span className="text-[10px] font-black uppercase italic tracking-tighter">
                            {new Date(item.date_text).toLocaleDateString('fr-FR', {
                              day: '2-digit',
                              month: 'short'
                            }).toUpperCase()}
                          </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </article>
                ))}
              </div>
          ) : (
              <div className="py-40 text-center bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
                <p className="text-slate-400 font-black uppercase italic tracking-widest">Aucune actualité pour le moment</p>
              </div>
          )}

          {/* ÉQUIPE DE RÉDACTION */}
          {redacteurs.length > 0 && (
              <footer className="mt-32 pt-12 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-8 px-4">
                <div className="flex items-center gap-4">
                  <div className="bg-red-600 p-2 rounded-xl shadow-lg shadow-red-200">
                    <Heart size={16} className="text-white" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] italic text-slate-400">Équipe de rédaction</span>
                </div>
                <div className="flex flex-wrap justify-center md:justify-end gap-x-8 gap-y-3">
                  {redacteurs.map((redac, idx) => (
                      <span key={idx} className="text-[11px] font-black text-slate-900 uppercase italic tracking-tighter hover:text-red-600 transition-colors cursor-default relative group">
                  {redac.full_name}
                        <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-red-600 transition-all group-hover:w-full"></span>
                </span>
                  ))}
                </div>
              </footer>
          )}
        </main>
      </div>
  );
}