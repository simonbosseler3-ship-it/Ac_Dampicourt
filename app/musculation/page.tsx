"use client";

import { useState, useEffect, useCallback } from "react";
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
  Loader2
} from "lucide-react";
import {
  startOfWeek,
  addDays,
  format,
  isSameDay,
  setHours,
  setMinutes,
  addWeeks,
  subWeeks
} from "date-fns";
import { fr } from "date-fns/locale";
import { Button } from "@/components/ui/button";

const MAX_CAPACITY = 8;
const OPENING_HOUR = 8;
const CLOSING_HOUR = 22;
const DAYS_TO_SHOW = 7;

export default function MusculationPage() {
  const { user, profile, loading: authLoading } = useAuth(); // Accès instantané
  const [currentDate, setCurrentDate] = useState(new Date());
  const [reservations, setReservations] = useState<any[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean;
    type: "auth" | "confirm_delete" | "full" | "locked" | "forbidden";
    data?: any;
  }>({ isOpen: false, type: "auth" });

  const startDate = startOfWeek(currentDate, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: DAYS_TO_SHOW }).map((_, i) => addDays(startDate, i));
  const timeSlots = Array.from({ length: (CLOSING_HOUR - OPENING_HOUR) / 2 }, (_, i) => OPENING_HOUR + i * 2);

  // --- RÉCUPÉRATION DES RÉSERVATIONS ---
  const fetchReservations = useCallback(async (dateRef: Date) => {
    // On ne fetch que si l'utilisateur est potentiellement connecté
    const start = startOfWeek(dateRef, { weekStartsOn: 1 });
    const end = addDays(start, 7);

    const { data, error } = await supabase
    .from('gym_reservations')
    .select('*')
    .gte('start_time', start.toISOString())
    .lt('start_time', end.toISOString());

    if (error) return;

    let allResas = data ? [...data] : [];

    // --- CRÉNEAUX RÉCURRENTS ---
    const recurring = [
      { dayOffset: 0, hour: 18, name: "JACQUES LUCAS" },
      { dayOffset: 3, hour: 18, name: "GROUPE F. ALLARD" },
      { dayOffset: 5, hour: 10, name: "NICOLAS THOMAS" },
      { dayOffset: 6, hour: 10, name: "YVES HERMAN" },
    ];

    recurring.forEach(rec => {
      allResas.push({
        id: `recurrent-${rec.name.toLowerCase().replace(/\s/g, '-')}`,
        full_name: rec.name,
        start_time: setMinutes(setHours(addDays(start, rec.dayOffset), rec.hour), 0).toISOString(),
        is_locked: true
      });
    });

    setReservations(allResas);
    setDataLoading(false);
  }, []);

  // --- INITIALISATION ---
  useEffect(() => {
    setMounted(true);
    if (!authLoading) {
      fetchReservations(currentDate);
    }

    const channel = supabase
    .channel(`gym-changes-${currentDate.getTime()}`)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'gym_reservations' }, () => {
      fetchReservations(currentDate);
    })
    .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [currentDate, fetchReservations, authLoading]);

  const handleSlotClick = async (slotDate: Date, myReservationId: string | null, currentCount: number, isLocked: boolean) => {
    if (isLocked) {
      setModalConfig({ isOpen: true, type: "locked" });
      return;
    }
    if (!user) {
      setModalConfig({ isOpen: true, type: "auth" });
      return;
    }

    const allowedRoles = ['athlete', 'redacteur', 'admin'];
    const userRole = profile?.role?.toLowerCase().trim();
    if (!userRole || !allowedRoles.includes(userRole)) {
      setModalConfig({ isOpen: true, type: "forbidden" });
      return;
    }

    if (myReservationId) {
      setModalConfig({ isOpen: true, type: "confirm_delete", data: { id: myReservationId } });
      return;
    }
    if (currentCount >= MAX_CAPACITY) {
      setModalConfig({ isOpen: true, type: "full" });
      return;
    }

    // Traitement réservation immédiat
    await supabase.from('gym_reservations').insert({
      user_id: user.id,
      full_name: profile?.full_name || user.email,
      start_time: slotDate.toISOString()
    });
  };

  const confirmDelete = async () => {
    if (modalConfig.data?.id) {
      await supabase.from('gym_reservations').delete().eq('id', modalConfig.data.id);
      setModalConfig({ ...modalConfig, isOpen: false });
    }
  };

  const renderModal = () => {
    if (!modalConfig.isOpen || !mounted) return null;
    const config = {
      auth: { icon: <LogIn className="h-8 w-8 text-red-600" />, title: "Connexion requise", desc: "La réservation est réservée aux membres de l'AC Dampicourt.", btnText: "Se connecter", btnClass: "bg-red-600", action: () => (window.location.href = "/login") },
      confirm_delete: { icon: <AlertTriangle className="h-8 w-8 text-red-600" />, title: "Annuler ?", desc: "Libérer ta place pour ce créneau ?", btnText: "Confirmer", btnClass: "bg-red-600", action: confirmDelete },
      full: { icon: <Info className="h-8 w-8 text-slate-600" />, title: "Complet", desc: "La limite de 8 personnes est atteinte.", btnText: "Fermer", btnClass: "bg-slate-900", action: () => setModalConfig({ ...modalConfig, isOpen: false }) },
      locked: { icon: <ShieldCheck className="h-8 w-8 text-blue-600" />, title: "Créneau réservé", desc: "Ce créneau est réservé pour un entraînement spécifique.", btnText: "Compris", btnClass: "bg-blue-600", action: () => setModalConfig({ ...modalConfig, isOpen: false }) },
      forbidden: { icon: <ShieldAlert className="h-8 w-8 text-orange-600" />, title: "Accès restreint", desc: "Seuls les membres actifs peuvent réserver.", btnText: "J'ai compris", btnClass: "bg-orange-600", action: () => setModalConfig({ ...modalConfig, isOpen: false }) }
    }[modalConfig.type];

    return createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm" onClick={() => setModalConfig({ ...modalConfig, isOpen: false })} />
          <div className="relative bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl text-center animate-in zoom-in duration-200">
            <div className="bg-slate-50 p-4 rounded-full mb-4 inline-block">{config.icon}</div>
            <h3 className="text-xl font-black italic uppercase text-slate-900 mb-2">{config.title}</h3>
            <p className="text-slate-500 text-sm mb-8">{config.desc}</p>
            <button onClick={config.action} className={`w-full py-4 rounded-xl font-bold text-white transition-all ${config.btnClass}`}>{config.btnText}</button>
          </div>
        </div>, document.body
    );
  };

  return (
      <div className="min-h-screen bg-transparent">
        <main className="container mx-auto px-4 py-12 pt-32 animate-in fade-in duration-500">

          {/* HEADER */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
            <div>
              <h1 className="text-4xl font-black text-slate-900 uppercase italic tracking-tighter leading-none">
                Salle de <span className="text-red-600">Muscu</span>
              </h1>
              <p className="text-slate-500 font-bold text-xs mt-2 uppercase tracking-[0.2em]">Accès réservé membres ACD</p>
            </div>

            <div className="flex items-center gap-3 bg-white/80 backdrop-blur-sm p-2 rounded-2xl shadow-sm border border-slate-200">
              <button onClick={() => setCurrentDate(subWeeks(currentDate, 1))} className="p-2 hover:bg-slate-100 rounded-xl transition">
                <ChevronLeft size={20} />
              </button>
              <span className="font-black text-slate-900 uppercase text-[11px] w-44 text-center">
              {format(startDate, 'd MMM', { locale: fr })} — {format(addDays(startDate, 6), 'd MMM', { locale: fr })}
            </span>
              <button onClick={() => setCurrentDate(addWeeks(currentDate, 1))} className="p-2 hover:bg-slate-100 rounded-xl transition">
                <ChevronRight size={20} />
              </button>
            </div>
          </div>

          {/* CONTENU PRINCIPAL */}
          {authLoading ? (
              <div className="min-h-[500px] flex flex-col items-center justify-center bg-white/50 backdrop-blur-sm rounded-[2.5rem] border border-slate-100">
                <Loader2 className="h-12 w-12 text-red-600 animate-spin mb-4" />
                <p className="text-slate-400 font-black uppercase italic text-xs tracking-widest">Vérification de vos accès...</p>
              </div>
          ) : user ? (
              <div className="bg-white/90 backdrop-blur-sm rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto">
                  <div className="min-w-[1100px]">
                    {/* JOURS */}
                    <div className="grid grid-cols-8 bg-slate-900 text-white">
                      <div className="p-6 bg-slate-950 italic text-[10px] font-black text-slate-600 uppercase tracking-widest flex items-center justify-center border-r border-white/5">Heures</div>
                      {weekDays.map((day, i) => (
                          <div key={i} className={`p-6 text-center border-r border-white/5 ${isSameDay(day, new Date()) ? 'bg-red-600' : ''}`}>
                            <div className="font-black uppercase text-xs">{format(day, 'EEEE', { locale: fr })}</div>
                            <div className="text-[10px] uppercase font-bold opacity-40">{format(day, 'd MMM', { locale: fr })}</div>
                          </div>
                      ))}
                    </div>

                    {/* GRILLE HORAIRE */}
                    <div className="divide-y divide-slate-100">
                      {timeSlots.map((hour) => (
                          <div key={hour} className="grid grid-cols-8 min-h-[160px]">
                            <div className="flex flex-col items-center justify-center bg-slate-50/50 border-r border-slate-100 font-black text-slate-400 text-[10px] italic">
                              <span>{hour}H00</span>
                              <div className="w-px h-8 bg-slate-200 my-1"></div>
                              <span>{hour + 2}H00</span>
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
                                  <div key={i} className="border-r border-slate-100 p-2 group hover:bg-slate-50/30 transition-colors">
                                    <button
                                        onClick={() => handleSlotClick(slotDate, myResa?.id, slotResas.length, isLockedSlot)}
                                        className={`w-full h-full rounded-2xl p-4 flex flex-col transition-all duration-300 relative
                                ${isLockedSlot ? 'bg-blue-600 text-white shadow-lg' :
                                            myResa ? 'bg-white ring-4 ring-red-600 shadow-xl' :
                                                isFull ? 'bg-slate-100 opacity-60' : 'bg-white border border-slate-100 hover:border-red-200 shadow-sm'}
                              `}
                                    >
                                      <div className="flex justify-between items-center mb-3 w-full">
                                <span className={`text-[9px] font-black px-2 py-0.5 rounded-full ${isLockedSlot ? 'bg-blue-500' : myResa ? 'bg-red-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                                  {isLockedSlot ? 'RÉSERVÉ' : `${slotResas.length} / ${MAX_CAPACITY}`}
                                </span>
                                        {isLockedSlot && <ShieldCheck size={14} />}
                                        {myResa && !isLockedSlot && <User size={12} className="text-red-600" />}
                                      </div>

                                      <div className="flex flex-col gap-1 w-full text-left overflow-y-auto no-scrollbar">
                                        {slotResas.map(r => (
                                            <div key={r.id} className={`text-[9px] font-black truncate px-2 py-1.5 rounded border ${
                                                r.is_locked ? 'bg-blue-500 border-blue-400 text-white' :
                                                    r.user_id === user?.id ? 'bg-red-500 border-red-400 text-white' : 'bg-white border-slate-100'
                                            }`}>
                                              {r.full_name}
                                            </div>
                                        ))}
                                        {!isFull && !myResa && (
                                            <span className="text-[8px] font-black uppercase text-red-600 opacity-0 group-hover:opacity-100 mt-2">+ Réserver</span>
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
              <div className="bg-white/80 backdrop-blur-sm rounded-[2.5rem] p-12 md:p-20 shadow-xl border border-slate-100 text-center flex flex-col items-center">
                <div className="bg-red-50 p-8 rounded-full mb-8"><Lock size={60} className="text-red-600" /></div>
                <h2 className="text-3xl font-black uppercase italic text-slate-900 mb-4">Accès Privé</h2>
                <p className="text-slate-500 max-w-lg mb-10 font-bold uppercase text-xs tracking-widest">Le planning est réservé aux membres de l'AC Dampicourt.</p>
                <Link href="/login">
                  <Button className="bg-red-600 text-white font-black rounded-2xl px-12 py-7 uppercase italic shadow-2xl active:scale-95 transition-transform">Se connecter</Button>
                </Link>
              </div>
          )}
        </main>
        {renderModal()}
      </div>
  );
}