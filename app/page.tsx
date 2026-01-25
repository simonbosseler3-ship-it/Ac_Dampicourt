import { HeroNews } from "@/components/carousel/news";
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import Link from "next/link";
import { Timer, Trophy, CalendarCheck, ChevronRight, HelpCircle, MessageSquare } from "lucide-react";
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
    .select('role, has_seen_tutorial, full_name') // On récupère bien le nom ici
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

        {/* SECTION LIENS PRINCIPAUX */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 px-2 mb-10">
          <Link href="/resultats" className="group relative h-40 bg-slate-50 border-l-4 border-slate-200 hover:border-red-600 transition-all duration-300 overflow-hidden flex flex-col justify-between p-6 rounded-r-2xl shadow-sm">
            <div className="absolute top-1/2 -translate-y-1/2 right-4 opacity-[0.05] group-hover:opacity-[0.1] transition-opacity transform group-hover:scale-110 duration-500 text-black">
              <Trophy size={80} strokeWidth={1}/>
            </div>
            <div className="z-10">
              <h3 className="text-xl font-black text-slate-900 uppercase italic tracking-tighter group-hover:text-red-600 transition-colors">Résultats</h3>
              <div className="w-6 h-1 bg-red-600 mt-1 group-hover:w-12 transition-all duration-500"></div>
            </div>
            <div className="flex items-center justify-between z-10 text-slate-400 font-bold text-[9px] uppercase tracking-[0.2em]">
              Chronos & Podiums
              <ChevronRight className="text-red-600 transform group-hover:translate-x-1 transition-transform" size={16}/>
            </div>
          </Link>

          <Link href="/inscriptions" className="group relative h-40 bg-slate-900 overflow-hidden flex flex-col justify-between p-6 rounded-2xl shadow-lg transition-all duration-300">
            <div className="absolute inset-0 bg-red-600 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out z-0"></div>
            <div className="z-10 relative">
              <h3 className="text-xl font-black text-white uppercase italic tracking-tighter">Inscriptions</h3>
              <p className="text-slate-400 text-[10px] mt-1 font-bold uppercase tracking-widest group-hover:text-white/80 transition-colors">Meetings & Championnats</p>
            </div>
            <div className="z-10 relative flex justify-between items-end">
              <div className="bg-white/10 p-1.5 rounded-full"><ChevronRight className="text-white" size={14}/></div>
              <CalendarCheck className="text-red-600 group-hover:text-white transition-colors" size={28}/>
            </div>
          </Link>

          <Link href="/speed-night" className="group relative h-40 bg-slate-50 border-r-4 border-slate-200 hover:border-red-600 transition-all duration-300 overflow-hidden flex flex-col justify-between p-6 rounded-l-2xl shadow-sm">
            <div className="absolute top-1/2 -translate-y-1/2 right-4 opacity-[0.05] group-hover:opacity-[0.1] transition-opacity transform group-hover:scale-110 duration-500 text-black">
              <Timer size={80} strokeWidth={1}/>
            </div>
            <div className="z-10">
              <h3 className="text-xl font-black text-slate-900 uppercase italic tracking-tighter group-hover:text-red-600 transition-colors">Speed Night</h3>
              <div className="w-6 h-1 bg-red-600 mt-1 group-hover:w-12 transition-all duration-500"></div>
            </div>
            <div className="flex items-center justify-between z-10 text-slate-400 font-bold text-[9px] uppercase tracking-[0.2em]">
              Événement Majeur
              <ChevronRight className="text-red-600 transform group-hover:translate-x-1 transition-transform" size={16}/>
            </div>
          </Link>
        </section>

        {/* SECTION : FORUM */}
        <section className="px-2">
          <Link href="/forum" className="group block w-full bg-white border-2 border-slate-100 rounded-[2rem] p-8 hover:border-red-600 transition-all duration-300 shadow-sm hover:shadow-xl relative overflow-hidden">
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