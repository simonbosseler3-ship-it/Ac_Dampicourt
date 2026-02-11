"use client";

import { useState, useEffect, Suspense, useCallback } from "react";
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

  // 1. Charger les catégories disponibles une seule fois
  useEffect(() => {
    async function fetchCategories() {
      const { data } = await supabase.from('forum_topics').select('category');
      if (data) {
        const uniqueCats = ["Tous", ...new Set(data.map(c => c.category))];
        setCategories(uniqueCats);
      }
    }
    fetchCategories();
  }, []);

  // 2. Charger les sujets selon les filtres
  const fetchTopics = useCallback(async () => {
    setLoading(true);
    try {
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

      const { data, error } = await query;
      if (error) throw error;
      setTopics(data || []);
    } catch (err) {
      console.error("Erreur forum:", err);
    } finally {
      setLoading(false);
    }
  }, [currentCategory, currentSearch]);

  useEffect(() => {
    fetchTopics();
  }, [fetchTopics]);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const search = formData.get("search") as string;
    const params = new URLSearchParams(searchParams.toString());

    if (search) params.set("search", search);
    else params.delete("search");

    router.push(`/forum?${params.toString()}`);
  };

  const handleRemoveTopicLocally = (id: string) => {
    setTopics((prev) => prev.filter((topic) => topic.id !== id));
  };

  return (
      <main className="container mx-auto px-4 pt-32 pb-20 animate-in fade-in duration-700">
        {/* HEADER ACD STYLE */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-red-600 p-2.5 rounded-xl shadow-lg shadow-red-200">
                <MessageSquare className="text-white" size={20}/>
              </div>
              <span className="text-red-600 font-black uppercase italic tracking-[0.2em] text-[10px]">Espace Discussions</span>
            </div>
            <h1 className="text-6xl md:text-8xl font-black text-slate-900 uppercase italic tracking-tighter leading-none">
              Le <span className="text-red-600">Forum</span>
            </h1>
            <p className="text-slate-400 font-bold uppercase italic text-xs mt-4 tracking-widest">Partagez, échangez, progressez.</p>
          </div>

          <Link href="/forum/poser-question">
            <button className="bg-slate-900 text-white px-10 py-5 rounded-[1.5rem] font-black uppercase italic tracking-widest flex items-center gap-4 hover:bg-red-600 transition-all shadow-2xl hover:-translate-y-1 active:scale-95">
              <Plus size={22}/> Poser une question
            </button>
          </Link>
        </div>

        {/* RECHERCHE ET FILTRES */}
        <div className="flex flex-col gap-8 mb-12">
          <form onSubmit={handleSearch} className="relative group max-w-2xl">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-red-600 transition-colors" size={22}/>
            <input
                name="search"
                type="text"
                defaultValue={currentSearch}
                placeholder="Une question ? Un sujet ? Cherchez ici..."
                className="w-full bg-white border-2 border-slate-100 rounded-[2rem] py-5 pl-16 pr-8 font-bold text-slate-700 focus:border-red-600 outline-none transition-all shadow-sm focus:shadow-xl"
            />
          </form>

          <div className="flex items-center gap-3 overflow-x-auto pb-4 no-scrollbar">
            {categories.map((cat) => (
                <Link
                    key={cat}
                    href={`/forum?category=${cat}${currentSearch ? `&search=${currentSearch}` : ''}`}
                    className={`px-8 py-3 rounded-full font-black uppercase italic text-[10px] tracking-[0.15em] whitespace-nowrap transition-all border-2 ${
                        currentCategory === cat
                            ? "bg-red-600 border-red-600 text-white shadow-lg shadow-red-100"
                            : "bg-white text-slate-400 border-slate-100 hover:border-red-600 hover:text-red-600"
                    }`}
                >
                  {cat}
                </Link>
            ))}
          </div>
        </div>

        {/* LISTE DES DISCUSSIONS */}
        <div className="space-y-6">
          {loading ? (
              <div className="flex flex-col items-center justify-center py-32 bg-slate-50/50 rounded-[3rem] border-2 border-dashed border-slate-200">
                <Loader2 className="animate-spin text-red-600 mb-6" size={48} />
                <p className="text-slate-400 font-black uppercase italic text-xs tracking-[0.3em] animate-pulse">Chargement du flux...</p>
              </div>
          ) : topics.length > 0 ? (
              topics.map((topic) => (
                  <div key={topic.id} className="flex items-center gap-4 group animate-in slide-in-from-bottom-4">
                    <Link href={`/forum/${topic.id}`} className="flex-1 block">
                      <div className="bg-white border-2 border-slate-50 p-8 rounded-[2.5rem] group-hover:border-red-500 group-hover:shadow-2xl transition-all duration-500 flex items-center justify-between">
                        <div className="flex items-start gap-8">
                          <div className="hidden sm:flex h-16 w-16 rounded-[1.25rem] bg-slate-50 items-center justify-center text-slate-400 group-hover:bg-red-600 group-hover:text-white transition-all duration-500">
                            <User size={28}/>
                          </div>

                          <div className="space-y-3">
                            <div className="flex items-center gap-3">
                        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-red-600 bg-red-50 px-3 py-1 rounded-full">
                          {topic.category}
                        </span>
                            </div>
                            <h3 className="text-2xl font-black uppercase italic text-slate-900 leading-none tracking-tight">
                              {topic.title}
                            </h3>
                            <p className="text-slate-400 text-[9px] font-black uppercase tracking-widest">
                              Publié le {new Date(topic.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-10">
                          <div className="hidden md:flex flex-col items-center">
                      <span className="text-2xl font-black text-slate-900 tracking-tighter group-hover:text-red-600 transition-colors">
                        {topic.forum_messages?.length || 0}
                      </span>
                            <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Réponses</span>
                          </div>
                          <div className="bg-slate-50 p-4 rounded-2xl group-hover:bg-slate-900 group-hover:text-white transition-all">
                            <ChevronRight size={20}/>
                          </div>
                        </div>
                      </div>
                    </Link>

                    {/* ACTIONS ADMIN : Sortie du Link pour éviter le bug de clic */}
                    {profile?.role === 'admin' && (
                        <div className="flex-shrink-0 bg-white p-2 rounded-2xl border border-slate-100 shadow-sm">
                          <DeleteTopicButton
                              topicId={topic.id}
                              onDelete={() => handleRemoveTopicLocally(topic.id)}
                          />
                        </div>
                    )}
                  </div>
              ))
          ) : (
              <div className="text-center py-32 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
                <MessageCircle className="mx-auto text-slate-200 mb-6" size={80}/>
                <p className="text-slate-400 font-black uppercase italic tracking-[0.2em] text-sm">
                  Aucune discussion ici pour le moment
                </p>
                <Link href="/forum" className="inline-block mt-8 text-red-600 text-[10px] font-black uppercase tracking-widest border-b-2 border-red-600 pb-1 hover:text-slate-900 hover:border-slate-900 transition-all">
                  Voir tous les sujets
                </Link>
              </div>
          )}
        </div>
      </main>
  );
}

// Wrapper principal avec Suspense (Obligatoire pour useSearchParams)
export default function ForumPage() {
  return (
      <div className="min-h-screen">
        <Suspense fallback={
          <div className="min-h-screen flex flex-col items-center justify-center gap-4">
            <Loader2 className="animate-spin text-red-600" size={40}/>
            <p className="text-[10px] font-black uppercase italic text-slate-400">Initialisation du
              forum...</p>
          </div>
        }>
          <ForumContent/>
        </Suspense>
      </div>
  );
}