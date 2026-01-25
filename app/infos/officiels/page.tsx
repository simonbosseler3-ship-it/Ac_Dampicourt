import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { Navbar } from "@/components/navbar/navbar";
import { Info, Edit } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function OfficielsPage() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { cookies: { getAll() { return cookieStore.getAll() } } }
  );

  // 1. Vérification du rôle Admin
  const { data: { user } } = await supabase.auth.getUser();
  let isAdmin = false;

  if (user) {
    const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();
    isAdmin = profile?.role?.toLowerCase().trim() === 'admin';
  }

  // 2. Récupération des officiels
  const { data: officials } = await supabase
  .from('officials')
  .select('*')
  .order('name');

  return (
      <div className="min-h-screen">

        <main className="container mx-auto px-4 py-12 pt-32">

          {/* TITRE & ACTION ADMIN */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
            <div className="flex flex-col">
              <h1 className="text-4xl font-black text-slate-900 uppercase italic">
                Nos <span className="text-red-600">Officiels</span>
              </h1>
              <div className="h-2 w-24 bg-red-600 mt-2"></div>
            </div>

            {isAdmin && (
                <Link href="/infos/officiels/modifier">
                  <button
                      className="flex items-center gap-2 bg-slate-900 text-white px-6 py-2 rounded-full font-bold hover:bg-red-600 transition-all text-xs uppercase italic shadow-lg">
                    <Edit size={16}/> Gérer le jury
                  </button>
                </Link>
            )}
          </div>

          {/* SECTION LISTE OFFICIELS */}
          <section className="mb-24 bg-slate-900 rounded-[40px] p-8 md:p-16 text-white shadow-2xl">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-black uppercase italic mb-4 text-white">
                  L'équipe <span className="text-red-600">Juge & Arbitre</span>
                </h2>
                <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">
                  Le cœur des compétitions
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {officials?.map((off) => (
                    <div key={off.id}
                         className="text-[11px] font-bold uppercase tracking-tight text-slate-300 border-l border-red-600 pl-3">
                      {off.name}
                    </div>
                ))}
              </div>
            </div>
          </section>

          {/* FAQ */}
          <section className="max-w-3xl mx-auto space-y-8">
            <div className="flex items-center gap-3 mb-8">
              <Info className="text-red-600" size={28}/>
              <h2 className="text-2xl font-black text-slate-900 uppercase italic">FAQ Officiels</h2>
            </div>

            <div className="space-y-6">
              <div className="bg-slate-50 border-l-4 border-red-600 p-8 shadow-sm rounded-r-3xl">
                <h3 className="font-black uppercase italic text-slate-900 mb-2 text-lg">Quel est son rôle ?</h3>
                <p className="text-slate-600 leading-relaxed">
                  Encadrer les concours et courses, juger du respect des règles et faire respecter les règlements de la fédération.
                </p>
              </div>
              <div className="bg-slate-50 border-l-4 border-red-600 p-8 shadow-sm rounded-r-3xl">
                <h3 className="font-black uppercase italic text-slate-900 mb-2 text-lg">Y a-t-il une formation ?</h3>
                <p className="text-slate-600 leading-relaxed">
                  Un syllabus succinct à assimiler, une formation sur le terrain et un petit test de contrôle organisé fin mars.
                </p>
              </div>
            </div>
          </section>
        </main>
      </div>
  );
}