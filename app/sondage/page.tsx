"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/app/context/authContext";
import {
  BarChart3,
  Plus,
  CheckCircle2,
  X,
  Loader2,
  TrendingUp,
  Trash2,
  Trophy,
  MessageSquare
} from "lucide-react";

type PollOption = { id: string; text: string; votes_count?: number };
type Poll = { id: string; question: string; is_active: boolean; options: PollOption[] };

export default function SondagesPage() {
  const { user, profile, loading: authLoading } = useAuth();
  const [polls, setPolls] = useState<Poll[]>([]);
  const [votedPolls, setVotedPolls] = useState<string[]>([]);
  const [userIp, setUserIp] = useState<string | null>(null);
  const [dataLoading, setDataLoading] = useState(true);

  // States Création
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newQuestion, setNewQuestion] = useState("");
  const [newOptions, setNewOptions] = useState(["", ""]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [votingInProgress, setVotingInProgress] = useState<string | null>(null);

  const canManage = ['admin', 'editeur', 'redacteur', 'rédacteur'].includes(profile?.role?.toLowerCase()?.trim() || '');

  useEffect(() => {
    initSondages();
  }, [user]);

  // Abonnement Realtime pour voir les votes des autres en direct
  useEffect(() => {
    const channel = supabase
    .channel('realtime-polls')
    .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'poll_votes' },
        (payload) => {
          const newVote = payload.new;
          setPolls((current) =>
              current.map((poll) => {
                if (poll.id !== newVote.poll_id) return poll;
                return {
                  ...poll,
                  options: poll.options.map((opt) =>
                      opt.id === newVote.option_id
                          ? { ...opt, votes_count: (opt.votes_count || 0) + 1 }
                          : opt
                  ),
                };
              })
          );
        }
    )
    .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const initSondages = async () => {
    try {
      const ipRes = await fetch('https://api.ipify.org?format=json');
      const { ip } = await ipRes.json();
      setUserIp(ip);
      await fetchPollsData(ip);
    } catch (err) {
      console.error("Erreur init:", err);
      fetchPollsData(null);
    }
  };

  const fetchPollsData = async (ip: string | null) => {
    setDataLoading(true);
    try {
      const { data: pollsData } = await supabase
      .from('polls')
      .select(`id, question, is_active, poll_options ( id, text )`)
      .order('created_at', { ascending: false });

      const { data: votesCount } = await supabase.from('poll_votes').select('option_id, poll_id, ip_address, user_id');

      const voteTally: Record<string, number> = {};
      const alreadyVotedSet = new Set<string>();

      votesCount?.forEach(v => {
        voteTally[v.option_id] = (voteTally[v.option_id] || 0) + 1;
        if ((ip && v.ip_address === ip) || (user && v.user_id === user.id)) {
          alreadyVotedSet.add(v.poll_id);
        }
      });

      const formattedPolls = pollsData?.map(poll => ({
        ...poll,
        options: poll.poll_options.map((opt: any) => ({
          ...opt,
          votes_count: voteTally[opt.id] || 0
        }))
      })) || [];

      setPolls(formattedPolls);
      setVotedPolls(Array.from(alreadyVotedSet));
    } finally {
      setDataLoading(false);
    }
  };

  const handleVote = async (pollId: string, optionId: string) => {
    if (votedPolls.includes(pollId) || votingInProgress) return;
    setVotingInProgress(pollId);

    try {
      const { error } = await supabase.from('poll_votes').insert([
        { poll_id: pollId, option_id: optionId, user_id: user?.id || null, ip_address: userIp }
      ]);
      if (error) throw error;
      setVotedPolls(prev => [...prev, pollId]);
    } catch (err) {
      alert("Erreur lors du vote.");
    } finally {
      setVotingInProgress(null);
    }
  };

  const handleDeletePoll = async (pollId: string) => {
    if (!confirm("Supprimer définitivement ce sondage ?")) return;
    await supabase.from('polls').delete().eq('id', pollId);
    setPolls(prev => prev.filter(p => p.id !== pollId));
  };

  const handleCreatePoll = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const { data: poll } = await supabase.from('polls').insert([{ question: newQuestion }]).select().single();
      const options = newOptions.filter(o => o.trim()).map(opt => ({ poll_id: poll.id, text: opt }));
      await supabase.from('poll_options').insert(options);
      setIsModalOpen(false);
      setNewQuestion("");
      setNewOptions(["", ""]);
      initSondages();
    } finally {
      setIsSubmitting(false);
    }
  };

  if (dataLoading || authLoading) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-4">
          <Loader2 className="animate-spin text-red-600" size={40} />
          <p className="text-[10px] font-black uppercase italic tracking-[0.3em] text-slate-400">Analyse du terrain...</p>
        </div>
    );
  }

  return (
      <div className="min-h-screen">
        <main className="container mx-auto px-4 pt-32 pb-24">

          {/* HEADER */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="h-[2px] w-10 bg-red-600"></span>
                <span className="text-red-600 font-black uppercase italic tracking-[0.3em] text-[10px]">Voix du Club</span>
              </div>
              <h1 className="text-6xl md:text-8xl font-black text-slate-900 uppercase italic tracking-tighter leading-[0.85]">
                SONDAGES <br /><span className="text-red-600">& VOTES</span>
              </h1>
            </div>

            {canManage && (
                <button onClick={() => setIsModalOpen(true)} className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black hover:bg-red-600 transition-all text-[10px] uppercase italic shadow-2xl active:scale-95 flex items-center gap-2">
                  <Plus size={16} /> Nouveau Sondage
                </button>
            )}
          </div>

          {/* LISTE OU ÉTAT VIDE */}
          {polls.length === 0 ? (
              <div className="w-full flex flex-col items-center justify-center py-24 px-6 bg-white rounded-[3rem] border-2 border-dashed border-slate-200 text-center animate-in fade-in slide-in-from-bottom-4 duration-1000">
                <div className="relative mb-8">
                  <div className="absolute inset-0 bg-red-100 rounded-full blur-3xl opacity-50 scale-150"></div>
                  <div className="relative bg-white p-8 rounded-full shadow-2xl border border-slate-100">
                    <MessageSquare size={64} className="text-red-600" />
                  </div>
                  <Trophy size={32} className="absolute -top-2 -right-2 text-yellow-500 animate-bounce" />
                </div>

                <h2 className="text-3xl font-black uppercase italic text-slate-900 mb-4 tracking-tighter">
                  Le silence avant le match
                </h2>
                <p className="max-w-md text-slate-400 font-bold uppercase italic text-[11px] tracking-widest leading-relaxed mb-10">
                  Aucun sondage n'est actif pour le moment. Revenez bientôt pour donner votre avis ou proposez une idée au staff !
                </p>

                {canManage && (
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="group flex items-center gap-4 text-red-600 font-black uppercase italic text-[12px] tracking-[0.2em] hover:text-slate-900 transition-colors"
                    >
                      Lancer le premier vote <Plus size={18} className="group-hover:rotate-90 transition-transform" />
                    </button>
                )}
              </div>
          ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {polls.map((poll) => {
                  const totalVotes = poll.options.reduce((sum, opt) => sum + (opt.votes_count || 0), 0);
                  const hasVoted = votedPolls.includes(poll.id);

                  return (
                      <div key={poll.id} className="bg-white p-8 md:p-10 rounded-[2.5rem] border border-slate-100 shadow-xl relative overflow-hidden group hover:shadow-2xl transition-all duration-500">
                        <TrendingUp size={120} className="absolute -right-10 -bottom-10 text-slate-50 pointer-events-none group-hover:scale-110 transition-transform duration-1000" />

                        {canManage && (
                            <button onClick={() => handleDeletePoll(poll.id)} className="absolute top-8 right-8 text-slate-300 hover:text-red-600 z-20 transition-colors">
                              <Trash2 size={20} />
                            </button>
                        )}

                        <div className="relative z-10">
                          <h2 className="text-xl md:text-2xl font-black uppercase italic text-slate-900 leading-tight mb-8 pr-12">
                            {poll.question}
                          </h2>

                          <div className="space-y-4">
                            {poll.options.map((option) => {
                              const votes = option.votes_count || 0;
                              const percentage = totalVotes > 0 ? Math.round((votes / totalVotes) * 100) : 0;

                              if (hasVoted) {
                                return (
                                    <div key={option.id} className="relative">
                                      <div className="flex justify-between text-[10px] font-black uppercase italic mb-2 tracking-widest">
                                        <span className="text-slate-700">{option.text}</span>
                                        <span className="text-red-600">{percentage}% ({votes})</span>
                                      </div>
                                      <div className="h-5 w-full bg-slate-100 rounded-full overflow-hidden p-[2px]">
                                        <div
                                            className="h-full bg-slate-900 rounded-full transition-all duration-[1500ms] ease-out shadow-lg"
                                            style={{ width: `${percentage}%` }}
                                        />
                                      </div>
                                    </div>
                                );
                              }

                              return (
                                  <button
                                      key={option.id}
                                      onClick={() => handleVote(poll.id, option.id)}
                                      className="w-full text-left p-5 rounded-2xl border-2 border-slate-100 hover:border-red-600 hover:bg-red-50 transition-all font-black uppercase italic text-slate-600 hover:text-red-600 text-[11px] tracking-widest group/btn active:scale-95"
                                  >
                            <span className="flex items-center justify-between">
                              {option.text}
                              <Plus size={14} className="opacity-0 group-hover/btn:opacity-100 transition-opacity" />
                            </span>
                                  </button>
                              );
                            })}
                          </div>

                          <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                        {totalVotes} Participation{totalVotes > 1 ? 's' : ''}
                      </span>
                            {hasVoted && (
                                <span className="text-[9px] font-black text-slate-900 uppercase italic flex items-center gap-1">
                          <CheckCircle2 size={10} className="text-green-500" /> Opinion enregistrée
                        </span>
                            )}
                          </div>
                        </div>
                      </div>
                  );
                })}
              </div>
          )}
        </main>

        {/* MODAL CRÉATION */}
        {isModalOpen && (
            <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
              <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setIsModalOpen(false)} />
              <div className="bg-white rounded-[2.5rem] p-10 w-full max-w-lg relative z-10 shadow-2xl animate-in zoom-in-95 duration-300">
                <button onClick={() => setIsModalOpen(false)} className="absolute top-8 right-8 text-slate-400 hover:text-red-600 transition-colors">
                  <X size={24} />
                </button>
                <h3 className="text-3xl font-black uppercase italic text-slate-900 mb-8 tracking-tighter">Nouveau Sondage</h3>
                <form onSubmit={handleCreatePoll} className="space-y-6">
                  <div>
                    <label className="text-[10px] font-black uppercase italic text-slate-400 tracking-widest mb-2 block">La question</label>
                    <input
                        type="text" required placeholder="Ex: Quel maillot pour la saison ?" value={newQuestion} onChange={(e) => setNewQuestion(e.target.value)}
                        className="w-full p-5 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold focus:border-red-600 outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase italic text-slate-400 tracking-widest mb-2 block">Options de réponse</label>
                    {newOptions.map((opt, idx) => (
                        <input
                            key={idx} type="text" required={idx < 2} value={opt} placeholder={`Choix ${idx + 1}`}
                            onChange={(e) => {
                              const n = [...newOptions]; n[idx] = e.target.value; setNewOptions(n);
                            }}
                            className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-xl font-bold text-sm focus:border-red-600 outline-none transition-all"
                        />
                    ))}
                    {newOptions.length < 5 && (
                        <button type="button" onClick={() => setNewOptions([...newOptions, ""])} className="text-[10px] font-black uppercase text-red-600 flex items-center gap-2 mt-2">
                          <Plus size={14} /> Ajouter une option
                        </button>
                    )}
                  </div>
                  <button disabled={isSubmitting} type="submit" className="w-full bg-slate-900 text-white p-5 rounded-2xl font-black uppercase italic text-[12px] tracking-[0.2em] hover:bg-red-600 transition-all shadow-xl active:scale-95 disabled:opacity-50 mt-4">
                    {isSubmitting ? 'Publication...' : 'Lancer le sondage'}
                  </button>
                </form>
              </div>
            </div>
        )}
      </div>
  );
}