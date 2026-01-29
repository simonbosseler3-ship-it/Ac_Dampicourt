import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { FileText, Mail, Phone, Award, Settings, Trophy } from "lucide-react";
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

  const [maleRes, femaleRes] = await Promise.all([
    supabase.from('club_records').select('*').eq('category', 'Masculin').order('display_order', { ascending: true }),
    supabase.from('club_records').select('*').eq('category', 'Féminin').order('display_order', { ascending: true })
  ]);

  const maleRecords = maleRes.data;
  const femaleRecords = femaleRes.data;

  return (
      <div className="min-h-screen bg-transparent">
        <main className="container mx-auto px-4 py-12 pt-32 text-slate-900 animate-in fade-in duration-700">

          {/* HEADER & ADMIN */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div className="flex flex-col">
              <span className="text-red-600 font-black uppercase italic tracking-[0.3em] text-xs mb-2">Statistiques Officielles</span>
              <h1 className="text-5xl md:text-6xl font-black text-slate-900 uppercase italic tracking-tighter leading-none">
                LES RECORDS <br /><span className="text-red-600">DU CLUB</span>
              </h1>
              <div className="h-2 w-32 bg-red-600 mt-6 shadow-lg shadow-red-200"></div>
            </div>

            {user && (
                <Link href="/infos/records/modification"
                      className="flex items-center gap-3 bg-slate-900 text-white px-8 py-4 rounded-2xl font-black uppercase italic text-xs hover:bg-red-600 transition-all shadow-xl active:scale-95 group">
                  <Settings size={18} className="group-hover:rotate-90 transition-transform duration-500" />
                  Modifier les données
                </Link>
            )}
          </div>

          {/* GRILLE DOCUMENTS & CONTACT */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
            {[
              { title: "TOP10 Outdoor", type: "Outdoor", link: "https://acdampicourt.be/uploads/2025/04/DAMP10-1957-2024-Outdoor.pdf", color: "bg-slate-900" },
              { title: "TOP10 Indoor", type: "Indoor", link: "https://acdampicourt.be/uploads/2025/04/DAMP10-1957-2025-Indoor.pdf", color: "bg-red-600" }
            ].map((doc, i) => (
                <a key={i} href={doc.link} target="_blank" className="group block h-full">
                  <div className="h-full bg-white/70 backdrop-blur-md rounded-[2.5rem] overflow-hidden border border-white shadow-xl group-hover:shadow-2xl group-hover:-translate-y-2 transition-all duration-500">
                    <div className={`relative h-48 ${doc.color} flex items-center justify-center overflow-hidden`}>
                      <FileText size={80} className="text-white/10 group-hover:scale-125 group-hover:text-white/20 transition-transform duration-700" />
                      <span className="absolute top-6 left-6 bg-white/10 backdrop-blur-md text-white text-[10px] font-black px-4 py-1.5 uppercase tracking-widest rounded-full border border-white/20">
                    {doc.type}
                  </span>
                    </div>
                    <div className="p-8">
                      <h2 className="text-xl font-black text-slate-900 mb-2 uppercase italic leading-tight">{doc.title}</h2>
                      <div className="text-red-600 font-black uppercase text-[10px] tracking-[0.2em] flex items-center gap-2">
                        Télécharger PDF <span className="group-hover:translate-x-2 transition-transform">→</span>
                      </div>
                    </div>
                  </div>
                </a>
            ))}

            <div className="bg-white/80 backdrop-blur-md rounded-[2.5rem] p-8 border border-white shadow-xl relative overflow-hidden">
              <Trophy className="absolute -right-6 -bottom-6 text-slate-100 w-40 h-40" />
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <Award className="text-red-600" size={24} />
                  <h2 className="text-xl font-black uppercase italic text-slate-900">Stats & Records</h2>
                </div>
                <p className="text-xl font-black uppercase italic text-red-600 leading-none mb-1">Alain MONET</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-6 tracking-widest opacity-70 italic">Expert Statistiques (ATFS)</p>

                <div className="space-y-4 text-[10px] font-black uppercase text-slate-600 tracking-wider">
                  <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100 hover:border-red-200 transition-colors">
                    <Mail size={16} className="text-red-600" /> alain.monet@hotmail.com
                  </div>
                  <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100 hover:border-red-200 transition-colors">
                    <Phone size={16} className="text-red-600" /> 063 / 57.95.65
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* TABLEAUX DES RECORDS */}
          {[
            { title: "Masculin", data: maleRecords, accent: "text-blue-600" },
            { title: "Féminin", data: femaleRecords, accent: "text-red-600" }
          ].map((section, idx) => (
              <div key={idx} className="mb-24">
                <div className="flex items-center gap-4 mb-8">
                  <h2 className="text-3xl font-black text-slate-900 uppercase italic">Club – <span className="text-red-600">{section.title}</span></h2>
                  <div className="h-px flex-1 bg-slate-100"></div>
                </div>

                <div className="overflow-x-auto rounded-[2.5rem] border border-white bg-white/50 backdrop-blur-md shadow-2xl">
                  <table className="w-full text-left border-collapse">
                    <thead>
                    <tr className="bg-slate-900 text-[10px] font-black uppercase tracking-widest text-white/70">
                      <th className="p-6">Épreuve</th>
                      <th className="p-6 border-x border-white/5 bg-red-600/10 text-red-500">Outdoor</th>
                      <th className="p-6">Perf</th>
                      <th className="p-6 text-center opacity-50">An</th>
                      <th className="p-6 border-x border-white/5 bg-slate-800/10">Indoor</th>
                      <th className="p-6">Perf</th>
                      <th className="p-6 text-right opacity-50">An</th>
                    </tr>
                    </thead>
                    <tbody className="text-sm">
                    {section.data?.map((r) => (
                        <tr key={r.id} className="border-b border-slate-100 hover:bg-white transition-colors group">
                          <td className="p-6 font-black uppercase italic text-slate-900 bg-slate-50/50">{r.epreuve}</td>
                          <td className="px-6 py-4 font-bold text-slate-700">{r.out_athlete || "—"}</td>
                          <td className="px-6 py-4 font-black italic text-red-600 text-lg tracking-tighter group-hover:scale-110 transition-transform origin-left">{r.out_perf || "—"}</td>
                          <td className="px-6 py-4 text-[10px] font-black text-slate-400 text-center">{r.out_year || "—"}</td>
                          <td className="px-6 py-4 font-bold text-slate-700 border-l border-slate-50">{r.in_athlete || "—"}</td>
                          <td className="px-6 py-4 font-black italic text-slate-900 text-lg tracking-tighter">{r.in_perf || "—"}</td>
                          <td className="px-6 py-4 text-[10px] font-black text-slate-400 text-right">{r.in_year || "—"}</td>
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