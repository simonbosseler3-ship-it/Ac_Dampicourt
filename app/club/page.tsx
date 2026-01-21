import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { Navbar } from "@/components/navbar/navbar";
import { Phone, Mail, MapPin, Edit } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function ClubPage() {
  const cookieStore = await cookies();

  const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return cookieStore.getAll() },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
            } catch {}
          },
        },
      }
  )

  // 1. On récupère l'utilisateur pour savoir s'il est admin
  const { data: { user } } = await supabase.auth.getUser();
  let isAdmin = false;
  if (user) {
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
    isAdmin = profile?.role?.toLowerCase().trim() === 'admin';
  }

  // 2. On récupère les données (Accessible à tous)
  const { data: info } = await supabase.from('club_info').select('*').single();
  const { data: comite } = await supabase.from('club_comite').select('*').order('order_index', { ascending: true });

  return (
      <div className="min-h-screen">
        <Navbar/>

        <main className="container mx-auto px-4 py-12 pt-32">

          <div
              className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
            <div className="flex flex-col">
              <h1 className="text-4xl font-black text-slate-900 uppercase italic">
                L'Athlétic Club <span className="text-red-600">Dampicourt</span>
              </h1>
              <div className="h-2 w-24 bg-red-600 mt-2"></div>
            </div>

            {/* BOUTON MODIFIER : Apparaît uniquement pour l'admin */}
            {isAdmin && (
                <Link href="/club/modifier">
                  <button
                      className="flex items-center gap-2 bg-slate-900 text-white px-6 py-2 rounded-full font-bold hover:bg-red-600 transition-all text-sm uppercase italic">
                    <Edit size={16}/> Modifier la page
                  </button>
                </Link>
            )}
          </div>

          {/* PRÉSENTATION */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-20">
            <div className="lg:col-span-2 space-y-6 text-slate-600 leading-relaxed">
              <p className="whitespace-pre-wrap">{info?.history_text}</p>
              <p className="italic border-l-4 border-red-600 pl-4 bg-slate-50 py-4 font-medium">
                "{info?.quote_text}"
              </p>
            </div>

            <div className="bg-slate-900 text-white p-8 rounded-3xl shadow-xl h-fit">
              <h3 className="text-xl font-black uppercase italic mb-6 text-red-600 tracking-tighter">En
                quelques chiffres</h3>
              <ul className="space-y-4 font-bold uppercase italic text-[12px]">
                <li className="flex justify-between border-b border-white/10 pb-2">
                  <span>Licenciés</span> <span className="text-red-600">~400</span></li>
                <li className="flex justify-between border-b border-white/10 pb-2">
                  <span>Entraîneurs</span> <span className="text-red-600">30+</span></li>
                <li className="flex justify-between border-b border-white/10 pb-2">
                  <span>Officiels</span> <span className="text-red-600">50</span></li>
                <li className="flex justify-between"><span>Compétitions / an</span> <span
                    className="text-red-600">15+</span></li>
              </ul>
            </div>
          </div>

          {/* STADE */}
          <div className="mb-20">
            <h2 className="text-3xl font-black text-slate-900 uppercase italic mb-2">Le Stade
              des <span className="text-red-600">Fusillés</span></h2>
            <div className="h-1.5 w-16 bg-red-600 mb-6"></div>
            <p className="text-slate-500 flex items-center gap-2 font-bold uppercase text-xs tracking-widest mb-8">
              <MapPin size={16} className="text-red-600"/> {info?.stade_location}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                <h3 className="text-red-600 font-black text-xs uppercase italic mb-2 tracking-tighter">Piste</h3>
                <p className="text-slate-600 text-xs font-bold leading-relaxed">Piste synthétique 6
                  couloirs en réfection : passage à 8 couloirs.</p>
              </div>
              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                <h3 className="text-red-600 font-black text-xs uppercase italic mb-2 tracking-tighter">Sautoirs</h3>
                <p className="text-slate-600 text-xs font-bold leading-relaxed">Sautoir en longueur
                  et piste de survitesse en Mondo (2010).</p>
              </div>
              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                <h3 className="text-red-600 font-black text-xs uppercase italic mb-2 tracking-tighter">Endurance</h3>
                <p className="text-slate-600 text-xs font-bold leading-relaxed">Circuit de copeaux
                  de 1 km pour l'entraînement (2006).</p>
              </div>
              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                <h3 className="text-red-600 font-black text-xs uppercase italic mb-2 tracking-tighter">Perche</h3>
                <p className="text-slate-600 text-xs font-bold leading-relaxed">Portique
                  multifonctionnel pour l'entraînement (2010).</p>
              </div>
            </div>
          </div>

          {/* COMITÉ */}
          <div>
            <h2 className="text-3xl font-black text-slate-900 uppercase italic mb-2">Le Bureau
              du <span className="text-red-600">Comité</span></h2>
            <div className="h-1.5 w-16 bg-red-600 mb-8"></div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {comite?.map((member) => (
                  <div key={member.id}
                       className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                    <span
                        className="text-[9px] font-black uppercase tracking-widest text-red-600 italic block mb-2">{member.role}</span>
                    <h3 className="text-lg font-bold text-slate-800 mb-6">{member.name}</h3>
                    <div className="space-y-3 pt-4 border-t border-slate-50">
                      <a href={`tel:${member.tel}`}
                         className="flex items-center gap-3 text-xs font-bold text-slate-400 hover:text-red-600 transition-colors italic">
                        <Phone size={14}/> {member.tel}
                      </a>
                      <a href={`mailto:${member.email}`}
                         className="flex items-center gap-3 text-xs font-bold text-slate-400 hover:text-red-600 transition-colors truncate italic">
                        <Mail size={14}/> {member.email}
                      </a>
                    </div>
                  </div>
              ))}
            </div>

            <div
                className="bg-slate-50 rounded-3xl p-8 flex flex-col md:flex-row justify-between items-center gap-6 border border-slate-200">
              <div>
                <span
                    className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Coordinateur KBPM</span>
                <span
                    className="text-lg font-black italic uppercase text-slate-800 underline decoration-red-600 decoration-4">{info?.kbpm_coordinator}</span>
              </div>
              <div className="text-right">
                <span
                    className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Coordinateur Sportif & Technique</span>
                <span
                    className="text-lg font-black italic uppercase text-slate-800">{info?.sport_coordinator}</span>
              </div>
            </div>
          </div>
        </main>
      </div>
  );
}