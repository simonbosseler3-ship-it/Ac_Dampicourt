"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/authContext";
import { ArrowLeft, Send, AlertCircle, Check, Loader2 } from "lucide-react";
import Link from "next/link";

const CATEGORIES = ["Inscriptions", "Entraînements", "Compétitions", "Matériel", "Autre"];

export default function NouveauTopicPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [selectedCat, setSelectedCat] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loading) return;

    const formData = new FormData(e.currentTarget);
    const title = formData.get('title') as string;
    const content = formData.get('content') as string;

    if (!selectedCat || !title || !content) return;

    setLoading(true);

    try {
      // 1. Insertion du sujet
      const { data: topic, error: topicError } = await supabase
      .from('forum_topics')
      .insert({
        title,
        category: selectedCat,
        author_id: user?.id || null,
        is_closed: false
      })
      .select()
      .single();

      if (topicError) throw topicError;

      if (topic && content) {
        // 2. Insertion du message initial
        await supabase.from('forum_messages').insert({
          topic_id: topic.id,
          author_id: user?.id || null,
          content: content,
          is_staff_answer: false
        });

        // 3. Notification Email via une API Route (pour ne pas bloquer le client)
        // On lance l'appel sans attendre le 'await' pour rediriger plus vite
        fetch('/api/forum/notify', {
          method: 'POST',
          body: JSON.stringify({
            topicId: topic.id,
            title,
            category: selectedCat,
            content
          }),
        }).catch(err => console.error("Email notification failed", err));
      }

      // Redirection immédiate
      router.push('/forum');
      router.refresh();
    } catch (err) {
      console.error("Erreur creation topic:", err);
      alert("Une erreur est survenue lors de la publication.");
      setLoading(false);
    }
  };

  return (
      <div className="min-h-screen bg-transparent">
        <main className="container mx-auto px-4 pt-32 pb-20 max-w-3xl animate-in fade-in duration-500">

          <Link href="/forum"
                className="flex items-center gap-2 text-slate-400 hover:text-red-600 font-bold uppercase italic text-[10px] mb-8 transition-colors group">
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform"/>
            Retour au forum
          </Link>

          <div className="bg-white/80 backdrop-blur-md rounded-[3rem] p-8 md:p-12 shadow-2xl border border-white">
            <div className="mb-10">
              <h1 className="text-4xl font-black text-slate-900 uppercase italic tracking-tighter">
                Poser une <span className="text-red-600">Question</span>
              </h1>
              <p className="text-slate-500 font-medium mt-2">
                Le staff ACD vous répondra directement sur ce fil de discussion.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">

              {/* TITRE */}
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">
                  Objet de la question
                </label>
                <input
                    name="title"
                    required
                    disabled={loading}
                    placeholder="Ex: Horaires du car pour le cross d'Etalle"
                    className="w-full bg-slate-50/50 border-2 border-slate-100 rounded-2xl py-4 px-6 font-bold focus:border-red-600 focus:bg-white outline-none transition-all placeholder:text-slate-300 text-slate-900"
                />
              </div>

              {/* CATÉGORIES */}
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">
                  Choisissez une catégorie
                </label>
                <div className="flex flex-wrap gap-3">
                  {CATEGORIES.map((cat) => (
                      <button
                          key={cat}
                          type="button"
                          onClick={() => setSelectedCat(cat)}
                          disabled={loading}
                          className={`px-6 py-3 rounded-full font-black uppercase italic text-[10px] tracking-widest border-2 transition-all flex items-center gap-2
                      ${selectedCat === cat
                              ? "bg-red-600 text-white border-red-600 shadow-lg shadow-red-200"
                              : "bg-slate-50 border-slate-100 text-slate-400 hover:border-red-200"
                          }`}
                      >
                        {cat}
                        {selectedCat === cat && <Check size={12} className="animate-in zoom-in" />}
                      </button>
                  ))}
                </div>
              </div>

              {/* MESSAGE */}
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">
                  Votre message détaillé
                </label>
                <textarea
                    name="content"
                    required
                    disabled={loading}
                    rows={6}
                    placeholder="Détaillez votre question ici..."
                    className="w-full bg-slate-50/50 border-2 border-slate-100 rounded-[2rem] py-4 px-6 font-bold focus:border-red-600 focus:bg-white outline-none transition-all placeholder:text-slate-300 resize-none text-slate-900"
                ></textarea>
              </div>

              {/* ALERTE */}
              <div className="bg-red-50/50 p-6 rounded-2xl flex gap-4 items-start border border-red-100">
                <AlertCircle className="text-red-600 shrink-0 mt-0.5" size={20}/>
                <p className="text-[10px] font-bold text-red-800 leading-relaxed uppercase tracking-tight">
                  Votre question sera publiée publiquement sur le forum.
                </p>
              </div>

              <button
                  type="submit"
                  disabled={loading || !selectedCat}
                  className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black uppercase italic tracking-widest flex items-center justify-center gap-3 hover:bg-red-600 transition-all shadow-xl active:scale-95 disabled:opacity-50 group"
              >
                {loading ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      Publication en cours...
                    </>
                ) : (
                    <>
                      <Send size={20} className="group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform"/>
                      Publier la question
                    </>
                )}
              </button>
            </form>
          </div>
        </main>
      </div>
  );
}