"use client";

import {
  Target,
  Brain,
  Award,
  Clock,
  MapPin,
  GraduationCap,
  ChevronRight,
  Users,
  BookOpen,
  ArrowLeft,
  CheckCircle2,
  Sparkles
} from "lucide-react";
import Link from "next/link";

export default function MethodePedagogiquePage() {
  return (
      <div className="min-h-screen">
        <main className="container mx-auto px-4 py-12 pt-32 pb-32 animate-in fade-in duration-700">

          {/* TOP BAR / NAVIGATION */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-8">
            <div className="flex items-center gap-6">
              <Link href="/infos/kbpm"
                    className="group flex items-center gap-3 bg-white p-4 rounded-2xl shadow-sm border border-slate-300 hover:border-red-600 transition-all">
                <ArrowLeft size={20} className="text-slate-400 group-hover:text-red-600 transition-colors"/>
              </Link>
              <div>
                <div className="flex items-center gap-2 text-red-600 mb-1 font-black uppercase tracking-[0.2em] text-[10px] italic">
                  <GraduationCap size={14} />
                  Formation Jeunesse
                </div>
                <h1 className="text-4xl md:text-6xl font-black text-slate-900 uppercase italic leading-[0.8] tracking-tighter">
                  MÉTHODE <span className="text-red-600">PÉDAGOGIQUE</span>
                </h1>
              </div>
            </div>

            <div className="hidden md:flex bg-white px-6 py-3 rounded-2xl border border-slate-300 items-center gap-3 shadow-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-[10px] font-black uppercase italic text-slate-500 tracking-widest">Programme Officiel KBPM</span>
            </div>
          </div>

          {/* SECTION 1 : CATÉGORIES & OBJECTIFS */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mb-10">

            {/* Sidebar Catégories */}
            <div className="lg:col-span-1">
              <div className="bg-slate-900 text-white p-10 rounded-[3rem] shadow-2xl relative overflow-hidden h-full">
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-8">
                    <Users className="text-red-600" size={24} />
                    <h3 className="text-2xl font-black uppercase italic tracking-tight">Les Catégories</h3>
                  </div>
                  <div className="space-y-6">
                    {[
                      { name: "Kangourous (U8)", age: "6–7 ans", icon: "🐾" },
                      { name: "Benjamins (U10)", age: "8–9 ans", icon: "⚡" },
                      { name: "Pupilles (U12)", age: "10–11 ans", icon: "🏆" },
                      { name: "Minimes (U14)", age: "12–13 ans", icon: "🚀" }
                    ].map((cat, i) => (
                        <div key={i} className="flex items-center justify-between group cursor-default">
                          <div className="flex items-center gap-4">
                            <span className="text-xl">{cat.icon}</span>
                            <span className="font-bold text-slate-300 group-hover:text-white transition-colors">{cat.name}</span>
                          </div>
                          <span className="text-red-500 font-black italic text-sm">{cat.age}</span>
                        </div>
                    ))}
                  </div>
                </div>
                <GraduationCap className="absolute -right-12 -bottom-12 text-white/5 w-64 h-64 -rotate-12" />
              </div>
            </div>

            {/* Carte Objectif Principal */}
            <div className="lg:col-span-2 bg-white p-10 md:p-14 rounded-[3rem] border border-slate-300 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-10">
                <Sparkles className="text-slate-100" size={120} />
              </div>

              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-8">
                  <div className="p-4 bg-red-50 text-red-600 rounded-2xl">
                    <Target size={32} />
                  </div>
                  <div>
                    <h2 className="text-3xl font-black uppercase italic text-slate-900 leading-none">Objectif <br/><span className="text-red-600">Pédagogique</span></h2>
                  </div>
                </div>

                <p className="text-xl text-slate-600 leading-relaxed italic mb-10 max-w-2xl">
                  Favoriser le développement moteur global de l’enfant à travers des activités ludiques. L’accent est mis sur la <span className="text-slate-900 font-black">polyvalence</span> avant la spécialisation.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    "Coordination & équilibre moteur",
                    "Découverte multidisciplinaire",
                    "Le plaisir de bouger ensemble",
                    "Apprentissage technique progressif"
                  ].map((text, i) => (
                      <div key={i} className="flex items-center gap-4 p-5 bg-slate-50 rounded-2xl border border-slate-200 group hover:border-red-600 hover:bg-white transition-all">
                        <CheckCircle2 className="text-red-600 shrink-0" size={20} />
                        <span className="font-black uppercase italic text-[11px] tracking-wider text-slate-700">{text}</span>
                      </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 2 : LES 3 PILIERS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
            {[
              { icon: Brain, title: "Motricité", desc: "Coordination, équilibre et dissociation segmentaire au cœur de chaque séance.", color: "bg-blue-50 text-blue-600" },
              { icon: Award, title: "Le Jeu", desc: "Le moteur principal de l'engagement, de la créativité et de la socialisation.", color: "bg-red-50 text-red-600" },
              { icon: Users, title: "Identité", desc: "Respect des règles, esprit d’équipe et apprentissage du rôle d’athlète.", color: "bg-slate-900 text-white" }
            ].map((item, i) => (
                <div key={i} className="bg-white p-10 rounded-[3rem] border border-slate-300 shadow-lg text-center group hover:border-red-600 transition-all">
                  <div className={`mx-auto w-20 h-20 rounded-[2rem] flex items-center justify-center mb-6 shadow-inner ${item.color}`}>
                    <item.icon size={32} className="group-hover:scale-110 transition-transform" />
                  </div>
                  <h4 className="font-black uppercase italic text-xl mb-4 text-slate-900">{item.title}</h4>
                  <p className="text-xs text-slate-500 font-bold leading-relaxed uppercase tracking-wide">{item.desc}</p>
                </div>
            ))}
          </div>

          {/* SECTION 3 : LOGISTIQUE & EXPERTISE */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16">

            {/* Infos Pratiques */}
            <div className="bg-white p-10 md:p-14 rounded-[3rem] border border-slate-300 shadow-xl">
              <h2 className="text-4xl font-black uppercase italic text-slate-900 leading-tight mb-10">
                Horaire <br /><span className="text-red-600">& Localisation</span>
              </h2>

              <div className="space-y-6">
                <div className="flex items-center gap-8 p-8 bg-slate-100 rounded-[2.5rem] border border-slate-200 group hover:bg-white hover:shadow-lg transition-all">
                  <div className="p-5 bg-slate-900 text-white rounded-[1.5rem] shadow-xl"><Clock size={28} /></div>
                  <div>
                    <h4 className="font-black uppercase italic text-[10px] text-red-600 tracking-[0.2em] mb-1">Tous les Mercredis</h4>
                    <p className="text-3xl font-black italic text-slate-900">18h00 <span className="text-slate-300">—</span> 19h15</p>
                  </div>
                </div>

                <div className="flex items-center gap-8 p-8 bg-slate-100 rounded-[2.5rem] border border-slate-200 group hover:bg-white hover:shadow-lg transition-all">
                  <div className="p-5 bg-red-600 text-white rounded-[1.5rem] shadow-xl shadow-red-200"><MapPin size={28} /></div>
                  <div>
                    <h4 className="font-black uppercase italic text-[10px] text-red-600 tracking-[0.2em] mb-1">Stade des Fusillés</h4>
                    <p className="text-xl font-black italic text-slate-900 uppercase">Piste Daniel Thiry <br/> <span className="text-sm font-bold text-slate-400 not-italic">Virton</span></p>
                  </div>
                </div>
              </div>
            </div>

            {/* BOX EXPERTISE TECHNIQUE */}
            <div className="bg-slate-900 p-10 md:p-14 rounded-[3rem] shadow-2xl text-white relative overflow-hidden flex flex-col justify-center">
              <div className="absolute top-0 right-0 p-12 opacity-5">
                <BookOpen size={200} />
              </div>

              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 bg-red-600 rounded-2xl flex items-center justify-center">
                    <BookOpen size={24} />
                  </div>
                  <h3 className="text-2xl font-black uppercase italic">Encadrement <span className="text-red-600">Expert</span></h3>
                </div>

                <p className="text-slate-300 leading-relaxed italic mb-10 text-lg font-medium">
                  Les séances sont encadrées par des <span className="text-white font-black uppercase italic">entraîneurs diplômés</span>, spécialisés dans l’approche pédagogique des jeunes enfants et formés aux dernières méthodes de la LBFA.
                </p>

                <div className="pt-8 border-t border-white/10">
                  <p className="text-[10px] font-black uppercase text-red-600 mb-6 tracking-[0.3em] flex items-center gap-2">
                    <div className="w-4 h-[1px] bg-red-600"></div>
                    Références Académiques
                  </p>
                  <ul className="space-y-4 text-[10px] text-slate-400 font-black uppercase tracking-widest italic">
                    <li className="flex gap-4 items-center">
                      <span className="w-1 h-1 bg-white rounded-full"></span>
                      FFA (2020) : GUIDE DE L’ÉCOLE D’ATHLÉTISME
                    </li>
                    <li className="flex gap-4 items-center">
                      <span className="w-1 h-1 bg-white rounded-full"></span>
                      SÉBASTIEN RATEL : "ENTRAÎNER LES JEUNES"
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* CTA FINAL SECTION */}
          <div className="flex flex-col items-center">
            <div className="w-full h-[1px] bg-slate-300 mb-12"></div>
            <Link href="/infos/kbpm"
                  className="group relative inline-flex items-center gap-6 bg-slate-900 text-white px-12 py-6 rounded-[2rem] font-black uppercase italic tracking-widest hover:bg-red-600 transition-all shadow-2xl active:scale-95">
              <span className="text-sm">Retour aux compétitions</span>
              <ChevronRight className="group-hover:translate-x-2 transition-transform" size={20} />
            </Link>
            <p className="mt-8 text-[10px] font-black uppercase text-slate-400 tracking-[0.4em] italic">Athlétic Club Dampicourt</p>
          </div>

        </main>
      </div>
  );
}