"use client";

import { PageHero } from "@/components/layout/PageHero";
import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/app/context/authContext";
import { Loader2, Edit2, FileText, Download, ArrowLeft, Calendar, Facebook } from "lucide-react";
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
            /* ON DESACTIVE TOUTES LES COUPURES AUTOMATIQUES */
            hyphens: none !important;
            -webkit-hyphens: none !important;
            -moz-hyphens: none !important;
            
            /* On force le mot à rester entier */
            word-break: normal !important; 
            
            /* On autorise le passage à la ligne seulement si le mot entier ne tient pas */
            overflow-wrap: break-word; 
            
            text-align: left;
            color: #334155;
          }

          .prose-custom h2 { 
            font-size: clamp(1.5rem, 5vw, 2.25rem);
            font-weight: 900; 
            text-transform: uppercase; 
            font-style: italic; 
            color: #dc2626;
            margin-top: 3.5rem; 
            margin-bottom: 1.5rem;
            line-height: 1.1; 
            letter-spacing: -0.05em;
            /* Pas de coupure sur les titres non plus */
            word-break: normal;
          }

          .prose-custom p { 
            margin-bottom: 1.75rem; 
            line-height: 1.7; 
            font-size: clamp(1.05rem, 2vw, 1.15rem);
          }

          .prose-custom b, .prose-custom strong { font-weight: 800; color: #000; }
          .prose-custom ul { list-style-type: disc; padding-left: 1.5rem; margin-bottom: 2rem; }
          .prose-custom li { margin-bottom: 0.75rem; }
          .prose-custom a { color: #dc2626; text-decoration: underline; font-weight: bold; }
          
          .img-hd {
            image-rendering: -webkit-optimize-contrast;
            transform: translateZ(0);
          }
        `}} />

        <PageHero
            image={article.image_url}
            back={{ onBack: () => router.back(), label: "Retour" }}
            eyebrow="Actualité"
            title={article.title}
            titleSize="md"
            meta={
                <span className="ph__chip ph__chip--red">
                  <Calendar size={14} />
                  {new Date(article.date_text).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                </span>
            }
            actions={canEdit ? (
                <Link href={`/actualites/modifier/${article.id}`}>
                  <button className="flex items-center gap-2 bg-slate-900 text-white px-6 py-3.5 rounded-2xl text-xs font-black uppercase italic hover:bg-red-600 transition-all shadow-lg">
                    <Edit2 size={14}/> Modifier
                  </button>
                </Link>
            ) : undefined}
        />
        <main className="pt-12 md:pt-16 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 animate-in fade-in duration-1000">

          {/* CORPS DE L'ARTICLE */}
          <div className="max-w-3xl mx-auto">
            <div className="prose-custom mb-24">
              {article.content ? (
                  <div dangerouslySetInnerHTML={{ __html: article.content }} />
              ) : (
                  <p className="italic text-slate-400 font-medium text-center py-10">L'actualité est en cours de rédaction...</p>
              )}
            </div>

            {/* BLOC DOCUMENT */}
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

            {/* BLOC LIEN FACEBOOK */}
            {article.facebook_url && (
                <div className="bg-[#1877F2] text-white rounded-[2.5rem] p-8 md:p-12 mb-12 flex flex-col md:flex-row items-center justify-between gap-8 transition-all hover:ring-8 hover:ring-[#1877F2]/10">
                  <div className="flex items-center gap-6">
                    <div className="bg-white p-5 rounded-2xl shadow-lg">
                      <Facebook size={32} className="text-[#1877F2]"/>
                    </div>
                    <div>
                      <h3 className="font-black uppercase italic text-2xl leading-none">Lien Facebook</h3>
                      <p className="text-[10px] text-blue-100 font-bold uppercase italic tracking-widest mt-2">Plus d'infos sur les réseaux</p>
                    </div>
                  </div>

                  <a href={article.facebook_url} target="_blank" rel="noopener noreferrer" className="w-full md:w-auto">
                    <button className="w-full flex items-center justify-center gap-3 bg-white text-[#1877F2] px-10 py-5 rounded-2xl font-black uppercase italic hover:bg-slate-900 hover:text-white transition-all">
                      Rejoindre la page
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