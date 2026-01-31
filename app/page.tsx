"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/app/context/authContext";
import { HeroNews } from "@/components/carousel/news";
import Link from "next/link";
import {
  Timer,
  Trophy,
  CalendarCheck,
  ChevronRight,
  HelpCircle,
  MessageSquare,
  ArrowUpRight
} from "lucide-react";
import { TutorialOverlay } from "@/components/tutorial/tutorial";

export default function Home() {
  const { user, profile, loading: authLoading } = useAuth();
  const [news, setNews] = useState<any[]>([]);
  const [latestEvent, setLatestEvent] = useState<any>(null);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    async function fetchHomeData() {
      try {
        // 1. News
        const newsPromise = supabase
        .from('news')
        .select('*')
        .eq('is_hidden', false)
        .order('date_text', { ascending: false })
        .limit(3);

        // 2. Événement le plus récent (updated_at ou created_at) qui n'est pas caché
        const eventPromise = supabase
        .from('competition_config')
        .select('title')
        .neq('hidden', true)
        .order('updated_at', { ascending: false })
        .limit(1);

        const [newsRes, eventRes] = await Promise.all([newsPromise, eventPromise]);

        if (newsRes.error) throw newsRes.error;
        setNews(newsRes.data || []);

        if (eventRes.data && eventRes.data.length > 0) {
          setLatestEvent(eventRes.data[0]);
        } else {
          setLatestEvent(null);
        }

        if (eventRes.error) console.error("Erreur event:", eventRes.error);

      } catch (err) {
        console.error("Erreur chargement données accueil:", err);
      } finally {
        setDataLoading(false);
      }
    }

    fetchHomeData();
  }, []);

  return (
      <main className="container mx-auto px-4 pt-10 pb-12 animate-in fade-in duration-700">

        {/* POP-UP TUTORIEL */}
        {!authLoading && user && profile && !profile.has_seen_tutorial && (
            <TutorialOverlay
                role={profile.role}
                userId={user.id}
                userName={profile.full_name || "Athlète"}
            />
        )}

        {/* CAROUSEL */}
        <div className="mb-10 min-h-[400px]">
          {dataLoading ? (
              <div className="w-full h-[400px] bg-slate-200/50 animate-pulse rounded-[3rem] flex items-center justify-center">
                <span className="text-slate-400 font-black uppercase italic">Chargement de l'actu...</span>
              </div>
          ) : (
              <HeroNews newsData={news} />
          )}
        </div>

        {/* SECTION LIENS PRINCIPAUX */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 px-2 mb-10">

          {/* CARTE 1 : RECORDS DU CLUB */}
          <Link href="/infos/records" className="group relative h-48 rounded-[2.5rem] bg-white/80 backdrop-blur-sm border-2 border-slate-100 hover:border-slate-900 overflow-hidden transition-all duration-500 hover:shadow-2xl">
            <div className="absolute inset-0 bg-slate-900 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out z-0"></div>
            <div className="absolute -bottom-6 -left-6 text-slate-100 group-hover:text-slate-800 transition-colors duration-500 z-0 group-hover:scale-125 group-hover:rotate-12 transition-transform origin-bottom-left">
              <Trophy size={140} strokeWidth={0.5} />
            </div>
            <div className="relative z-10 h-full flex flex-col justify-between p-8">
              <div className="flex justify-between items-start">
                <div className="bg-slate-100 p-3 rounded-2xl group-hover:bg-white/10 transition-colors">
                  <Trophy className="text-slate-900 group-hover:text-white" size={24} />
                </div>
                <div className="opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500">
                  <ArrowUpRight className="text-white" size={28} />
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-black text-slate-900 uppercase italic tracking-tighter group-hover:text-white transition-colors">Records Club</h3>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-1">Historique & Performance</p>
              </div>
            </div>
          </Link>

          {/* CARTE 2 : INSCRIPTIONS */}
          <Link href="/inscription" className="group relative h-48 rounded-[2.5rem] bg-red-600 border-2 border-red-600 overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-red-200 hover:-translate-y-1">
            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
            <div className="absolute top-1/2 -translate-y-1/2 right-[-2rem] text-black/10 group-hover:text-white/20 z-0 transition-transform group-hover:scale-110">
              <CalendarCheck size={160} strokeWidth={1} />
            </div>
            <div className="relative z-10 h-full flex flex-col justify-between p-8">
              <div className="bg-black/20 p-3 rounded-2xl w-fit group-hover:bg-white text-white group-hover:text-red-600 transition-all">
                <CalendarCheck size={24} />
              </div>
              <div>
                <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter group-hover:translate-x-1 transition-transform">Inscriptions</h3>
                <div className="flex items-center gap-2 mt-2">
                  <div className="h-0.5 w-6 bg-white/50 group-hover:w-12 group-hover:bg-white transition-all"></div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-red-100">Meetings</p>
                </div>
              </div>
            </div>
          </Link>

          {/* CARTE 3 : ÉVÉNEMENT DYNAMIQUE (Speed Night etc) */}
          <Link href="/speed-night" className="group relative h-48 rounded-[2.5rem] bg-white/80 backdrop-blur-sm border-2 border-slate-100 hover:border-red-600 overflow-hidden transition-all duration-500 hover:shadow-2xl">
            <div className="absolute inset-0 bg-red-600 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out z-0"></div>
            <div className="absolute -top-6 -right-6 text-slate-100 group-hover:text-red-700 z-0 group-hover:scale-125 group-hover:-rotate-12 transition-transform origin-top-right">
              <Timer size={140} strokeWidth={0.5} />
            </div>
            <div className="relative z-10 h-full flex flex-col justify-between p-8">
              <div className="flex justify-between items-start">
                <div className="bg-slate-100 p-3 rounded-2xl group-hover:bg-white/20 transition-colors">
                  <Timer className="text-slate-900 group-hover:text-white" size={24} />
                </div>
                <div className="opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500">
                  <ArrowUpRight className="text-white" size={28} />
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-black text-slate-900 uppercase italic tracking-tighter group-hover:text-white transition-colors line-clamp-1">
                  {latestEvent ? latestEvent.title : "Événement"}
                </h3>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 group-hover:text-red-200 mt-1">
                  {latestEvent ? "Événement Majeur" : "Bientôt de retour"}
                </p>
              </div>
            </div>
          </Link>
        </section>

        {/* SECTION : FORUM */}
        <section className="px-2">
          <Link href="/forum" className="group block w-full bg-white/80 backdrop-blur-sm border-2 border-slate-100 rounded-[2.5rem] p-8 hover:border-red-600 transition-all duration-300 shadow-sm hover:shadow-xl relative overflow-hidden">
            <div className="absolute -right-10 -bottom-10 text-slate-50 group-hover:text-red-50 transition-colors duration-500 -rotate-12">
              <MessageSquare size={200} strokeWidth={1} />
            </div>
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center gap-6">
                <div className="bg-red-600 p-4 rounded-2xl shadow-lg shadow-red-200 group-hover:scale-110 transition-transform">
                  <HelpCircle className="text-white" size={32} />
                </div>
                <div>
                  <h2 className="text-2xl font-black uppercase italic tracking-tighter text-slate-900">Une question ? <span className="text-red-600">Le Forum ACD</span></h2>
                  <p className="text-slate-500 font-medium max-w-md">Besoin d'aide pour une inscription ou d'infos sur les entraînements ?</p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-slate-900 text-white px-8 py-4 rounded-2xl font-black uppercase italic tracking-widest text-sm group-hover:bg-red-600 transition-colors shadow-lg">
                Accéder au forum <ChevronRight size={20} />
              </div>
            </div>
          </Link>
        </section>
      </main>
  );
}