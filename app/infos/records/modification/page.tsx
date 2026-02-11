import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { Save, ArrowLeft, Trophy, Zap, Cloud, Home, Activity } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function ModificationRecordsPage() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { cookies: { getAll() { return cookieStore.getAll() } } }
  )

  const { data: mData } = await supabase.from('club_records').select('*').eq('category', 'Masculin').order('display_order', { ascending: true });
  const { data: fData } = await supabase.from('club_records').select('*').eq('category', 'Féminin').order('display_order', { ascending: true });

  const maleRecords = mData || [];
  const femaleRecords = fData || [];

  async function updateRow(formData: FormData) {
    'use server'
    const id = formData.get('id');
    const updates = {
      out_athlete: formData.get('out_athlete'),
      out_perf: formData.get('out_perf'),
      out_year: formData.get('out_year'),
      in_athlete: formData.get('in_athlete'),
      in_perf: formData.get('in_perf'),
      in_year: formData.get('in_year'),
    };

    const cookieStore = await cookies();
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        { cookies: { getAll() { return cookieStore.getAll() } } }
    );

    await supabase.from('club_records').update(updates).eq('id', id);
    revalidatePath('/infos/records');
    revalidatePath('/infos/records/modification');
  }

  return (
      <div className="min-h-screen bg-slate-50/50">
        <main className="container mx-auto px-4 py-12 pt-32 pb-32">

          {/* HEADER D'ADMINISTRATION */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-8">
            <div className="flex items-center gap-6">
              <Link href="/infos/records"
                    className="group flex items-center gap-3 bg-white p-4 rounded-2xl shadow-sm border border-slate-200 hover:border-red-600 transition-all">
                <ArrowLeft size={20} className="text-slate-400 group-hover:text-red-600 transition-colors" />
              </Link>
              <div>
                <h1 className="text-4xl font-black text-slate-900 uppercase italic tracking-tighter leading-none">
                  CONSOLE <span className="text-red-600">RECORDS</span>
                </h1>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-2">Mise à jour des performances historiques</p>
              </div>
            </div>

            <div className="hidden lg:flex items-center gap-4 bg-slate-900 text-white px-6 py-3 rounded-2xl border border-white/10 shadow-xl">
              <Activity size={18} className="text-red-600 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest italic">Mode Édition Serveur Actif</span>
            </div>
          </div>

          {[
            { title: "Masculins", data: maleRecords, icon: <Zap size={20} className="text-red-600" /> },
            { title: "Féminins", data: femaleRecords, icon: <Trophy size={20} className="text-red-600" /> }
          ].map((section) => (
              <div key={section.title} className="mb-24">
                <div className="flex items-center gap-4 mb-8">
                  <div className="p-3 bg-white rounded-xl shadow-sm border border-slate-100">
                    {section.icon}
                  </div>
                  <h2 className="text-2xl font-black text-slate-900 uppercase italic tracking-tight">
                    Records {section.title} <span className="text-slate-300 ml-2">({section.data.length})</span>
                  </h2>
                </div>

                <div className="overflow-hidden rounded-[2.5rem] border border-slate-200 shadow-2xl bg-white">
                  <table className="w-full text-left border-collapse table-fixed min-w-[1000px]">
                    <thead className="bg-slate-900 text-[10px] font-black uppercase tracking-[0.2em] text-white">
                    <tr>
                      <th className="p-8 w-[20%]">Épreuve</th>
                      <th className="p-8 w-[35%] border-l border-white/5 bg-red-600/10 text-red-500">
                        <div className="flex items-center gap-2"><Cloud size={14}/> Outdoor (Plein Air)</div>
                      </th>
                      <th className="p-8 w-[35%] border-l border-white/5 bg-slate-800 text-slate-400">
                        <div className="flex items-center gap-2"><Home size={14}/> Indoor (Salle)</div>
                      </th>
                      <th className="p-8 w-[10%] text-center">Action</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                    {section.data.map((r) => (
                        <tr key={r.id} className="hover:bg-slate-50/80 transition-all group">
                          {/* NOM DE L'EPREUVE */}
                          <td className="p-8 font-black uppercase italic text-slate-900 bg-slate-50/50">
                            {r.epreuve}
                          </td>

                          {/* FORMULAIRE DE MISE A JOUR */}
                          <td colSpan={3} className="p-0">
                            <form action={updateRow} className="grid grid-cols-[1fr_1fr_100px] h-full items-stretch">
                              <input type="hidden" name="id" value={r.id}/>

                              {/* COLONNE OUTDOOR */}
                              <div className="p-6 flex flex-col gap-3 border-l border-slate-100 group-hover:bg-red-50/30 transition-colors">
                                <input
                                    name="out_athlete"
                                    defaultValue={r.out_athlete || ""}
                                    placeholder="Nom de l'athlète..."
                                    className="w-full px-4 py-2.5 bg-white border border-slate-200 focus:border-red-600 outline-none font-bold rounded-xl text-slate-900 shadow-sm transition-all"
                                />
                                <div className="flex gap-3">
                                  <input
                                      name="out_perf"
                                      defaultValue={r.out_perf || ""}
                                      placeholder="00:00.00"
                                      className="w-2/3 px-4 py-2.5 bg-white border border-slate-200 focus:border-red-600 outline-none font-black italic text-red-600 rounded-xl shadow-sm text-lg"
                                  />
                                  <input
                                      name="out_year"
                                      defaultValue={r.out_year || ""}
                                      placeholder="Année"
                                      className="w-1/3 px-4 py-2.5 bg-white border border-slate-200 focus:border-red-600 outline-none text-slate-400 font-black rounded-xl text-center shadow-sm"
                                  />
                                </div>
                              </div>

                              {/* COLONNE INDOOR */}
                              <div className="p-6 flex flex-col gap-3 border-l border-slate-100 group-hover:bg-slate-100/50 transition-colors">
                                <input
                                    name="in_athlete"
                                    defaultValue={r.in_athlete || ""}
                                    placeholder="Nom de l'athlète..."
                                    className="w-full px-4 py-2.5 bg-white border border-slate-200 focus:border-slate-900 outline-none font-bold rounded-xl text-slate-900 shadow-sm transition-all"
                                />
                                <div className="flex gap-3">
                                  <input
                                      name="in_perf"
                                      defaultValue={r.in_perf || ""}
                                      placeholder="00:00.00"
                                      className="w-2/3 px-4 py-2.5 bg-white border border-slate-200 focus:border-slate-900 outline-none font-black italic text-slate-900 rounded-xl shadow-sm text-lg"
                                  />
                                  <input
                                      name="in_year"
                                      defaultValue={r.in_year || ""}
                                      placeholder="Année"
                                      className="w-1/3 px-4 py-2.5 bg-white border border-slate-200 focus:border-slate-900 outline-none text-slate-400 font-black rounded-xl text-center shadow-sm"
                                  />
                                </div>
                              </div>

                              {/* BOUTON SAUVEGARDER */}
                              <div className="flex items-center justify-center border-l border-slate-100 bg-slate-50/30 group-hover:bg-white transition-colors">
                                <button type="submit"
                                        title="Sauvegarder la ligne"
                                        className="p-4 bg-white text-slate-300 rounded-2xl border border-slate-100 hover:border-green-500 hover:text-green-600 hover:bg-green-50 transition-all shadow-sm hover:shadow-green-100 active:scale-90 group/btn">
                                  <Save size={24} className="group-hover/btn:scale-110 transition-transform" />
                                </button>
                              </div>
                            </form>
                          </td>
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