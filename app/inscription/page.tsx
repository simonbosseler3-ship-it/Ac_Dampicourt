"use client";

import { ExternalLink, Calendar, Trophy, Info, MousePointer2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function InscriptionsPage() {
  return (
      <div className="min-h-screen bg-transparent">
        <main className="container mx-auto px-4 py-12 pt-32 animate-in fade-in duration-700">

          {/* HERO SECTION */}
          <div className="max-w-4xl mx-auto text-center mb-20">
          <span className="text-red-600 font-black uppercase italic tracking-[0.3em] text-xs mb-2 block">
            Engagement & Performance
          </span>
            <h1 className="text-5xl md:text-7xl font-black text-slate-900 uppercase italic tracking-tighter leading-none mb-6">
              PRÊT POUR LA <br /><span className="text-red-600">COMPÉTITION ?</span>
            </h1>
            <div className="h-2 w-32 bg-red-600 mx-auto shadow-lg shadow-red-200"></div>
          </div>

          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">

            {/* PLATEFORME 1 : BEATHLETICS (LBFA) */}
            <div className="bg-white/70 backdrop-blur-md rounded-[3rem] p-10 border border-white shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all group relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform">
                <Calendar size={120} />
              </div>

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-8">
                  <div className="bg-red-600 p-4 rounded-2xl text-white shadow-lg shadow-red-200">
                    <Calendar size={28} />
                  </div>
                  <span className="text-[10px] font-black bg-slate-900 text-white px-4 py-1.5 rounded-full uppercase tracking-widest">
                  Officiel LBFA
                </span>
                </div>

                <h2 className="text-3xl font-black text-slate-900 uppercase italic mb-4 leading-tight">
                  Calendrier <br /><span className="text-red-600">BeAthletics</span>
                </h2>
                <p className="text-slate-500 text-sm font-medium mb-10 leading-relaxed italic uppercase tracking-tight">
                  La plateforme centrale pour toutes les compétitions en Belgique. Consultez l'horaire et inscrivez-vous via votre portail athlète.
                </p>

                <a href="https://www.beathletics.be/calendar" target="_blank" rel="noopener noreferrer">
                  <Button className="w-full bg-slate-900 hover:bg-red-600 text-white font-black uppercase italic py-8 rounded-2xl shadow-xl transition-all flex items-center justify-center gap-3 tracking-widest">
                    Ouvrir le calendrier <ExternalLink size={18} />
                  </Button>
                </a>
              </div>
            </div>

            {/* PLATEFORME 2 : ATHLETICS.APP */}
            <div className="bg-white/70 backdrop-blur-md rounded-[3rem] p-10 border border-white shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all group relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform text-blue-600">
                <MousePointer2 size={120} />
              </div>

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-8">
                  <div className="bg-blue-600 p-4 rounded-2xl text-white shadow-lg shadow-blue-200">
                    <MousePointer2 size={28} />
                  </div>
                  <span className="text-[10px] font-black bg-slate-900 text-white px-4 py-1.5 rounded-full uppercase tracking-widest">
                  International
                </span>
                </div>

                <h2 className="text-3xl font-black text-slate-900 uppercase italic mb-4 leading-tight">
                  Plateforme <br /><span className="text-blue-600">Athletics.app</span>
                </h2>
                <p className="text-slate-500 text-sm font-medium mb-10 leading-relaxed italic uppercase tracking-tight">
                  Utilisée pour de nombreux meetings en Belgique et aux Pays-Bas. Idéal pour les compétitions hors province.
                </p>

                <a href="https://www.athletics.app/wedstrijden/" target="_blank" rel="noopener noreferrer">
                  <Button className="w-full bg-slate-900 hover:bg-blue-600 text-white font-black uppercase italic py-8 rounded-2xl shadow-xl transition-all flex items-center justify-center gap-3 tracking-widest">
                    Voir les meetings <ExternalLink size={18} />
                  </Button>
                </a>
              </div>
            </div>
          </div>

          {/* SECTION CHAMPIONNATS (BERNARD THOMAS) */}
          <div className="max-w-6xl mx-auto">
            <div className="bg-slate-900 rounded-[3rem] p-10 md:p-16 text-white relative overflow-hidden shadow-2xl">
              <Trophy className="absolute right-[-30px] bottom-[-30px] text-white/5 w-80 h-80 -rotate-12" />

              <div className="relative z-10 flex flex-col lg:flex-row items-center gap-12">
                <div className="flex-grow">
                  <div className="inline-flex items-center gap-2 bg-red-600 px-5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-8 shadow-lg shadow-red-900/20">
                    <Trophy size={14} /> Championnats Officiels
                  </div>
                  <h2 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter mb-6 leading-none">
                    Provinciaux, <br /><span className="text-red-600">LBFA & Nationaux</span>
                  </h2>
                  <p className="text-slate-400 text-sm font-bold max-w-xl leading-relaxed uppercase tracking-tight italic">
                    Attention : pour les championnats officiels, la procédure est centralisée. L'inscription individuelle n'est pas autorisée.
                  </p>
                </div>

                <div className="shrink-0 w-full lg:w-auto">
                  <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-10 rounded-[2.5rem] text-center group hover:border-red-600 transition-colors">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-red-500 mb-2">Responsable Club</p>
                    <p className="text-3xl font-black uppercase italic mb-8 tracking-tighter">Bernard Thomas</p>
                    <div className="flex items-center justify-center gap-2 text-xs font-black uppercase italic text-slate-400 group-hover:text-white transition-colors">
                      Contact via le club <ArrowRight size={14} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* INFO RAPPEL (MODERNE) */}
          <div className="max-w-4xl mx-auto mt-20 bg-white/50 backdrop-blur-md p-8 rounded-[2rem] border border-white shadow-lg flex items-center gap-6 group hover:border-blue-500 transition-all">
            <div className="bg-blue-600 p-4 rounded-2xl text-white shadow-lg shadow-blue-200">
              <Info size={24} />
            </div>
            <p className="text-slate-700 text-xs font-black uppercase tracking-wider leading-relaxed italic">
              Vérifiez votre <span className="text-blue-600">numéro de dossard officiel</span> et votre cotisation avant toute inscription.
            </p>
          </div>
        </main>
      </div>
  );
}