import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { AdminActions } from "@/components/admin/adminAction";
import { Navbar } from "@/components/navbar/navbar";
import Link from "next/link";
import { User, Feather } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ActualitesPage() {
  const cookieStore = await cookies();

  const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                  cookieStore.set(name, value, options)
              )
            } catch {
              // Le middleware gère déjà l'écriture
            }
          },
        },
      }
  )

  const { data: { user } } = await supabase.auth.getUser();

  let canManage = false;
  if (user) {
    const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

    const role = profile?.role?.toLowerCase().trim();
    canManage = role === 'admin' || role === 'redacteur';
  }

  // 1. Récupération des actualités
  const { data: news } = await supabase
  .from('news')
  .select(`
      *,
      author:profiles (
        full_name
      )
    `)
  .order('created_at', { ascending: false });

  // 2. Récupération des rédacteurs
  const { data: redactors } = await supabase
  .from('profiles')
  .select('full_name')
  .eq('role', 'redacteur');

  return (
      <div className="min-h-screen">
        <Navbar/>

        <main className="container mx-auto px-4 py-12 pt-24">

          {canManage && (
              <Link href="/actualites/nouveau" className="block w-fit mb-8">
                <button
                    className="bg-green-600 text-white px-6 py-2 rounded-full font-bold hover:bg-green-700 transition-all flex items-center gap-2 shadow-lg active:scale-95">
                  <span className="text-xl">+</span> Ajouter une actualité
                </button>
              </Link>
          )}

          <div className="flex flex-col mb-12 text-center md:text-left">
            <h1 className="text-4xl font-black text-slate-900 uppercase italic">
              Toute l'actualité <span className="text-red-600">ACD</span>
            </h1>
            <div className="h-2 w-24 bg-red-600 mt-2 mx-auto md:mx-0"></div>
          </div>

          {/* GRILLE DES ARTICLES */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
            {news?.map((item: any) => (
                <article key={item.id} className="relative group">
                  {canManage && (
                      <div className="absolute top-4 right-4 z-30">
                        <AdminActions id={item.id}/>
                      </div>
                  )}

                  <Link href={`/actualites/${item.id}`} className="block h-full">
                    <div
                        className="h-full bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col">
                      <div className="relative h-56 overflow-hidden">
                        <img
                            src={item.image_url}
                            alt={item.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-4 left-4">
                          <span
                              className="bg-red-600 text-white text-[10px] font-bold px-3 py-1 uppercase tracking-widest rounded-sm shadow-sm">
                            {item.date_text}
                          </span>
                        </div>
                      </div>

                      <div className="p-6 flex flex-col flex-grow">
                        <h2 className="text-xl font-bold text-slate-800 mb-3 group-hover:text-red-600 transition-colors uppercase italic tracking-tighter line-clamp-2">
                          {item.title}
                        </h2>
                        <p className="text-slate-500 text-sm leading-relaxed mb-6 line-clamp-3 font-medium">
                          {item.content || "Découvrez les derniers détails concernant cet événement..."}
                        </p>

                        <div
                            className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between">
                          <div className="flex items-center gap-2 text-slate-400">
                            <User size={14} className="text-red-600"/>
                            <span
                                className="text-[10px] font-black uppercase italic tracking-tighter">
                              Par {item.author?.full_name || "Club ACD"}
                            </span>
                          </div>
                          <div
                              className="text-red-600 font-black uppercase text-[10px] tracking-widest flex items-center gap-1">
                            Lire <span
                              className="group-hover:translate-x-1 transition-transform">→</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </article>
            ))}
          </div>

          {/* ZONE DE REMERCIEMENT CENTRÉE - ÉCRITURE PLUS FONCÉE */}
          {redactors && redactors.length > 0 && (
              <footer
                  className="mt-20 pt-12 border-t border-slate-200 max-w-2xl mx-auto text-center mb-10">
                <div className="flex flex-col items-center gap-4">
                  <div
                      className="flex items-center gap-2 text-slate-500 text-[10px] uppercase font-bold tracking-[0.2em]">
                    <Feather size={14} className="text-red-600/60"/>
                    <span>Merci à nos rédacteurs</span>
                  </div>

                  <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
                    {redactors.map((r, i) => (
                        <span key={i}
                              className="text-[11px] font-black uppercase italic text-slate-700 hover:text-red-600 transition-colors cursor-default">
                      {r.full_name}
                    </span>
                    ))}
                  </div>

                  <div className="h-1 w-8 bg-slate-200 rounded-full mt-2"></div>
                </div>
              </footer>
          )}

        </main>
      </div>
  );
}