import { HeroNews } from "@/components/carousel/news";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { Timer, Trophy, CalendarCheck, ChevronRight, HelpCircle, MessageSquare } from "lucide-react";

export default async function Home() {
  // On récupère uniquement les 3 actualités les plus récentes selon la date de l'événement
  const { data: news } = await supabase
  .from('news')
  .select('*')
  .eq('is_hidden', false) // Optionnel : n'afficher que ce qui n'est pas masqué
  .order('date_text', { ascending: false }) // Tri par date de l'actualité
  .limit(3); // On ne prend que les 3 premiers

  return (
      <main className="container mx-auto px-4 pt-10 pb-12">
        {/* CAROUSEL - N'affiche que les 3 dernières actus */}
        <div className="mb-10">
          <HeroNews newsData={news || []}/>
        </div>

        {/* SECTION LIENS PRINCIPAUX */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 px-2 mb-10">
          {/* CARTE 1 : RÉSULTATS */}
          <Link href="/resultats"
                className="group relative h-40 bg-slate-50 border-l-4 border-slate-200 hover:border-red-600 transition-all duration-300 overflow-hidden flex flex-col justify-between p-6 rounded-r-2xl shadow-sm hover:shadow-md">
            <div className="absolute top-1/2 -translate-y-1/2 right-4 opacity-[0.05] group-hover:opacity-[0.1] transition-opacity transform group-hover:scale-110 duration-500 text-black">
              <Trophy size={80} strokeWidth={1}/>
            </div>
            <div className="z-10">
              <h3 className="text-xl font-black text-slate-900 uppercase italic tracking-tighter group-hover:text-red-600 transition-colors">Résultats</h3>
              <div className="w-6 h-1 bg-red-600 mt-1 group-hover:w-12 transition-all duration-500"></div>
            </div>
            <div className="flex items-center justify-between z-10">
              <p className="text-slate-400 font-bold text-[9px] uppercase tracking-[0.2em]">Chronos & Podiums</p>
              <ChevronRight className="text-red-600 transform group-hover:translate-x-1 transition-transform" size={16}/>
            </div>
          </Link>

          {/* CARTE 2 : INSCRIPTIONS */}
          <Link href="/inscriptions"
                className="group relative h-40 bg-slate-900 overflow-hidden flex flex-col justify-between p-6 rounded-2xl shadow-lg hover:shadow-red-900/20 transition-all duration-300">
            <div className="absolute inset-0 bg-red-600 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out z-0"></div>
            <div className="z-10 relative">
              <h3 className="text-xl font-black text-white uppercase italic tracking-tighter">Inscriptions</h3>
              <p className="text-slate-400 text-[10px] mt-1 font-bold uppercase tracking-widest group-hover:text-white/80 transition-colors">Meetings & Championnats</p>
            </div>
            <div className="z-10 relative flex justify-between items-end">
              <div className="bg-white/10 p-1.5 rounded-full">
                <ChevronRight className="text-white" size={14}/>
              </div>
              <CalendarCheck className="text-red-600 group-hover:text-white transition-colors" size={28}/>
            </div>
          </Link>

          {/* CARTE 3 : SPEED NIGHT */}
          <Link href="/speed-night"
                className="group relative h-40 bg-slate-50 border-r-4 border-slate-200 hover:border-red-600 transition-all duration-300 overflow-hidden flex flex-col justify-between p-6 rounded-l-2xl shadow-sm hover:shadow-md">
            <div className="absolute top-1/2 -translate-y-1/2 right-4 opacity-[0.05] group-hover:opacity-[0.1] transition-opacity transform group-hover:scale-110 duration-500 text-black">
              <Timer size={80} strokeWidth={1}/>
            </div>
            <div className="z-10">
              <h3 className="text-xl font-black text-slate-900 uppercase italic tracking-tighter group-hover:text-red-600 transition-colors">Speed Night</h3>
              <div className="w-6 h-1 bg-red-600 mt-1 group-hover:w-12 transition-all duration-500"></div>
            </div>
            <div className="flex items-center justify-between z-10">
              <p className="text-slate-400 font-bold text-[9px] uppercase tracking-[0.2em]">Événement Majeur</p>
              <ChevronRight className="text-red-600 transform group-hover:translate-x-1 transition-transform" size={16}/>
            </div>
          </Link>
        </section>

        {/* SECTION : FORUM */}
        <section className="px-2">
          <Link href="/forum"
                className="group block w-full bg-white border-2 border-slate-100 rounded-[2rem] p-8 hover:border-red-600 transition-all duration-300 shadow-sm hover:shadow-xl relative overflow-hidden">
            <div className="absolute -right-10 -bottom-10 text-slate-50 group-hover:text-red-50 transition-colors duration-500 -rotate-12">
              <MessageSquare size={200} strokeWidth={1} />
            </div>
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center gap-6">
                <div className="bg-red-600 p-4 rounded-2xl shadow-lg shadow-red-200 group-hover:scale-110 transition-transform">
                  <HelpCircle className="text-white" size={32} />
                </div>
                <div>
                  <h2 className="text-2xl font-black uppercase italic tracking-tighter text-slate-900">
                    Une question ? <span className="text-red-600">Le Forum ACD</span>
                  </h2>
                  <p className="text-slate-500 font-medium max-w-md">
                    Besoin d'aide pour une inscription ou d'infos sur les entraînements ? Posez vos questions à la communauté.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-slate-900 text-white px-8 py-4 rounded-2xl font-black uppercase italic tracking-widest text-sm group-hover:bg-red-600 transition-colors shadow-lg">
                Accéder au forum
                <ChevronRight size={20} />
              </div>
            </div>
          </Link>
        </section>
      </main>
  );
}