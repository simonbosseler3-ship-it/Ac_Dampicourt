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
  BookOpen
} from "lucide-react";
import Link from "next/link";

export default function MethodePedagogiquePage() {
  return (
      <div className="min-h-screen bg-transparent">
        <main className="container mx-auto px-4 py-12 pt-32 text-slate-900 animate-in fade-in duration-700">

          {/* ENTÊTE DE PAGE */}
          <div className="max-w-4xl mx-auto mb-20">
            <div className="flex items-center gap-4 text-red-600 mb-4 font-black uppercase tracking-[0.2em] text-xs italic">
              <GraduationCap size={20} />
              Formation Jeunesse
            </div>
            <h1 className="text-5xl md:text-6xl font-black text-slate-900 uppercase italic leading-tight tracking-tighter">
              Méthode pédagogique <br />
              <span className="text-red-600">K.B.P.M.</span>
            </h1>
            <div className="h-2 w-32 bg-red-600 mt-6 shadow-lg shadow-red-200"></div>
          </div>

          {/* SECTION 1 : CATÉGORIES & OBJECTIFS */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
            <div className="lg:col-span-1">
              <div className="bg-slate-900 text-white p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
                <div className="relative z-10">
                  <h3 className="text-xl font-black uppercase italic mb-6 text-red-600">Catégories</h3>
                  <ul className="space-y-4 font-bold text-sm">
                    {[
                      { name: "Kangourous (U8)", age: "6–7 ans" },
                      { name: "Benjamins (U10)", age: "8–9 ans" },
                      { name: "Pupilles (U12)", age: "10–11 ans" },
                      { name: "Minimes (U14)", age: "12–13 ans" }
                    ].map((cat, i) => (
                        <li key={i} className="flex justify-between border-b border-white/10 pb-2">
                          <span className="opacity-80">{cat.name}</span>
                          <span className="text-red-500 italic">{cat.age}</span>
                        </li>
                    ))}
                  </ul>
                </div>
                <GraduationCap className="absolute -right-8 -bottom-8 text-white/5 w-40 h-40 -rotate-12" />
              </div>
            </div>

            <div className="lg:col-span-2 bg-white/70 backdrop-blur-md p-10 rounded-[3rem] border border-white shadow-xl">
              <h2 className="text-3xl font-black uppercase italic text-slate-900 flex items-center gap-3 mb-6">
                <Target className="text-red-600" /> Objectif <span className="text-red-600">Pédagogique</span>
              </h2>
              <p className="text-lg text-slate-600 leading-relaxed italic mb-8">
                Favoriser le développement moteur global de l’enfant à travers des activités ludiques. L’accent est mis sur :
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  "Coordination & équilibre moteur",
                  "Découverte multidisciplinaire",
                  "Le plaisir de bouger ensemble",
                  "Apprentissage technique progressif"
                ].map((text, i) => (
                    <div key={i} className="flex items-center gap-4 p-4 bg-slate-50/50 rounded-2xl border border-slate-100 group hover:border-red-600 transition-colors">
                      <div className="h-2 w-2 bg-red-600 rotate-45 group-hover:scale-125 transition-transform"></div>
                      <span className="font-black uppercase italic text-[10px] tracking-widest text-slate-700">{text}</span>
                    </div>
                ))}
              </div>
            </div>
          </div>

          {/* SECTION 2 : PRINCIPES CLÉS (GRID GLASS) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
            {[
              { icon: Brain, title: "Motricité", desc: "Coordination, équilibre et dissociation segmentaire." },
              { icon: Award, title: "Le Jeu", desc: "Favorise l'engagement, la créativité et la socialisation." },
              { icon: Users, title: "Identité", desc: "Respect des règles, esprit d’équipe et rôle d’athlète." }
            ].map((item, i) => (
                <div key={i} className="bg-white/80 backdrop-blur-md p-8 rounded-[2.5rem] border border-white shadow-lg text-center group hover:-translate-y-2 transition-all">
                  <item.icon className="mx-auto text-red-600 mb-4 group-hover:scale-110 transition-transform" size={40} />
                  <h4 className="font-black uppercase italic text-lg mb-2">{item.title}</h4>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed uppercase tracking-tighter">{item.desc}</p>
                </div>
            ))}
          </div>

          {/* SECTION 3 : INFOS PRATIQUES */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
            <div className="space-y-8">
              <h2 className="text-4xl font-black uppercase italic text-slate-900 leading-tight">
                Horaire <br /><span className="text-red-600">& Lieu</span>
              </h2>

              <div className="space-y-4">
                <div className="flex items-center gap-6 p-6 bg-white/60 backdrop-blur-sm rounded-[2rem] border border-white shadow-sm">
                  <div className="p-4 bg-slate-900 text-white rounded-2xl shadow-lg"><Clock size={24} /></div>
                  <div>
                    <h4 className="font-black uppercase italic text-xs text-red-600">Mercredi</h4>
                    <p className="text-xl font-black italic text-slate-900">18h00 — 19h15</p>
                  </div>
                </div>

                <div className="flex items-center gap-6 p-6 bg-white/60 backdrop-blur-sm rounded-[2rem] border border-white shadow-sm">
                  <div className="p-4 bg-red-600 text-white rounded-2xl shadow-lg shadow-red-200"><MapPin size={24} /></div>
                  <div>
                    <h4 className="font-black uppercase italic text-xs text-red-600">Stade des Fusillés</h4>
                    <p className="text-sm font-bold text-slate-700 italic">Piste Daniel Thiry – Virton</p>
                  </div>
                </div>
              </div>
            </div>

            {/* BOX EXPERTISE */}
            <div className="relative group">
              <div className="absolute -inset-4 bg-red-600/10 rounded-[3rem] rotate-2 group-hover:rotate-0 transition-transform"></div>
              <div className="relative bg-slate-900 p-10 rounded-[2.5rem] shadow-2xl text-white">
                <div className="flex items-center gap-3 mb-6">
                  <BookOpen className="text-red-600" />
                  <h3 className="text-xl font-black uppercase italic">Encadrement Expert</h3>
                </div>
                <p className="text-slate-300 leading-relaxed italic mb-8 text-sm">
                  Les séances sont encadrées par des entraîneurs diplômés, spécialisés dans l’approche pédagogique des jeunes enfants.
                </p>
                <div className="pt-6 border-t border-white/10">
                  <p className="text-[10px] font-black uppercase text-red-600 mb-4 tracking-widest">Références Scientifiques :</p>
                  <ul className="space-y-3 text-[10px] text-slate-400 font-bold uppercase tracking-tight">
                    <li className="flex gap-2"><span>•</span> FFA (2020). GUIDE DE L’ÉCOLE D’ATHLÉTISME</li>
                    <li className="flex gap-2"><span>•</span> SÉBASTIEN RATEL : "ENTRAÎNER LES JEUNES"</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* CTA FINAL (Lien vers KBPM) */}
          <div className="text-center">
            <Link href="/infos/kbpm" className="inline-flex items-center gap-3 bg-red-600 text-white px-10 py-5 rounded-2xl font-black uppercase italic tracking-widest hover:bg-slate-900 transition-all shadow-xl active:scale-95 group">
              Retour aux infos compétitions <ChevronRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

        </main>
      </div>
  );
}