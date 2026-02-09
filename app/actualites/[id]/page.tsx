"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/app/context/authContext";
import { Loader2, Edit2, FileText, Download, Paperclip } from "lucide-react";
import Link from "next/link";

export default function ArticlePage() {
  const { id } = useParams();
  const router = useRouter();
  const { profile } = useAuth();

  const [article, setArticle] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const canEdit = profile?.role === 'admin' || profile?.role === 'redacteur';

  useEffect(() => {
    async function fetchArticle() {
      try {
        const { data, error } = await supabase
        .from('news')
        .select('*')
        .eq('id', id)
        .single();

        if (error || !data) {
          router.push('/404');
          return;
        }
        setArticle(data);
      } catch (err) {
        console.error("Erreur fetch:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchArticle();
  }, [id, router]);

  if (loading) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-white">
          <Loader2 className="animate-spin text-red-600" size={40} />
        </div>
    );
  }

  return (
      <div className="min-h-screen">
        <main className="container mx-auto px-4 py-12 max-w-4xl">

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            {/* Badge Date */}
            <span className="bg-red-600 text-white px-3 py-1 rounded-sm text-xs font-bold uppercase italic inline-block tracking-widest self-start">
              {article.date_text}
            </span>

            {/* Bouton Modifier (Visible uniquement pour admin/rédacteur) */}
            {/* Bouton Modifier (Visible uniquement pour admin/rédacteur) */}
            {canEdit && article?.id && (
                <Link href={`/actualites/modifier/${article.id}`}>
                  <button className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-xl text-xs font-black uppercase italic hover:bg-red-600 transition-all shadow-lg">
                    <Edit2 size={14} /> Modifier l'article
                  </button>
                </Link>
            )}
          </div>

          {/* Titre avec style ACD */}
          <h1 className="text-5xl md:text-7xl font-black uppercase italic mb-8 leading-[0.85] tracking-tighter text-slate-900">
            {article.title}
          </h1>

          {/* Image de couverture */}
          <div className="relative h-[300px] md:h-[550px] w-full mb-12 rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white">
            <img
                src={article.image_url}
                alt={article.title}
                className="object-cover w-full h-full"
            />
          </div>

          {/* Zone de contenu */}
          <div className="max-w-3xl mx-auto">
            <div className="text-lg md:text-xl text-slate-700 leading-relaxed font-medium whitespace-pre-wrap mb-12">
              {article.content || (
                  <p className="italic text-slate-400">Cet article ne contient pas encore de texte.</p>
              )}
            </div>

            {/* --- SECTION FICHIER JOINT / HORAIRE --- */}
            {article.schedule_url && (
                <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2rem] p-8 mb-16 flex flex-col md:flex-row items-center justify-between gap-6 group hover:border-red-600/30 transition-colors">
                  <div className="flex items-center gap-5">
                    <div className="bg-white p-4 rounded-2xl shadow-sm text-red-600 group-hover:scale-110 transition-transform">
                      <FileText size={32} />
                    </div>
                    <div>
                      <h3 className="font-black uppercase italic text-slate-900 tracking-tight">Document disponible</h3>
                      <p className="text-sm text-slate-500 font-bold uppercase italic">Horaire, résultats ou infos</p>
                    </div>
                  </div>

                  <a
                      href={article.schedule_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full md:w-auto"
                  >
                    <button className="w-full flex items-center justify-center gap-3 bg-slate-900 text-white px-8 py-4 rounded-2xl font-black uppercase italic hover:bg-red-600 transition-all shadow-xl hover:-translate-y-1 active:scale-95">
                      <Download size={20} /> Télécharger / Voir
                    </button>
                  </a>
                </div>
            )}

            {/* Signature Footer ACD */}
            <div className="mt-16 pt-8 border-t border-slate-100 flex items-center justify-between">
              <p className="font-black italic uppercase text-slate-900 text-sm">
                AC <span className="text-red-600">Dampicourt</span>
              </p>
              <div className="h-1.5 w-24 bg-red-600 shadow-[0_0_15px_rgba(220,38,38,0.4)]"></div>
            </div>
          </div>
        </main>
      </div>
  );
}