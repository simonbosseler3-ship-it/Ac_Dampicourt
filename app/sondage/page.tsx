"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/app/context/authContext";
import {
  Plus,
  Loader2,
  Trash2,
  Trophy,
  MessageSquare,
  Sparkles,
  Pencil,
  Send,
  MessageCircle,
  ChevronRight,
  AlertTriangle,
  X
} from "lucide-react";

type PollOption = { id: string; text: string; votes_count?: number };
type PollMessage = { id: string; poll_id: string; content: string; created_at: string };
type Poll = {
  id: string;
  question: string;
  is_active: boolean;
  type: 'standard' | 'competition';
  options: PollOption[]
};

async function createVoterHash(ip: string) {
  const salt = "AC-Dampicourt-Secret-2024";
  const msgUint8 = new TextEncoder().encode(ip + salt);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export default function SondagesPage() {
  const { profile, loading: authLoading } = useAuth();

  const [polls, setPolls] = useState<Poll[]>([]);
  const [messages, setMessages] = useState<Record<string, PollMessage[]>>({});
  const [votedPolls, setVotedPolls] = useState<string[]>([]);
  const [voterHash, setVoterHash] = useState<string | null>(null);
  const [dataLoading, setDataLoading] = useState(true);
  const [animatedPoll, setAnimatedPoll] = useState<string | null>(null);

  // Modals States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({ isOpen: false, title: "", message: "", onConfirm: () => {} });

  const [editingPollId, setEditingPollId] = useState<string | null>(null);
  const [newQuestion, setNewQuestion] = useState("");
  const [pollType, setPollType] = useState<'standard' | 'competition'>('standard');
  const [newOptions, setNewOptions] = useState(["", ""]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [msgInput, setMsgInput] = useState<Record<string, string>>({});

  const canManage = ['admin', 'editeur', 'redacteur', 'rédacteur'].includes(profile?.role?.toLowerCase()?.trim() || '');

  useEffect(() => {
    initSondages();
  }, []);

  // REALTIME CONFIGURATION
  useEffect(() => {
    const channel = supabase.channel('realtime-feedback')
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'poll_messages' }, (payload) => {
      const newMessage = payload.new as PollMessage;
      setMessages(prev => {
        const currentMsgs = prev[newMessage.poll_id] || [];
        if (currentMsgs.some(m => m.id === newMessage.id)) return prev;
        return {
          ...prev,
          [newMessage.poll_id]: [newMessage, ...currentMsgs]
        };
      });
    })
    .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'poll_messages' }, (payload) => {
      const deletedId = payload.old.id;
      setMessages(prev => {
        const newState = { ...prev };
        Object.keys(newState).forEach(pollId => {
          newState[pollId] = newState[pollId].filter(m => m.id !== deletedId);
        });
        return newState;
      });
    })
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'poll_votes' }, () => {
      refreshVotesOnly();
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
    } catch { fetchPollsData(null); }
  };

  const refreshVotesOnly = async () => {
    const { data: votesCount } = await supabase.from('poll_votes').select('option_id');
    const voteTally: Record<string, number> = {};
    votesCount?.forEach(v => { voteTally[v.option_id] = (voteTally[v.option_id] || 0) + 1; });

    setPolls(prev => prev.map(p => ({
      ...p, options: p.options.map(o => ({ ...o, votes_count: voteTally[o.id] || 0 }))
    })));
  };

  const fetchPollsData = async (currentHash: string | null) => {
    setDataLoading(true);
    try {
      const { data: pollsData } = await supabase
      .from('polls')
      .select(`id, question, is_active, type, poll_options ( id, text )`)
      .order('created_at', { ascending: false });

      const { data: votesCount } = await supabase.from('poll_votes').select('option_id, poll_id, voter_hash');
      const { data: msgsData } = await supabase.from('poll_messages').select('*').order('created_at', { ascending: false });

      const voteTally: Record<string, number> = {};
      const alreadyVotedSet = new Set<string>();

      votesCount?.forEach(v => {
        voteTally[v.option_id] = (voteTally[v.option_id] || 0) + 1;
        if ((currentHash && v.voter_hash === currentHash) || (typeof window !== 'undefined' && localStorage.getItem(`voted_${v.poll_id}`))) {
          alreadyVotedSet.add(v.poll_id);
        }
      });

      const groupedMsgs: Record<string, PollMessage[]> = {};
      msgsData?.forEach(m => {
        if (!groupedMsgs[m.poll_id]) groupedMsgs[m.poll_id] = [];
        groupedMsgs[m.poll_id].push(m);
      });

      setPolls(pollsData?.map(p => ({
        ...p, options: p.poll_options?.map((o: any) => ({ ...o, votes_count: voteTally[o.id] || 0 })) || []
      })) || []);

      setMessages(groupedMsgs);
      setVotedPolls(Array.from(alreadyVotedSet));
    } finally { setDataLoading(false); }
  };

  const handleVote = async (pollId: string, optionId: string) => {
    if (votedPolls.includes(pollId)) return;
    setVotedPolls(prev => [...prev, pollId]);
    localStorage.setItem(`voted_${pollId}`, 'true');
    setAnimatedPoll(pollId);
    setPolls(prev => prev.map(p => {
      if (p.id === pollId) {
        return {
          ...p,
          options: p.options.map(o => o.id === optionId ? { ...o, votes_count: (o.votes_count || 0) + 1 } : o)
        };
      }
      return p;
    }));
    setTimeout(() => setAnimatedPoll(null), 600);
    await supabase.from('poll_votes').insert([{ poll_id: pollId, option_id: optionId, voter_hash: voterHash }]);
  };

  const handlePostMessage = async (pollId: string) => {
    const content = msgInput[pollId]?.trim();
    if (!content || !voterHash) return;
    setMsgInput(prev => ({ ...prev, [pollId]: "" }));
    const tempId = `temp-${Date.now()}`;
    const tempMsg: PollMessage = { id: tempId, poll_id: pollId, content, created_at: new Date().toISOString() };
    setMessages(prev => ({ ...prev, [pollId]: [tempMsg, ...(prev[pollId] || [])] }));
    const { data } = await supabase.from('poll_messages').insert([{ poll_id: pollId, content, voter_hash: voterHash }]).select().single();
    if (data) {
      setMessages(prev => ({
        ...prev,
        [pollId]: prev[pollId]?.map(m => m.id === tempId ? data as PollMessage : m) || []
      }));
    }
  };

  // --- ACTIONS DE SUPPRESSION AVEC FIX ---
  const triggerDeleteMessage = (msgId: string, pollId: string) => {
    setConfirmModal({
      isOpen: true,
      title: "Supprimer l'encouragement ?",
      message: "Cette action est irréversible et le message disparaîtra pour tout le monde.",
      onConfirm: async () => {
        // 1. Fermer la modal immédiatement
        setConfirmModal(prev => ({ ...prev, isOpen: false }));

        // 2. Suppression locale (Optimiste)
        const previousMessages = { ...messages };
        setMessages(prev => ({
          ...prev,
          [pollId]: prev[pollId].filter(m => m.id !== msgId)
        }));

        // 3. Suppression réelle en BDD
        const { error } = await supabase.from('poll_messages').delete().eq('id', msgId);

        if (error) {
          console.error("Erreur suppression:", error.message);
          // 4. Si ça échoue (ex: RLS), on remet l'état précédent
          setMessages(previousMessages);
          alert("Erreur : Vous n'avez probablement pas les droits pour supprimer ce message.");
        }
      }
    });
  };

  const triggerDeletePoll = (pollId: string) => {
    setConfirmModal({
      isOpen: true,
      title: "Supprimer ce module ?",
      message: "Tout le contenu (votes et messages) sera définitivement effacé.",
      onConfirm: async () => {
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
        const { error } = await supabase.from('polls').delete().eq('id', pollId);

        if (error) {
          console.error("Erreur suppression module:", error.message);
          alert("Impossible de supprimer le module.");
        } else {
          initSondages();
        }
      }
    });
  };

  const handleSavePoll = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingPollId) {
        await supabase.from('polls').update({ question: newQuestion, type: pollType }).eq('id', editingPollId);
      } else {
        const { data: poll } = await supabase.from('polls').insert([{ question: newQuestion, type: pollType }]).select().single();
        if (pollType === 'standard' && poll) {
          const options = newOptions.filter(o => o.trim()).map(opt => ({ poll_id: poll.id, text: opt }));
          await supabase.from('poll_options').insert(options);
        }
      }
      closeAndResetModal();
      initSondages();
    } finally { setIsSubmitting(false); }
  };

  const closeAndResetModal = () => {
    setIsModalOpen(false);
    setEditingPollId(null);
    setNewQuestion("");
    setPollType('standard');
    setNewOptions(["", ""]);
  };

  if (dataLoading || authLoading) return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-red-600" size={48} />
      </div>
  );

  return (
      <div className="min-h-screen">
        <main className="container mx-auto px-6 pt-32 pb-24 max-w-7xl animate-in fade-in duration-1000">

          {/* HEADER */}
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2 mb-4">
                <span className="h-1 w-8 bg-red-600 rounded-full"></span>
                <p className="text-red-600 font-black uppercase italic tracking-widest text-[10px]">Interactivité Club</p>
              </div>
              <h1 className="text-6xl md:text-8xl font-black text-slate-900 uppercase italic tracking-tighter leading-[0.85]">
                VOTES <span className="text-red-600">&</span><br />ENCOURAGEMENTS
              </h1>
            </div>
            {canManage && (
                <button onClick={() => setIsModalOpen(true)} className="bg-slate-900 text-white px-8 py-5 rounded-2xl font-black hover:bg-red-600 transition-all text-[11px] uppercase italic shadow-xl flex items-center gap-3 active:scale-95">
                  <Plus size={18} /> Créer un module
                </button>
            )}
          </div>

          {/* MASONRY GRID */}
          <div className="columns-1 lg:columns-2 gap-8 space-y-8">
            {polls.map((poll) => {
              const totalVotes = poll.options.reduce((sum, opt) => sum + (opt.votes_count || 0), 0);
              const hasVoted = votedPolls.includes(poll.id);
              const isComp = poll.type === 'competition';
              const isAnimating = animatedPoll === poll.id;

              return (
                  <div
                      key={poll.id}
                      className={`break-inside-avoid mb-8 flex flex-col rounded-[2.5rem] overflow-hidden transition-all duration-300 shadow-xl 
                  ${isComp ? 'bg-[#0F172A] border-slate-800' : 'bg-white border-2 border-slate-100'} 
                  ${isAnimating ? 'animate-vote-pop' : ''}`}
                  >
                    <div className="p-8 md:p-10 pb-6">
                      <div className="flex justify-between items-center mb-6">
                        <div className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase italic tracking-wider flex items-center gap-2 ${isComp ? 'bg-red-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                          {isComp ? <Trophy size={12} /> : <MessageSquare size={12} />}
                          {isComp ? 'Live Compétition' : hasVoted ? 'Sondage Terminé' : 'Nouveau Sondage'}
                        </div>
                        {canManage && (
                            <div className="flex gap-2">
                              <button onClick={() => { setEditingPollId(poll.id); setNewQuestion(poll.question); setPollType(poll.type); setIsModalOpen(true); }} className="p-2.5 bg-slate-50 rounded-xl text-slate-400 hover:text-blue-500 transition-colors"><Pencil size={16} /></button>
                              <button onClick={() => triggerDeletePoll(poll.id)} className="p-2.5 bg-slate-50 rounded-xl text-slate-400 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                            </div>
                        )}
                      </div>

                      <h2 className={`text-2xl md:text-3xl font-black uppercase italic leading-tight tracking-tight mb-6 ${isComp ? 'text-white' : 'text-slate-900'}`}>
                        {poll.question}
                      </h2>

                      {!isComp && (
                          <div className="space-y-3">
                            {poll.options.map((option) => {
                              const votes = option.votes_count || 0;
                              const percentage = totalVotes > 0 ? Math.round((votes / totalVotes) * 100) : 0;
                              return hasVoted ? (
                                  <div key={option.id} className="relative py-1">
                                    <div className="flex justify-between text-[10px] font-black uppercase italic mb-2 px-1">
                                      <span className="text-slate-800">{option.text}</span>
                                      <span className="text-red-600">{percentage}%</span>
                                    </div>
                                    <div className="h-5 w-full bg-slate-100 rounded-full overflow-hidden p-[3px]">
                                      <div className="h-full bg-slate-900 rounded-full transition-all duration-1000 ease-out" style={{ width: `${percentage}%` }} />
                                    </div>
                                  </div>
                              ) : (
                                  <button key={option.id} onClick={() => handleVote(poll.id, option.id)} className="w-full flex justify-between items-center p-5 rounded-2xl border-2 border-slate-50 bg-slate-50 hover:border-red-600 hover:bg-red-50 transition-all font-black uppercase italic text-slate-700 text-xs">
                                    {option.text}
                                    <ChevronRight size={16} className="text-red-600" />
                                  </button>
                              );
                            })}
                          </div>
                      )}

                      {isComp && (
                          <div className="flex items-center gap-4 p-5 bg-white/5 rounded-2xl border border-white/5 mb-2">
                            <Sparkles className="text-yellow-400 shrink-0" size={20} />
                            <p className="text-[11px] font-bold text-slate-400 uppercase italic">Espace ouvert ! Vos messages s'affichent en temps réel.</p>
                          </div>
                      )}
                    </div>

                    {isComp && (
                        <div className="bg-slate-900/50 p-8 pt-0 border-t border-white/5">
                          <div className="flex gap-3 my-6">
                            <input
                                type="text"
                                value={msgInput[poll.id] || ""}
                                onChange={(e) => setMsgInput(prev => ({ ...prev, [poll.id]: e.target.value }))}
                                onKeyDown={(e) => e.key === 'Enter' && handlePostMessage(poll.id)}
                                placeholder="Votre message..."
                                className="flex-1 bg-slate-800 border-none rounded-xl py-4 px-5 text-white text-xs font-bold focus:ring-2 focus:ring-red-600 outline-none"
                            />
                            <button onClick={() => handlePostMessage(poll.id)} className="bg-red-600 text-white px-5 rounded-xl hover:bg-red-500 transition-all active:scale-90">
                              <Send size={18} />
                            </button>
                          </div>

                          <div className="space-y-3 max-h-[280px] overflow-y-auto pr-2 custom-scrollbar">
                            {messages[poll.id]?.map((m) => (
                                <div key={m.id} className="group relative p-5 rounded-2xl border border-white/5 bg-white/5 animate-message-flash">
                                  {canManage && (
                                      <button
                                          onClick={() => triggerDeleteMessage(m.id, poll.id)}
                                          className="absolute top-4 right-4 p-2 text-slate-500 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                                      >
                                        <Trash2 size={14} />
                                      </button>
                                  )}
                                  <p className="text-slate-200 text-xs font-medium pr-6">{m.content}</p>
                                  <div className="flex items-center gap-2 mt-3">
                                    <span className="h-[1px] w-3 bg-red-600"></span>
                                    <span className="text-[8px] text-slate-500 uppercase font-black italic">
                              {new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                                  </div>
                                </div>
                            ))}
                          </div>
                        </div>
                    )}
                  </div>
              );
            })}
          </div>
        </main>

        {/* MODAL CONFIG */}
        {isModalOpen && (
            <div className="fixed inset-0 z-[300] flex items-center justify-center p-6">
              <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={closeAndResetModal} />
              <div className="bg-white rounded-[3rem] p-10 w-full max-w-lg relative z-10 shadow-2xl animate-in zoom-in-95 duration-200">
                <div className="flex justify-between items-start mb-8">
                  <h3 className="text-3xl font-black uppercase italic text-slate-900 tracking-tighter">Configuration</h3>
                  <button onClick={closeAndResetModal} className="p-2 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors"><X size={20}/></button>
                </div>
                <form onSubmit={handleSavePoll} className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <button type="button" onClick={() => setPollType('standard')} className={`p-5 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${pollType === 'standard' ? 'border-red-600 bg-red-50 text-red-600' : 'border-slate-100 text-slate-400'}`}>
                      <MessageCircle size={24} />
                      <span className="text-[9px] font-black uppercase italic tracking-widest">Sondage</span>
                    </button>
                    <button type="button" onClick={() => setPollType('competition')} className={`p-5 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${pollType === 'competition' ? 'border-red-600 bg-red-50 text-red-600' : 'border-slate-100 text-slate-400'}`}>
                      <Trophy size={24} />
                      <span className="text-[9px] font-black uppercase italic tracking-widest">Compétition</span>
                    </button>
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase italic text-slate-400 mb-2 block">Question ou Titre</label>
                    <input type="text" required value={newQuestion} onChange={(e) => setNewQuestion(e.target.value)} className="w-full p-5 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold focus:border-red-600 outline-none" />
                  </div>
                  {pollType === 'standard' && (
                      <div className="space-y-3">
                        {newOptions.map((opt, idx) => (
                            <input key={idx} type="text" required={idx < 2} value={opt} placeholder={`Option ${idx + 1}`} onChange={(e) => { const n = [...newOptions]; n[idx] = e.target.value; setNewOptions(n); }} className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-xl font-bold text-sm outline-none" />
                        ))}
                        <button type="button" onClick={() => setNewOptions([...newOptions, ""])} className="text-[10px] font-black uppercase text-red-600 flex items-center gap-2 italic"><Plus size={14} /> Ajouter un choix</button>
                      </div>
                  )}
                  <button disabled={isSubmitting} type="submit" className="w-full bg-slate-900 text-white p-6 rounded-2xl font-black uppercase italic text-xs hover:bg-red-600 transition-all disabled:opacity-50">
                    {isSubmitting ? 'Publication...' : 'Mettre en ligne'}
                  </button>
                </form>
              </div>
            </div>
        )}

        {/* MODAL DE CONFIRMATION */}
        {confirmModal.isOpen && (
            <div className="fixed inset-0 z-[400] flex items-center justify-center p-6">
              <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))} />
              <div className="bg-white rounded-[2.5rem] p-8 w-full max-w-sm relative z-10 shadow-2xl animate-in zoom-in-95 duration-200 border-t-8 border-red-600">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center text-red-600 mb-6">
                    <AlertTriangle size={32} />
                  </div>
                  <h3 className="text-xl font-black uppercase italic text-slate-900 mb-2 tracking-tight">{confirmModal.title}</h3>
                  <p className="text-slate-500 text-xs font-medium leading-relaxed mb-8">{confirmModal.message}</p>

                  <div className="grid grid-cols-2 gap-3 w-full">
                    <button
                        onClick={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
                        className="p-4 rounded-xl bg-slate-100 text-slate-600 font-black uppercase italic text-[10px] hover:bg-slate-200 transition-all"
                    >
                      Annuler
                    </button>
                    <button
                        onClick={confirmModal.onConfirm}
                        className="p-4 rounded-xl bg-red-600 text-white font-black uppercase italic text-[10px] hover:bg-red-700 shadow-lg shadow-red-200 transition-all"
                    >
                      Confirmer
                    </button>
                  </div>
                </div>
              </div>
            </div>
        )}

        <style jsx global>{`
          .custom-scrollbar::-webkit-scrollbar { width: 4px; }
          .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }

          @keyframes votePop {
            0% { transform: scale(1); }
            40% { transform: scale(1.02); }
            100% { transform: scale(1); }
          }
          .animate-vote-pop { animation: votePop 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); }

          @keyframes messageFlash {
            0% { background-color: rgba(220, 38, 38, 0.25); border-color: rgba(220, 38, 38, 0.4); }
            100% { background-color: rgba(255, 255, 255, 0.05); border-color: rgba(255, 255, 255, 0.05); }
          }
          .animate-message-flash { animation: messageFlash 1.5s ease-out forwards; }
        `}</style>
      </div>
  );
}