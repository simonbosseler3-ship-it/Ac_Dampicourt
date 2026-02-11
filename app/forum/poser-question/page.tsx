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
  const { profile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [selectedCat, setSelectedCat] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loading) return;

    // 1. Vérification de la session actuelle
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      alert("Vous devez être connecté pour poser une question.");
      router.push("/login");
      return;
    }

    const formData = new FormData(e.currentTarget);
    const title = (formData.get('title') as string).trim();
    const content = (formData.get('content') as string).trim();

    if (!selectedCat || !title || !content) {
      alert("Veuillez remplir tous les champs.");
      return;
    }

    setLoading(true);

    try {
      // 2. Création du Topic
      const { data: topic, error: topicError } = await supabase
      .from('forum_topics')
      .insert({
        title,
        category: selectedCat,
        author_id: session.user.id,
        is_closed: false
      })
      .select()
      .single();

      if (topicError) throw topicError;

      // 3. Création du premier message
      if (topic) {
        const isStaff = profile?.role === 'admin' || profile?.role === 'redacteur';

        const { error: msgError } = await supabase.from('forum_messages').insert({
          topic_id: topic.id,
          author_id: session.user.id,
          content: content,
          is_staff_answer: isStaff // Marqué comme staff si l'auteur l'est
        });

        if (msgError) throw msgError;

        // 4. Notification (optionnel, ne bloque pas la réussite)
        fetch('/api/forum/notify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            topicId: topic.id,
            title,
            category: selectedCat,
            content,
            authorName: profile?.full_name || "Un membre"
          }),
        }).catch(err => console.error("Notification non envoyée", err));
      }

      // 5. Succès et redirection
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
        <main
            className="container mx-auto px-4 pt-32 pb-20 max-w-3xl animate-in fade-in slide-in-from-bottom-4 duration-700">

          <Link href="/forum"
                className="flex items-center gap-2 text-slate-400 hover:text-red-600 font-black uppercase italic text-[10px] mb-8 transition-all group tracking-widest">
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform"/>
            Retour au forum
          </Link>

          <div
              className="bg-slate-50/50 rounded-[3rem] p-8 md:p-14 border border-slate-100 shadow-sm relative overflow-hidden">
            {/* Déco subtile */}
            <div
                className="absolute top-0 right-0 w-32 h-32 bg-red-600/5 rounded-full -mr-16 -mt-16"></div>

            <div className="mb-12 relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <span className="h-1 w-10 bg-red-600"></span>
                <span
                    className="text-red-600 font-black uppercase italic text-[10px] tracking-[0.3em]">Nouveau Sujet</span>
              </div>
              <h1 className="text-5xl font-black text-slate-900 uppercase italic tracking-tighter leading-none">
                Poser une <span className="text-red-600">Question</span>
              </h1>
              <p className="text-slate-500 font-bold uppercase italic text-[11px] mt-4 tracking-widest leading-relaxed">
                Le staff ACD vous répondra directement ici.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-10 relative z-10">

              {/* TITRE */}
              <div className="space-y-4">
                <label
                    className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-2">
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
                <label
                    className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-2">
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
                <label
                    className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-2">
                  Détails de la question
                </label>
                <textarea
                    name="content"
                    required
                    disabled={loading}
                    rows={8}
                    placeholder="Décrivez votre situation avec précision pour obtenir une réponse rapide..."
                    className="w-full bg-white border-2 border-slate-100 rounded-[2rem] py-6 px-8 font-medium focus:border-red-600 outline-none transition-all shadow-sm resize-none text-slate-700 leading-relaxed"
                ></textarea>
              </div>

              {/* ALERTE */}
              <div
                  className="bg-red-50 p-6 rounded-2xl flex gap-4 items-center border border-red-100/50">
                <div className="bg-red-600 p-2 rounded-lg text-white">
                  <AlertCircle size={18}/>
                </div>
                <p className="text-[10px] font-black text-red-900 uppercase italic tracking-widest leading-tight">
                  Attention : Votre question sera visible par <br/> l'ensemble des membres du club.
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
                      <Send size={22}
                            className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"/>
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