"use client";
import {
  Info,
  Users,
  Baby,
  Edit,
  ShoppingBag,
  Truck,
  Zap,
  Clock,
  MapPin,
  Gauge,
  Timer,
  CalendarCheck,
  Megaphone,
  Award
} from "lucide-react";
import Link from "next/link";

const CATEGORIES = [
  { name: "KANGOUROU", acro: "KAN", ages: "6-7 ans", years: "2019-2020", trad: "PAS AUTORISÉES", color: "text-slate-400" },
  { name: "BENJAMIN(E)", acro: "BEN", ages: "8-9 ans", years: "2017-2018", trad: "AUTORISÉES", color: "text-green-600" },
  { name: "PUPILLE", acro: "PUP", ages: "10-11 ans", years: "2015-2016", trad: "AUTORISÉES", color: "text-green-600" },
  { name: "MINIME", acro: "MIN", ages: "12-13 ans", years: "2013-2014", trad: "AUTORISÉES", color: "text-green-600" },
];

export default function KBPMPage() {
  return (
      <div className="min-h-screen">
        <main className="container mx-auto px-4 pt-32 pb-20 animate-in fade-in duration-700">

          {/* HEADER SECTION */}
          <div className="flex flex-col mb-16">
            <div className="flex items-center gap-3 mb-4">
              <span className="h-[2px] w-10 bg-red-600"></span>
              <span className="text-red-600 font-black uppercase italic tracking-[0.3em] text-[10px]">Jeunes Athlètes</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-slate-900 uppercase italic tracking-tighter leading-[0.9]">
              COMPÉTITION <br/><span className="text-red-600">K.B.P.M.</span>
            </h1>
            <p className="text-slate-500 font-bold text-sm mt-6 uppercase tracking-widest max-w-xl leading-relaxed">
              Kangourous, Benjamins, Pupilles & Minimes : Tout savoir pour accompagner vos futurs champions.
            </p>
          </div>

          {/* SECTION 1 : INTRO PARENTS */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-24">
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-slate-50 p-10 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden">
                <Info className="text-red-600 mb-6" size={32}/>
                <h2 className="text-2xl font-black uppercase italic text-slate-900 mb-4 tracking-tight">Chers parents,</h2>
                <p className="text-slate-600 leading-relaxed text-lg font-medium">
                  Le club encourage vivement ses jeunes athlètes à participer aux compétitions.
                  C'est l'occasion idéale de mettre en pratique les acquis des entraînements dans une
                  ambiance conviviale et formatrice.
                </p>

                <div className="mt-8 pl-6 border-l-4 border-red-600">
                  <p className="text-slate-800 text-xl font-black italic mb-2 leading-tight">
                    « Le coureur qui ne fait jamais de compétition ressemble fort à cet amoureux qui
                    ne donne jamais de preuve d’amour. »
                  </p>
                  <cite className="text-red-600 font-bold not-italic uppercase tracking-widest text-[10px]">— J. Joannes, 1984</cite>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-slate-900 text-white p-8 rounded-[2.5rem] shadow-xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-700">
                  <Users size={100} />
                </div>
                <Users className="text-red-600 mb-4 relative z-10" size={32}/>
                <h3 className="text-xl font-black uppercase italic mb-2 relative z-10">Le Comité Spécial</h3>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-wider leading-relaxed relative z-10">
                  Un comité dédié regroupe parents et entraîneurs pour l'amélioration continue de l'encadrement BPM.
                </p>
              </div>

              <div className="bg-red-600 p-8 rounded-[2.5rem] text-white shadow-lg relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:rotate-12 transition-transform duration-700">
                  <Award size={100} />
                </div>
                <Award size={32} className="mb-4 text-white relative z-10"/>
                <h3 className="text-xl font-black uppercase italic mb-2 relative z-10">Récompenses</h3>
                <p className="text-xs font-bold text-red-100 uppercase tracking-wider leading-relaxed relative z-10">
                  Participation régulière récompensée par la remise d'écussons et trophées en fin de saison.
                </p>
              </div>
            </div>
          </div>

          {/* CTA MÉTHODE PÉDAGOGIQUE */}
          <div className="mb-24">
            <Link href="/infos/kbpm/methode-pedagogique" className="group block">
              <div className="bg-white border-2 border-dashed border-slate-200 p-8 md:p-12 rounded-[3rem] flex flex-col md:flex-row items-center justify-between gap-8 hover:border-red-600 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center gap-8">
                  <div className="bg-red-50 p-6 rounded-3xl group-hover:bg-red-600 transition-colors duration-300">
                    <Edit className="text-red-600 group-hover:text-white transition-colors" size={40}/>
                  </div>
                  <div>
                    <h3 className="text-2xl md:text-3xl font-black uppercase italic text-slate-900 leading-none mb-2">
                      Notre méthode <span className="text-red-600">pédagogique</span>
                    </h3>
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">
                      Développement moteur & technique de l'enfant
                    </p>
                  </div>
                </div>
                <div className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black uppercase italic text-xs tracking-widest group-hover:bg-red-600 transition-colors shadow-lg">
                  En savoir plus
                </div>
              </div>
            </Link>
          </div>

          {/* SECTION : ÉCHAUFFEMENT */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-24 items-stretch">
            <div className="bg-slate-900 rounded-[3rem] p-10 md:p-14 text-white relative overflow-hidden group shadow-2xl">
              <Gauge className="absolute -right-10 -bottom-10 text-white/5 w-80 h-80 group-hover:rotate-12 transition-transform duration-1000"/>

              <div className="relative z-10 h-full flex flex-col justify-between">
                <div>
                  <div className="inline-flex items-center gap-2 bg-red-600 px-4 py-1.5 rounded-full mb-6">
                    <Zap size={12} className="text-white" />
                    <span className="text-[9px] font-black uppercase tracking-widest">Performance</span>
                  </div>
                  <h2 className="text-4xl font-black uppercase italic mb-8 leading-tight">
                    L'importance de <br/><span className="text-red-600">l'échauffement</span>
                  </h2>

                  <div className="space-y-6 text-slate-300 font-medium leading-relaxed">
                    <p>
                      Nous veillerons à avoir au minimum <strong className="text-white">un membre attitré</strong> à l’échauffement le jour des compétitions.
                    </p>
                    <p>
                      L’échauffement pré-compétition est <strong className="text-white">indispensable</strong> pour être prêt physiquement et éviter les blessures avant de concourir.
                    </p>
                  </div>
                </div>

                <div className="mt-10 bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/10 text-xs font-bold uppercase tracking-wide text-white flex items-center gap-4">
                  <Users size={20} className="text-red-500" />
                  Un moniteur sera présent pour encadrer vos enfants sur place.
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-center space-y-10 p-4">
              <div>
                <h2 className="text-4xl font-black text-slate-900 uppercase italic leading-none mb-4">
                  Une compétition, <br/><span className="text-red-600">ça dure combien de temps ?</span>
                </h2>
                <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">
                  Estimations variables selon l'affluence
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 hover:border-red-200 transition-colors group">
                  <h4 className="font-black text-xs uppercase text-slate-400 mb-2 tracking-widest group-hover:text-red-600 transition-colors">Courses</h4>
                  <p className="text-2xl font-black italic text-slate-900 mb-2">15-20 min</p>
                  <p className="text-xs font-bold text-slate-500 uppercase">Sprint (60-80m) et Demi-fond (1000m)</p>
                </div>
                <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 hover:border-red-200 transition-colors group">
                  <h4 className="font-black text-xs uppercase text-slate-400 mb-2 tracking-widest group-hover:text-red-600 transition-colors">Concours</h4>
                  <p className="text-2xl font-black italic text-slate-900 mb-2">30-60 min</p>
                  <p className="text-xs font-bold text-slate-500 uppercase">Sauts (hauteur/perche) et lancers</p>
                </div>
              </div>
            </div>
          </div>

          {/* TIMELINE ROUGE */}
          <div className="mb-24 bg-red-600 rounded-[3rem] p-10 md:p-16 text-white shadow-2xl shadow-red-600/30 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-20 opacity-10 pointer-events-none">
              <Timer size={200} />
            </div>

            <div className="relative z-10">
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
                <div>
                  <h3 className="text-3xl md:text-5xl font-black uppercase italic leading-none mb-2">Timing Total</h3>
                  <p className="text-red-100 font-bold uppercase tracking-widest text-xs">Estimation moyenne sur place</p>
                </div>
                <div className="bg-white text-red-600 px-8 py-4 rounded-2xl font-black text-3xl italic shadow-lg transform -rotate-2">
                  1H30 MAX
                </div>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-10">
                {[
                  { time: "10'", label: "Inscription" },
                  { time: "30'", label: "Échauffement" },
                  { time: "60'", label: "Participation" },
                  { time: "10'", label: "Relâchement" },
                ].map((item, i) => (
                    <div key={i} className="space-y-2 border-l-4 border-white/20 pl-6">
                      <span className="text-5xl font-black opacity-40 italic block">{item.time}</span>
                      <h4 className="font-bold uppercase text-xs tracking-[0.2em]">{item.label}</h4>
                    </div>
                ))}
              </div>
            </div>
          </div>

          {/* SECTION 3 : CATÉGORIES */}
          <div className="mb-24">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
              <div>
                <h2 className="text-4xl font-black text-slate-900 uppercase italic leading-none">
                  Quelle est la <br/><span className="text-red-600">catégorie de mon enfant ?</span>
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
              <div className="space-y-6">
                <div className="p-10 bg-slate-900 rounded-[2.5rem] text-white flex flex-col items-center text-center shadow-xl">
                  <Baby className="text-red-600 mb-6" size={48}/>
                  <p className="font-bold text-lg leading-tight">
                    Les catégories regroupent les athlètes par tranche de <span className="text-red-600 font-black italic">deux ans</span>.
                  </p>
                </div>
                <div className="p-8 border-2 border-dashed border-slate-200 rounded-[2.5rem] italic text-slate-500 text-xs font-bold uppercase tracking-wide leading-relaxed text-center">
                  "La notion de « toute catégorie » ne concerne pas les BPM."
                </div>
              </div>

              <div className="lg:col-span-2 overflow-hidden rounded-[2.5rem] border border-slate-200 shadow-xl bg-white">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[600px]">
                    <thead>
                    <tr className="bg-slate-50 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 border-b border-slate-100">
                      <th className="p-6">Catégorie</th>
                      <th className="p-6 text-center text-red-600">Code</th>
                      <th className="p-6">Ages</th>
                      <th className="p-6">Années</th>
                      <th className="p-6 text-right">Status</th>
                    </tr>
                    </thead>
                    <tbody>
                    {CATEGORIES.map((cat, idx) => (
                        <tr key={idx} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors group">
                          <td className="p-6 font-black italic text-slate-900 text-lg">{cat.name}</td>
                          <td className="p-6 text-center font-black text-slate-300 group-hover:text-red-600 transition-colors">{cat.acro}</td>
                          <td className="p-6 font-bold text-slate-600 text-sm">{cat.ages}</td>
                          <td className="p-6 font-black text-red-600 italic">{cat.years}</td>
                          <td className={`p-6 text-right font-black text-[9px] uppercase tracking-widest ${cat.color}`}>{cat.trad}</td>
                        </tr>
                    ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 4 : ÉPREUVES */}
          <div className="mb-24">
            <h2 className="text-4xl font-black text-slate-900 uppercase italic mb-10">
              Les épreuves <span className="text-red-600">BPM</span>
            </h2>

            <div className="overflow-hidden rounded-[2.5rem] border border-slate-200 shadow-xl bg-white">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[900px]">
                  <thead>
                  <tr className="bg-slate-900 text-white text-[10px] font-black uppercase tracking-[0.2em]">
                    <th className="p-6">Cat.</th>
                    <th className="p-6 border-l border-white/10">Courses</th>
                    <th className="p-6 border-l border-white/10">Sauts</th>
                    <th className="p-6 border-l border-white/10">Lancers</th>
                    <th className="p-6 border-l border-white/10">Relais</th>
                    <th className="p-6 border-l border-white/10">Combinées</th>
                  </tr>
                  </thead>
                  <tbody className="text-slate-600 font-medium text-sm leading-relaxed">
                  {[
                    { cat: "BEN", run: ["60m", "600m"], jump: ["Longueur", "Hauteur"], throw: ["Balle", "Poids"], relay: "4x60m", comb: "Tétrathlon" },
                    { cat: "PUP", run: ["60m", "60m Haies", "1000m"], jump: ["Longueur", "Hauteur"], throw: ["Balle", "Poids", "Disque"], relay: "4x60m", comb: "Tétrathlon" },
                    { cat: "MIN", run: ["80m", "150m", "300m", "1000m", "Haies"], jump: ["Longueur", "Hauteur", "Perche"], throw: ["Javelot", "Poids", "Disque"], relay: "4x80m", comb: "Pentathlon" },
                  ].map((row, i) => (
                      <tr key={i} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                        <td className="p-6 font-black text-red-600 bg-slate-50/50 italic text-lg">{row.cat}</td>
                        <td className="p-6 border-l border-slate-100">
                          {row.run.map(r => <div key={r} className="mb-1">{r}</div>)}
                        </td>
                        <td className="p-6 border-l border-slate-100">
                          {row.jump.map(j => <div key={j} className="mb-1">{j}</div>)}
                        </td>
                        <td className="p-6 border-l border-slate-100">
                          {row.throw.map(t => <div key={t} className="mb-1">{t}</div>)}
                        </td>
                        <td className="p-6 border-l border-slate-100 font-bold">{row.relay}</td>
                        <td className="p-6 border-l border-slate-100 font-black italic text-slate-900">{row.comb}</td>
                      </tr>
                  ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* SECTION 5 : LIRE UN HORAIRE */}
          <div className="mb-24">
            <div className="flex flex-col mb-12">
              <h2 className="text-4xl font-black text-slate-900 uppercase italic">
                Lire une <span className="text-red-600">grille horaire</span>
              </h2>
              <div className="h-2 w-20 bg-red-600 mt-4"></div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
              <div className="space-y-6 lg:sticky lg:top-32">
                <div className="p-10 bg-slate-50 rounded-[2.5rem] border border-slate-100 space-y-8">
                  <div className="space-y-2">
                    <h4 className="font-black uppercase text-xs text-red-600 italic tracking-widest flex items-center gap-2">
                      <Clock size={16} /> Heure de début
                    </h4>
                    <p className="text-sm font-medium text-slate-600 leading-relaxed">
                      L'heure indiquée est celle du <strong className="text-slate-900">début effectif</strong>. L'athlète doit être échauffé et prêt à l'appel.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-black uppercase text-xs text-red-600 italic tracking-widest flex items-center gap-2">
                      <Info size={16} /> Abréviations
                    </h4>
                    <p className="text-sm font-medium text-slate-600 leading-relaxed">
                      <span className="font-bold">MH</span> = Minimes Hommes <br/>
                      <span className="font-bold">PF</span> = Pupilles Filles <br/>
                      Vérifiez bien votre colonne !
                    </p>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-2 relative group">
                <div className="overflow-hidden rounded-[2.5rem] border-4 border-slate-900 shadow-2xl bg-white">
                  <img
                      src="/Grille-de-lecture.gif"
                      alt="Exemple Grille Horaire"
                      className="w-full h-auto"
                  />
                </div>
                <div className="absolute -bottom-6 -right-6 bg-red-600 text-white px-8 py-4 rounded-3xl font-black uppercase italic text-xs tracking-widest shadow-xl rotate-3">
                  Exemple Type
                </div>
              </div>
            </div>
          </div>

          {/* LOGISTIQUE */}
          <div className="mb-24">
            <h2 className="text-4xl font-black text-slate-900 uppercase italic mb-12">
              Logistique <span className="text-red-600">& Pratique</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-slate-50 p-10 rounded-[2.5rem] space-y-6 hover:bg-white hover:shadow-xl transition-all duration-300 border border-transparent hover:border-slate-100">
                <div className="p-4 bg-white rounded-2xl w-fit shadow-sm"><ShoppingBag className="text-red-600" size={24}/></div>
                <h4 className="font-black uppercase italic text-xl">Dans le sac</h4>
                <ul className="text-slate-600 space-y-3 text-sm font-medium">
                  <li className="flex gap-2"><span className="text-red-600 font-bold">•</span> Maillot & dossard</li>
                  <li className="flex gap-2"><span className="text-red-600 font-bold">•</span> Spikes (6mm)</li>
                  <li className="flex gap-2"><span className="text-red-600 font-bold">•</span> 4 Épingles</li>
                  <li className="flex gap-2"><span className="text-red-600 font-bold">•</span> Vêtements chauds</li>
                </ul>
              </div>

              <div className="bg-slate-900 p-10 rounded-[2.5rem] space-y-6 text-white shadow-xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform"><Clock size={100} /></div>
                <div className="p-4 bg-white/10 rounded-2xl w-fit"><Clock className="text-red-500" size={24}/></div>
                <h4 className="font-black uppercase italic text-xl relative z-10">Timing</h4>
                <p className="text-slate-300 text-sm font-medium leading-relaxed relative z-10">
                  Présentez-vous au secrétariat au moins <strong className="text-white">45 minutes</strong> avant votre première épreuve pour confirmer votre présence.
                </p>
              </div>

              <div className="bg-slate-50 p-10 rounded-[2.5rem] space-y-6 hover:bg-white hover:shadow-xl transition-all duration-300 border border-transparent hover:border-slate-100">
                <div className="p-4 bg-white rounded-2xl w-fit shadow-sm"><Truck className="text-red-600" size={24}/></div>
                <h4 className="font-black uppercase italic text-xl">Déplacement</h4>
                <p className="text-slate-600 text-sm font-medium leading-relaxed">
                  Le club favorise le co-voiturage. Organisez-vous avec les autres parents ou via le groupe WhatsApp officiel.
                </p>
              </div>
            </div>
          </div>

          {/* SECTION PARENTS & RÉSULTATS */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-24 items-start">

            <div className="space-y-8">
              <h2 className="text-3xl font-black text-slate-900 uppercase italic leading-tight">
                Pendant ce temps, <br/><span className="text-red-600">que font les parents ?</span>
              </h2>

              <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm space-y-6">
                <div className="flex gap-6 items-start">
                  <div className="p-3 bg-red-50 rounded-2xl text-red-600 shrink-0"><Users size={24}/></div>
                  <div>
                    <h4 className="font-black uppercase italic text-sm mb-2">Gradins & Cafétaria</h4>
                    <p className="text-sm text-slate-500 font-medium leading-relaxed">Installez-vous confortablement pour suivre les exploits.</p>
                  </div>
                </div>
                <div className="flex gap-6 items-start">
                  <div className="p-3 bg-red-50 rounded-2xl text-red-600 shrink-0"><MapPin size={24}/></div>
                  <div>
                    <h4 className="font-black uppercase italic text-sm mb-2">Zones autorisées</h4>
                    <p className="text-sm text-slate-500 font-medium leading-relaxed">Restez derrière la main courante près des sautoirs et lancers.</p>
                  </div>
                </div>
                <div className="bg-red-600 p-6 rounded-3xl text-white text-xs font-bold uppercase tracking-wide leading-relaxed">
                  ⚠️ Il est interdit de courir à côté des athlètes pour les encourager.
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <h2 className="text-3xl font-black text-slate-900 uppercase italic leading-tight">
                Les résultats <br/><span className="text-red-600">de compétition</span>
              </h2>

              <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden">
                <Megaphone className="text-red-600 mb-4" size={32} />
                <h4 className="font-black uppercase italic mb-2">Annonces Live</h4>
                <p className="text-slate-400 text-sm font-medium mb-6">Résultats au micro ou affichés au secrétariat.</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Link href="https://www.beathletics.be/res/calendrier" target="_blank" className="bg-white text-slate-900 px-6 py-4 rounded-2xl font-black uppercase italic text-xs tracking-wider hover:bg-red-600 hover:text-white transition-all text-center">
                    BeAthletics
                  </Link>
                  <div className="bg-white/10 text-white px-6 py-4 rounded-2xl font-black uppercase italic text-xs tracking-wider text-center border border-white/10">
                    Journal ACDiste
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ENTRAÎNEMENTS D'ÉTÉ */}
          <div className="mb-24">
            <h2 className="text-4xl font-black text-slate-900 uppercase italic mb-10">
              L'entraînement <span className="text-red-600">estival</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-8 bg-slate-900 rounded-[2.5rem] text-white shadow-xl">
                <h4 className="font-black uppercase italic text-red-600 text-xl mb-4">Saint-Mard</h4>
                <div className="space-y-3 text-xs font-bold uppercase tracking-wider text-slate-300">
                  <p>Mercredi <span className="text-white">18h00</span></p>
                  <p>Vendredi <span className="text-white">18h00</span></p>
                  <p className="text-red-500 pt-2 border-t border-white/10">Psycho : Mer 17h45</p>
                </div>
              </div>

              <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100">
                <h4 className="font-black uppercase italic text-slate-900 text-xl mb-4">Izel</h4>
                <div className="space-y-3 text-xs font-bold uppercase tracking-wider text-slate-500">
                  <p>Mer (BEN/PUP) <span className="text-slate-900">17h30</span></p>
                  <p>Mer (MIN) <span className="text-slate-900">18h00</span></p>
                </div>
              </div>

              <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100">
                <h4 className="font-black uppercase italic text-slate-900 text-xl mb-4">Bastogne</h4>
                <div className="space-y-3 text-xs font-bold uppercase tracking-wider text-slate-500">
                  <p>Mardi <span className="text-slate-900">16h00</span></p>
                </div>
              </div>

              <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100">
                <h4 className="font-black uppercase italic text-slate-900 text-xl mb-4">Habay</h4>
                <div className="space-y-3 text-xs font-bold uppercase tracking-wider text-slate-500">
                  <p>Lundi <span className="text-slate-900">18h00</span></p>
                </div>
              </div>
            </div>
          </div>

          {/* CHECKLIST FINALE */}
          <div className="bg-white border-2 border-dashed border-slate-200 rounded-[3rem] p-12 text-center">
            <h2 className="text-2xl font-black text-slate-900 uppercase italic mb-8">
              Prêts pour le <span className="text-red-600">départ ?</span>
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              {["Agenda", "Sac", "Horaire", "Plaisir"].map((item, i) => (
                  <div key={i} className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center text-red-600">
                      <CalendarCheck size={20} />
                    </div>
                    <span className="font-black uppercase italic text-sm">{item}</span>
                  </div>
              ))}
            </div>
          </div>

        </main>
      </div>
  );
}