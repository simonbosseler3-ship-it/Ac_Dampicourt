"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Navbar } from "@/components/navbar/navbar";
import { supabase } from "@/lib/supabase";
import {
  ChevronLeft,
  ChevronRight,
  User,
  AlertTriangle,
  LogIn,
  Info,
  ShieldCheck,
  ShieldAlert
} from "lucide-react";
import {
  startOfWeek,
  addDays,
  format,
  addWeeks,
  subWeeks,
  isSameDay,
  setHours,
  setMinutes
} from "date-fns";
import { fr } from "date-fns/locale";

const MAX_CAPACITY = 8;
const OPENING_HOUR = 8;
const CLOSING_HOUR = 22;
const DAYS_TO_SHOW = 7;

export default function MusculationPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [reservations, setReservations] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean;
    type: "auth" | "confirm_delete" | "full" | "locked" | "forbidden";
    data?: any;
  }>({ isOpen: false, type: "auth" });

  const startDate = startOfWeek(currentDate, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: DAYS_TO_SHOW }).map((_, i) => addDays(startDate, i));
  const timeSlots = [];
  for (let h = OPENING_HOUR; h < CLOSING_HOUR; h += 2) {
    timeSlots.push(h);
  }

  useEffect(() => {
    setMounted(true);
    const init = async () => {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (authUser) {
        setUser(authUser);
        const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', authUser.id)
        .single();
        setUserRole(profile?.role || null);
      }
      fetchReservations(currentDate);
    };

    init();

    const channel = supabase
    .channel(`table-db-changes-${currentDate.getTime()}`)
    .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'gym_reservations' },
        () => {
          fetchReservations(currentDate);
        }
    )
    .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentDate]);

  const fetchReservations = async (dateRef: Date) => {
    const start = startOfWeek(dateRef, { weekStartsOn: 1 });
    const end = addDays(start, 7);

    const { data, error } = await supabase
    .from('gym_reservations')
    .select('*')
    .gte('start_time', start.toISOString())
    .lt('start_time', end.toISOString());

    if (error) return;

    let allResas = data ? [...data] : [];

    // --- CRÉNEAUX RÉCURRENTS VERROUILLÉS ---

    // 1. GROUPE F. ALLARD (Jeudi 18h-20h)
    const thursday = addDays(start, 3);
    allResas.push({
      id: `recurrent-allard`,
      full_name: "GROUPE F. ALLARD",
      start_time: setMinutes(setHours(thursday, 18), 0).toISOString(),
      is_locked: true
    });

    // 2. GROUPE NICOLAS THOMAS (Samedi 10h-12h)
    const saturday = addDays(start, 5);
    allResas.push({
      id: `recurrent-nicolas-thomas`,
      full_name: "NICOLAS THOMAS",
      start_time: setMinutes(setHours(saturday, 10), 0).toISOString(),
      is_locked: true
    });

    // 3. GROUPE YVES HERMAN (Dimanche 10h-12h)
    const sunday = addDays(start, 6);
    allResas.push({
      id: `recurrent-yves-herman`,
      full_name: "YVES HERMAN",
      start_time: setMinutes(setHours(sunday, 10), 0).toISOString(),
      is_locked: true
    });

    setReservations(allResas);
  };

  const processReservation = async (slotDate: Date) => {
    const { data: profile } = await supabase
    .from('profiles')
    .select('full_name')
    .eq('id', user.id)
    .single();

    const fullName = profile?.full_name || user.email;

    await supabase.from('gym_reservations').insert({
      user_id: user.id,
      full_name: fullName,
      start_time: slotDate.toISOString()
    });
  };

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
    if (!userRole || !allowedRoles.includes(userRole.toLowerCase())) {
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
    await processReservation(slotDate);
  };

  const confirmDelete = async () => {
    await supabase.from('gym_reservations').delete().eq('id', modalConfig.data.id);
    setModalConfig({ ...modalConfig, isOpen: false });
  };

  const renderModal = () => {
    if (!modalConfig.isOpen || !mounted) return null;
    const config = {
      auth: { icon: <LogIn className="h-8 w-8 text-red-600" />, title: "Connexion requise", desc: "Connecte-toi pour réserver.", btnText: "Se connecter", btnClass: "bg-red-600", action: () => (window.location.href = "/login") },
      confirm_delete: { icon: <AlertTriangle className="h-8 w-8 text-red-600" />, title: "Annuler ?", desc: "Libérer ta place ?", btnText: "Confirmer", btnClass: "bg-red-600", action: confirmDelete },
      full: { icon: <Info className="h-8 w-8 text-slate-600" />, title: "Complet", desc: "La limite de 8 personnes est atteinte.", btnText: "Fermer", btnClass: "bg-slate-900", action: () => setModalConfig({ ...modalConfig, isOpen: false }) },
      locked: { icon: <ShieldCheck className="h-8 w-8 text-blue-600" />, title: "Créneau réservé", desc: "Ce créneau est réservé pour un entraînement de groupe spécifique.", btnText: "Compris", btnClass: "bg-blue-600", action: () => setModalConfig({ ...modalConfig, isOpen: false }) },
      forbidden: { icon: <ShieldAlert className="h-8 w-8 text-orange-600" />, title: "Accès restreint", desc: "Seuls les athlètes et rédacteurs peuvent réserver un créneau.", btnText: "J'ai compris", btnClass: "bg-orange-600", action: () => setModalConfig({ ...modalConfig, isOpen: false }) }
    }[modalConfig.type];

    return createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm" onClick={() => setModalConfig({ ...modalConfig, isOpen: false })} />
          <div className="relative bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl text-center animate-in zoom-in duration-200">
            <div className="bg-slate-50 p-4 rounded-full mb-4 inline-block">{config.icon}</div>
            <h3 className="text-xl font-black italic uppercase text-slate-900 mb-2">{config.title}</h3>
            <p className="text-slate-500 text-sm mb-8 leading-relaxed">{config.desc}</p>
            <button onClick={config.action} className={`w-full py-4 rounded-xl font-bold text-white transition-all shadow-lg ${config.btnClass}`}>{config.btnText}</button>
          </div>
        </div>, document.body
    );
  };

  return (
      <div className="min-h-screen">
        <Navbar/>
        <main className="container mx-auto px-4 py-12 pt-32">
          <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
            <div>
              <h1 className="text-4xl font-black text-slate-900 uppercase italic tracking-tighter leading-none">
                Salle de <span className="text-red-600">Muscu</span>
              </h1>
              <p className="text-slate-500 font-bold text-xs mt-2 uppercase tracking-[0.2em]">Accès réservé membres ACD</p>
            </div>
            <div className="flex items-center gap-3 bg-white p-2 rounded-2xl shadow-sm border border-slate-200">
              <button onClick={() => setCurrentDate(subWeeks(currentDate, 1))} className="p-2 hover:bg-slate-100 rounded-xl transition">
                <ChevronLeft size={20}/>
              </button>
              <span className="font-black text-slate-900 uppercase text-[11px] w-44 text-center">
                {format(startDate, 'd MMM', {locale: fr})} — {format(addDays(startDate, 6), 'd MMM', {locale: fr})}
              </span>
              <button onClick={() => setCurrentDate(addWeeks(currentDate, 1))} className="p-2 hover:bg-slate-100 rounded-xl transition">
                <ChevronRight size={20}/>
              </button>
            </div>
          </div>

          <div className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden">
            <div className="overflow-x-auto">
              <div className="min-w-[1100px]">
                <div className="grid grid-cols-8 bg-slate-900 text-white">
                  <div className="p-6 border-r border-white/5 flex items-center justify-center bg-slate-950 italic text-[10px] font-black text-slate-600 uppercase tracking-widest">Temps</div>
                  {weekDays.map((day, i) => (
                      <div key={i} className={`p-6 text-center border-r border-white/5 ${isSameDay(day, new Date()) ? 'bg-red-600 shadow-inner' : ''}`}>
                        <div className="font-black uppercase text-xs tracking-tighter">{format(day, 'EEEE', {locale: fr})}</div>
                        <div className="text-[10px] uppercase font-bold opacity-40 mt-1">{format(day, 'd MMMM', {locale: fr})}</div>
                      </div>
                  ))}
                </div>

                <div className="divide-y divide-slate-100">
                  {timeSlots.map((hour) => (
                      <div key={hour} className="grid grid-cols-8 min-h-[160px]">
                        <div className="flex flex-col items-center justify-center bg-slate-50/80 border-r border-slate-100 font-black text-slate-400 text-[10px] italic py-4">
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
                          const myResa = user ? slotResas.find(r => r.user_id === user.id) : null;
                          const isLockedSlot = slotResas.some(r => r.is_locked);
                          const isFull = slotResas.length >= MAX_CAPACITY || isLockedSlot;

                          const canUserReserve = userRole && ['athlete', 'redacteur', 'admin'].includes(userRole.toLowerCase());

                          return (
                              <div key={i} className="border-r border-slate-100 p-2 relative group hover:bg-slate-50/30 transition-colors">
                                <button
                                    onClick={() => handleSlotClick(slotDate, myResa?.id, slotResas.length, isLockedSlot)}
                                    className={`w-full h-full rounded-2xl p-4 flex flex-col transition-all duration-300 relative overflow-hidden
                                      ${isLockedSlot ? 'bg-blue-600 shadow-lg shadow-blue-200/50 z-10 scale-[1.02]' :
                                        myResa ? 'bg-white ring-4 ring-red-600 shadow-xl z-20' :
                                            isFull ? 'bg-slate-100 cursor-not-allowed opacity-60' :
                                                'bg-white border border-slate-100 shadow-sm hover:border-red-200 hover:shadow-md'}
                                    `}
                                >
                                  <div className="flex justify-between items-center mb-3 w-full">
                                    <span className={`text-[9px] font-black px-2 py-0.5 rounded-full ${isLockedSlot ? 'bg-blue-500 text-white' : myResa ? 'bg-red-600 text-white' : isFull ? 'bg-slate-200 text-slate-500' : 'bg-slate-100 text-slate-600'}`}>
                                      {isLockedSlot ? 'RÉSERVÉ' : `${slotResas.length} / ${MAX_CAPACITY}`}
                                    </span>
                                    {isLockedSlot && <ShieldCheck size={14} className="text-white"/>}
                                    {!isLockedSlot && myResa && <User size={12} className="text-red-600" fill="currentColor"/>}
                                  </div>
                                  <div className="flex flex-col gap-2 w-full text-left overflow-y-auto no-scrollbar">
                                    {slotResas.map(r => (
                                        <div key={r.id} className={`text-[10px] font-black truncate px-3 py-2 rounded-lg border shadow-sm
                                          ${r.is_locked ? 'bg-blue-500 text-white border-blue-400' :
                                            myResa && r.user_id === user?.id ? 'bg-red-600 text-white border-red-500' :
                                                'bg-white text-slate-800 border-l-4 border-l-red-600 border-slate-100 shadow-sm'}
                                        `}>
                                          {r.full_name}
                                        </div>
                                    ))}
                                    {!isFull && !myResa && !isLockedSlot && canUserReserve && (
                                        <div className="mt-2 text-center opacity-0 group-hover:opacity-100 transition-opacity">
                                          <span className="text-[8px] font-black uppercase text-red-600 tracking-tighter underline underline-offset-4">+ Réserver ma place</span>
                                        </div>
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
        </main>
        {renderModal()}
      </div>
  );
}