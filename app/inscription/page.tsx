"use client";

import { Navbar } from "@/components/navbar/navbar";
import { ExternalLink, Calendar, Trophy, Mail, Info, MousePointer2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function InscriptionsPage() {
  return (
      <div className="min-h-screen">
        <Navbar/>

        <main className="container mx-auto px-4 py-12 pt-32">
          {/* HERO SECTION */}
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-black text-slate-900 uppercase italic tracking-tighter mb-4">
              Prêt pour la <span className="text-red-600">Compétition ?</span>
            </h1>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-sm">
              Retrouvez ici toutes les modalités d'inscription aux épreuves
            </p>
            <div className="h-2 w-24 bg-red-600 mx-auto mt-6"></div>
          </div>

          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">

            {/* PLATEFORME 1 : LBFA */}
            <div
                className="bg-white rounded-[2.5rem] p-8 border-b-8 border-slate-200 shadow-xl hover:border-red-600 transition-all group">
              <div className="flex items-start justify-between mb-6">
                <div
                    className="bg-red-50 p-4 rounded-2xl text-red-600 group-hover:bg-red-600 group-hover:text-white transition-colors">
                  <Calendar size={32}/>
                </div>
                <span
                    className="text-[10px] font-black bg-slate-100 px-3 py-1 rounded-full uppercase tracking-widest text-slate-500">
                Officiel LBFA
              </span>
              </div>

              <h2 className="text-3xl font-black text-slate-900 uppercase italic mb-4 leading-none">
                Calendrier <br/><span className="text-red-600">BeAthletics</span>
              </h2>
              <p className="text-slate-500 text-sm font-medium mb-8 leading-relaxed">
                La plateforme centrale pour toutes les compétitions en Belgique. Consultez l'horaire
                et inscrivez-vous directement via votre portail athlète.
              </p>

              <a
                  href="https://www.beathletics.be/calendar"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
              >
                <Button
                    className="w-full bg-slate-900 hover:bg-red-600 text-white font-black uppercase italic py-7 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-3">
                  Ouvrir le calendrier <ExternalLink size={18}/>
                </Button>
              </a>
            </div>

            {/* PLATEFORME 2 : ATHLETIC.NU */}
            <div
                className="bg-white rounded-[2.5rem] p-8 border-b-8 border-slate-200 shadow-xl hover:border-red-600 transition-all group">
              <div className="flex items-start justify-between mb-6">
                <div
                    className="bg-blue-50 p-4 rounded-2xl text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <MousePointer2 size={32}/>
                </div>
                <span
                    className="text-[10px] font-black bg-slate-100 px-3 py-1 rounded-full uppercase tracking-widest text-slate-500">
                International
              </span>
              </div>

              <h2 className="text-3xl font-black text-slate-900 uppercase italic mb-4 leading-none">
                Plateforme <br/><span className="text-blue-600">Athletics.app</span>
              </h2>
              <p className="text-slate-500 text-sm font-medium mb-8 leading-relaxed">
                Utilisée pour de nombreux meetings en Belgique et aux Pays-Bas. Vérifiez si votre
                prochaine compétition s'y trouve.
              </p>

              <a
                  href="https://www.athletics.app/wedstrijden/#{%22c%22:%22BE%22,%22s%22:%22%22,%22e%22:[%22in%22,%22out%22],%22pdst%22:0,%22r%22:[],%22cat%22:[],%22events%22:[],%22sd%22:-30610224561,%22ed%22:-30610224561}"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
              >
                <Button
                    className="w-full bg-slate-900 hover:bg-blue-600 text-white font-black uppercase italic py-7 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-3">
                  Voir les compétitions <ExternalLink size={18}/>
                </Button>
              </a>
            </div>
          </div>

          {/* SECTION CHAMPIONNATS (BERNARD THOMAS) */}
          <div className="max-w-6xl mx-auto">
            <div
                className="bg-slate-900 rounded-[3rem] p-8 md:p-12 text-white relative overflow-hidden">
              {/* Déco en arrière-plan */}
              <Trophy
                  className="absolute right-[-20px] bottom-[-20px] text-white/5 w-64 h-64 -rotate-12"/>

              <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
                <div className="flex-grow">
                  <div
                      className="inline-flex items-center gap-2 bg-red-600 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-6">
                    <Trophy size={14}/> Championnats
                  </div>
                  <h2 className="text-3xl md:text-4xl font-black uppercase italic tracking-tighter mb-4 leading-tight">
                    Championnats Provinciaux, <br/>LBFA & Nationaux
                  </h2>
                  <p className="text-slate-300 text-sm font-medium max-w-xl leading-relaxed">
                    Pour toutes les inscriptions concernant les championnats officiels, la procédure
                    est différente. Vous ne pouvez pas vous inscrire seul.
                  </p>
                </div>

                <div className="shrink-0 w-full md:w-auto">
                  <div
                      className="bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-[2rem] text-center">
                    <p className="text-[10px] font-black uppercase tracking-widest text-red-400 mb-2">Contact
                      Responsable</p>
                    <p className="text-2xl font-black uppercase italic mb-6">Bernard Thomas</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* PETIT RAPPEL INFO */}
          <div
              className="max-w-4xl mx-auto mt-16 flex items-start gap-4 bg-blue-50 p-6 rounded-2xl border-l-4 border-blue-500">
            <Info className="text-blue-500 shrink-0"/>
            <p className="text-blue-900 text-xs font-bold leading-relaxed">
              N'oubliez pas que pour toute inscription, vous devez être en possession de votre <span
                className="underline">numéro de dossard officiel</span> de la saison en cours et
              être en ordre de cotisation auprès de l'AC Dampicourt.
            </p>
          </div>
        </main>
      </div>
  );
}