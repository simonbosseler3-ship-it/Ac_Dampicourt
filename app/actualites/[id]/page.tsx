import { Navbar } from "@/components/navbar/navbar";
import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";

// On définit le type de params comme une Promise
export default async function ArticlePage({ params }: { params: Promise<{ id: string }> }) {

  // ÉTAPE CRUCIALE : On attend que les params soient prêts
  const resolvedParams = await params;
  const id = resolvedParams.id;

  const { data: article } = await supabase
  .from('news')
  .select('*')
  .eq('id', id) // On utilise l'id déballé ici
  .single();

  if (!article) notFound();

  return (
      <div className="min-h-screen bg-white text-slate-900">
        <Navbar />
        <main className="container mx-auto px-4 py-12 max-w-4xl">
        <span className="bg-red-600 text-white px-3 py-1 rounded-sm text-xs font-bold uppercase italic mb-6 inline-block">
          {article.date_text}
        </span>

          <h1 className="text-5xl font-black uppercase italic mb-8 leading-tight">
            {article.title}
          </h1>

          <div className="relative h-[450px] w-full mb-10 rounded-3xl overflow-hidden shadow-2xl border border-slate-100">
            <img
                src={article.image_url}
                alt={article.title}
                className="object-cover w-full h-full hover:scale-105 transition-transform duration-700"
            />
          </div>

          <div className="prose prose-xl max-w-none">
            <p className="text-2xl font-bold text-slate-800 mb-6 border-l-4 border-red-600 pl-6 italic">
              {article.description || "Pas de description disponible."}
            </p>
            <div className="text-lg text-slate-600 leading-relaxed space-y-4">
              {/* Ici tu pourras plus tard afficher article.content si tu ajoutes la colonne */}
              <p>Le contenu complet de l'article sera bientôt disponible ici.</p>
            </div>
          </div>
        </main>
      </div>
  );
}