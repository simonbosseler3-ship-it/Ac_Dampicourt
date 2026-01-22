import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { Navbar } from "@/components/navbar/navbar";
import { ShieldCheck } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function EthiquePage() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { cookies: { getAll() { return cookieStore.getAll() } } }
  );

  const { data: config } = await supabase.from('training_page_config').select('*').single();

  return (
      <div className="min-h-screen">
        <Navbar/>

        <main className="container mx-auto px-4 py-12 pt-32">

          <div className="flex flex-col mb-12">
            <h1 className="text-4xl font-black text-slate-900 uppercase italic">
              Éthique <span className="text-red-600">& Dopage</span>
            </h1>
            <div className="h-2 w-24 bg-red-600 mt-2"></div>
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
                <h3 className="text-xl font-black uppercase italic mb-4 relative z-10">Contact
                  Référent</h3>
                <p className="text-slate-400 text-sm mb-6 relative z-10">
                  Pour toute question relative à l'éthique sportive ou au dopage au sein de la LBFA.
                </p>
                <a href="mailto:referent.ethique@lbfa.be"
                   className="inline-block bg-red-600 text-white font-bold px-6 py-3 rounded-xl hover:bg-white hover:text-red-600 transition-all relative z-10 uppercase text-xs tracking-wider">
                  referent.ethique@lbfa.be
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