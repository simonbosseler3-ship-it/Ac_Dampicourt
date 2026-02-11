"use client";

import { useState, useEffect, use, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/app/context/authContext";
import { ArrowLeft, User, ShieldCheck, Lock, Loader2, Send } from "lucide-react";
import Link from "next/link";

export default function TopicDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { user, profile } = useAuth();

  const [topic, setTopic] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const isStaff = profile?.role?.toLowerCase().trim() === 'admin' || profile?.role?.toLowerCase().trim() === 'redacteur';

  // Chargement initial
  const fetchTopicData = useCallback(async () => {
    try {
      const [topicRes, messagesRes] = await Promise.all([
        supabase.from('forum_topics').select('*').eq('id', id).maybeSingle(),
        supabase.from('forum_messages')
        .select('*, profiles!left(full_name, role)')
        .eq('topic_id', id)
        .order('created_at', { ascending: true })
      ]);

      if (topicRes.data) setTopic(topicRes.data);
      if (messagesRes.data) setMessages(messagesRes.data);
    } catch (err) {
      console.error("Erreur chargement discussion:", err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchTopicData();

    // REALTIME : On écoute les nouveaux messages
    const channel = supabase
    .channel(`topic-${id}`)
    .on('postgres_changes', {
      event: 'INSERT',
      schema: 'public',
      table: 'forum_messages',
      filter: `topic_id=eq.${id}`
    }, async (payload) => {
      // Pour éviter les doublons si l'auteur a déjà ajouté le message en Optimistic UI
      setMessages(current => {
        if (current.some(m => m.id === payload.new.id)) return current;

        // On récupère les infos du profil pour le nouveau message reçu via Realtime
        const fetchFullMsg = async () => {
          const { data } = await supabase
          .from('forum_messages')
          .select('*, profiles!left(full_name, role)')
          .eq('id', payload.new.id)
          .single();

          if (data) {
            setMessages(prev => {
              if (prev.some(m => m.id === data.id)) return prev;
              return [...prev, data];
            });
          }
        };
        fetchFullMsg();
        return current;
      });
    })
    .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [id, fetchTopicData]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const content = (formData.get('content') as string).trim();

    if (!content || !user) return;

    setSending(true);

    try {
      const { data: newMessage, error } = await supabase.from('forum_messages').insert({
        topic_id: id,
        author_id: user.id,
        content: content,
        is_staff_answer: isStaff
      }).select().single();

      if (error) throw error;

      if (newMessage) {
        // Optimistic UI : Ajout immédiat avec le profil local
        const optimisticMsg = {
          ...newMessage,
          profiles: { full_name: profile?.full_name, role: profile?.role }
        };

        setMessages(prev => {
          if (prev.some(m => m.id === newMessage.id)) return prev;
          return [...prev, optimisticMsg];
        });

        form.reset();

        // Notification asynchrone
        if (isStaff) {
          fetch('/api/forum/notify-staff-reply', {
            method: 'POST',
            body: JSON.stringify({
              topicId: id,
              topicTitle: topic.title,
              staffName: profile?.full_name || "Staff ACD",
              replyContent: content
            }),
          }).catch(() => null);
        }
      }
    } catch (err) {
      alert("Impossible d'envoyer votre message.");
    } finally {
      setSending(false);
    }
  };

  if (loading) return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <Loader2 className="animate-spin text-red-600" size={40} />
        <p className="text-[10px] font-black uppercase italic text-slate-400 tracking-widest">Ouverture de la discussion...</p>
      </div>
  );

  if (!topic) return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6">
        <h2 className="text-2xl font-black uppercase italic text-slate-300">Sujet introuvable</h2>
        <Link href="/forum" className="bg-slate-900 text-white px-6 py-3 rounded-xl font-black uppercase italic text-xs tracking-widest">
          Retour au forum
        </Link>
      </div>
  );

  return (
      <div className="min-h-screen">
        <main
            className="container mx-auto px-4 pt-32 pb-20 max-w-4xl animate-in fade-in duration-700">

          <Link href="/forum"
                className="flex items-center gap-2 text-slate-400 hover:text-red-600 font-black uppercase italic text-[10px] mb-12 transition-all group tracking-[0.2em]">
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform"/>
            Retour au forum
          </Link>

          {/* HEADER DU TOPIC */}
          <div className="mb-16">
          <span
              className="bg-red-600 text-white px-3 py-1 rounded-md text-[9px] font-black uppercase italic tracking-[0.2em] mb-4 inline-block shadow-lg shadow-red-100">
            {topic.category}
          </span>
            <h1 className="text-4xl md:text-7xl font-black text-slate-900 uppercase italic tracking-tighter leading-[0.9]">
              {topic.title}
            </h1>
          </div>

          {/* LISTE DES MESSAGES */}
          <div className="space-y-8 mb-20">
            {messages.map((msg, index) => (
                <div key={msg.id}
                     className={`p-8 md:p-10 rounded-[3rem] border-2 transition-all animate-in slide-in-from-bottom-4 duration-500 ${
                         index === 0
                             ? "bg-slate-50 border-slate-100 shadow-sm"
                             : msg.is_staff_answer
                                 ? "bg-slate-900 text-white border-slate-900 shadow-2xl scale-[1.02]"
                                 : "bg-white text-slate-900 border-slate-100 shadow-sm"
                     }`}>

                  <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-4">
                      <div
                          className={`h-12 w-12 rounded-2xl flex items-center justify-center transition-colors ${msg.is_staff_answer ? "bg-red-600 text-white shadow-lg" : "bg-white text-slate-300 shadow-inner"}`}>
                        <User size={20}/>
                      </div>
                      <div>
                        <p className={`text-[10px] font-black uppercase tracking-widest flex items-center gap-2 ${index === 0 ? "text-red-600" : msg.is_staff_answer ? "text-red-500" : "text-slate-900"}`}>
                          {index === 0 ? "Auteur de la question" : (msg.profiles?.full_name || "Membre")}
                          {msg.is_staff_answer &&
                              <ShieldCheck size={14} className="animate-pulse"/>}
                        </p>
                        <p className={`text-[8px] font-bold uppercase tracking-widest opacity-40 mt-0.5`}>
                          {new Date(msg.created_at).toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div
                      className={`italic font-medium whitespace-pre-wrap leading-relaxed ${index === 0 ? "text-xl text-slate-800" : "text-lg"}`}>
                    {msg.content}
                  </div>
                </div>
            ))}
          </div>

          {/* ZONE DE RÉPONSE */}
          {user ? (
              <div
                  className="bg-slate-50 p-8 md:p-12 rounded-[3.5rem] border border-slate-100 shadow-inner">
                <div className="flex items-center gap-4 mb-8">
                  <div className="h-1.5 w-12 bg-red-600"></div>
                  <h2 className="text-[11px] font-black uppercase italic text-slate-900 tracking-[0.3em]">Votre
                    participation</h2>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
              <textarea
                  name="content"
                  required
                  rows={5}
                  className="w-full bg-white border-2 border-slate-200 rounded-[2rem] p-8 outline-none focus:border-red-600 font-medium text-slate-800 transition-all shadow-sm"
                  placeholder={isStaff ? "Rédiger une réponse officielle ACD..." : "Écrire un message..."}
              ></textarea>

                  <button
                      type="submit"
                      disabled={sending}
                      className="w-full bg-slate-900 text-white py-6 rounded-2xl font-black uppercase italic tracking-widest hover:bg-red-600 transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50 shadow-xl"
                  >
                    {sending ? <Loader2 className="animate-spin" size={24}/> : <><Send
                        size={20}/> Envoyer la réponse</>}
                  </button>
                </form>
              </div>
          ) : (
              <div
                  className="bg-slate-50 rounded-[3rem] p-12 text-center border-2 border-dashed border-slate-200">
                <Lock className="mx-auto mb-4 text-slate-300" size={32}/>
                <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.3em] mb-6">Connectez-vous
                  pour répondre</p>
                <Link href="/login"
                      className="inline-block bg-slate-900 text-white px-10 py-4 rounded-xl font-black uppercase italic text-[10px] tracking-widest hover:bg-red-600 transition-all">
                  Se connecter
                </Link>
              </div>
          )}
        </main>
      </div>
  );
}