import { Navbar } from "@/components/navbar/navbar";
import {
  BookOpen,
  Target,
  Brain,
  Award,
  Clock,
  MapPin,
  GraduationCap,
  ChevronRight,
  Users
} from "lucide-react";

export default function MethodePedagogiquePage() {
  return (
      <div className="min-h-screen">

        <main className="container mx-auto px-4 py-12 pt-32 text-slate-900">

          {/* ENTÊTE DE PAGE */}
          <div className="max-w-4xl mx-auto mb-20">
            <div
                className="flex items-center gap-4 text-red-600 mb-4 font-black uppercase tracking-widest text-sm italic">
              <GraduationCap size={24}/>
              Formation Jeunesse
            </div>
            <h1 className="text-5xl font-black text-slate-900 uppercase italic leading-tight">
              Méthode pédagogique <br/>
              <span className="text-red-600">K.B.P.M.</span>
            </h1>
            <div className="h-2 w-32 bg-red-600 mt-6"></div>
          </div>

          {/* SECTION 1 : CATÉGORIES & OBJECTIFS */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-20">
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-slate-900 text-white p-8 rounded-[2.5rem] shadow-xl">
                <h3 className="text-xl font-black uppercase italic mb-6 text-red-600">Catégories
                  concernées</h3>
                <ul className="space-y-4 font-bold">
                  <li className="flex justify-between border-b border-white/10 pb-2">
                    <span>Kangourous (U8)</span>
                    <span className="text-red-500">6–7 ans</span>
                  </li>
                  <li className="flex justify-between border-b border-white/10 pb-2">
                    <span>Benjamins (U10)</span>
                    <span className="text-red-500">8–9 ans</span>
                  </li>
                  <li className="flex justify-between border-b border-white/10 pb-2">
                    <span>Pupilles (U12)</span>
                    <span className="text-red-500">10–11 ans</span>
                  </li>
                  <li className="flex justify-between border-b border-white/10 pb-2">
                    <span>Minimes (U14)</span>
                    <span className="text-red-500">12–13 ans</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="lg:col-span-2 space-y-8">
              <h2 className="text-3xl font-black uppercase italic text-slate-800 flex items-center gap-3">
                <Target className="text-red-600"/> Objectif pédagogique
              </h2>
              <p className="text-lg text-slate-600 leading-relaxed italic">
                Favoriser le développement moteur global de l’enfant à travers des activités
                ludiques et variées. L’accent est mis sur :
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  "La coordination, l’équilibre et la motricité",
                  "La découverte des disciplines de l’athlétisme",
                  "Le plaisir de bouger et de progresser ensemble",
                  "Le développement progressif des actes techniques"
                ].map((text, i) => (
                    <div key={i}
                         className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <div className="h-2 w-2 bg-red-600 rotate-45"></div>
                      <span className="font-bold text-slate-700 text-sm">{text}</span>
                    </div>
                ))}
              </div>
            </div>
          </div>

          {/* SECTION 2 : L'APPROCHE & PRINCIPES CLÉS */}
          <div className="bg-slate-50 rounded-[3rem] p-12 mb-20 border border-slate-100">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="text-3xl font-black uppercase italic mb-6">Approche <span
                  className="text-red-600">Pédagogique</span></h2>
              <p className="text-slate-600 italic leading-relaxed">
                L’approche repose sur le développement global de l’enfant à travers le jeu, la
                motricité et la découverte des disciplines athlétiques. L’enfant est encouragé à
                explorer, expérimenter et construire ses repères corporels.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-[2rem] shadow-sm space-y-4">
                <Brain className="text-red-600" size={32}/>
                <h4 className="font-black uppercase italic">Motricité Fondamentale</h4>
                <p className="text-sm text-slate-500">Coordination, équilibre, dissociation
                  segmentaire.</p>
              </div>
              <div className="bg-white p-8 rounded-[2rem] shadow-sm space-y-4">
                <Award className="text-red-600" size={32}/>
                <h4 className="font-black uppercase italic">Apprentissage par le jeu</h4>
                <p className="text-sm text-slate-500">Favorise l’engagement, la créativité et la
                  socialisation.</p>
              </div>
              <div className="bg-white p-8 rounded-[2rem] shadow-sm space-y-4">
                <Users size={32} className="text-red-600"/>
                <h4 className="font-black uppercase italic">Construction Identitaire</h4>
                <p className="text-sm text-slate-500">Découverte du rôle d’athlète, respect des
                  règles et esprit d’équipe.</p>
              </div>
            </div>
          </div>

          {/* SECTION 3 : INFOS PRATIQUES (HORAIRES) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20 items-center">
            <div className="space-y-8">
              <h2 className="text-3xl font-black uppercase italic text-slate-800 leading-tight">
                Horaire et lieu <br/><span className="text-red-600">d’entraînement</span>
              </h2>

              <div className="space-y-6">
                <div className="flex items-start gap-6">
                  <div className="p-4 bg-slate-900 text-white rounded-2xl"><Clock size={24}/></div>
                  <div>
                    <h4 className="font-black uppercase italic text-sm">Mercredi</h4>
                    <p className="text-slate-600">18h00 à 19h15</p>
                  </div>
                </div>

                <div className="flex items-start gap-6">
                  <div className="p-4 bg-red-600 text-white rounded-2xl"><MapPin size={24}/></div>
                  <div>
                    <h4 className="font-black uppercase italic text-sm">Printemps, été, automne</h4>
                    <p className="text-slate-600">Piste Daniel Thiry – Stade des Fusillés –
                      Virton</p>
                  </div>
                </div>

                <div className="p-6 bg-slate-50 rounded-[2rem] border-l-4 border-slate-900">
                  <h4 className="font-black uppercase italic text-xs mb-2 text-slate-400 tracking-widest">Hiver
                    : Salle Multisport</h4>
                  <p className="text-sm text-slate-600">Piste d’athlétisme intérieure courte
                    (60m-poids-hauteur)</p>
                </div>

                <div
                    className="inline-flex items-center gap-2 px-6 py-3 bg-red-100 text-red-600 rounded-full font-black uppercase italic text-xs">
                  <ChevronRight size={14}/> Stage de cinq jours en juillet-août
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-4 bg-red-600/5 rounded-[3rem] -rotate-3"></div>
              <div
                  className="relative bg-white border border-slate-100 p-10 rounded-[2.5rem] shadow-xl space-y-6">
                <h3 className="text-xl font-black uppercase italic">Encadrement Expert</h3>
                <p className="text-slate-600 leading-relaxed italic">
                  Les séances sont encadrées par des entraîneurs diplômés, spécialisés dans
                  l’approche pédagogique des jeunes enfants.
                </p>
                <div className="pt-6 border-t border-slate-100">
                  <p className="text-[10px] font-black uppercase text-slate-400 mb-4 tracking-widest">Références
                    Scientifiques :</p>
                  <ul className="space-y-3 text-xs text-slate-500 italic">
                    <li>• FFA (2020). Guide de l’école d’athlétisme</li>
                    <li>• Sébastien RATEL – HDR Université Clermont Auvergne : "Comment entraîner
                      les jeunes enfants de manière sécuritaire"
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

        </main>
      </div>
  );
}