import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { Navbar } from "@/components/navbar/navbar";
import { Save, ArrowLeft } from "lucide-react";
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
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <main className="container mx-auto px-4 py-12 pt-32 text-slate-900">

          <div className="flex items-center gap-4 mb-12">
            <Link href="/infos/records" className="p-3 bg-white hover:bg-slate-100 rounded-2xl transition-colors text-slate-400 shadow-sm border border-slate-200">
              <ArrowLeft size={24} />
            </Link>
            <h1 className="text-4xl font-black text-slate-900 uppercase italic">
              Administration <span className="text-red-600">Records</span>
            </h1>
          </div>

          {[
            { title: "Masculins", data: maleRecords },
            { title: "Féminins", data: femaleRecords }
          ].map((section) => (
              <div key={section.title} className="mb-20">
                <h2 className="text-2xl font-black text-slate-900 uppercase italic mb-6 border-l-4 border-red-600 pl-4">
                  Records {section.title} ({section.data.length})
                </h2>
                <div className="overflow-hidden rounded-[2rem] border border-slate-200 shadow-xl bg-white">
                  <table className="w-full text-left border-collapse table-fixed">
                    <thead className="bg-slate-900 text-[10px] font-black uppercase tracking-widest text-slate-400">
                    <tr>
                      <th className="p-6 w-1/4">Épreuve</th>
                      <th className="p-6 w-1/3 border-l border-white/10 text-red-500">Outdoor</th>
                      <th className="p-6 w-1/3 border-l border-white/10 text-white">Indoor</th>
                      <th className="p-6 w-20 text-center">Save</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                    {section.data.map((r) => (
                        <tr key={r.id} className="hover:bg-slate-50 transition-colors group">
                          <td className="p-6 font-black uppercase italic text-slate-800 bg-slate-50/30">
                            {r.epreuve}
                          </td>
                          <td colSpan={3} className="p-0">
                            <form action={updateRow} className="grid grid-cols-[1fr_1fr_80px] h-full items-center">
                              <input type="hidden" name="id" value={r.id} />

                              {/* OUTDOOR */}
                              <div className="p-4 flex flex-col gap-2 border-l border-slate-100">
                                <input name="out_athlete" defaultValue={r.out_athlete || ""} placeholder="Athlète" className="w-full px-3 py-1.5 bg-slate-100 border border-slate-200 focus:border-red-600 focus:bg-white outline-none font-bold rounded-lg text-slate-900" />
                                <div className="flex gap-2">
                                  <input name="out_perf" defaultValue={r.out_perf || ""} placeholder="Perf" className="w-2/3 px-3 py-1.5 bg-slate-100 border border-slate-200 focus:border-red-600 focus:bg-white outline-none font-black italic text-red-600 rounded-lg" />
                                  <input name="out_year" defaultValue={r.out_year || ""} placeholder="Année" className="w-1/3 px-3 py-1.5 bg-slate-100 border border-slate-200 focus:border-red-600 focus:bg-white outline-none text-slate-500 rounded-lg text-center" />
                                </div>
                              </div>

                              {/* INDOOR */}
                              <div className="p-4 flex flex-col gap-2 border-l border-slate-100">
                                <input name="in_athlete" defaultValue={r.in_athlete || ""} placeholder="Athlète" className="w-full px-3 py-1.5 bg-slate-100 border border-slate-200 focus:border-slate-900 focus:bg-white outline-none font-bold rounded-lg text-slate-900" />
                                <div className="flex gap-2">
                                  <input name="in_perf" defaultValue={r.in_perf || ""} placeholder="Perf" className="w-2/3 px-3 py-1.5 bg-slate-100 border border-slate-200 focus:border-slate-900 focus:bg-white outline-none font-black italic text-slate-900 rounded-lg" />
                                  <input name="in_year" defaultValue={r.in_year || ""} placeholder="Année" className="w-1/3 px-3 py-1.5 bg-slate-100 border border-slate-200 focus:border-slate-900 focus:bg-white outline-none text-slate-500 rounded-lg text-center" />
                                </div>
                              </div>

                              {/* BOUTON */}
                              <div className="flex justify-center border-l border-slate-100">
                                <button type="submit" className="p-3 bg-slate-100 text-slate-400 rounded-xl hover:bg-green-600 hover:text-white transition-all shadow-sm">
                                  <Save size={20} />
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