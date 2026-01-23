import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { Navbar } from "@/components/navbar/navbar";
import {
  MessageSquare,
  Search,
  Plus,
  ChevronRight,
  MessageCircle,
  User
} from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

// Note : searchParams est désormais une Promise dans les versions récentes de Next.js 15
export default async function ForumPage({
                                          searchParams,
                                        }: {
  searchParams: Promise<{ category?: string; search?: string }>
}) {
  const params = await searchParams; // On attend les paramètres
  const cookieStore = await cookies();
  const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { cookies: { getAll() { return cookieStore.getAll() } } }
  );

  // 1. Récupération des catégories (Unique)
  const { data: catData } = await supabase.from('forum_topics').select('category');
  const categories = ["Tous", ...new Set(catData?.map(c => c.category) || [])];

  // 2. Construction de la requête
  let query = supabase
  .from('forum_topics')
  .select(`
      *,
      forum_messages ( id )
    `)
  .order('created_at', { ascending: false });

  // Application des filtres de catégorie
  if (params.category && params.category !== "Tous") {
    query = query.eq('category', params.category);
  }

  // Application de la recherche sur le TITRE
  if (params.search) {
    query = query.ilike('title', `%${params.search}%`);
  }

  const { data: topics, error } = await query;

  return (
      <div className="min-h-screen">
        <Navbar/>

        <main className="container mx-auto px-4 pt-32 pb-20">

          {error && (
              <div className="bg-red-50 border-2 border-red-200 p-4 rounded-2xl mb-8 text-red-600 font-bold text-sm">
                Erreur : {error.message}
              </div>
          )}

          {/* HEADER */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-red-600 p-2 rounded-lg shadow-lg shadow-red-200">
                  <MessageSquare className="text-white" size={20}/>
                </div>
                <span className="text-red-600 font-black uppercase italic tracking-widest text-[10px]">Communauté ACD</span>
              </div>
              <h1 className="text-5xl font-black text-slate-900 uppercase italic tracking-tighter">
                Le <span className="text-red-600">Forum</span>
              </h1>
              <p className="text-slate-500 font-medium mt-2">Recherchez une réponse ou posez votre question.</p>
            </div>

            <Link href="/forum/poser-question">
              <button className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black uppercase italic tracking-widest flex items-center gap-3 hover:bg-red-600 transition-all shadow-xl active:scale-95">
                <Plus size={20}/> Poser une question
              </button>
            </Link>
          </div>

          {/* RECHERCHE ET FILTRES */}
          <div className="flex flex-col gap-6 mb-10">
            {/* CORRECTION : Formulaire avec méthode GET pour mettre à jour l'URL */}
            <form action="/forum" method="GET" className="relative group">
              {/* On garde la catégorie active lors de la recherche */}
              {params.category && <input type="hidden" name="category" value={params.category} />}

              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-red-600 transition-colors" size={20}/>
              <input
                  name="search"
                  type="text"
                  defaultValue={params.search}
                  placeholder="Rechercher dans les titres..."
                  className="w-full bg-white border-2 border-slate-100 rounded-2xl py-4 pl-14 pr-6 font-bold focus:border-red-600 outline-none transition-all shadow-sm"
              />
            </form>

            <div className="flex items-center gap-3 overflow-x-auto pb-2 no-scrollbar">
              {categories.map((cat) => (
                  <Link
                      key={cat}
                      // On garde le terme de recherche lors du changement de catégorie
                      href={`/forum?category=${cat}${params.search ? `&search=${params.search}` : ''}`}
                      className={`px-6 py-2 rounded-full font-black uppercase italic text-[10px] tracking-widest whitespace-nowrap transition-all ${
                          (params.category || "Tous") === cat
                              ? "bg-red-600 text-white shadow-md shadow-red-100"
                              : "bg-white text-slate-500 border border-slate-200 hover:border-red-600"
                      }`}
                  >
                    {cat}
                  </Link>
              ))}
            </div>
          </div>

          {/* LISTE DES DISCUSSIONS */}
          <div className="space-y-4">
            {topics && topics.length > 0 ? (
                topics.map((topic) => (
                    <Link href={`/forum/${topic.id}`} key={topic.id} className="block group">
                      <div className="bg-white border-2 border-transparent p-6 rounded-[2.5rem] hover:border-red-200 hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-300 flex items-center justify-between">
                        <div className="flex items-start gap-6">
                          <div className="hidden sm:flex h-14 w-14 rounded-2xl bg-slate-50 items-center justify-center text-slate-400 group-hover:bg-red-50 group-hover:text-red-600 transition-colors">
                            <User size={24}/>
                          </div>

                          <div className="space-y-1">
                            <div className="flex items-center gap-3">
                              <span className="text-[9px] font-black uppercase tracking-widest text-red-600 bg-red-50 px-2 py-0.5 rounded">
                                {topic.category}
                              </span>
                            </div>
                            <h3 className="text-xl font-black uppercase italic text-slate-900 group-hover:text-red-600 transition-colors leading-tight">
                              {topic.title}
                            </h3>
                            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-2">
                              Posté le {new Date(topic.created_at).toLocaleDateString('fr-FR')}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-8">
                          <div className="hidden md:flex flex-col items-center">
                            <span className="text-xl font-black text-slate-900">{topic.forum_messages?.length || 0}</span>
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Réponses</span>
                          </div>
                          <div className="bg-slate-50 p-3 rounded-2xl group-hover:bg-red-600 group-hover:text-white transition-all">
                            <ChevronRight size={20}/>
                          </div>
                        </div>
                      </div>
                    </Link>
                ))
            ) : (
                <div className="text-center py-20 bg-white rounded-[3rem] border-2 border-dashed border-slate-100 shadow-sm">
                  <MessageCircle className="mx-auto text-slate-200 mb-4" size={64}/>
                  <p className="text-slate-400 font-bold uppercase italic tracking-widest text-sm">
                    Aucun résultat pour cette recherche
                  </p>
                  <Link href="/forum" className="text-red-600 text-xs font-black uppercase mt-4 block hover:underline italic">Voir toutes les questions</Link>
                </div>
            )}
          </div>
        </main>
      </div>
  );
}