"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/app/context/authContext";
import { Loader2, Edit2 } from "lucide-react";

export default function ArticlePage() {
  const { id } = useParams();
  const router = useRouter();
  const { profile } = useAuth(); // Récupération du rôle en temps réel

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
          // Au lieu du notFound server-side, on redirige proprement
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
          {/* Badge Date (Donnée originale conservée) */}
          <span
              className="bg-red-600 text-white px-3 py-1 rounded-sm text-xs font-bold uppercase italic mb-6 inline-block tracking-widest">
          {article.date_text}
        </span>

          {/* Titre avec style ACD */}
          <h1 className="text-5xl md:text-6xl font-black uppercase italic mb-8 leading-[0.9] tracking-tighter text-slate-900">
            {article.title}
          </h1>

          {/* Image de couverture (Donnée originale conservée) */}
          <div
              className="relative h-[300px] md:h-[500px] w-full mb-12 rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white">
            <img
                src={article.image_url}
                alt={article.title}
                className="object-cover w-full h-full"
            />
          </div>

          {/* Zone de contenu */}
          <div className="max-w-3xl mx-auto">
            {/* Texte de l'article (Donnée originale conservée) */}
            <div
                className="text-lg md:text-xl text-slate-700 leading-relaxed font-medium whitespace-pre-wrap">
              {article.content || (
                  <p className="italic text-slate-400">Cet article ne contient pas encore de
                    texte.</p>
              )}
            </div>

            {/* Signature Footer ACD */}
            <div className="mt-16 pt-8 border-t border-slate-100 flex items-center justify-between">
              <p className="font-black italic uppercase text-slate-900 text-sm">
                AC <span className="text-red-600">Dampicourt</span>
              </p>
              <div className="h-1 w-20 bg-red-600 shadow-[0_0_15px_rgba(220,38,38,0.3)]"></div>
            </div>
          </div>
        </main>
      </div>
  );
}