"use client";

import { PageHero } from "@/components/layout/PageHero";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/authContext";
import { ArrowLeft, Send, AlertCircle, Check, Loader2, Globe } from "lucide-react";
import Link from "next/link";

const CATEGORIES = ["Inscriptions", "Entraînements", "Compétitions", "Matériel", "Autre"];

export default function NouveauTopicPage() {
  const router = useRouter();
  const { profile, user } = useAuth(); // On utilise le contexte pour identifier le staff
  const [loading, setLoading] = useState(false);
  const [selectedCat, setSelectedCat] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loading) return;

    const formData = new FormData(e.currentTarget);
    const title = (formData.get('title') as string).trim();
    const content = (formData.get('content') as string).trim();

    if (!selectedCat || !title || !content) {
      alert("Veuillez remplir tous les champs.");
      return;
    }

    setLoading(true);

    try {
      // 1. Création du Topic (author_id sera null si visiteur non connecté)
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

      // 2. Création du premier message
      if (topic) {
        // Identification du staff (uniquement si connecté avec le bon rôle)
        const isStaff = profile?.role === 'admin' || profile?.role === 'redacteur';

        const { error: msgError } = await supabase.from('forum_messages').insert({
          topic_id: topic.id,
          author_id: user?.id || null,
          content: content,
          is_staff_answer: isStaff
        });

        if (msgError) throw msgError;

        // 3. Notification (optionnel)
        fetch('/api/forum/notify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            topicId: topic.id,
            title,
            category: selectedCat,
            content,
            authorName: profile?.full_name || "Un visiteur"
          }),
        }).catch(err => console.error("Notification non envoyée", err));
      }

      // 4. Succès et redirection
      router.push(`/forum/${topic.id}`);
      router.refresh();
    } catch (err: any) {
      console.error("Erreur forum:", err);
      alert("Erreur : " + (err.message || "Impossible de publier."));
      setLoading(false);
    }
  };

  return (
      <div className="min-h-screen">
        <PageHero
            back={{ href: "/forum", label: "Retour au forum" }}
            eyebrow={user ? "Nouveau Sujet" : "Question Publique"}
            title={<>Poser une <em>question</em></>}
            meta={<span className="ph__chip"><Globe size={14} /> Ouvert à tous. Le staff ACD vous répondra ici.</span>}
        />
        <main
            className="container mx-auto px-4 pt-12 md:pt-16 pb-20 max-w-3xl">

          <div
              className="bg-white/95 rounded-[2.5rem] p-8 md:p-14 border border-slate-200 shadow-xl relative overflow-hidden">

            {/* Déco subtile */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/5 rounded-full -mr-16 -mt-16"></div>

            <form onSubmit={handleSubmit} className="space-y-10 relative z-10">

              {/* TITRE */}
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-2">
                  Objet de votre demande
                </label>
                <input
                    name="title"
                    required
                    disabled={loading}
                    autoFocus
                    placeholder="Ex: Question sur les inscriptions cross"
                    className="w-full bg-white border-2 border-slate-100 rounded-2xl py-5 px-8 font-bold focus:border-red-600 outline-none transition-all shadow-sm text-slate-900"
                />
              </div>

              {/* CATÉGORIES */}
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-2">
                  Catégorie concernée
                </label>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map((cat) => (
                      <button
                          key={cat}
                          type="button"
                          onClick={() => setSelectedCat(cat)}
                          disabled={loading}
                          className={`px-6 py-3 rounded-xl font-black uppercase italic text-[10px] tracking-widest border-2 transition-all flex items-center gap-2
                      ${selectedCat === cat
                              ? "bg-slate-900 text-white border-slate-900 shadow-xl scale-105"
                              : "bg-white border-slate-100 text-slate-400 hover:border-red-600 hover:text-red-600"
                          }`}
                      >
                        {cat}
                        {selectedCat === cat && <Check size={14} className="text-red-600"/>}
                      </button>
                  ))}
                </div>
              </div>

              {/* MESSAGE */}
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-2">
                  Détails de la question
                </label>
                <textarea
                    name="content"
                    required
                    disabled={loading}
                    rows={8}
                    placeholder="Décrivez votre situation avec précision..."
                    className="w-full bg-white border-2 border-slate-100 rounded-[2rem] py-6 px-8 font-medium focus:border-red-600 outline-none transition-all shadow-sm resize-none text-slate-700 leading-relaxed"
                ></textarea>
              </div>

              {/* ALERTE */}
              <div className="bg-red-50 p-6 rounded-2xl flex gap-4 items-center border border-red-100/50">
                <div className="bg-red-600 p-2 rounded-lg text-white">
                  <AlertCircle size={18}/>
                </div>
                <p className="text-[10px] font-black text-red-900 uppercase italic tracking-widest leading-tight">
                  Note : Votre question sera publiée publiquement <br/> et visible par l'ensemble du club.
                </p>
              </div>

              <button
                  type="submit"
                  disabled={loading || !selectedCat}
                  className="w-full bg-red-600 text-white py-6 rounded-2xl font-black uppercase italic tracking-widest flex items-center justify-center gap-4 hover:bg-slate-900 transition-all shadow-2xl shadow-red-200 active:scale-95 disabled:opacity-50 disabled:scale-100 group"
              >
                {loading ? (
                    <>
                      <Loader2 className="animate-spin" size={24}/>
                      Publication en cours...
                    </>
                ) : (
                    <>
                      <Send size={22} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"/>
                      Publier sur le forum
                    </>
                )}
              </button>
            </form>
          </div>
        </main>
      </div>
  );
}