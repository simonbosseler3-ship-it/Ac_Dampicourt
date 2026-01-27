"use client";

import { useState, useEffect, use } from "react";
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

  // Vérification Staff
  const isStaff = profile?.role === 'admin' || profile?.role === 'redacteur';

  useEffect(() => {
    async function fetchTopicData() {
      try {
        // 1. Récupérer le sujet et les messages en parallèle pour gagner du temps
        const [topicRes, messagesRes] = await Promise.all([
          supabase.from('forum_topics').select('*').eq('id', id).maybeSingle(),
          supabase.from('forum_messages')
          .select('*, profiles!left(full_name, role)')
          .eq('topic_id', id)
          .order('created_at', { ascending: true })
        ]);

        setTopic(topicRes.data);
        setMessages(messagesRes.data || []);
      } catch (err) {
        console.error("Erreur chargement discussion:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchTopicData();

    // TEMPS RÉEL : On écoute les nouveaux messages pour qu'ils s'affichent sans rafraîchir !
    const channel = supabase
    .channel(`topic-${id}`)
    .on('postgres_changes', {
      event: 'INSERT',
      schema: 'public',
      table: 'forum_messages',
      filter: `topic_id=eq.${id}`
    }, async (payload) => {
      // On recharge les messages pour avoir les infos de profil
      const { data } = await supabase
      .from('forum_messages')
      .select('*, profiles!left(full_name, role)')
      .eq('id', payload.new.id)
      .single();
      if (data) setMessages(prev => [...prev, data]);
    })
    .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [id]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const content = formData.get('content') as string;
    if (!content.trim() || !user) return;

    setSending(true);
    const { error } = await supabase.from('forum_messages').insert({
      topic_id: id,
      author_id: user.id,
      content: content,
      is_staff_answer: isStaff
    });

    if (!error) (e.target as HTMLFormElement).reset();
    setSending(false);
  };

  if (loading) {
    return (
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="animate-spin text-red-600" size={40} />
        </div>
    );
  }

  if (!topic) return <div className="pt-40 text-center font-black text-slate-400">Discussion introuvable</div>;

  return (
      <div className="min-h-screen bg-transparent">
        <main className="container mx-auto px-4 pt-32 pb-20 max-w-4xl animate-in fade-in duration-500">
          <Link href="/forum" className="flex items-center gap-2 text-slate-400 hover:text-red-600 font-bold uppercase italic text-[10px] mb-10 transition-colors group">
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform"/> Retour au forum
          </Link>

          <h1 className="text-4xl md:text-5xl font-black text-slate-900 uppercase italic tracking-tighter mb-12 leading-none">
            {topic.title}
          </h1>

          <div className="space-y-6 mb-16">
            {/* QUESTION ORIGINALE */}
            <div className="bg-white/80 backdrop-blur-sm p-8 rounded-[2.5rem] border-2 border-white shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400">
                  <User size={18}/>
                </div>
                <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Question Originale</span>
              </div>
              <p className="text-lg italic font-medium text-slate-800 whitespace-pre-wrap">{topic.title}</p>
            </div>

            {/* LISTE DES RÉPONSES */}
            {messages.map((msg) => (
                <div key={msg.id}
                     className={`p-8 rounded-[2.5rem] border-2 transition-all shadow-sm animate-in slide-in-from-bottom-2 duration-300 ${
                         msg.is_staff_answer
                             ? "bg-slate-900 text-white border-slate-900 shadow-xl"
                             : "bg-white/90 backdrop-blur-sm text-slate-900 border-white"
                     }`}>
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${msg.is_staff_answer ? "bg-red-600" : "bg-slate-100 text-slate-400"}`}>
                        <User size={18}/>
                      </div>
                      <div>
                        <p className={`text-[10px] font-black uppercase tracking-widest ${msg.is_staff_answer ? "text-red-500" : "text-slate-900"}`}>
                          {msg.profiles?.full_name || (msg.is_staff_answer ? "STAFF ACD" : "MEMBRE")}
                        </p>
                        <p className="text-[8px] opacity-40 font-bold uppercase">
                          {new Date(msg.created_at).toLocaleDateString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                    {msg.is_staff_answer && <ShieldCheck className="text-red-500" size={20}/>}
                  </div>
                  <p className="text-md md:text-lg italic font-medium whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                </div>
            ))}
          </div>

          {/* ZONE DE RÉPONSE */}
          {user ? (
              <div className="bg-white/95 backdrop-blur-md p-6 md:p-10 rounded-[3rem] shadow-2xl border border-white">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-2 w-10 bg-red-600 rounded-full"></div>
                  <h2 className="text-sm font-black uppercase italic text-slate-900">Ajouter une réponse</h2>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
              <textarea
                  name="content"
                  required
                  rows={4}
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-[2rem] p-6 outline-none focus:border-red-600 font-bold text-slate-900 transition-all"
                  placeholder={isStaff ? "Votre réponse officielle..." : "Votre commentaire..."}
              ></textarea>
                  <button
                      type="submit"
                      disabled={sending}
                      className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black uppercase italic hover:bg-red-600 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
                  >
                    {sending ? <Loader2 className="animate-spin" /> : <><Send size={18}/> Envoyer la réponse</>}
                  </button>
                </form>
              </div>
          ) : (
              <div className="bg-slate-900/5 backdrop-blur-sm rounded-[2.5rem] p-10 text-center border-2 border-dashed border-slate-200">
                <Lock className="mx-auto mb-2 text-slate-400" size={24}/>
                <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Connectez-vous pour participer à la discussion</p>
              </div>
          )}
        </main>
      </div>
  );
}