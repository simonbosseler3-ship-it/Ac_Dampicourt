import { Navbar } from "@/components/navbar/navbar";
import { HeroNews } from "@/components/carousel/news";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { MapPin, Phone, ExternalLink, Instagram, Facebook, Timer, Trophy, CalendarCheck, ChevronRight } from "lucide-react";

export default async function Home() {
  const { data: news } = await supabase
  .from('news')
  .select('*')
  .order('created_at', { ascending: false });

  return (
      <div className="min-h-screen">
        <Navbar/>

        {/* pt-10 au lieu de pt-32 pour remonter le contenu vers la Navbar */}
        <main className="container mx-auto px-4 pt-10 pb-12">

          {/* CAROUSEL : Marges réduites pour coller davantage au haut de page */}
          <div className="mb-10">
            <HeroNews newsData={news || []}/>
          </div>

          {/* SECTION LIENS - DYNAMIQUE & COMPACTE */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6 px-2">

            {/* CARTE 1 : RÉSULTATS */}
            <Link href="/resultats"
                  className="group relative h-40 bg-slate-50 border-l-4 border-slate-200 hover:border-red-600 transition-all duration-300 overflow-hidden flex flex-col justify-between p-6 rounded-r-2xl shadow-sm hover:shadow-md">
              <div
                  className="absolute -top-2 -right-2 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity transform group-hover:scale-110 duration-500 text-black">
                <Trophy size={120} strokeWidth={1}/>
              </div>
              <div className="z-10">
                <h3 className="text-xl font-black text-slate-900 uppercase italic tracking-tighter group-hover:text-red-600 transition-colors">Résultats</h3>
                <div
                    className="w-6 h-1 bg-red-600 mt-1 group-hover:w-12 transition-all duration-500"></div>
              </div>
              <div className="flex items-center justify-between z-10">
                <p className="text-slate-400 font-bold text-[9px] uppercase tracking-[0.2em]">Chronos
                  & Podiums</p>
                <ChevronRight
                    className="text-red-600 transform group-hover:translate-x-1 transition-transform"
                    size={16}/>
              </div>
            </Link>

            {/* CARTE 2 : INSCRIPTIONS */}
            <Link href="/inscriptions"
                  className="group relative h-40 bg-slate-900 overflow-hidden flex flex-col justify-between p-6 rounded-2xl shadow-lg hover:shadow-red-900/20 transition-all duration-300">
              <div
                  className="absolute inset-0 bg-red-600 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out z-0"></div>
              <div className="z-10 relative">
                <h3 className="text-xl font-black text-white uppercase italic tracking-tighter">Inscriptions</h3>
                <p className="text-slate-400 text-[10px] mt-1 font-bold uppercase tracking-widest group-hover:text-white/80 transition-colors">Meetings
                  & Championnats</p>
              </div>
              <div className="z-10 relative flex justify-between items-end">
                <div className="bg-white/10 p-1.5 rounded-full">
                  <ChevronRight className="text-white" size={14}/>
                </div>
                <CalendarCheck className="text-red-600 group-hover:text-white transition-colors"
                               size={28}/>
              </div>
            </Link>

            {/* CARTE 3 : SPEED NIGHT */}
            <Link href="/speed-night"
                  className="group relative h-40 bg-slate-50 border-r-4 border-slate-200 hover:border-red-600 transition-all duration-300 overflow-hidden flex flex-col justify-between p-6 rounded-l-2xl shadow-sm hover:shadow-md">
              <div
                  className="absolute -top-2 -right-2 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity transform group-hover:scale-110 duration-500 text-black">
                <Timer size={120} strokeWidth={1}/>
              </div>
              <div className="z-10">
                <h3 className="text-xl font-black text-slate-900 uppercase italic tracking-tighter group-hover:text-red-600 transition-colors">Speed
                  Night</h3>
                <div
                    className="w-6 h-1 bg-red-600 mt-1 group-hover:w-12 transition-all duration-500"></div>
              </div>
              <div className="flex items-center justify-between z-10">
                <p className="text-slate-400 font-bold text-[9px] uppercase tracking-[0.2em]">Événement
                  Majeur</p>
                <ChevronRight
                    className="text-red-600 transform group-hover:translate-x-1 transition-transform"
                    size={16}/>
              </div>
            </Link>

          </section>
        </main>

        {/* FOOTER LARGE */}
        <footer className="bg-slate-900 text-white pt-20 pb-10 mt-24">
          <div className="container mx-auto px-4">
            <div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 border-b border-white/10 pb-16">
              <div className="flex flex-col gap-6">
                <div>
                  <h4 className="text-red-600 font-black uppercase italic text-3xl leading-none">AC
                    Dampicourt</h4>
                  <p className="text-gray-500 text-xs font-bold uppercase tracking-[0.2em] mt-2">Le
                    club de la Gaume</p>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
                  Former, s'entraîner et performer. L'athlétisme pour tous, de l'initiation au haut
                  niveau.
                </p>
              </div>

              <div className="flex flex-col gap-6">
                <h4 className="text-white font-black uppercase italic text-sm tracking-widest">Navigation</h4>
                <nav className="flex flex-col gap-3">
                  <Link href="/club"
                        className="text-gray-400 hover:text-red-600 transition-colors text-sm font-bold uppercase italic">Le
                    Club</Link>
                  <Link href="/actualites"
                        className="text-gray-400 hover:text-red-600 transition-colors text-sm font-bold uppercase italic">Actualités</Link>
                  <Link href="/entrainement"
                        className="text-gray-400 hover:text-red-600 transition-colors text-sm font-bold uppercase italic">Entraînements</Link>
                  <Link href="/resultats"
                        className="text-gray-400 hover:text-red-600 transition-colors text-sm font-bold uppercase italic">Résultats</Link>
                </nav>
              </div>

              <div className="flex flex-col gap-6">
                <h4 className="text-white font-black uppercase italic text-sm tracking-widest">Le
                  Stade</h4>
                <div className="space-y-4 text-sm">
                  <div className="flex items-start gap-3 text-gray-400">
                    <MapPin size={20} className="text-red-600 shrink-0 mt-1"/>
                    <div>
                      <p className="font-black text-white uppercase italic leading-none mb-1">Stade
                        des Fusillés</p>
                      <p>Rue du Stade 7, 6762 SAINT-MARD</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-gray-400">
                    <Phone size={18} className="text-red-600 shrink-0"/>
                    <a href="tel:+3263576974"
                       className="hover:text-white transition-colors font-bold">+32 63 57 69 74</a>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-6">
                <h4 className="text-white font-black uppercase italic text-sm tracking-widest">Suivre
                  l'ACD</h4>
                <div className="flex items-center gap-4">
                  <a href="https://www.facebook.com/groups/111612989000083" target="_blank"
                     className="bg-white/5 p-4 rounded-2xl hover:bg-blue-600 transition-all group shadow-xl">
                    <Facebook size={22} className="group-hover:scale-110 transition-transform"/>
                  </a>
                  <a href="https://www.instagram.com/acdampicourt_" target="_blank"
                     className="bg-white/5 p-4 rounded-2xl hover:bg-gradient-to-tr from-yellow-500 via-red-500 to-purple-600 transition-all group shadow-xl">
                    <Instagram size={22} className="group-hover:scale-110 transition-transform"/>
                  </a>
                </div>
              </div>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-10">
              <div className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-600">©
                2026 AC Dampicourt
              </div>
              <div
                  className="flex gap-6 text-[9px] font-black uppercase text-gray-700 tracking-widest italic">
                <span>Confidentialité</span>
                <span>Réglement</span>
              </div>
            </div>
          </div>
        </footer>
      </div>
  );
}