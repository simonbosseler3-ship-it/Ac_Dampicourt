import { HeroNews } from "@/components/carousel/news";
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import Link from "next/link";
import { Timer, Trophy, CalendarCheck, ChevronRight, HelpCircle, MessageSquare, ArrowUpRight } from "lucide-react";
import { TutorialOverlay } from "@/components/tutorial/tutorial";

export default async function Home() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { cookies: { getAll() { return cookieStore.getAll() } } }
  );

  // 1. Récupération de l'utilisateur et de son profil
  const { data: { user } } = await supabase.auth.getUser();
  let profile = null;

  if (user) {
    const { data } = await supabase
    .from('profiles')
    .select('role, has_seen_tutorial, full_name')
    .eq('id', user.id)
    .single();
    profile = data;
  }

  // 2. Récupération des actualités (les 3 dernières)
  const { data: news } = await supabase
  .from('news')
  .select('*')
  .eq('is_hidden', false)
  .order('date_text', { ascending: false })
  .limit(3);

  return (
      <main className="container mx-auto px-4 pt-10 pb-12">

        {/* POP-UP TUTORIEL PERSONNALISÉ */}
        {user && profile && !profile.has_seen_tutorial && (
            <TutorialOverlay
                role={profile.role}
                userId={user.id}
                userName={profile.full_name || "Athlète"}
            />
        )}

        {/* CAROUSEL */}
        <div className="mb-10">
          <HeroNews newsData={news || []}/>
        </div>

        {/* SECTION LIENS PRINCIPAUX - NOUVEAU DESIGN */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 px-2 mb-10">

          {/* CARTE 1 : RECORDS DU CLUB */}
          <Link href="/infos/records" className="group relative h-48 rounded-[2.5rem] bg-white border-2 border-slate-100 hover:border-slate-900 overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-slate-200">
            {/* Arrière-plan animé au survol */}
            <div className="absolute inset-0 bg-slate-900 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out z-0"></div>

            {/* Icône Géante en fond */}
            <div className="absolute -bottom-6 -left-6 text-slate-100 group-hover:text-slate-800 transition-colors duration-500 z-0 group-hover:scale-125 group-hover:rotate-12 transition-transform origin-bottom-left">
              <Trophy size={140} strokeWidth={0.5}/>
            </div>

            {/* Contenu */}
            <div className="relative z-10 h-full flex flex-col justify-between p-8">
              <div className="flex justify-between items-start">
                <div className="bg-slate-100 p-3 rounded-2xl group-hover:bg-white/10 transition-colors duration-500">
                  <Trophy className="text-slate-900 group-hover:text-white transition-colors duration-500" size={24} />
                </div>
                {/* Flèche d'action */}
                <div className="opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500 delay-100">
                  <ArrowUpRight className="text-white" size={28} />
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-black text-slate-900 uppercase italic tracking-tighter group-hover:text-white transition-colors duration-500">Records Club</h3>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 group-hover:text-slate-400 transition-colors duration-500 mt-1">
                  Historique & Performance
                </p>
              </div>
            </div>
          </Link>

          {/* CARTE 2 : INSCRIPTIONS (Mise en avant centrale) */}
          <Link href="/inscription" className="group relative h-48 rounded-[2.5rem] bg-red-600 border-2 border-red-600 overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-red-200 hover:-translate-y-1">
            {/* Motif de fond subtil */}
            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>

            {/* Icône Géante en fond */}
            <div className="absolute top-1/2 -translate-y-1/2 right-[-2rem] text-black/10 group-hover:text-white/20 transition-colors duration-500 z-0 group-hover:scale-110 transition-transform">
              <CalendarCheck size={160} strokeWidth={1}/>
            </div>

            {/* Contenu */}
            <div className="relative z-10 h-full flex flex-col justify-between p-8">
              <div className="flex justify-between items-start">
                <div className="bg-black/20 p-3 rounded-2xl group-hover:bg-white text-white group-hover:text-red-600 transition-all duration-500">
                  <CalendarCheck size={24} />
                </div>
              </div>

              <div>
                <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter group-hover:translate-x-1 transition-transform duration-300">Inscriptions</h3>
                <div className="flex items-center gap-2 mt-2">
                  <div className="h-0.5 w-6 bg-white/50 group-hover:w-12 group-hover:bg-white transition-all duration-500"></div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-red-100">Meetings</p>
                </div>
              </div>
            </div>
          </Link>

          {/* CARTE 3 : SPEED NIGHT */}
          <Link href="/speed-night" className="group relative h-48 rounded-[2.5rem] bg-white border-2 border-slate-100 hover:border-red-600 overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-slate-200">
            {/* Arrière-plan animé au survol */}
            <div className="absolute inset-0 bg-red-600 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out z-0"></div>

            {/* Icône Géante en fond */}
            <div className="absolute -top-6 -right-6 text-slate-100 group-hover:text-red-700 transition-colors duration-500 z-0 group-hover:scale-125 group-hover:-rotate-12 transition-transform origin-top-right">
              <Timer size={140} strokeWidth={0.5}/>
            </div>

            {/* Contenu */}
            <div className="relative z-10 h-full flex flex-col justify-between p-8">
              <div className="flex justify-between items-start">
                <div className="bg-slate-100 p-3 rounded-2xl group-hover:bg-white/20 transition-colors duration-500">
                  <Timer className="text-slate-900 group-hover:text-white transition-colors duration-500" size={24} />
                </div>
                {/* Flèche d'action */}
                <div className="opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500 delay-100">
                  <ArrowUpRight className="text-white" size={28} />
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-black text-slate-900 uppercase italic tracking-tighter group-hover:text-white transition-colors duration-500">Speed Night/Race</h3>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 group-hover:text-red-200 transition-colors duration-500 mt-1">
                  Événement Majeur
                </p>
              </div>
            </div>
          </Link>
        </section>

        {/* SECTION : FORUM */}
        <section className="px-2">
          <Link href="/forum" className="group block w-full bg-white border-2 border-slate-100 rounded-[2.5rem] p-8 hover:border-red-600 transition-all duration-300 shadow-sm hover:shadow-xl relative overflow-hidden">
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