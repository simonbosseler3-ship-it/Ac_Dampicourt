import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { Navbar } from "@/components/navbar/navbar";
import { Mail, Phone, Edit } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function EntraineursPage() {
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

  return (
      <div className="min-h-screen">
        <Navbar/>

        <main className="container mx-auto px-4 py-12 pt-32">
          {/* TITRE & ACTION ADMIN */}
          <div
              className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-6">
            <div className="flex flex-col">
              <h1 className="text-4xl font-black text-slate-900 uppercase italic">
                Nos <span className="text-red-600">Entraîneurs</span>
              </h1>
              <div className="h-2 w-24 bg-red-600 mt-2"></div>
            </div>

            {isAdmin && (
                <Link
                    href="/entrainement/modifier"> {/* Tu pourras changer ce lien plus tard si tu déplaces la page admin */}
                  <button
                      className="flex items-center gap-2 bg-slate-900 text-white px-6 py-2 rounded-full font-bold hover:bg-red-600 transition-all text-xs uppercase italic">
                    <Edit size={16}/> Gérer les entraîneurs
                  </button>
                </Link>
            )}
          </div>

          {/* LISTE DES ENTRAÎNEURS */}
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
        </main>
      </div>
  );
}