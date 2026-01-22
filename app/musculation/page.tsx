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
  Info
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

// --- CONFIGURATION ---
const MAX_CAPACITY = 8;
const OPENING_HOUR = 8;
const CLOSING_HOUR = 22;
const DAYS_TO_SHOW = 7;

export default function MusculationPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [reservations, setReservations] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  // État pour gérer la modale unique
  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean;
    type: "auth" | "confirm_delete" | "full";
    data?: any;
  }>({ isOpen: false, type: "auth" });

  useEffect(() => {
    setMounted(true);
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      fetchReservations(currentDate);
    };
    init();
  }, [currentDate]);

  const fetchReservations = async (dateRef: Date) => {
    setLoading(true);
    const start = startOfWeek(dateRef, { weekStartsOn: 1 });
    const end = addDays(start, 7);

    const { data, error } = await supabase
    .from('gym_reservations')
    .select('*')
    .gte('start_time', start.toISOString())
    .lt('start_time', end.toISOString());

    if (!error && data) setReservations(data);
    setLoading(false);
  };

  const handleSlotClick = async (slotDate: Date, myReservationId: string | null, currentCount: number) => {
    if (!user) {
      setModalConfig({ isOpen: true, type: "auth" });
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

  const processReservation = async (slotDate: Date) => {
    setLoading(true);
    const { data: profile } = await supabase.from('profiles').select('full_name').eq('id', user.id).single();
    const fullName = profile?.full_name || user.email;

    const { error } = await supabase.from('gym_reservations').insert({
      user_id: user.id,
      full_name: fullName,
      start_time: slotDate.toISOString()
    });

    if (!error) fetchReservations(currentDate);
    setLoading(false);
  };

  const confirmDelete = async () => {
    setLoading(true);
    const { error } = await supabase.from('gym_reservations').delete().eq('id', modalConfig.data.id);
    if (!error) {
      setModalConfig({ ...modalConfig, isOpen: false });
      fetchReservations(currentDate);
    }
    setLoading(false);
  };

  // --- RENDU DES MODALES ---
  const renderModal = () => {
    if (!modalConfig.isOpen || !mounted) return null;

    const config = {
      auth: {
        icon: <LogIn className="h-8 w-8 text-red-600" />,
        title: "Connexion requise",
        desc: "Tu dois être connecté pour réserver un créneau à la salle.",
        btnText: "Se connecter",
        btnClass: "bg-red-600 hover:bg-red-700",
        action: () => (window.location.href = "/login")
      },
      confirm_delete: {
        icon: <AlertTriangle className="h-8 w-8 text-red-600" />,
        title: "Annuler la séance ?",
        desc: "Veux-tu vraiment supprimer ta réservation pour ce créneau ?",
        btnText: "Confirmer l'annulation",
        btnClass: "bg-red-600 hover:bg-red-700",
        action: confirmDelete
      },
      full: {
        icon: <Info className="h-8 w-8 text-slate-600" />,
        title: "Créneau complet",
        desc: "Désolé, la limite de 8 athlètes est atteinte pour cette heure.",
        btnText: "D'accord",
        btnClass: "bg-slate-900 hover:bg-slate-800",
        action: () => setModalConfig({ ...modalConfig, isOpen: false })
      }
    }[modalConfig.type];

    return createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm" onClick={() => setModalConfig({ ...modalConfig, isOpen: false })} />
          <div className="relative bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex flex-col items-center text-center">
              <div className="bg-slate-50 p-4 rounded-full mb-4">{config.icon}</div>
              <h3 className="text-xl font-black italic uppercase text-slate-900 mb-2">{config.title}</h3>
              <p className="text-slate-500 text-sm mb-8">{config.desc}</p>
              <div className="flex flex-col gap-2 w-full">
                <button onClick={config.action} disabled={loading} className={`w-full py-4 rounded-xl font-bold text-white transition-all flex justify-center items-center ${config.btnClass}`}>
                  {loading ? <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : config.btnText}
                </button>
                {modalConfig.type !== "full" && (
                    <button onClick={() => setModalConfig({ ...modalConfig, isOpen: false })} className="w-full py-3 rounded-xl font-bold text-slate-400 hover:text-slate-600 transition-colors">Retour</button>
                )}
              </div>
            </div>
          </div>
        </div>,
        document.body
    );
  };

  // --- LOGIQUE CALENDRIER ---
  const startDate = startOfWeek(currentDate, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: DAYS_TO_SHOW }).map((_, i) => addDays(startDate, i));
  const hours = Array.from({ length: CLOSING_HOUR - OPENING_HOUR }).map((_, i) => OPENING_HOUR + i);

  return (
      <div className="min-h-screen">
        <Navbar/>
        <main className="container mx-auto px-4 py-12 pt-32">

          {/* EN-TÊTE */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
            <div className="text-center md:text-left">
              <h1 className="text-4xl font-black text-slate-900 uppercase italic">
                Salle de <span className="text-red-600">Musculation</span>
              </h1>
              <p className="text-slate-500 font-medium mt-2">Planning des réservations.</p>
            </div>

            <div
                className="flex items-center gap-4 bg-white p-2 rounded-full shadow-sm border border-slate-200">
              <button onClick={() => setCurrentDate(subWeeks(currentDate, 1))}
                      className="p-2 hover:bg-slate-100 rounded-full transition"><ChevronLeft/>
              </button>
              <span className="font-bold text-slate-900 uppercase min-w-[150px] text-center">
              {format(startDate, 'd MMM', {locale: fr})} - {format(addDays(startDate, 6), 'd MMM', {locale: fr})}
            </span>
              <button onClick={() => setCurrentDate(addWeeks(currentDate, 1))}
                      className="p-2 hover:bg-slate-100 rounded-full transition"><ChevronRight/>
              </button>
            </div>
          </div>

          {/* GRILLE */}
          <div
              className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden overflow-x-auto">
            <div className="min-w-[800px]">
              <div className="grid grid-cols-8 border-b border-slate-100 bg-slate-900 text-white">
                <div
                    className="p-4 font-black uppercase italic text-center text-xs flex items-center justify-center text-slate-400">Heures
                </div>
                {weekDays.map((day, i) => (
                    <div key={i}
                         className={`p-4 text-center ${isSameDay(day, new Date()) ? 'bg-red-600 text-white' : ''}`}>
                      <div
                          className="font-black uppercase text-sm">{format(day, 'EEE', {locale: fr})}</div>
                      <div className="text-xs opacity-70">{format(day, 'd MMM', {locale: fr})}</div>
                    </div>
                ))}
              </div>

              <div className="divide-y divide-slate-100">
                {hours.map((hour) => (
                    <div key={hour}
                         className="grid grid-cols-8 group hover:bg-slate-50 transition-colors">
                      <div
                          className="p-4 text-xs font-bold text-slate-400 border-r border-slate-100 flex items-center justify-center bg-slate-50/50">
                        {hour}h00 - {hour + 1}h00
                      </div>

                      {weekDays.map((day, i) => {
                        const slotDate = setMinutes(setHours(day, hour), 0);
                        const slotResas = reservations.filter(r => new Date(r.start_time).getTime() === slotDate.getTime());
                        const myResa = slotResas.find(r => r.user_id === user?.id);
                        const isFull = slotResas.length >= MAX_CAPACITY;

                        return (
                            <div key={i} className="border-r border-slate-100 p-2 relative h-24">
                              <button
                                  onClick={() => handleSlotClick(slotDate, myResa?.id, slotResas.length)}
                                  className={`w-full h-full rounded-xl flex flex-col items-center justify-center gap-1 transition-all duration-300
                            ${myResa ? 'bg-red-600 text-white shadow-lg' : isFull ? 'bg-slate-100 text-slate-300 cursor-not-allowed' : 'hover:bg-green-50 border border-transparent group-hover:border-slate-200'}
                          `}
                              >
                                {myResa ? (
                                    <>
                                      <User size={16} fill="currentColor"/>
                                      <span
                                          className="text-[10px] font-black uppercase">Inscrit</span>
                                    </>
                                ) : isFull ? (
                                    <span
                                        className="text-[10px] font-black uppercase">Complet</span>
                                ) : (
                                    <span
                                        className="text-[10px] font-bold text-slate-300 uppercase opacity-0 group-hover:opacity-100 text-green-600">S'inscrire</span>
                                )}
                                <div
                                    className="absolute top-2 right-2 text-[9px] font-black opacity-50">{slotResas.length}/{MAX_CAPACITY}</div>
                              </button>

                              {slotResas.length > 0 && (
                                  <div
                                      className="absolute z-20 bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block w-48 bg-slate-900 text-white p-3 rounded-xl shadow-xl pointer-events-none">
                                    <p className="text-[10px] font-bold uppercase text-slate-400 mb-2 border-b border-slate-700 pb-1">Athlètes</p>
                                    <ul className="space-y-1">
                                      {slotResas.map(r => (
                                          <li key={r.id}
                                              className="text-xs truncate flex items-center gap-2">
                                            <span
                                                className="w-1 h-1 bg-red-600 rounded-full"></span> {r.full_name}
                                          </li>
                                      ))}
                                    </ul>
                                  </div>
                              )}
                            </div>
                        );
                      })}
                    </div>
                ))}
              </div>
            </div>
          </div>

          <div
              className="flex gap-6 justify-center mt-8 text-xs font-bold uppercase text-slate-500">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-white border border-slate-200"></div>
              Libre
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-red-600"></div>
              Moi
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-slate-200"></div>
              Complet
            </div>
          </div>
        </main>

        {renderModal()}
      </div>
  );
}