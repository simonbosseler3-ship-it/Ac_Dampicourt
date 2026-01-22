import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { Navbar } from "@/components/navbar/navbar";
import { Mail, Phone, ShieldCheck, Users, Info, Edit } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function EntrainementPage() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { cookies: { getAll() { return cookieStore.getAll() } } }
  );

  const { data: { user } } = await supabase.auth.getUser();
  let isAdmin = false;
  if (user) {
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
    isAdmin = profile?.role?.toLowerCase().trim() === 'admin';
  }

  const { data: trainers } = await supabase.from('trainers').select('*').order('order_index');
  const { data: officials } = await supabase.from('officials').select('*').order('name');
  const { data: config } = await supabase.from('training_page_config').select('*').single();

  return (
      <div className="min-h-screen">
        <Navbar/>

        <main className="container mx-auto px-4 py-12 pt-32">
          {/* TITRE & ACTION ADMIN */}
          <div
              className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-6">
            <div className="flex flex-col">
              <h1 className="text-4xl font-black text-slate-900 uppercase italic">
                Encadrement <span className="text-red-600">& Entraînements</span>
              </h1>
              <div className="h-2 w-24 bg-red-600 mt-2"></div>
            </div>

            {isAdmin && (
                <Link href="/entrainement/modifier">
                  <button
                      className="flex items-center gap-2 bg-slate-900 text-white px-6 py-2 rounded-full font-bold hover:bg-red-600 transition-all text-xs uppercase italic">
                    <Edit size={16}/> Gérer les entraîneurs
                  </button>
                </Link>
            )}
          </div>

          {/* SECTION ENTRAÎNEURS */}
          <section className="mb-24">
            <div className="flex items-center gap-3 mb-8">
              <Users className="text-red-600" size={28}/>
              <h2 className="text-2xl font-black text-slate-900 uppercase italic">Nos
                Entraîneurs</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {trainers?.map((t) => (
                  <div key={t.id}
                       className="bg-slate-50 p-6 rounded-3xl border border-slate-100 hover:shadow-xl transition-all group">
                    <div className="flex items-start justify-between mb-4">
                      <div
                          className="bg-red-600 text-white font-black p-3 rounded-xl text-lg w-12 h-12 flex items-center justify-center italic">
                        {t.sigle}
                      </div>
                      <div className="text-right">
                        <h3 className="font-black text-slate-900 uppercase italic leading-tight">{t.name}</h3>
                        <p className="text-[10px] font-bold text-red-600 uppercase tracking-widest mt-1">Entraineur</p>
                      </div>
                    </div>
                    <div className="space-y-2 border-t border-slate-200 pt-4">
                      {t.phone && (
                          <p className="text-xs font-bold text-slate-500 flex items-center gap-2">
                            <Phone size={14} className="text-red-600"/> {t.phone}
                          </p>
                      )}
                      {t.email && (
                          <a href={`mailto:${t.email}`}
                             className="text-xs font-bold text-slate-500 flex items-center gap-2 hover:text-red-600 transition-colors">
                            <Mail size={14} className="text-red-600"/> {t.email}
                          </a>
                      )}
                    </div>
                  </div>
              ))}
            </div>
          </section>

          {/* SECTION OFFICIELS */}
          <section className="mb-24 bg-slate-900 rounded-[40px] p-8 md:p-16 text-white">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-black uppercase italic mb-4">Nos <span
                    className="text-red-600">50 Officiels</span></h2>
                <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Le cœur
                  des compétitions</p>
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

          {/* FAQ & ÉTHIQUE (Style Actualités) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* FAQ */}
            <section className="space-y-8">
              <div className="flex items-center gap-3">
                <Info className="text-red-600" size={28}/>
                <h2 className="text-2xl font-black text-slate-900 uppercase italic">FAQ
                  Officiels</h2>
              </div>

              <div className="space-y-6">
                <div className="bg-white border-l-4 border-red-600 p-6 shadow-sm rounded-r-2xl">
                  <h3 className="font-black uppercase italic text-slate-900 mb-2">Quel est son rôle
                    ?</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">Encadrer les concours et
                    courses, juger du respect des règles et faire respecter les règlements de la
                    fédération.</p>
                </div>
                <div className="bg-white border-l-4 border-red-600 p-6 shadow-sm rounded-r-2xl">
                  <h3 className="font-black uppercase italic text-slate-900 mb-2">Y a-t-il une
                    formation ?</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">Un syllabus succinct à
                    assimiler, une formation sur le terrain et un petit test de contrôle organisé
                    fin mars.</p>
                </div>
              </div>
            </section>

            {/* ÉTHIQUE */}
            <section className="space-y-8">
              <div className="flex items-center gap-3">
                <ShieldCheck className="text-red-600" size={28}/>
                <h2 className="text-2xl font-black text-slate-900 uppercase italic">Éthique &
                  Dopage</h2>
              </div>
              <div className="bg-slate-50 p-8 rounded-3xl border border-slate-200">
                <p className="text-sm text-slate-600 leading-relaxed mb-6 whitespace-pre-wrap">
                  {config?.ethics_text}
                </p>
                <div className="bg-white p-4 rounded-xl border border-red-100">
                  <p className="text-[10px] font-black uppercase text-slate-400 mb-1">Contact
                    Référent Éthique LBFA</p>
                  <a href="mailto:referent.ethique@lbfa.be"
                     className="text-red-600 font-black italic">referent.ethique@lbfa.be</a>
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>
  );
}