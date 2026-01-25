import { Navbar } from "@/components/navbar/navbar";
import { Info, Users, Calendar, Mail, Baby, Edit, ShoppingBag, Truck, Zap, Clock, MapPin, Gauge, Timer } from "lucide-react";
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

        <main className="container mx-auto px-4 py-12 pt-32 text-slate-900">

          {/* TITRE PRINCIPAL */}
          <div className="flex flex-col mb-12">
            <h1 className="text-4xl font-black text-slate-900 uppercase italic">
              La compétition <span className="text-red-600">en athlétisme (K.B.P.M.)</span>
            </h1>
            <div className="h-2 w-24 bg-red-600 mt-2"></div>
          </div>

          {/* SECTION 1 : INTRODUCTION */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-20">
            <div className="lg:col-span-2 space-y-8">
              <h2 className="text-2xl font-black uppercase italic text-slate-800 flex items-center gap-3">
                <Info className="text-red-600"/> Chers parents,
              </h2>
              <div className="space-y-6 text-slate-600 leading-relaxed text-lg">
                <p>
                  Le club encourage vivement ses jeunes athlètes à participer aux compétitions.
                  C'est l'occasion de mettre en pratique les acquis des entraînements dans une
                  ambiance conviviale.
                </p>
                <div
                    className="bg-slate-50 border-l-4 border-red-600 p-8 rounded-r-3xl italic shadow-sm">
                  <p className="text-slate-700 text-xl font-medium mb-4">
                    « Le coureur qui ne fait jamais de compétition ressemble fort à cet amoureux qui
                    ne donne jamais de preuve d’amour. »
                  </p>
                  <cite
                      className="text-red-600 font-bold not-italic uppercase tracking-widest text-sm">—
                    J. Joannes, 1984</cite>
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <div className="bg-slate-900 text-white p-8 rounded-[2rem] shadow-xl">
                <Users className="text-red-600 mb-4" size={32}/>
                <h3 className="text-xl font-black uppercase italic mb-4">Le Comité Spécial</h3>
                <p className="text-slate-300 text-sm leading-relaxed">Un comité dédié regroupe
                  parents et entraîneurs pour l'amélioration de l'encadrement des catégories
                  BPM.</p>
              </div>
              <div className="bg-red-600 p-8 rounded-[2rem] text-white shadow-lg">
                <Zap size={32} className="mb-4 text-white"/>
                <h3 className="text-xl font-black uppercase italic mb-2">Récompenses</h3>
                <p className="text-sm text-red-100">En fin de saison, la participation régulière est
                  récompensée par la remise d'écussons et trophées.</p>
              </div>
            </div>
          </div>

          {/* LIEN VERS MÉTHODE PÉDAGOGIQUE */}
          <div className="mb-20">
            <Link href="/infos/kbpm/methode-pedagogique" className="group block">
              <div className="bg-slate-50 border-2 border-dashed border-slate-200 p-8 rounded-[2.5rem] flex flex-col md:flex-row items-center justify-between gap-6 hover:border-red-600 hover:bg-white transition-all duration-300">
                <div className="flex items-center gap-6">
                  <div className="bg-white p-4 rounded-2xl shadow-sm group-hover:bg-red-600 transition-colors">
                    <Edit className="text-red-600 group-hover:text-white" size={32} />
                  </div>
                  <div>
                    <h3 className="text-xl font-black uppercase italic text-slate-900">
                      Notre méthode <span className="text-red-600">pédagogique</span>
                    </h3>
                    <p className="text-sm text-slate-500 mt-1 italic">
                      Découvrez comment nous accompagnons le développement moteur et technique de vos enfants.
                    </p>
                  </div>
                </div>
                <div className="bg-slate-900 text-white px-6 py-3 rounded-xl font-black uppercase italic text-xs tracking-widest group-hover:bg-red-600 transition-colors">
                  En savoir plus →
                </div>
              </div>
            </Link>
          </div>

          {/* SECTION : ÉCHAUFFEMENT ET ACCOMPAGNEMENT */}
          <div
              className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20 pt-12 border-t border-slate-100">
            <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden">
              <Gauge className="absolute -right-8 -bottom-8 text-white/5 w-64 h-64 rotate-12"/>
              <div className="relative z-10">
                <h2 className="text-3xl font-black uppercase italic mb-6">L'importance de <span
                    className="text-red-600">l'échauffement</span></h2>
                <div className="space-y-4 text-slate-300 leading-relaxed">
                  <p>Nous veillerons à avoir au minimum **un membre attitré** à l’échauffement le
                    jour des compétitions.</p>
                  <p>L’échauffement pré-compétition ne diffère pas nécessairement de celui des
                    entraînements, mais il est **indispensable** d'être prêt physiquement avant de
                    concourir.</p>
                  <div
                      className="bg-white/10 p-4 rounded-2xl border border-white/10 text-sm italic">
                    Un moniteur/entraîneur sera présent pour encadrer vos enfants sur place.
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-center space-y-8 p-4">
              <h2 className="text-3xl font-black text-slate-900 uppercase italic">
                Une compétition, <br/><span
                  className="text-red-600">ça prend combien de temps ?</span>
              </h2>
              <p className="text-slate-600 leading-relaxed">
                La durée peut varier grandement suivant le choix d’épreuves et le nombre de
                participants. Voici quelques estimations :
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                  <h4 className="font-black text-xs uppercase text-red-600 mb-2 tracking-widest italic">Courses</h4>
                  <p className="text-sm font-bold">15 à 20 minutes</p>
                  <p className="text-xs text-slate-500 mt-1">Sprint (60-80m) et Demi-fond
                    (1000m)</p>
                </div>
                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                  <h4 className="font-black text-xs uppercase text-red-600 mb-2 tracking-widest italic">Sauts
                    & Lancers</h4>
                  <p className="text-sm font-bold">30 à 60 minutes</p>
                  <p className="text-xs text-slate-500 mt-1">Sauts en hauteur et perche sont plus
                    longs.</p>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION : DÉTAIL DU TEMPS (TIMELINE) */}
          <div
              className="mb-20 bg-red-600 rounded-[2.5rem] p-10 text-white shadow-2xl shadow-red-200">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
              <div>
                <h3 className="text-2xl font-black uppercase italic italic">Estimation totale par
                  épreuve</h3>
                <p className="text-red-100 italic">Prévoyez environ 1h00 à 1h30 au total sur
                  place.</p>
              </div>
              <div
                  className="bg-white text-red-600 px-8 py-4 rounded-2xl font-black text-2xl italic shadow-lg">
                1H30 MAX
              </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="space-y-2 border-l-2 border-white/20 pl-6">
                <span className="text-4xl font-black opacity-30 italic">10'</span>
                <h4 className="font-bold uppercase text-xs tracking-widest">Inscription</h4>
              </div>
              <div className="space-y-2 border-l-2 border-white/20 pl-6">
                <span className="text-4xl font-black opacity-30 italic">30'</span>
                <h4 className="font-bold uppercase text-xs tracking-widest">Échauffement</h4>
              </div>
              <div className="space-y-2 border-l-2 border-white/20 pl-6">
                <span className="text-4xl font-black opacity-30 italic">15-60'</span>
                <h4 className="font-bold uppercase text-xs tracking-widest">Participation</h4>
              </div>
              <div className="space-y-2 border-l-2 border-white/20 pl-6">
                <span className="text-4xl font-black opacity-30 italic">10'</span>
                <h4 className="font-bold uppercase text-xs tracking-widest">Relâchement</h4>
              </div>
            </div>
          </div>

          {/* SECTION 3 : CATÉGORIES */}
          <div className="mb-20 pt-12 border-t border-slate-100">
            <h2 className="text-3xl font-black text-slate-900 uppercase italic mb-8">
              Quelle est la <span className="text-red-600">catégorie de mon enfant ?</span>
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
              <div className="space-y-6">
                <div
                    className="p-8 bg-slate-900 rounded-[2rem] text-white flex flex-col items-center text-center">
                  <Baby className="text-red-600 mb-4" size={40}/>
                  <p className="font-medium">Les catégories regroupent les athlètes par tranche
                    de <span className="text-red-600 font-black">deux ans</span>.</p>
                </div>
                <div
                    className="p-8 border border-slate-100 rounded-[2rem] bg-slate-50/50 italic text-slate-500 text-sm leading-relaxed">
                  "La notion de « toute catégorie » s'entend à partir de Cadet(te). Les BPM ne sont
                  pas concernés par cette dénomination."
                </div>
              </div>

              <div
                  className="lg:col-span-2 overflow-hidden rounded-[2rem] border border-slate-100 shadow-sm bg-white">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                  <tr className="bg-slate-50/50 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100">
                    <th className="p-6">Catégorie</th>
                    <th className="p-6 text-red-600 text-center">Acro.</th>
                    <th className="p-6">Ages</th>
                    <th className="p-6">Années de naissance</th>
                    <th className="p-6 text-right">Compétitions</th>
                  </tr>
                  </thead>
                  <tbody>
                  {CATEGORIES.map((cat, idx) => (
                      <tr key={idx}
                          className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                        <td className="p-6 font-black italic text-slate-800">{cat.name}</td>
                        <td className="p-6 text-center font-bold text-slate-400">{cat.acro}</td>
                        <td className="p-6 font-medium text-slate-500">{cat.ages}</td>
                        <td className="p-6 font-black text-red-600 italic">{cat.years}</td>
                        <td className={`p-6 text-right font-black text-[10px] tracking-widest ${cat.color}`}>{cat.trad}</td>
                      </tr>
                  ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* SECTION 4 : ÉPREUVES */}
          <div className="mb-20 pt-12 border-t border-slate-100">
            <h2 className="text-3xl font-black text-slate-900 uppercase italic mb-8">
              Quelles sont les épreuves <span className="text-red-600">pour les BPM ?</span>
            </h2>
            <div
                className="overflow-hidden rounded-[2rem] border border-slate-200 shadow-xl bg-white">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                <tr className="bg-white border-b border-slate-100 text-red-600 font-black uppercase text-xs italic">
                  <th className="p-6 border-r border-slate-100">Catégorie</th>
                  <th className="p-6 border-r border-slate-100">Courses</th>
                  <th className="p-6 border-r border-slate-100">Concours : Sauts</th>
                  <th className="p-6 border-r border-slate-100">Concours : Lancers</th>
                  <th className="p-6 border-r border-slate-100">Relais</th>
                  <th className="p-6">Épreuves Combinées</th>
                </tr>
                </thead>
                <tbody className="text-slate-700 font-medium leading-relaxed">
                <tr className="border-b border-slate-50">
                  <td className="p-6 font-black bg-slate-50/30 border-r">BEN</td>
                  <td className="p-6 border-r">60m<br/>600m</td>
                  <td className="p-6 border-r">L = Longueur<br/>H = Hauteur</td>
                  <td className="p-6 border-r">Ba (ou BH) = Balle de hockey<br/>Po = Poids</td>
                  <td className="p-6 border-r">4x60m</td>
                  <td className="p-6 font-bold">Tétrathlon</td>
                </tr>
                <tr className="border-b border-slate-50">
                  <td className="p-6 font-black bg-slate-50/30 border-r">PUP</td>
                  <td className="p-6 border-r">60m<br/>60m haies<br/>1000m</td>
                  <td className="p-6 border-r">L = Longueur<br/>H = Hauteur</td>
                  <td className="p-6 border-r">Ba (ou BH) = Balle de hockey<br/>Po = Poids<br/>D =
                    Disque
                  </td>
                  <td className="p-6 border-r">4x60m<br/>4x1000m</td>
                  <td className="p-6 font-bold">Tétrathlon</td>
                </tr>
                <tr>
                  <td className="p-6 font-black bg-slate-50/30 border-r">MIN</td>
                  <td className="p-6 border-r whitespace-pre-line">80m{"\n"}60m haies (F){"\n"}80m
                    haies (G){"\n"}150m{"\n"}150m haies{"\n"}300m{"\n"}1000m
                  </td>
                  <td className="p-6 border-r whitespace-pre-line">L = Longueur{"\n"}H =
                    Hauteur{"\n"}Pe = Perche
                  </td>
                  <td className="p-6 border-r whitespace-pre-line">J = Javelot{"\n"}Po = Poids{"\n"}D
                    = Disque
                  </td>
                  <td className="p-6 border-r">4x80m<br/>4x1000m</td>
                  <td className="p-6 font-bold">Pentathlon</td>
                </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* SECTION 5 : COMMENT LIRE UN HORAIRE */}
          <div className="mb-20 pt-12 border-t border-slate-100">
            <div className="flex flex-col mb-12">
              <h2 className="text-3xl font-black text-slate-900 uppercase italic">
                Comment lire <span className="text-red-600">une grille horaire ?</span>
              </h2>
              <div className="h-1.5 w-16 bg-red-600 mt-2"></div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
              <div className="space-y-6 lg:sticky lg:top-32">
                <div className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100 space-y-6">
                  <div className="space-y-2">
                    <h4 className="font-black uppercase text-sm text-red-600 italic">L'heure de
                      début</h4>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      L'heure indiquée est celle du **début effectif** de l'épreuve. L'athlète doit
                      être échauffé et prêt à concourir à ce moment précis.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-black uppercase text-sm text-red-600 italic">Les
                      abréviations</h4>
                    <p className="text-sm text-slate-600 leading-relaxed italic">
                      "MH" = Minimes Hommes, "PF" = Pupilles Filles, etc. Vérifiez bien votre
                      colonne !
                    </p>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-2 group relative">
                <div
                    className="overflow-hidden rounded-[2.5rem] border-4 border-slate-900 shadow-2xl bg-white">
                  <img
                      src="/Grille-de-lecture.gif"
                      alt="Exemple de grille horaire Meeting BPM"
                      className="w-full h-auto cursor-zoom-in hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div
                    className="absolute -bottom-4 -right-4 bg-red-600 text-white px-6 py-3 rounded-2xl font-black uppercase italic text-xs shadow-xl">
                  Exemple de meeting
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 6 : LOGISTIQUE */}
          <div className="pt-12 border-t border-slate-100">
            <h2 className="text-3xl font-black text-slate-900 uppercase italic mb-12">Infos
              pratiques <span className="text-red-600">& Logistique</span></h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">
              <div className="bg-slate-50 p-8 rounded-[2.5rem] space-y-4">
                <ShoppingBag className="text-red-600" size={32}/>
                <h4 className="font-black uppercase italic">Ce qu'il faut emporter</h4>
                <ul className="text-slate-600 space-y-2 list-disc list-inside">
                  <li>Maillot et dossard obligatoire</li>
                  <li>Spikes (pointes de 6mm)</li>
                  <li>Épingles de sûreté (x4)</li>
                  <li>Vêtements chauds / de rechange</li>
                </ul>
              </div>
              <div
                  className="bg-slate-50 p-8 rounded-[2.5rem] space-y-4 border-2 border-red-600 shadow-xl">
                <Clock className="text-red-600" size={32}/>
                <h4 className="font-black uppercase italic">Timing à respecter</h4>
                <p className="text-slate-600">Présentez-vous au secrétariat au moins 45 minutes
                  avant votre première épreuve pour confirmer votre présence.</p>
              </div>
              <div className="bg-slate-50 p-8 rounded-[2.5rem] space-y-4">
                <Truck className="text-red-600" size={32}/>
                <h4 className="font-black uppercase italic">Déplacement</h4>
                <p className="text-slate-600">Le club favorise le co-voiturage. N'hésitez pas à
                  contacter les autres parents ou les entraîneurs via le groupe WhatsApp.</p>
              </div>
            </div>
          </div>

          {/* NOUVELLE SECTION : ÉCHAUFFEMENT ET TEMPS */}
          <div
              className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12 pt-12 border-t border-slate-100">
            <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden">
              <Gauge className="absolute -right-8 -bottom-8 text-white/5 w-64 h-64 rotate-12"/>
              <div className="relative z-10">
                <h2 className="text-3xl font-black uppercase italic mb-6">L'importance de <span
                    className="text-red-600">l'échauffement</span></h2>
                <div className="space-y-4 text-slate-300 leading-relaxed text-sm">
                  <p>Nous avons constaté l’importance d’assurer la présence d’un
                    **moniteur/entraîneur** pour encadrer l’échauffement des enfants le jour des
                    compétitions.</p>
                  <p>Nous veillerons donc à avoir au minimum un membre attitré à l’échauffement.
                    S'il ne diffère pas nécessairement des jours d'entraînements, il est
                    **primordial** d'être prêt avant de concourir ou de courir.</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-center space-y-6 p-4">
              <h2 className="text-3xl font-black text-slate-900 uppercase italic leading-tight">
                Une compétition, <br/><span
                  className="text-red-600">ça prend combien de temps ?</span>
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed">
                Suivant le choix d’épreuves et le nombre de participants, la durée peut varier
                grandement. Voici nos estimations pour vous organiser :
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                  <h4 className="font-black text-[10px] uppercase text-red-600 mb-1 tracking-widest italic">Courses</h4>
                  <p className="text-sm font-bold italic">15 à 20 minutes</p>
                  <p className="text-[10px] text-slate-500 mt-1 uppercase font-bold tracking-tighter">Sprint
                    & Demi-fond</p>
                </div>
                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                  <h4 className="font-black text-[10px] uppercase text-red-600 mb-1 tracking-widest italic">Concours</h4>
                  <p className="text-sm font-bold italic">30 à 60 minutes</p>
                  <p className="text-[10px] text-slate-500 mt-1 uppercase font-bold tracking-tighter">Sauts
                    & Lancers</p>
                </div>
              </div>
            </div>
          </div>

          {/* BANDEAU ESTIMATION TOTALE */}
          <div
              className="mb-20 bg-red-600 rounded-[2.5rem] p-10 text-white shadow-2xl shadow-red-200">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
              <div>
                <h3 className="text-2xl font-black uppercase italic">Estimation totale par
                  épreuve</h3>
                <p className="text-red-100 text-sm italic">Prévoyez environ 1h00 à 1h30 au total sur
                  place.</p>
              </div>
              <div
                  className="bg-white text-red-600 px-8 py-4 rounded-2xl font-black text-2xl italic shadow-lg flex items-center gap-3">
                <Timer size={32}/> 1H30 MAX
              </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="space-y-1 border-l-2 border-white/20 pl-6">
                <span className="text-4xl font-black opacity-30 italic">10'</span>
                <h4 className="font-bold uppercase text-[10px] tracking-widest">Inscription</h4>
              </div>
              <div className="space-y-1 border-l-2 border-white/20 pl-6">
                <span className="text-4xl font-black opacity-30 italic">30'</span>
                <h4 className="font-bold uppercase text-[10px] tracking-widest">Échauffement</h4>
              </div>
              <div className="space-y-1 border-l-2 border-white/20 pl-6">
                <span className="text-4xl font-black opacity-30 italic">15-60'</span>
                <h4 className="font-bold uppercase text-[10px] tracking-widest">Participation</h4>
              </div>
              <div className="space-y-1 border-l-2 border-white/20 pl-6">
                <span className="text-4xl font-black opacity-30 italic">10'</span>
                <h4 className="font-bold uppercase text-[10px] tracking-widest">Relâchement</h4>
              </div>
            </div>
          </div>

          {/* SECTION 6 : ASSISTER ET RÉSULTATS */}
          <div
              className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20 pt-12 border-t border-slate-100">

            {/* CÔTÉ PARENTS */}
            <div className="space-y-8">
              <h2 className="text-3xl font-black text-slate-900 uppercase italic">
                Pendant ce temps, <span className="text-red-600">que font les parents ?</span>
              </h2>

              <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100 space-y-6">
                <div className="flex gap-4">
                  <div className="bg-white p-3 rounded-2xl shadow-sm h-fit"><Users size={20}
                                                                                   className="text-red-600"/>
                  </div>
                  <div>
                    <h4 className="font-black uppercase italic text-sm">Gradins & Cafétaria</h4>
                    <p className="text-sm text-slate-600 mt-1 leading-relaxed">Tous les parents sont
                      les bienvenus ! Les gradins et la cafétéria sont à votre disposition pour
                      suivre les épreuves confortablement.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="bg-white p-3 rounded-2xl shadow-sm h-fit"><MapPin size={20}
                                                                                    className="text-red-600"/>
                  </div>
                  <div>
                    <h4 className="font-black uppercase italic text-sm">Zones de concours</h4>
                    <p className="text-sm text-slate-600 mt-1 leading-relaxed">Il est permis de
                      s'approcher des sautoirs (longueur, hauteur, perche) et lancers, à condition
                      de rester derrière la main courante.</p>
                  </div>
                </div>

                <div className="bg-red-50 p-5 rounded-2xl border-l-4 border-red-600 italic">
                  <p className="text-xs text-red-900 font-bold">⚠️ Règle d'or : Il n'est pas
                    autorisé de courir à côté des athlètes pour les encourager, même hors de la
                    piste.</p>
                </div>

                <div className="pt-4 border-t border-slate-200">
                  <p className="text-xs font-bold text-slate-500 uppercase">Envie d'aider ?</p>
                  <p className="text-sm text-slate-600 mt-2 italic">Toute aide spontanée (cafétaria,
                    officiel de terrain) est la bienvenue et n'empêche pas de voir son enfant
                    concourir !</p>
                </div>
              </div>
            </div>

            {/* CÔTÉ RÉSULTATS */}
            <div className="space-y-8">
              <h2 className="text-3xl font-black text-slate-900 uppercase italic">
                Les résultats <span className="text-red-600">de compétition</span>
              </h2>

              <div className="space-y-6">
                <div
                    className="p-8 bg-slate-900 rounded-[2.5rem] text-white relative overflow-hidden">
                  <Zap className="absolute -right-4 -top-4 text-white/5 w-32 h-32"/>
                  <h4 className="font-black uppercase italic mb-4 text-red-600">Annonces en
                    direct</h4>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    Les résultats sont annoncés au micro quelques minutes après la fin de l'épreuve.
                    En cas de doute, demandez au **secrétariat** (et non à la tour de chrono).
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Link
                      href="https://www.beathletics.be/res/calendrier"
                      target="_blank"
                      className="p-6 bg-white border-2 border-slate-900 rounded-3xl hover:bg-red-600 hover:border-red-600 hover:text-white transition-all group shadow-sm"
                  >
                    <h4 className="font-black uppercase italic text-xs mb-2 text-red-600 group-hover:text-white transition-colors">BeAthletics</h4>
                    <p className="text-[10px] opacity-70 uppercase font-bold group-hover:text-white transition-colors leading-tight">
                      Consulter les résultats officiels →
                    </p>
                  </Link>

                  <div className="p-6 bg-slate-50 border border-slate-200 rounded-3xl">
                    <h4 className="font-black uppercase italic text-xs mb-2">L'ACDiste</h4>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">Le
                      journal officiel du club</p>
                  </div>
                </div>

                <p className="text-xs text-slate-400 italic px-4 leading-relaxed">
                  Certains résultats sont également mis en avant dans la chronique du club, les
                  petits journaux locaux ou le quotidien régional hebdomadaire.
                </p>
              </div>
            </div>
          </div>

          {/* SECTION 7 : ENTRAÎNEMENTS ESTIVAUX */}
          <div className="mb-20 pt-12 border-t border-slate-100">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              <div className="lg:col-span-1 space-y-6">
                <h2 className="text-3xl font-black text-slate-900 uppercase italic">
                  L'entraînement <span className="text-red-600">estival</span>
                </h2>
                <p className="text-slate-600 leading-relaxed text-sm">
                  L’entraînement ne s'arrête pas pendant la saison des compétitions. Au contraire,
                  nos entraîneurs s'efforcent de préparer les athlètes aux épreuves techniques
                  prévues au calendrier.
                </p>
                <div className="p-6 bg-red-50 rounded-3xl border border-red-100">
                  <p className="text-xs text-red-600 font-bold italic underline mb-2 text-center uppercase">Important</p>
                  <p className="text-xs text-red-800 leading-relaxed text-center">
                    La psychomotricité à Virton continue pour les plus petits le mercredi.
                  </p>
                </div>
              </div>

              <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* SAINT-MARD */}
                <div className="p-6 bg-slate-900 rounded-[2rem] text-white">
                  <h4 className="font-black uppercase italic text-red-600 mb-3">Saint-Mard</h4>
                  <ul className="text-xs space-y-2 opacity-90">
                    <li><span className="font-bold">Mercredi :</span> 18h00 - 19h15 (Piste)</li>
                    <li className="text-red-400 italic font-bold">Mercredi : 17h45 - 18h45 (Psycho
                      Virton - KAN/BEN1)
                    </li>
                    <li><span className="font-bold">Vendredi :</span> 18h00 - 19h15 (Piste)</li>
                  </ul>
                </div>

                {/* IZEL */}
                <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
                  <h4 className="font-black uppercase italic text-slate-900 mb-3 underline decoration-red-600">Izel</h4>
                  <ul className="text-xs space-y-2 text-slate-600">
                    <li><span className="font-bold">Mercredi :</span> 17h30 - 18h30 (BEN / PUP1)
                    </li>
                    <li><span className="font-bold">Mercredi :</span> 18h00 - 19h30 (MIN2)</li>
                  </ul>
                </div>

                {/* BASTOGNE */}
                <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
                  <h4 className="font-black uppercase italic text-slate-900 mb-3 underline decoration-red-600">Bastogne</h4>
                  <ul className="text-xs space-y-2 text-slate-600">
                    <li><span className="font-bold">Mardi :</span> 16h00 - 17h30 (Piste)</li>
                  </ul>
                </div>

                {/* HABAY */}
                <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
                  <h4 className="font-black uppercase italic text-slate-900 mb-3 underline decoration-red-600">Habay-la-Neuve</h4>
                  <ul className="text-xs space-y-2 text-slate-600">
                    <li><span className="font-bold">Lundi :</span> 18h00 - 19h00 (Piste du Châtelet)
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 8 : RÉSUMÉ & CONCLUSION */}
          <div className="mb-20 bg-slate-50 rounded-[3rem] p-12 border border-slate-200">
            <h2 className="text-2xl font-black text-slate-900 uppercase italic mb-8 flex items-center gap-3">
              En résumé : <span className="text-red-600 text-sm font-bold tracking-widest">Ma checklist</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {t: "Agenda", d: "Notez les dates et organisez votre déplacement."},
                {t: "Vérification", d: "Lieu, horaire, épreuves et contenu du sac."},
                {t: "Anticipation", d: "Arrivez tôt pour l'inscription et l'échauffement."},
                {t: "Plaisir", d: "Admirez les progrès de votre enfant et des autres."}
              ].map((item, i) => (
                  <div key={i} className="space-y-2">
                    <div className="h-1 w-8 bg-red-600 mb-4"></div>
                    <h4 className="font-black uppercase text-sm italic">{item.t}</h4>
                    <p className="text-xs text-slate-500 leading-relaxed">{item.d}</p>
                  </div>
              ))}
            </div>

            <div className="mt-12 pt-8 border-t border-slate-200 text-center">
              <p className="text-lg font-black uppercase italic text-slate-800">
                On se retrouve au bord de la <span
                  className="text-red-600">piste très bientôt !</span>
              </p>
            </div>
          </div>

        </main>
      </div>
  );
}