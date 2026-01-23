import { Navbar } from "@/components/navbar/navbar";
import { Info, Users, Calendar, Mail, Baby } from "lucide-react";
import Link from "next/link";

export default function KBPMPage() {
  // Calcul dynamique des années de naissance pour le tableau des catégories
  const currentYear = new Date().getFullYear();

  const categories = [
    { name: "Kangourou", acro: "KAN", gender: "—", ages: "6-7 ans", years: `${currentYear - 7}-${currentYear - 6}`, trad: "Pas autorisées" },
    { name: "Benjamin(e)", acro: "BEN", gender: "BH – BF", ages: "8-9 ans", years: `${currentYear - 9}-${currentYear - 8}`, trad: "Autorisées" },
    { name: "Pupille", acro: "PUP", gender: "PH – PF", ages: "10-11 ans", years: `${currentYear - 11}-${currentYear - 10}`, trad: "Autorisées" },
    { name: "Minime", acro: "MIN", gender: "MH – MF", ages: "12-13 ans", years: `${currentYear - 13}-${currentYear - 12}`, trad: "Autorisées" },
  ];

  return (
      <div className="min-h-screen">
        <Navbar/>

        <main className="container mx-auto px-4 py-12 pt-32 text-slate-900">

          {/* TITRE PRINCIPAL */}
          <div className="flex flex-col mb-12">
            <h1 className="text-4xl font-black text-slate-900 uppercase italic">
              La compétition <span className="text-red-600">en athlétisme (K.B.P.M.)</span>
            </h1>
            <div className="h-2 w-24 bg-red-600 mt-2"></div>
          </div>

          {/* SECTION 1 : INTRODUCTION ET PHILOSOPHIE */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-20">
            <div className="lg:col-span-2 space-y-8">
              <section className="prose prose-slate max-w-none">
                <h2 className="text-2xl font-black uppercase italic text-slate-800 mb-6 flex items-center gap-3">
                  <Info className="text-red-600"/> Chers parents,
                </h2>
                <div className="space-y-6 text-slate-600 leading-relaxed text-lg">
                  <p>
                    Ce document a pour but de vous fournir l’essentiel des informations qui vous
                    permettront de planifier et préparer sereinement la participation de votre
                    enfant à une compétition d’athlétisme.
                  </p>
                  <div
                      className="bg-slate-50 border-l-4 border-red-600 p-8 rounded-r-3xl my-10 italic shadow-sm">
                    <p className="text-slate-700 text-xl font-medium mb-4">
                      « Le coureur qui ne fait jamais de compétition ressemble fort à cet amoureux
                      qui ne donne jamais de preuve d’amour. »
                    </p>
                    <cite
                        className="text-red-600 font-bold not-italic uppercase tracking-widest text-sm">—
                      J. Joannes, 1984</cite>
                  </div>
                  <p>
                    La compétition est une occasion pour votre enfant de s’(auto-)évaluer, d’établir
                    des références et de mettre en pratique le travail réalisé aux entraînements.
                  </p>
                </div>
              </section>
            </div>

            <div className="space-y-6">
              <div
                  className="bg-slate-900 text-white p-8 rounded-3xl shadow-xl relative overflow-hidden group">
                <div className="relative z-10">
                  <Users className="text-red-600 mb-4" size={32}/>
                  <h3 className="text-xl font-black uppercase italic mb-4">Le Comité Spécial</h3>
                  <p className="text-slate-300 text-sm leading-relaxed text-balance">
                    Un comité dédié regroupe parents et entraîneurs pour l'amélioration de
                    l'encadrement des catégories <span className="text-white font-bold">BPM</span>.
                  </p>
                </div>
              </div>
              <div className="bg-red-600 p-8 rounded-3xl text-white">
                <Calendar size={32} className="mb-4 text-white"/>
                <h3 className="text-xl font-black uppercase italic mb-2">Récompenses</h3>
                <p className="text-sm text-red-100">
                  En fin de saison, la participation est récompensée par la remise d'écussons.
                </p>
              </div>
            </div>
          </div>

          {/* SECTION 2 : CALENDRIER ET HORAIRES */}
          <div className="flex flex-col mb-12">
            <h2 className="text-3xl font-black text-slate-900 uppercase italic text-balance">
              Le calendrier <span className="text-red-600">et les horaires</span>
            </h2>
            <div className="h-1.5 w-16 bg-red-600 mt-2"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
            <div
                className="md:col-span-2 bg-slate-50 rounded-3xl p-8 border border-slate-100 flex flex-col md:flex-row gap-8 items-center">
              <div className="bg-white p-4 rounded-2xl shadow-sm shrink-0 text-red-600"><Mail
                  size={40}/></div>
              <p className="text-slate-600 leading-relaxed">
                Le <span className="font-bold text-slate-900">comité BPM</span> vous informera
                régulièrement du programme par email environ <span
                  className="text-red-600 font-bold">4 à 6 semaines à l'avance</span>.
              </p>
            </div>
            <Link href="/infos/resultats" className="group">
              <div
                  className="h-full bg-white rounded-3xl p-8 border border-slate-100 shadow-sm hover:shadow-xl transition-all">
                <h3 className="text-xl font-black uppercase italic mb-3 group-hover:text-red-600 transition-colors">Résultats
                  du Club</h3>
                <div
                    className="text-red-600 font-black uppercase text-xs tracking-widest flex items-center gap-2">Consulter <span
                    className="group-hover:translate-x-2 transition-transform">→</span></div>
              </div>
            </Link>
            <a href="https://www.lbfa.be/" target="_blank" className="group">
              <div
                  className="h-full bg-white rounded-3xl p-8 border border-slate-100 shadow-sm hover:shadow-xl transition-all">
                <h3 className="text-xl font-black uppercase italic mb-3 group-hover:text-red-600 transition-colors">Site
                  de la LBFA</h3>
                <div
                    className="text-red-600 font-black uppercase text-xs tracking-widest flex items-center gap-2">Visiter <span
                    className="group-hover:translate-x-2 transition-transform">→</span></div>
              </div>
            </a>
          </div>

          {/* SECTION 3 : CATÉGORIES (NEW) */}
          <div className="flex flex-col mb-12 pt-12 border-t border-slate-100">
            <h2 className="text-3xl font-black text-slate-900 uppercase italic">
              Quelle est la <span className="text-red-600">catégorie de mon enfant ?</span>
            </h2>
            <div className="h-1.5 w-16 bg-red-600 mt-2"></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start mb-20">
            <div className="lg:col-span-1 space-y-6">
              <div className="p-6 bg-slate-900 rounded-3xl text-white">
                <Baby className="text-red-600 mb-4" size={32}/>
                <p className="text-sm leading-relaxed text-slate-300">
                  Les catégories regroupent les athlètes par tranche de <span
                    className="text-white font-bold tracking-tight">deux ans</span>.
                </p>
              </div>
              <div className="p-6 border border-slate-100 rounded-3xl space-y-4">
                <p className="text-sm text-slate-500 leading-relaxed italic">
                  "La notion de « toute catégorie » s'entend à partir de Cadet(te). Les BPM ne sont
                  pas concernés par cette dénomination."
                </p>
              </div>
            </div>

            <div className="lg:col-span-2">
              <div
                  className="overflow-hidden rounded-3xl border border-slate-100 shadow-sm bg-white">
                <table className="w-full text-left border-collapse">
                  <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-400">
                    <th className="p-6">Catégorie</th>
                    <th className="p-6 text-red-600 text-center">Acro.</th>
                    <th className="p-6">Ages</th>
                    <th className="p-6">Années de naissance</th>
                    <th className="p-6 text-right">Compétitions</th>
                  </tr>
                  </thead>
                  <tbody className="text-sm">
                  {categories.map((cat, idx) => (
                      <tr key={idx}
                          className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                        <td className="p-6 font-black uppercase italic text-slate-800">{cat.name}</td>
                        <td className="p-6 text-center font-bold text-slate-400">{cat.acro}</td>
                        <td className="p-6 font-medium text-slate-600">{cat.ages}</td>
                        <td className="p-6 font-black italic text-red-600">{cat.years}</td>
                        <td className={`p-6 text-right font-bold text-[11px] uppercase tracking-tighter ${cat.trad === 'Autorisées' ? 'text-green-600' : 'text-slate-400'}`}>
                          {cat.trad}
                        </td>
                      </tr>
                  ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-8 p-6 bg-red-50 rounded-3xl border border-red-100">
                <h4 className="font-black uppercase italic text-red-600 mb-2 text-sm tracking-wide">Note
                  pour les Kangourous</h4>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Les enfants de la catégorie Kangourou ne sont pas autorisés à participer aux
                  compétitions traditionnelles. Les <span className="font-bold text-slate-900">« Kid’s Athletics »</span> leur
                  sont par contre ouverts, voire destinés. La Ligue cherche activement à stimuler
                  l’organisation de ces événements.
                </p>
              </div>
            </div>
          </div>

        </main>
      </div>
  );
}