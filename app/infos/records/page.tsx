import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { Navbar } from "@/components/navbar/navbar";
import { FileText, Mail, MapPin, Phone, Award, Settings } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function RecordsPage() {
  const cookieStore = await cookies();

  const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
        },
      }
  )

  // Vérification de la session pour afficher le bouton
  const { data: { user } } = await supabase.auth.getUser();

  const { data: maleRecords } = await supabase
  .from('club_records')
  .select('*')
  .eq('category', 'Masculin')
  .order('display_order', { ascending: true });

  const { data: femaleRecords } = await supabase
  .from('club_records')
  .select('*')
  .eq('category', 'Féminin')
  .order('display_order', { ascending: true });

  return (
      <div className="min-h-screen relative">
        <Navbar/>

        <main className="container mx-auto px-4 py-12 pt-32 text-slate-900">

          {/* TITRE PRINCIPAL & BOUTON ADMIN */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div className="flex flex-col">
              <h1 className="text-4xl font-black text-slate-900 uppercase italic">
                Les Records <span className="text-red-600">du Club et Top 10</span>
              </h1>
              <div className="h-2 w-24 bg-red-600 mt-2"></div>
            </div>

            {/* LIEN CORRIGÉ VERS LE DOSSIER INFOS */}
            {user && (
                <Link
                    href="/infos/records/modification"
                    className="flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-2xl font-black uppercase italic text-xs hover:bg-red-600 transition-all duration-300 shadow-lg hover:-translate-y-1"
                >
                  <Settings size={16} />
                  Modifier les données
                </Link>
            )}
          </div>

          {/* ... RESTE DE TON CODE (GRILLE ET TABLEAUX) ... */}
          {/* GRILLE DU HAUT (PDF & CONTACT) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            <article className="relative group">
              <a href="https://acdampicourt.be/uploads/2025/04/DAMP10-1957-2024-Outdoor.pdf"
                 target="_blank" className="block h-full">
                <div
                    className="h-full bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                  <div
                      className="relative h-56 overflow-hidden bg-slate-900 flex items-center justify-center">
                    <FileText size={64}
                              className="text-white/20 group-hover:scale-110 group-hover:text-red-600 transition-all duration-500"/>
                    <div className="absolute top-4 left-4">
                      <span
                          className="bg-red-600 text-white text-[10px] font-bold px-3 py-1 uppercase tracking-widest rounded-sm">Outdoor</span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h2 className="text-xl font-bold text-slate-800 mb-2 uppercase italic">TOP10
                      Outdoor & Records</h2>
                    <div
                        className="text-red-600 font-black uppercase text-xs tracking-widest flex items-center gap-2">
                      Consulter le document <span>→</span>
                    </div>
                  </div>
                </div>
              </a>
            </article>

            <article className="relative group">
              <a href="https://acdampicourt.be/uploads/2025/04/DAMP10-1957-2025-Indoor.pdf"
                 target="_blank" className="block h-full">
                <div
                    className="h-full bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                  <div
                      className="relative h-56 overflow-hidden bg-slate-800 flex items-center justify-center">
                    <FileText size={64}
                              className="text-white/20 group-hover:scale-110 group-hover:text-red-600 transition-all duration-500"/>
                    <div className="absolute top-4 left-4">
                      <span
                          className="bg-red-600 text-white text-[10px] font-bold px-3 py-1 uppercase tracking-widest rounded-sm">Indoor</span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h2 className="text-xl font-bold text-slate-800 mb-2 uppercase italic">TOP10
                      Indoor</h2>
                    <div
                        className="text-red-600 font-black uppercase text-xs tracking-widest flex items-center gap-2">
                      Consulter le document <span>→</span>
                    </div>
                  </div>
                </div>
              </a>
            </article>

            <article className="h-full">
              <div className="h-full bg-slate-50 rounded-3xl p-8 border border-slate-100 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <Award className="text-red-600" size={24}/>
                  <h2 className="text-xl font-black uppercase italic text-slate-900">Contact
                    Stats</h2>
                </div>
                <p className="text-lg font-black uppercase italic text-red-600 leading-none">Alain
                  MONET</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-6 tracking-tighter">Association
                  for Track and Field Statistics</p>
                <div
                    className="space-y-3 text-xs font-bold uppercase text-slate-600 tracking-tight">
                  <div className="flex items-center gap-3"><MapPin size={16}
                                                                   className="text-red-600"/> 6761
                    Chenois
                  </div>
                  <div className="flex items-center gap-3"><Phone size={16}
                                                                  className="text-red-600"/> 063/57.95.65
                  </div>
                  <div className="flex items-center gap-3"><Mail size={16}
                                                                 className="text-red-600"/> alain.monet@hotmail.com
                  </div>
                </div>
              </div>
            </article>
          </div>

          {/* SECTION MASCULINE */}
          <div className="flex flex-col mb-8">
            <h2 className="text-3xl font-black text-slate-900 uppercase italic">
              Club – <span className="text-red-600">Masculin</span>
            </h2>
            <div className="h-1.5 w-16 bg-red-600 mt-2"></div>
          </div>

          <div className="overflow-x-auto rounded-3xl border border-slate-100 shadow-sm mb-20">
            <table className="w-full text-left border-collapse bg-white">
              <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-400">
                <th className="p-6">Épreuve</th>
                <th className="p-6 border-l border-slate-100 text-red-600">Athlète (Outdoor)</th>
                <th className="p-6">Perf</th>
                <th className="p-6 border-r border-slate-100 text-center">An</th>
                <th className="p-6">Athlète (Indoor)</th>
                <th className="p-6">Perf</th>
                <th className="p-6 text-right">An</th>
              </tr>
              </thead>
              <tbody className="text-sm">
              {maleRecords?.map((r) => (
                  <tr key={r.id}
                      className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                    <td className="p-6 font-black uppercase italic text-slate-800 bg-slate-50/20">{r.epreuve}</td>
                    <td className="px-6 py-4 border-l border-slate-50 font-bold">{r.out_athlete || "—"}</td>
                    <td className="px-6 py-4 font-black italic text-red-600">{r.out_perf || "—"}</td>
                    <td className="px-6 py-4 border-r border-slate-50 text-slate-400 text-center">{r.out_year || "—"}</td>
                    <td className="px-6 py-4 font-bold">{r.in_athlete || "—"}</td>
                    <td className="px-6 py-4 font-black italic text-slate-900">{r.in_perf || "—"}</td>
                    <td className="px-6 py-4 text-slate-400 text-right">{r.in_year || "—"}</td>
                  </tr>
              ))}
              </tbody>
            </table>
          </div>

          {/* SECTION FÉMININE */}
          <div className="flex flex-col mb-8">
            <h2 className="text-3xl font-black text-slate-900 uppercase italic">
              Club – <span className="text-red-600">Féminin</span>
            </h2>
            <div className="h-1.5 w-16 bg-red-600 mt-2"></div>
          </div>

          <div className="overflow-x-auto rounded-3xl border border-slate-100 shadow-sm">
            <table className="w-full text-left border-collapse bg-white">
              <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-400">
                <th className="p-6">Épreuve</th>
                <th className="p-6 border-l border-slate-100 text-red-600">Athlète (Outdoor)</th>
                <th className="p-6">Perf</th>
                <th className="p-6 border-r border-slate-100 text-center">An</th>
                <th className="p-6">Athlète (Indoor)</th>
                <th className="p-6">Perf</th>
                <th className="p-6 text-right">An</th>
              </tr>
              </thead>
              <tbody className="text-sm">
              {femaleRecords?.map((r) => (
                  <tr key={r.id}
                      className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                    <td className="p-6 font-black uppercase italic text-slate-800 bg-slate-50/20">{r.epreuve}</td>
                    <td className="px-6 py-4 border-l border-slate-50 font-bold">{r.out_athlete || "—"}</td>
                    <td className="px-6 py-4 font-black italic text-red-600">{r.out_perf || "—"}</td>
                    <td className="px-6 py-4 border-r border-slate-50 text-slate-400 text-center">{r.out_year || "—"}</td>
                    <td className="px-6 py-4 font-bold">{r.in_athlete || "—"}</td>
                    <td className="px-6 py-4 font-black italic text-slate-900">{r.in_perf || "—"}</td>
                    <td className="px-6 py-4 text-slate-400 text-right">{r.in_year || "—"}</td>
                  </tr>
              ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
  );
}