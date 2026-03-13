"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/app/context/authContext";
import { Loader2, Edit2, FileText, Download, ArrowLeft, Calendar } from "lucide-react";
import Link from "next/link";

export default function ArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { profile } = useAuth();

  const [article, setArticle] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const canEdit = profile?.role?.toLowerCase().trim() === 'admin' || profile?.role?.toLowerCase().trim() === 'redacteur';

  useEffect(() => {
    async function fetchArticle() {
      try {
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
          <p className="text-[10px] font-black uppercase italic text-slate-400 tracking-widest text-center px-4">Préparation de votre lecture...</p>
        </div>
    );
  }

  return (
      <div className="min-h-screen selection:bg-red-100">
        <style dangerouslySetInnerHTML={{ __html: `
          /* Verrouillage horizontal total */
          html, body { overflow-x: hidden; width: 100%; }
          
          .prose-custom {
            word-break: normal;
            overflow-wrap: break-word;
          }
          
          /* Règle stricte pour les tirets et les mots */
          .prose-custom p, .prose-custom h2, .prose-custom li {
            hyphens: none !important;
            -webkit-hyphens: none !important;
            overflow-wrap: anywhere;
          }

          .prose-custom h2 { 
            font-size: clamp(1.5rem, 5vw, 2.25rem);
            font-weight: 900; 
            text-transform: uppercase; 
            font-style: italic; 
            color: #dc2626;
            margin-top: 3.5rem; 
            margin-bottom: 1.5rem;
            line-height: 1; 
            letter-spacing: -0.05em;
          }

          .prose-custom p { 
            margin-bottom: 1.75rem; 
            line-height: 1.8; 
            color: #334155; 
            font-size: clamp(1.125rem, 2vw, 1.25rem);
          }

          .prose-custom b, .prose-custom strong { font-weight: 800; color: #000; }
          .prose-custom ul { list-style-type: disc; padding-left: 1.5rem; margin-bottom: 2rem; }
          .prose-custom li { margin-bottom: 0.75rem; color: #334155; }
          .prose-custom a { color: #dc2626; text-decoration: underline; font-weight: bold; }
          
          .img-hd {
            image-rendering: -webkit-optimize-contrast;
            transform: translateZ(0);
          }
        `}} />

        <main className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-28 animate-in fade-in duration-1000">

          {/* BARRE DE NAVIGATION ET INFOS */}
          <div className="max-w-4xl mx-auto flex flex-wrap items-center justify-between gap-6 mb-12">
            <button
                onClick={() => router.back()}
                className="group flex items-center gap-2 text-slate-400 hover:text-red-600 transition-all text-[10px] font-black uppercase italic tracking-widest"
            >
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              Retour
            </button>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-slate-50 border border-slate-100 px-4 py-2 rounded-xl">
                <Calendar size={14} className="text-red-600" />
                <span className="text-slate-900 text-[10px] font-black uppercase italic tracking-wider">
                  {new Date(article.date_text).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                </span>
              </div>

              {canEdit && (
                  <Link href={`/actualites/modifier/${article.id}`}>
                    <button className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-xl text-[10px] font-black uppercase italic hover:bg-red-600 transition-all shadow-lg">
                      <Edit2 size={12}/> Modifier
                    </button>
                  </Link>
              )}
            </div>
          </div>

          {/* TITRE PRINCIPAL */}
          <div className="max-w-4xl mx-auto mb-16">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black uppercase italic leading-[0.85] tracking-tighter text-slate-900">
              {article.title}
            </h1>
          </div>

          {/* IMAGE DE COUVERTURE IMPACTANTE */}
          <div className="relative aspect-[16/10] md:aspect-[16/8] w-full mb-20 rounded-[2.5rem] md:rounded-[4rem] overflow-hidden shadow-2xl bg-slate-50 border border-slate-100">
            <img
                src={article.image_url}
                alt={article.title}
                className="object-cover w-full h-full img-hd hover:scale-105 transition-transform duration-1000"
            />
          </div>

          {/* CORPS DE L'ARTICLE */}
          <div className="max-w-3xl mx-auto">
            <div className="prose-custom mb-24">
              {article.content ? (
                  <div dangerouslySetInnerHTML={{ __html: article.content }} />
              ) : (
                  <p className="italic text-slate-400 font-medium text-center py-10">L'actualité est en cours de rédaction...</p>
              )}
            </div>

            {/* BLOC DOCUMENT (DESIGN ÉPURÉ) */}
            {article.schedule_url && (
                <div className="bg-slate-900 text-white rounded-[2.5rem] p-8 md:p-12 mb-24 flex flex-col md:flex-row items-center justify-between gap-8 transition-all hover:ring-8 hover:ring-red-600/5">
                  <div className="flex items-center gap-6">
                    <div className="bg-red-600 p-5 rounded-2xl shadow-lg">
                      <FileText size={32} className="text-white"/>
                    </div>
                    <div>
                      <h3 className="font-black uppercase italic text-2xl leading-none">Pièce jointe</h3>
                      <p className="text-[10px] text-red-500 font-bold uppercase italic tracking-widest mt-2">Cliquez pour consulter le fichier</p>
                    </div>
                  </div>

                  <a href={article.schedule_url} target="_blank" rel="noopener noreferrer" className="w-full md:w-auto">
                    <button className="w-full flex items-center justify-center gap-3 bg-white text-slate-900 px-10 py-5 rounded-2xl font-black uppercase italic hover:bg-red-600 hover:text-white transition-all">
                      <Download size={20}/> Consulter
                    </button>
                  </a>
                </div>
            )}

            {/* PIED DE PAGE ARTICLE */}
            <div className="mt-32 pt-12 border-t-2 border-slate-50 flex flex-col sm:flex-row items-center justify-between gap-8 pb-20">
              <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
                <p className="font-black italic uppercase text-slate-900 text-3xl tracking-tighter leading-none">
                  AC <span className="text-red-600">Dampicourt</span>
                </p>
                <span className="text-[9px] font-bold uppercase tracking-[0.4em] text-slate-400 mt-3">L'excellence provinciale</span>
              </div>

              <div className="flex gap-2">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="h-2 w-10 bg-red-600 rounded-full opacity-30 last:opacity-100 last:w-20" />
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
  );
}