import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { FileText, Mail, Phone, Award, Settings, Trophy, ChevronRight, Zap } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function RecordsPage() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { cookies: { getAll() { return cookieStore.getAll() } } }
  )

  const { data: { user } } = await supabase.auth.getUser();

  // Récupération des données en parallèle (Optimisé)
  const [maleRes, femaleRes] = await Promise.all([
    supabase.from('club_records').select('*').eq('category', 'Masculin').order('display_order', { ascending: true }),
    supabase.from('club_records').select('*').eq('category', 'Féminin').order('display_order', { ascending: true })
  ]);

  const maleRecords = maleRes.data || [];
  const femaleRecords = femaleRes.data || [];

  return (
      <div className="min-h-screen">
        <main className="container mx-auto px-4 py-12 pt-32 text-slate-900 animate-in fade-in duration-1000">

          {/* HEADER & ADMIN */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-20 gap-8">
            <div className="flex flex-col">
              <div className="flex items-center gap-3 mb-4">
                <span className="h-[2px] w-10 bg-red-600"></span>
                <span className="text-red-600 font-black uppercase italic tracking-[0.3em] text-[10px]">Performances Historiques</span>
              </div>
              <h1 className="text-6xl md:text-8xl font-black text-slate-900 uppercase italic tracking-tighter leading-[0.85]">
                LES RECORDS <br /><span className="text-red-600">DU CLUB</span>
              </h1>
            </div>

            {user && (
                <Link href="/infos/records/modification"
                      className="flex items-center gap-4 bg-slate-900 text-white px-10 py-5 rounded-[2rem] font-black uppercase italic text-xs hover:bg-red-600 transition-all shadow-2xl hover:-translate-y-1 active:scale-95 group">
                  <Settings size={20} className="group-hover:rotate-180 transition-transform duration-700" />
                  Administration des données
                </Link>
            )}
          </div>

          {/* SECTION DOCUMENTS & CONTACT */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
            {[
              { title: "TOP 10 Outdoor", type: "Plein Air", link: "https://acdampicourt.be/uploads/2025/04/DAMP10-1957-2024-Outdoor.pdf", color: "bg-slate-900", subtitle: "Historique 1957-2024" },
              { title: "TOP 10 Indoor", type: "Salle", link: "https://acdampicourt.be/uploads/2025/04/DAMP10-1957-2025-Indoor.pdf", color: "bg-red-600", subtitle: "Historique 1957-2025" }
            ].map((doc, i) => (
                <a key={i} href={doc.link} target="_blank" className="group block h-full">
                  <div className="h-full bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-xl group-hover:shadow-2xl transition-all duration-500 flex flex-col">
                    <div className={`relative h-40 ${doc.color} flex items-center justify-center overflow-hidden`}>
                      <FileText size={60} className="text-white/20 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-700" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                      <span className="absolute top-6 left-6 bg-white/20 backdrop-blur-md text-white text-[9px] font-black px-4 py-2 rounded-full border border-white/20 uppercase tracking-widest">
                        {doc.type}
                      </span>
                    </div>
                    <div className="p-8">
                      <p className="text-[9px] font-black text-red-600 uppercase tracking-widest mb-1">{doc.subtitle}</p>
                      <h2 className="text-2xl font-black text-slate-900 mb-4 uppercase italic leading-tight">{doc.title}</h2>
                      <div className="flex items-center gap-2 text-slate-900 font-black uppercase text-[10px] tracking-widest group-hover:text-red-600 transition-colors">
                        Consulter le PDF <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </a>
            ))}

            {/* CARTE STATISTICIEN */}
            <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden group">
              <Trophy className="absolute -right-10 -bottom-10 text-white/5 w-56 h-56 group-hover:scale-110 transition-transform duration-[2000ms]" />
              <div className="relative z-10 h-full flex flex-col">
                <div className="flex items-center gap-3 mb-8">
                  <div className="p-3 bg-red-600 rounded-2xl shadow-lg shadow-red-600/20">
                    <Award size={24} />
                  </div>
                  <div>
                    <h2 className="text-xl font-black uppercase italic leading-none">Statistiques</h2>
                    <p className="text-red-600 font-bold text-[8px] uppercase tracking-[0.3em] mt-1">Expert Officiel</p>
                  </div>
                </div>

                <p className="text-2xl font-black uppercase italic mb-1 tracking-tight">Alain <span className="text-red-600">MONET</span></p>
                <p className="text-[9px] font-bold text-slate-400 uppercase mb-8 tracking-[0.2em] italic">Membre de l'ATFS (Statisticiens d'Athlétisme)</p>

                <div className="space-y-3 mt-auto">
                  <a href="mailto:alain.monet@hotmail.com" className="flex items-center gap-4 bg-white/5 hover:bg-white/10 p-4 rounded-2xl border border-white/10 transition-all group/link text-[10px] font-black uppercase tracking-wider">
                    <Mail size={16} className="text-red-600" /> alain.monet@hotmail.com
                  </a>
                  <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/10 text-[10px] font-black uppercase tracking-wider">
                    <Phone size={16} className="text-red-600" /> 063 / 57.95.65
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* TABLEAUX DES RECORDS */}
          {[
            { title: "Masculin", data: maleRecords, color: "red" },
            { title: "Féminin", data: femaleRecords, color: "red" }
          ].map((section, idx) => (
              <div key={idx} className="mb-32">
                <div className="flex flex-col md:flex-row md:items-center gap-6 mb-10">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-xl">
                      <Zap size={20} className="fill-red-600 text-red-600" />
                    </div>
                    <h2 className="text-4xl font-black text-slate-900 uppercase italic tracking-tighter">CLUB – <span className="text-red-600">{section.title}</span></h2>
                  </div>
                  <div className="h-[2px] flex-1 bg-slate-200/50"></div>
                </div>

                <div className="overflow-x-auto rounded-[3rem] border border-slate-200 bg-white shadow-2xl">
                  <table className="w-full text-left border-collapse min-w-[800px]">
                    <thead>
                    <tr className="bg-slate-900 text-[10px] font-black uppercase tracking-[0.2em] text-white">
                      <th className="p-8">Épreuve</th>
                      <th className="p-8 border-x border-white/5 bg-red-600 text-white">Record Outdoor</th>
                      <th className="p-8 text-center">Perf</th>
                      <th className="p-8 text-center opacity-40">An</th>
                      <th className="p-8 border-x border-white/5 bg-slate-800 text-white">Record Indoor</th>
                      <th className="p-8 text-center">Perf</th>
                      <th className="p-8 text-right opacity-40">An</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                    {section.data?.map((r) => (
                        <tr key={r.id} className="hover:bg-slate-50 transition-all group">
                          <td className="p-8 font-black uppercase italic text-slate-900 bg-slate-50/30 w-1/5">{r.epreuve}</td>

                          {/* OUTDOOR */}
                          <td className="px-8 py-6 font-bold text-slate-700 text-sm border-l border-slate-50">{r.out_athlete || "—"}</td>
                          <td className="px-8 py-6 text-center">
                            <span className="font-black italic text-red-600 text-2xl tracking-tighter block group-hover:scale-110 transition-transform">{r.out_perf || "—"}</span>
                          </td>
                          <td className="px-8 py-6 text-[11px] font-black text-slate-400 text-center italic">{r.out_year || "—"}</td>

                          {/* INDOOR */}
                          <td className="px-8 py-6 font-bold text-slate-700 text-sm border-l border-slate-50">{r.in_athlete || "—"}</td>
                          <td className="px-8 py-6 text-center">
                            <span className="font-black italic text-slate-900 text-2xl tracking-tighter block group-hover:scale-110 transition-transform">{r.in_perf || "—"}</span>
                          </td>
                          <td className="px-8 py-6 text-[11px] font-black text-slate-400 text-right italic">{r.in_year || "—"}</td>
                        </tr>
                    ))}
                    </tbody>
                  </table>
                </div>
              </div>
          ))}
        </main>
      </div>
  );
}