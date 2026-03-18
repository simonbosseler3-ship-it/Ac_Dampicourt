"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/app/context/authContext";
import {
  Plus,
  CheckCircle2,
  X,
  Loader2,
  TrendingUp,
  Trash2,
  Trophy,
  MessageSquare,
  Sparkles,
  Pencil // Ajouté pour l'édition
} from "lucide-react";

type PollOption = { id: string; text: string; votes_count?: number };
type Poll = { id: string; question: string; is_active: boolean; options: PollOption[] };

async function createVoterHash(ip: string) {
  const salt = "AC-Dampicourt-Secret-2024";
  const msgUint8 = new TextEncoder().encode(ip + salt);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export default function SondagesPage() {
  const { user, profile, loading: authLoading } = useAuth();
  const [polls, setPolls] = useState<Poll[]>([]);
  const [votedPolls, setVotedPolls] = useState<string[]>([]);
  const [voterHash, setVoterHash] = useState<string | null>(null);
  const [dataLoading, setDataLoading] = useState(true);

  // States Modal (Création & Edition)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPollId, setEditingPollId] = useState<string | null>(null);
  const [newQuestion, setNewQuestion] = useState("");
  const [newOptions, setNewOptions] = useState(["", ""]);
  const [existingOptions, setExistingOptions] = useState<PollOption[]>([]); // Options déjà en DB lors de l'edit

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [votingInProgress, setVotingInProgress] = useState<string | null>(null);
  const [showCelebration, setShowCelebration] = useState<string | null>(null);

  const canManage = ['admin', 'editeur', 'redacteur', 'rédacteur'].includes(profile?.role?.toLowerCase()?.trim() || '');

  useEffect(() => {
    initSondages();
  }, [user]);

  useEffect(() => {
    const channel = supabase
    .channel('realtime-polls')
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'poll_votes' }, (payload) => {
      const newVote = payload.new;
      setPolls((current) => current.map((poll) => {
        if (poll.id !== newVote.poll_id) return poll;
        return {
          ...poll,
          options: poll.options.map((opt) =>
              opt.id === newVote.option_id ? { ...opt, votes_count: (opt.votes_count || 0) + 1 } : opt
          ),
        };
      }));
    })
    .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  const initSondages = async () => {
    try {
      const ipRes = await fetch('https://api.ipify.org?format=json');
      const { ip } = await ipRes.json();
      const hash = await createVoterHash(ip);
      setVoterHash(hash);
      await fetchPollsData(hash);
    } catch (err) {
      console.error("Erreur init:", err);
      fetchPollsData(null);
    }
  };

  const fetchPollsData = async (currentHash: string | null) => {
    setDataLoading(true);
    try {
      const { data: pollsData } = await supabase
      .from('polls')
      .select(`id, question, is_active, poll_options ( id, text )`)
      .order('created_at', { ascending: false });

      const { data: votesCount } = await supabase.from('poll_votes').select('option_id, poll_id, voter_hash');
      const voteTally: Record<string, number> = {};
      const alreadyVotedSet = new Set<string>();

      votesCount?.forEach(v => {
        voteTally[v.option_id] = (voteTally[v.option_id] || 0) + 1;
        if ((currentHash && v.voter_hash === currentHash) || localStorage.getItem(`voted_${v.poll_id}`)) {
          alreadyVotedSet.add(v.poll_id);
        }
      });

      const formattedPolls = pollsData?.map(poll => ({
        ...poll,
        options: poll.poll_options.map((opt: any) => ({ ...opt, votes_count: voteTally[opt.id] || 0 }))
      })) || [];

      setPolls(formattedPolls);
      setVotedPolls(Array.from(alreadyVotedSet));
    } finally {
      setDataLoading(false);
    }
  };

  // Ouvrir la modal en mode édition
  const openEditModal = (poll: Poll) => {
    setEditingPollId(poll.id);
    setNewQuestion(poll.question);
    setExistingOptions(poll.options); // On stocke les options existantes (qu'on ne modifie pas pour garder les votes)
    setNewOptions([""]); // On laisse un champ vide pour ajouter de nouvelles propositions
    setIsModalOpen(true);
  };

  const closeAndResetModal = () => {
    setIsModalOpen(false);
    setEditingPollId(null);
    setNewQuestion("");
    setNewOptions(["", ""]);
    setExistingOptions([]);
  };

  const handleSavePoll = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingPollId) {
        // --- MODE EDITION ---
        // 1. Update la question
        await supabase.from('polls').update({ question: newQuestion }).eq('id', editingPollId);

        // 2. Ajouter seulement les nouvelles options non vides
        const addedOptions = newOptions
        .filter(o => o.trim() !== "")
        .map(opt => ({ poll_id: editingPollId, text: opt }));

        if (addedOptions.length > 0) {
          await supabase.from('poll_options').insert(addedOptions);
        }
      } else {
        // --- MODE CREATION ---
        const { data: poll } = await supabase.from('polls').insert([{ question: newQuestion }]).select().single();
        const options = newOptions.filter(o => o.trim()).map(opt => ({ poll_id: poll.id, text: opt }));
        await supabase.from('poll_options').insert(options);
      }

      closeAndResetModal();
      initSondages();
    } catch (err) {
      console.error(err);
      alert("Une erreur est survenue.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVote = async (pollId: string, optionId: string) => {
    if (votedPolls.includes(pollId) || votingInProgress) return;
    setVotingInProgress(pollId);
    try {
      const { error } = await supabase.from('poll_votes').insert([{ poll_id: pollId, option_id: optionId, voter_hash: voterHash }]);
      if (error) throw error;
      localStorage.setItem(`voted_${pollId}`, 'true');
      setShowCelebration(pollId);
      setTimeout(() => setShowCelebration(null), 3000);
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

          {/* LISTE */}
          {polls.length === 0 ? (
              <div className="w-full flex flex-col items-center justify-center py-24 px-6 bg-white rounded-[3rem] border-2 border-dashed border-slate-200 text-center animate-in fade-in slide-in-from-bottom-4 duration-1000">
                <MessageSquare size={64} className="text-red-600 mb-4" />
                <h2 className="text-3xl font-black uppercase italic text-slate-900 mb-4">Le silence avant le match</h2>
                {canManage && (
                    <button onClick={() => setIsModalOpen(true)} className="text-red-600 font-black uppercase italic text-[12px] tracking-widest">
                      Lancer le premier vote <Plus size={18} className="inline ml-2" />
                    </button>
                )}
              </div>
          ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {polls.map((poll) => {
                  const totalVotes = poll.options.reduce((sum, opt) => sum + (opt.votes_count || 0), 0);
                  const hasVoted = votedPolls.includes(poll.id);
                  const isCelebrating = showCelebration === poll.id;

                  return (
                      <div key={poll.id} className={`bg-white p-8 md:p-10 rounded-[2.5rem] border border-slate-100 shadow-xl relative overflow-hidden group hover:shadow-2xl transition-all duration-500 ${isCelebrating ? 'ring-4 ring-red-600 ring-inset ring-opacity-20' : ''}`}>
                        {isCelebrating && (
                            <div className="absolute inset-0 pointer-events-none z-50 flex items-center justify-center">
                              <Sparkles className="text-red-600 animate-bounce" size={100} />
                            </div>
                        )}

                        <TrendingUp size={120} className="absolute -right-10 -bottom-10 text-slate-50 pointer-events-none" />

                        {canManage && (
                            <div className="absolute top-8 right-8 flex gap-3 z-20">
                              <button onClick={() => openEditModal(poll)} className="text-slate-300 hover:text-blue-600 transition-colors">
                                <Pencil size={20} />
                              </button>
                              <button onClick={() => handleDeletePoll(poll.id)} className="text-slate-300 hover:text-red-600 transition-colors">
                                <Trash2 size={20} />
                              </button>
                            </div>
                        )}

                        <div className="relative z-10">
                          <h2 className="text-xl md:text-2xl font-black uppercase italic text-slate-900 leading-tight mb-8 pr-20">
                            {poll.question}
                          </h2>
                          <div className="space-y-4">
                            {poll.options.map((option) => {
                              const votes = option.votes_count || 0;
                              const percentage = totalVotes > 0 ? Math.round((votes / totalVotes) * 100) : 0;
                              if (hasVoted) {
                                return (
                                    <div key={option.id} className="relative">
                                      <div className="flex justify-between text-[10px] font-black uppercase italic mb-2">
                                        <span className="text-slate-700">{option.text}</span>
                                        <span className="text-red-600">{percentage}% ({votes})</span>
                                      </div>
                                      <div className="h-5 w-full bg-slate-100 rounded-full overflow-hidden p-[2px]">
                                        <div className="h-full bg-slate-900 rounded-full transition-all duration-1000" style={{ width: `${percentage}%` }} />
                                      </div>
                                    </div>
                                );
                              }
                              return (
                                  <button key={option.id} onClick={() => handleVote(poll.id, option.id)} disabled={!!votingInProgress} className="w-full text-left p-5 rounded-2xl border-2 border-slate-100 hover:border-red-600 hover:bg-red-50 transition-all font-black uppercase italic text-slate-600 hover:text-red-600 text-[11px] tracking-widest active:scale-95">
                                    {option.text}
                                  </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                  );
                })}
              </div>
          )}
        </main>

        {/* MODAL HYBRIDE (CRÉATION & ÉDITION) */}
        {isModalOpen && (
            <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
              <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={closeAndResetModal} />
              <div className="bg-white rounded-[2.5rem] p-10 w-full max-w-lg relative z-10 shadow-2xl animate-in zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto">
                <button onClick={closeAndResetModal} className="absolute top-8 right-8 text-slate-400 hover:text-red-600 transition-colors">
                  <X size={24} />
                </button>
                <h3 className="text-3xl font-black uppercase italic text-slate-900 mb-8 tracking-tighter">
                  {editingPollId ? "Modifier le sondage" : "Nouveau Sondage"}
                </h3>

                <form onSubmit={handleSavePoll} className="space-y-6">
                  <div>
                    <label className="text-[10px] font-black uppercase italic text-slate-400 tracking-widest mb-2 block">La question</label>
                    <input type="text" required value={newQuestion} onChange={(e) => setNewQuestion(e.target.value)} className="w-full p-5 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold focus:border-red-600 outline-none transition-all"/>
                  </div>

                  {/* Affichage des options existantes (en mode édition uniquement) */}
                  {editingPollId && existingOptions.length > 0 && (
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase italic text-slate-400 tracking-widest block">Options actuelles (verrouillées)</label>
                        {existingOptions.map((opt) => (
                            <div key={opt.id} className="p-4 bg-slate-100 border-2 border-slate-200 rounded-xl font-bold text-sm text-slate-400 italic">
                              {opt.text}
                            </div>
                        ))}
                      </div>
                  )}

                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase italic text-slate-400 tracking-widest mb-2 block">
                      {editingPollId ? "Ajouter de nouvelles propositions" : "Options de réponse"}
                    </label>
                    {newOptions.map((opt, idx) => (
                        <input key={idx} type="text" required={!editingPollId && idx < 2} value={opt} placeholder={editingPollId ? "Nouveau choix..." : `Choix ${idx + 1}`} onChange={(e) => { const n = [...newOptions]; n[idx] = e.target.value; setNewOptions(n); }} className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-xl font-bold text-sm focus:border-red-600 outline-none transition-all" />
                    ))}
                    {newOptions.length + existingOptions.length < 8 && (
                        <button type="button" onClick={() => setNewOptions([...newOptions, ""])} className="text-[10px] font-black uppercase text-red-600 flex items-center gap-2 mt-2">
                          <Plus size={14} /> Ajouter un champ
                        </button>
                    )}
                  </div>

                  <button disabled={isSubmitting} type="submit" className="w-full bg-slate-900 text-white p-5 rounded-2xl font-black uppercase italic text-[12px] tracking-[0.2em] hover:bg-red-600 transition-all shadow-xl active:scale-95 disabled:opacity-50 mt-4">
                    {isSubmitting ? 'Enregistrement...' : editingPollId ? 'Mettre à jour' : 'Lancer le sondage'}
                  </button>
                </form>
              </div>
            </div>
        )}
      </div>
  );
}