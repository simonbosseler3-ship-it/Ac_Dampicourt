import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { AdminActions } from "@/components/admin/adminAction";
import { Navbar } from "@/components/navbar/navbar";
import Link from "next/link";

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

  const { data: news } = await supabase.from('news').select('*').order('created_at', { ascending: false });

  return (
      <div className="min-h-screen relative">
        <Navbar/>

        <main className="container mx-auto px-4 py-12 pt-32">
          {canManage && (
              <Link href="/actualites/nouveau">
                <button
                    className="mb-8 bg-green-600 text-white px-6 py-2 rounded-full font-bold hover:bg-green-700 transition-all flex items-center gap-2 shadow-lg">
                  <span>+</span> Ajouter une actualité
                </button>
              </Link>
          )}

          <div className="flex flex-col mb-12">
            <h1 className="text-4xl font-black text-slate-900 uppercase italic">
              Toute l'actualité <span className="text-red-600">ACD</span>
            </h1>
            <div className="h-2 w-24 bg-red-600 mt-2"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {news?.map((item) => (
                <article key={item.id} className="relative group">

                  {/* BOUTONS ADMIN : Positionnés en dehors du Link pour rester cliquables séparément */}
                  {canManage && (
                      <div className="absolute top-4 right-4 z-30">
                        <AdminActions id={item.id}/>
                      </div>
                  )}

                  {/* CARTE ENTIÈREMENT CLIQUABLE */}
                  <Link href={`/actualites/${item.id}`} className="block h-full">
                    <div
                        className="h-full bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">

                      {/* IMAGE SECTION */}
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

                      {/* TEXT SECTION */}
                      <div className="p-6">
                        <h2 className="text-xl font-bold text-slate-800 mb-3 group-hover:text-red-600 transition-colors">
                          {item.title}
                        </h2>
                        <p className="text-slate-500 text-sm leading-relaxed mb-6 line-clamp-3">
                          {item.content || "Découvrez les derniers détails concernant cet événement marquant pour notre club d'athlétisme..."}
                        </p>

                        <div
                            className="text-red-600 font-black uppercase text-xs tracking-widest flex items-center gap-2">
                          Consulter l'article <span
                            className="group-hover:translate-x-2 transition-transform">→</span>
                        </div>
                      </div>

                    </div>
                  </Link>
                </article>
            ))}
          </div>
        </main>
      </div>
  );
}