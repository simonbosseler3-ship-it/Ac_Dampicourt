"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/app/context/authContext";
import { Loader2, Edit2, FileText, Download } from "lucide-react";
import Link from "next/link";

export default function ArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { profile } = useAuth();

  const [article, setArticle] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Détection du rôle admin/rédacteur pour l'édition
  const canEdit = profile?.role?.toLowerCase().trim() === 'admin' || profile?.role?.toLowerCase().trim() === 'redacteur';

  useEffect(() => {
    async function fetchArticle() {
      try {
        // Chargement direct de l'article (public)
        const { data, error } = await supabase
        .from('news')
        .select('*')
        .eq('id', id)
        .single();

        if (error || !data) {
          router.replace('/404');
          return;
        }
        setArticle(data);
      } catch (err) {
        console.error("Erreur fetch article:", err);
        router.replace('/actualites');
      } finally {
        setLoading(false);
      }
    }
    fetchArticle();
  }, [id, router]);

  if (loading) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-white gap-4">
          <Loader2 className="animate-spin text-red-600" size={40} />
          <p className="text-[10px] font-black uppercase italic text-slate-400 tracking-widest">Chargement de l'article</p>
        </div>
    );
  }

  return (
      <div className="min-h-screen">
        <main
            className="container mx-auto px-4 py-12 pt-24 max-w-4xl animate-in fade-in duration-700">

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            {/* Badge Date */}
            <span
                className="bg-red-600 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase italic inline-block tracking-[0.2em] self-start shadow-lg shadow-red-100">
            {article.date_text}
          </span>

            {/* Bouton Modifier dynamique */}
            {canEdit && (
                <Link href={`/actualites/modifier/${article.id}`}
                      className="animate-in slide-in-from-right-4 duration-500">
                  <button
                      className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase italic hover:bg-red-600 transition-all shadow-xl active:scale-95">
                    <Edit2 size={14}/> Modifier l'article
                  </button>
                </Link>
            )}
          </div>

          {/* Titre Impactant */}
          <h1 className="text-5xl md:text-8xl font-black uppercase italic mb-10 leading-[0.85] tracking-tighter text-slate-900">
            {article.title}
          </h1>

          {/* Image de couverture avec overlay subtil */}
          <div
              className="relative h-[350px] md:h-[600px] w-full mb-16 rounded-[3rem] overflow-hidden shadow-2xl group">
            <img
                src={article.image_url}
                alt={article.title}
                className="object-cover w-full h-full transition-transform duration-1000 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
          </div>

          {/* Zone de contenu */}
          <div className="max-w-3xl mx-auto">
            <div
                className="text-lg md:text-xl text-slate-700 leading-relaxed font-medium whitespace-pre-wrap mb-16 px-2">
              {article.content || (
                  <p className="italic text-slate-400">Cet article ne contient pas encore de
                    texte.</p>
              )}
            </div>

            {/* --- SECTION FICHIER JOINT --- */}
            {article.schedule_url && (
                <div
                    className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2.5rem] p-8 mb-20 flex flex-col md:flex-row items-center justify-between gap-8 group hover:border-red-600/30 transition-all hover:bg-white hover:shadow-2xl">
                  <div className="flex items-center gap-6">
                    <div
                        className="bg-white p-5 rounded-3xl shadow-sm text-red-600 group-hover:bg-red-600 group-hover:text-white transition-all duration-500">
                      <FileText size={36}/>
                    </div>
                    <div>
                      <h3 className="font-black uppercase italic text-xl text-slate-900 tracking-tight">Document
                        joint</h3>
                      <p className="text-[10px] text-slate-500 font-bold uppercase italic tracking-widest mt-1">Horaire,
                        résultats ou informations</p>
                    </div>
                  </div>

                  <a
                      href={article.schedule_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full md:w-auto"
                  >
                    <button
                        className="w-full flex items-center justify-center gap-3 bg-slate-900 text-white px-10 py-5 rounded-[1.5rem] font-black uppercase italic hover:bg-red-600 transition-all shadow-xl hover:-translate-y-1 active:scale-95">
                      <Download size={22}/> Télécharger
                    </button>
                  </a>
                </div>
            )}

            {/* Signature ACD */}
            <div
                className="mt-24 pt-10 border-t border-slate-100 flex items-center justify-between px-2">
              <div className="flex flex-col">
                <p className="font-black italic uppercase text-slate-900 text-lg tracking-tighter">
                  AC <span className="text-red-600">Dampicourt</span>
                </p>
                <span className="text-[8px] font-bold uppercase tracking-[0.3em] text-slate-400">Le plus grand club de province</span>
              </div>
              <div className="h-2 w-32 bg-red-600 shadow-[0_10px_20px_rgba(220,38,38,0.2)]"></div>
            </div>
          </div>
        </main>
      </div>
  );
}