"use client";

import { useState } from "react";
import { Navbar } from "@/components/navbar/navbar";
import {
  MessageSquare,
  Search,
  Plus,
  ChevronRight,
  MessageCircle,
  User,
  Filter,
  CheckCircle2
} from "lucide-react";
import Link from "next/link";

// Mock data pour visualiser le rendu (à remplacer par ton fetch Supabase)
const CATEGORIES = ["Tous", "Inscriptions", "Entraînements", "Compétitions", "Matériel"];
const TOPICS = [
  {
    id: "1",
    title: "Comment s'inscrire au Cross d'Etalle ?",
    category: "Inscriptions",
    author: "Marc D.",
    replies: 4,
    is_closed: true,
    created_at: "Il y a 2h",
    has_staff_answer: true,
  },
  {
    id: "2",
    title: "Quelles pointes pour la piste en hiver ?",
    category: "Matériel",
    author: "Léa P.",
    replies: 2,
    is_closed: false,
    created_at: "Il y a 5h",
    has_staff_answer: false,
  }
];

export default function ForumPage() {
  const [activeCategory, setActiveCategory] = useState("Tous");

  return (
      <div className="min-h-screen relative">
        <Navbar/>

        <main className="container mx-auto px-4 pt-32 pb-20">

          {/* HEADER SECTION */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-red-600 p-2 rounded-lg shadow-lg shadow-red-200">
                  <MessageSquare className="text-white" size={20}/>
                </div>
                <span className="text-red-600 font-black uppercase italic tracking-widest text-xs">Communauté ACD</span>
              </div>
              <h1 className="text-5xl font-black text-slate-900 uppercase italic tracking-tighter">
                Le <span className="text-red-600">Forum</span>
              </h1>
              <p className="text-slate-500 font-medium mt-2">Posez vos questions et partagez avec le
                club.</p>
            </div>

            <Link href="/forum/nouveau">
              <button
                  className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black uppercase italic tracking-widest flex items-center gap-3 hover:bg-red-600 transition-all shadow-xl active:scale-95">
                <Plus size={20}/> Poser une question
              </button>
            </Link>
          </div>

          {/* BARRE DE RECHERCHE ET FILTRES */}
          <div className="flex flex-col gap-8 mb-10">
            <div className="relative group">
              <Search
                  className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-red-600 transition-colors"
                  size={20}/>
              <input
                  type="text"
                  placeholder="Rechercher une discussion (ex: pointes, horaires, licence...)"
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-5 pl-14 pr-6 font-bold focus:ring-4 focus:ring-red-50 focus:border-red-600 outline-none transition-all"
              />
            </div>

            <div className="flex items-center gap-4 overflow-x-auto pb-2 no-scrollbar">
              <div className="bg-slate-100 p-2 rounded-xl flex items-center gap-2 mr-2">
                <Filter size={16} className="text-slate-500"/>
              </div>
              {CATEGORIES.map((cat) => (
                  <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={`px-6 py-2 rounded-full font-black uppercase italic text-xs tracking-widest whitespace-nowrap transition-all ${
                          activeCategory === cat
                              ? "bg-red-600 text-white shadow-lg shadow-red-200"
                              : "bg-white text-slate-500 border border-slate-200 hover:border-red-600"
                      }`}
                  >
                    {cat}
                  </button>
              ))}
            </div>
          </div>

          {/* LISTE DES DISCUSSIONS */}
          <div className="space-y-4">
            {TOPICS.map((topic) => (
                <Link href={`/forum/${topic.id}`} key={topic.id} className="block group">
                  <div
                      className="bg-white border-2 border-slate-50 p-6 rounded-[2rem] hover:border-red-200 hover:shadow-2xl hover:shadow-slate-100 transition-all duration-300 flex items-center justify-between">
                    <div className="flex items-start gap-6">
                      {/* Avatar ou Initiale */}
                      <div
                          className="hidden sm:flex h-14 w-14 rounded-2xl bg-slate-100 items-center justify-center text-slate-400 group-hover:bg-red-50 group-hover:text-red-600 transition-colors">
                        <User size={24}/>
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-3">
                      <span
                          className="text-[10px] font-black uppercase tracking-widest text-red-600 bg-red-50 px-2 py-0.5 rounded">
                        {topic.category}
                      </span>
                          {topic.has_staff_answer && (
                              <span
                                  className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-green-600 bg-green-50 px-2 py-0.5 rounded">
                          <CheckCircle2 size={10}/> Réponse Staff
                        </span>
                          )}
                        </div>
                        <h3 className="text-xl font-black uppercase italic text-slate-900 group-hover:text-red-600 transition-colors">
                          {topic.title}
                        </h3>
                        <div
                            className="flex items-center gap-4 text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                          <span className="flex items-center gap-1"><User size={12}/> {topic.author}</span>
                          <span>● {topic.created_at}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-8">
                      <div className="hidden md:flex flex-col items-center">
                        <span className="text-xl font-black text-slate-900">{topic.replies}</span>
                        <span
                            className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Réponses</span>
                      </div>
                      <div
                          className="bg-slate-50 p-3 rounded-2xl group-hover:bg-red-600 group-hover:text-white transition-all">
                        <ChevronRight size={20}/>
                      </div>
                    </div>
                  </div>
                </Link>
            ))}
          </div>

          {/* EMPTY STATE */}
          {TOPICS.length === 0 && (
              <div
                  className="text-center py-20 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
                <MessageCircle className="mx-auto text-slate-300 mb-4" size={48}/>
                <p className="text-slate-500 font-bold italic">Aucune discussion trouvée dans cette
                  catégorie.</p>
              </div>
          )}
        </main>
      </div>
  );
}