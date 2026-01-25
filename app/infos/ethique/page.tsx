import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { Navbar } from "@/components/navbar/navbar";
import { ShieldCheck, Edit } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function EthiquePage() {
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

  // 2. Récupération de la configuration
  const { data: config } = await supabase
  .from('training_page_config')
  .select('*')
  .single();

  const contactEmail = config?.referent_email || "referent.ethique@lbfa.be";

  return (
      <div className="min-h-screen">

        <main className="container mx-auto px-4 py-12 pt-32">

          {/* TITRE & ACTION ADMIN */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
            <div className="flex flex-col">
              <h1 className="text-4xl font-black text-slate-900 uppercase italic">
                Éthique <span className="text-red-600">& Dopage</span>
              </h1>
              <div className="h-2 w-24 bg-red-600 mt-2"></div>
            </div>

            {isAdmin && (
                <Link href="/infos/ethique/modifier">
                  <button
                      className="flex items-center gap-2 bg-slate-900 text-white px-6 py-2 rounded-full font-bold hover:bg-red-600 transition-all text-xs uppercase italic shadow-lg">
                    <Edit size={16}/> Modifier la page
                  </button>
                </Link>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

            {/* Colonne principale texte */}
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100">
                <div className="flex items-center gap-3 mb-6 text-red-600">
                  <ShieldCheck size={32}/>
                  <span className="font-black uppercase italic">Charte et Règlements</span>
                </div>
                <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">
                  {config?.ethics_text || "Contenu en cours de rédaction..."}
                </p>
              </div>
            </div>

            {/* Sidebar Contact */}
            <div>
              <div
                  className="bg-slate-900 text-white p-8 rounded-3xl shadow-xl relative overflow-hidden">
                <h3 className="text-xl font-black uppercase italic mb-4 relative z-10">
                  Contact Référent
                </h3>
                <p className="text-slate-400 text-sm mb-6 relative z-10">
                  Pour toute question relative à l'éthique sportive ou au dopage au sein de la LBFA.
                </p>

                <a href={`mailto:${contactEmail}`}
                   className="inline-block bg-red-600 text-white font-bold px-6 py-3 rounded-xl hover:bg-white hover:text-red-600 transition-all relative z-10 uppercase text-[10px] tracking-wider truncate max-w-full">
                  {contactEmail}
                </a>

                {/* Décoration */}
                <div
                    className="absolute -bottom-10 -right-10 w-32 h-32 bg-red-600/20 rounded-full blur-3xl"></div>
              </div>
            </div>

          </div>
        </main>
      </div>
  );
}