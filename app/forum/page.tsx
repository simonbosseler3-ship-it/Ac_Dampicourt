"use client";

import { useState, useEffect, Suspense } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/app/context/authContext";
import { useSearchParams, useRouter } from "next/navigation";
import {
  MessageSquare,
  Search,
  Plus,
  ChevronRight,
  MessageCircle,
  User,
  Loader2
} from "lucide-react";
import Link from "next/link";
import { DeleteTopicButton } from "@/components/forum/delete-topic-button";

function ForumContent() {
  const { profile } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [topics, setTopics] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>(["Tous"]);
  const [loading, setLoading] = useState(true);

  const currentCategory = searchParams.get("category") || "Tous";
  const currentSearch = searchParams.get("search") || "";

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const { data: catData } = await supabase.from('forum_topics').select('category');
        const uniqueCats = ["Tous", ...new Set(catData?.map(c => c.category) || [])];
        setCategories(uniqueCats);

        let query = supabase
        .from('forum_topics')
        .select(`*, forum_messages ( id )`)
        .order('created_at', { ascending: false });

        if (currentCategory !== "Tous") {
          query = query.eq('category', currentCategory);
        }
        if (currentSearch) {
          query = query.ilike('title', `%${currentSearch}%`);
        }

        const { data } = await query;
        setTopics(data || []);
      } catch (err) {
        console.error("Erreur forum:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [currentCategory, currentSearch]);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const search = formData.get("search") as string;
    const params = new URLSearchParams(searchParams.toString());
    if (search) params.set("search", search);
    else params.delete("search");
    router.push(`/forum?${params.toString()}`);
  };

  // Fonction pour supprimer le topic de l'affichage localement
  const handleRemoveTopicLocally = (id: string) => {
    setTopics((prev) => prev.filter((topic) => topic.id !== id));
  };

  return (
      <main className="container mx-auto px-4 pt-32 pb-20 animate-in fade-in duration-500">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-red-600 p-2 rounded-lg shadow-lg">
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
          <form onSubmit={handleSearch} className="relative group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-red-600 transition-colors" size={20}/>
            <input
                name="search"
                type="text"
                defaultValue={currentSearch}
                placeholder="Rechercher dans les titres..."
                className="w-full bg-white/70 backdrop-blur-sm border-2 border-slate-100 rounded-2xl py-4 pl-14 pr-6 font-bold focus:border-red-600 outline-none transition-all shadow-sm"
            />
          </form>

          <div className="flex items-center gap-3 overflow-x-auto pb-2 no-scrollbar">
            {categories.map((cat) => (
                <Link
                    key={cat}
                    href={`/forum?category=${cat}${currentSearch ? `&search=${currentSearch}` : ''}`}
                    className={`px-6 py-2 rounded-full font-black uppercase italic text-[10px] tracking-widest whitespace-nowrap transition-all ${
                        currentCategory === cat
                            ? "bg-red-600 text-white shadow-md"
                            : "bg-white/60 backdrop-blur-sm text-slate-500 border border-slate-200 hover:border-red-600"
                    }`}
                >
                  {cat}
                </Link>
            ))}
          </div>
        </div>

        {/* LISTE DES DISCUSSIONS */}
        <div className="space-y-4">
          {loading ? (
              <div className="flex flex-col items-center justify-center py-20 bg-white/40 backdrop-blur-sm rounded-[3rem] border-2 border-dashed border-slate-200">
                <Loader2 className="animate-spin text-red-600 mb-4" size={40} />
                <p className="text-slate-400 font-black uppercase italic text-xs tracking-widest">Mise à jour du flux...</p>
              </div>
          ) : topics.length > 0 ? (
              topics.map((topic) => (
                  <div key={topic.id} className="flex items-center gap-4 group">
                    {/* ZONE DE LIEN : OCCUPE TOUT L'ESPACE RESTANT */}
                    <Link href={`/forum/${topic.id}`} className="flex-1 block">
                      <div className="bg-white/80 backdrop-blur-sm border-2 border-transparent p-6 rounded-[2.5rem] group-hover:border-red-200 group-hover:shadow-2xl group-hover:shadow-slate-200/50 transition-all duration-300 flex items-center justify-between">
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

                        <div className="flex items-center gap-4 md:gap-8">
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

                    {/* BOUTON SUPPRESSION : ISOLÉ À DROITE */}
                    {profile?.role === 'admin' && (
                        <div className="flex-shrink-0 pr-2">
                          <DeleteTopicButton
                              topicId={topic.id}
                              onDelete={() => handleRemoveTopicLocally(topic.id)}
                          />
                        </div>
                    )}
                  </div>
              ))
          ) : (
              <div className="text-center py-20 bg-white/60 backdrop-blur-sm rounded-[3rem] border-2 border-dashed border-slate-100">
                <MessageCircle className="mx-auto text-slate-200 mb-4" size={64}/>
                <p className="text-slate-400 font-bold uppercase italic tracking-widest text-sm">
                  Aucun sujet trouvé
                </p>
                <Link href="/forum" className="text-red-600 text-xs font-black uppercase mt-4 block hover:underline italic">
                  Réinitialiser les filtres
                </Link>
              </div>
          )}
        </div>
      </main>
  );
}

export default function ForumPage() {
  return (
      <div className="min-h-screen bg-transparent">
        <Suspense fallback={
          <div className="min-h-screen flex items-center justify-center">
            <Loader2 className="animate-spin text-red-600" size={40} />
          </div>
        }>
          <ForumContent />
        </Suspense>
      </div>
  );
}