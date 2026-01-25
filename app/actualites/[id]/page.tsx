import { Navbar } from "@/components/navbar/navbar";
import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";

export default async function ArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const id = resolvedParams.id;

  const { data: article } = await supabase
  .from('news')
  .select('*')
  .eq('id', id)
  .single();

  if (!article) notFound();

  return (
      <div className="min-h-screen">
        <main className="container mx-auto px-4 py-12 max-w-4xl">
          {/* Badge Date */}
          <span className="bg-red-600 text-white px-3 py-1 rounded-sm text-xs font-bold uppercase italic mb-6 inline-block tracking-widest">
          {article.date_text}
        </span>

          {/* Titre avec style ACD */}
          <h1 className="text-5xl md:text-6xl font-black uppercase italic mb-8 leading-[0.9] tracking-tighter text-slate-900">
            {article.title}
          </h1>

          {/* Image de couverture optimisée */}
          <div className="relative h-[300px] md:h-[500px] w-full mb-12 rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white">
            <img
                src={article.image_url}
                alt={article.title}
                className="object-cover w-full h-full"
            />
          </div>

          {/* Zone de contenu */}
          <div className="max-w-3xl mx-auto">
            {/* Texte de l'article */}
            <div
                className="text-lg md:text-xl text-slate-700 leading-relaxed font-medium whitespace-pre-wrap">
              {article.content || (
                  <p className="italic text-slate-400">Cet article ne contient pas encore de
                    texte.</p>
              )}
            </div>

            <div className="mt-16 pt-8 border-t border-white/20 flex items-center justify-between">
              <p className="font-black italic uppercase text-white text-sm">
                AC Dampicourt
              </p>
              <div className="h-1 w-20 bg-red-600 shadow-[0_0_15px_rgba(220,38,38,0.5)]"></div>
            </div>
          </div>
        </main>
      </div>
  );
}