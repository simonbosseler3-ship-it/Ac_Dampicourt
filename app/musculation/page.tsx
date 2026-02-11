"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { createPortal } from "react-dom";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/app/context/authContext";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  User,
  AlertTriangle,
  LogIn,
  Info,
  ShieldCheck,
  ShieldAlert,
  Lock,
  Loader2,
  Plus
} from "lucide-react";
import {
  startOfWeek,
  addDays,
  format,
  isSameDay,
  setHours,
  setMinutes,
  addWeeks,
  subWeeks,
  isBefore,
  startOfDay
} from "date-fns";
import { fr } from "date-fns/locale";
import { Button } from "@/components/ui/button";

const MAX_CAPACITY = 8;
const OPENING_HOUR = 8;
const CLOSING_HOUR = 22;
const DAYS_TO_SHOW = 7;

export default function MusculationPage() {
  const { user, profile, loading: authLoading } = useAuth();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [reservations, setReservations] = useState<any[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean;
    type: "auth" | "confirm_delete" | "full" | "locked" | "forbidden";
    data?: any;
  }>({ isOpen: false, type: "auth" });

  // Calcul des dates de la semaine
  const startDate = useMemo(() => startOfWeek(currentDate, { weekStartsOn: 1 }), [currentDate]);
  const weekDays = useMemo(() => Array.from({ length: DAYS_TO_SHOW }).map((_, i) => addDays(startDate, i)), [startDate]);
  const timeSlots = useMemo(() => Array.from({ length: (CLOSING_HOUR - OPENING_HOUR) / 2 }, (_, i) => OPENING_HOUR + i * 2), []);

  // --- RÉCUPÉRATION DES RÉSERVATIONS ---
  const fetchReservations = useCallback(async () => {
    setDataLoading(true);
    const start = startDate.toISOString();
    const end = addDays(startDate, 7).toISOString();

    const { data, error } = await supabase
    .from('gym_reservations')
    .select('*')
    .gte('start_time', start)
    .lt('start_time', end);

    if (error) {
      console.error("Erreur resas:", error);
      return;
    }

    let allResas = data ? [...data] : [];

    // --- CRÉNEAUX RÉCURRENTS (Logique métier Club) ---
    const recurring = [
      { dayOffset: 0, hour: 18, name: "JACQUES LUCAS" },
      { dayOffset: 3, hour: 18, name: "GROUPE F. ALLARD" },
      { dayOffset: 5, hour: 10, name: "NICOLAS THOMAS" },
      { dayOffset: 6, hour: 10, name: "YVES HERMAN" },
    ];

    recurring.forEach(rec => {
      allResas.push({
        id: `recurrent-${rec.name.toLowerCase().replace(/\s/g, '-')}-${rec.dayOffset}`,
        full_name: rec.name,
        start_time: setMinutes(setHours(addDays(startDate, rec.dayOffset), rec.hour), 0).toISOString(),
        is_locked: true
      });
    });

    setReservations(allResas);
    setDataLoading(false);
  }, [startDate]);

  useEffect(() => {
    setMounted(true);
    fetchReservations();

    const channel = supabase
    .channel('schema-db-changes')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'gym_reservations' }, () => {
      fetchReservations();
    })
    .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [fetchReservations]);

  const handleSlotClick = async (slotDate: Date, myReservationId: string | null, currentCount: number, isLocked: boolean) => {
    // 1. Verrous de base
    if (isLocked) return setModalConfig({ isOpen: true, type: "locked" });
    if (!user) return setModalConfig({ isOpen: true, type: "auth" });

    // 2. Vérification Rôle
    const userRole = profile?.role?.toLowerCase().trim();
    if (!['athlete', 'redacteur', 'admin'].includes(userRole || '')) {
      return setModalConfig({ isOpen: true, type: "forbidden" });
    }

    // 3. Empêcher de réserver dans le passé (Optionnel mais recommandé)
    if (isBefore(slotDate, new Date()) && !isSameDay(slotDate, new Date())) {
      return;
    }

    // 4. Suppression
    if (myReservationId) {
      setModalConfig({ isOpen: true, type: "confirm_delete", data: { id: myReservationId } });
      return;
    }

    // 5. Capacité
    if (currentCount >= MAX_CAPACITY) {
      setModalConfig({ isOpen: true, type: "full" });
      return;
    }

    // 6. Insertion Optimistic
    try {
      const { error } = await supabase.from('gym_reservations').insert({
        user_id: user.id,
        full_name: profile?.full_name || "Membre",
        start_time: slotDate.toISOString()
      });
      if (error) throw error;
      fetchReservations();
    } catch (err) {
      alert("Erreur lors de la réservation.");
    }
  };

  const confirmDelete = async () => {
    if (modalConfig.data?.id) {
      await supabase.from('gym_reservations').delete().eq('id', modalConfig.data.id);
      setModalConfig({ isOpen: false, type: "auth" });
      fetchReservations();
    }
  };

  const renderModal = () => {
    if (!modalConfig.isOpen || !mounted) return null;
    const config = {
      auth: { icon: <LogIn className="h-8 w-8 text-red-600" />, title: "Identification", desc: "Connectez-vous pour accéder au planning de musculation.", btnText: "Se connecter", btnClass: "bg-red-600", action: () => (window.location.href = "/login") },
      confirm_delete: { icon: <AlertTriangle className="h-8 w-8 text-red-600" />, title: "Annuler la place ?", desc: "Voulez-vous vraiment libérer ce créneau ?", btnText: "Confirmer l'annulation", btnClass: "bg-red-600", action: confirmDelete },
      full: { icon: <Info className="h-8 w-8 text-slate-600" />, title: "Créneau Complet", desc: "La limite de 8 athlètes a été atteinte pour cette heure.", btnText: "D'accord", btnClass: "bg-slate-900", action: () => setModalConfig({ ...modalConfig, isOpen: false }) },
      locked: { icon: <ShieldCheck className="h-8 w-8 text-blue-600" />, title: "Entraînement Club", desc: "Ce créneau est réservé pour un groupe spécifique ou un entraîneur.", btnText: "Compris", btnClass: "bg-blue-600", action: () => setModalConfig({ ...modalConfig, isOpen: false }) },
      forbidden: { icon: <ShieldAlert className="h-8 w-8 text-orange-600" />, title: "Accès Refusé", desc: "Votre statut actuel ne permet pas la réservation en ligne.", btnText: "Fermer", btnClass: "bg-orange-600", action: () => setModalConfig({ ...modalConfig, isOpen: false }) }
    }[modalConfig.type];

    return createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md" onClick={() => setModalConfig({ ...modalConfig, isOpen: false })} />
          <div className="relative bg-white rounded-[2.5rem] p-10 max-w-sm w-full shadow-2xl text-center border border-white/20">
            <div className="bg-slate-50 p-6 rounded-3xl mb-6 inline-block">{config.icon}</div>
            <h3 className="text-2xl font-black italic uppercase text-slate-900 mb-3 tracking-tighter">{config.title}</h3>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest leading-relaxed mb-10">{config.desc}</p>
            <button onClick={config.action} className={`w-full py-5 rounded-2xl font-black uppercase italic tracking-widest text-white shadow-xl transition-all active:scale-95 ${config.btnClass}`}>
              {config.btnText}
            </button>
          </div>
        </div>, document.body
    );
  };

  return (
      <div className="min-h-screen">
        <main className="container mx-auto px-4 py-12 pt-32 pb-24 animate-in fade-in duration-1000">

          {/* HEADER ACD STYLE */}
          <div className="flex flex-col lg:flex-row justify-between items-center mb-16 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="h-[2px] w-10 bg-red-600"></span>
                <span className="text-red-600 font-black uppercase italic tracking-[0.3em] text-[10px]">Planning Salle</span>
              </div>
              <h1 className="text-6xl md:text-8xl font-black text-slate-900 uppercase italic tracking-tighter leading-[0.85]">
                MUSCU<span className="text-red-600">LATION</span>
              </h1>
            </div>

            <div className="flex flex-col items-center gap-4 bg-slate-50 p-6 rounded-[2rem] border border-slate-100 shadow-sm">
              <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Navigation Semaine</p>
              <div className="flex items-center gap-6">
                <button onClick={() => setCurrentDate(subWeeks(currentDate, 1))} className="p-3 bg-white hover:bg-red-600 hover:text-white rounded-xl shadow-sm transition-all active:scale-90">
                  <ChevronLeft size={20} />
                </button>
                <span className="font-black text-slate-900 uppercase italic text-xs tracking-tighter min-w-[180px] text-center">
                    {format(startDate, 'dd MMM', { locale: fr })} — {format(addDays(startDate, 6), 'dd MMM', { locale: fr })}
                </span>
                <button onClick={() => setCurrentDate(addWeeks(currentDate, 1))} className="p-3 bg-white hover:bg-red-600 hover:text-white rounded-xl shadow-sm transition-all active:scale-90">
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          </div>

          {/* GRILLE OU LOCK */}
          {authLoading ? (
              <div className="min-h-[500px] flex flex-col items-center justify-center bg-slate-50 rounded-[3.5rem] border-2 border-dashed border-slate-200">
                <Loader2 className="h-12 w-12 text-red-600 animate-spin mb-6" />
                <p className="text-slate-400 font-black uppercase italic text-[10px] tracking-[0.3em]">Ouverture des portes...</p>
              </div>
          ) : user ? (
              <div className="bg-white rounded-[3.5rem] shadow-[0_0_80px_rgba(0,0,0,0.05)] border border-slate-100 overflow-hidden transition-all">
                <div className="overflow-x-auto">
                  <div className="min-w-[1200px]">

                    {/* HEADERS JOURS */}
                    <div className="grid grid-cols-8 bg-slate-900 text-white">
                      <div className="p-8 bg-slate-950 flex flex-col items-center justify-center border-r border-white/5">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Heures</span>
                      </div>
                      {weekDays.map((day, i) => (
                          <div key={i} className={`p-8 text-center border-r border-white/5 transition-colors ${isSameDay(day, new Date()) ? 'bg-red-600' : ''}`}>
                            <div className="font-black uppercase italic text-sm tracking-tighter leading-none">{format(day, 'EEEE', { locale: fr })}</div>
                            <div className="text-[10px] uppercase font-bold opacity-40 mt-1 tracking-widest">{format(day, 'd MMMM', { locale: fr })}</div>
                          </div>
                      ))}
                    </div>

                    {/* SLOTS */}
                    <div className="divide-y divide-slate-100">
                      {timeSlots.map((hour) => (
                          <div key={hour} className="grid grid-cols-8 min-h-[180px]">
                            <div className="flex flex-col items-center justify-center bg-slate-50/50 border-r border-slate-100 font-black text-slate-300 text-[11px] italic">
                              <span>{hour}:00</span>
                              <div className="w-[1px] h-10 bg-slate-200 my-2"></div>
                              <span>{hour + 2}:00</span>
                            </div>

                            {weekDays.map((day, i) => {
                              const slotDate = setMinutes(setHours(day, hour), 0);
                              const slotResas = reservations.filter(r => {
                                const rDate = new Date(r.start_time);
                                return isSameDay(rDate, day) && rDate.getHours() === hour;
                              });
                              const myResa = slotResas.find(r => r.user_id === user?.id);
                              const isLockedSlot = slotResas.some(r => r.is_locked);
                              const isFull = slotResas.length >= MAX_CAPACITY || isLockedSlot;

                              return (
                                  <div key={i} className={`border-r border-slate-100 p-3 transition-colors ${isSameDay(day, new Date()) ? 'bg-slate-50/30' : ''}`}>
                                    <button
                                        disabled={dataLoading}
                                        onClick={() => handleSlotClick(slotDate, myResa?.id, slotResas.length, isLockedSlot)}
                                        className={`w-full h-full rounded-[2rem] p-5 flex flex-col transition-all duration-500 group relative
                                ${isLockedSlot ? 'bg-blue-600 text-white shadow-xl scale-[0.98]' :
                                            myResa ? 'bg-white ring-[6px] ring-red-600 shadow-2xl z-10' :
                                                isFull ? 'bg-slate-100/50 grayscale' : 'bg-white border-2 border-slate-50 hover:border-red-600 shadow-sm hover:shadow-xl'}
                              `}
                                    >
                                      <div className="flex justify-between items-center mb-4 w-full">
                                <span className={`text-[9px] font-black px-3 py-1 rounded-full ${isLockedSlot ? 'bg-blue-500 text-white' : myResa ? 'bg-red-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                                  {isLockedSlot ? 'PRÉVU' : `${slotResas.length} / ${MAX_CAPACITY}`}
                                </span>
                                        {isLockedSlot ? <ShieldCheck size={16} /> : myResa ? <User size={14} className="text-red-600" /> : <Plus size={14} className="text-slate-200 group-hover:text-red-600 transition-colors" />}
                                      </div>

                                      <div className="flex flex-col gap-1.5 w-full text-left">
                                        {slotResas.slice(0, 5).map(r => (
                                            <div key={r.id} className={`text-[9px] font-black truncate px-3 py-2 rounded-xl border ${
                                                r.is_locked ? 'bg-blue-500/50 border-blue-400 text-white' :
                                                    r.user_id === user?.id ? 'bg-red-50 border-red-100 text-red-600' : 'bg-white border-slate-100 text-slate-600'
                                            }`}>
                                              {r.full_name}
                                            </div>
                                        ))}
                                        {slotResas.length > 5 && (
                                            <div className="text-[8px] font-black text-slate-400 ml-2">+ {slotResas.length - 5} autres</div>
                                        )}
                                      </div>
                                    </button>
                                  </div>
                              );
                            })}
                          </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
          ) : (
              <div className="bg-slate-900 rounded-[4rem] p-16 md:p-24 shadow-2xl text-center flex flex-col items-center relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                  <div className="grid grid-cols-6 gap-4 rotate-12 scale-150">
                    {Array.from({length: 24}).map((_, i) => <div key={i} className="h-20 bg-white/20 rounded-2xl"></div>)}
                  </div>
                </div>
                <div className="bg-red-600 p-10 rounded-[2.5rem] mb-10 shadow-2xl relative z-10 group-hover:rotate-6 transition-transform">
                  <Lock size={60} className="text-white" />
                </div>
                <h2 className="text-4xl md:text-6xl font-black uppercase italic text-white mb-6 tracking-tighter relative z-10">Accès <span className="text-red-600">Réservé</span></h2>
                <p className="text-slate-400 max-w-sm mb-12 font-bold uppercase italic text-[11px] tracking-widest leading-relaxed relative z-10">Le planning interactif est exclusivement accessible aux athlètes</p>
                <Link href="/login" className="relative z-10">
                  <Button className="bg-white text-slate-900 font-black rounded-2xl px-14 py-8 uppercase italic tracking-widest shadow-2xl hover:bg-red-600 hover:text-white transition-all active:scale-95">Se connecter</Button>
                </Link>
              </div>
          )}
        </main>
        {renderModal()}
      </div>
  );
}