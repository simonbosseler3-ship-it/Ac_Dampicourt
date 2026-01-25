import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { AdminActions } from "@/components/admin/adminAction";
import { Navbar } from "@/components/navbar/navbar";
import Link from "next/link";
import { User, EyeOff, Calendar, Heart } from "lucide-react";

export const dynamic = "force-dynamic";

interface NewsItem {
  id: string;
  title: string;
  content: string;
  image_url: string;
  date_text: string;
  is_hidden: boolean;
  author?: {
    full_name: string;
  };
}

export default async function ActualitesPage() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return cookieStore.getAll() },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                  cookieStore.set(name, value, options)
              )
            } catch {}
          },
        },
      }
  );

  const { data: { user } } = await supabase.auth.getUser();
  let isAdmin = false;
  let canManage = false;

  if (user) {
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
    const role = profile?.role?.toLowerCase().trim();
    isAdmin = role === 'admin';
    canManage = isAdmin || role === 'redacteur';
  }

  // Récupération des rédacteurs
  const { data: redacteurs } = await supabase
  .from('profiles')
  .select('full_name')
  .eq('role', 'redacteur')
  .order('full_name');

  let query = supabase
  .from('news')
  .select('*, author:profiles(full_name)')
  .order('date_text', { ascending: false });

  if (!isAdmin) {
    query = query.eq('is_hidden', false);
  }

  const { data: news } = await query;

  return (
      <div className="min-h-screen">
        <Navbar/>
        <main className="container mx-auto px-4 py-12 pt-24">

          {canManage && (
              <Link href="/actualites/nouveau" className="block w-fit mb-8">
                <button
                    className="bg-green-600 text-white px-6 py-2 rounded-full font-bold hover:bg-green-700 transition-all flex items-center gap-2 shadow-md active:scale-95 text-xs uppercase italic">
                  + Nouvelle actu
                </button>
              </Link>
          )}

          <div className="flex flex-col mb-12">
            <h1 className="text-4xl font-black text-slate-900 uppercase italic tracking-tighter">
              Toute l'actualité <span className="text-red-600">ACD</span>
            </h1>
            <div className="h-1.5 w-16 bg-red-600 mt-2"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
            {news?.map((item: NewsItem) => (
                <article key={item.id}
                         className={`relative group ${item.is_hidden ? 'opacity-85' : ''}`}>
                  {item.is_hidden && (
                      <div
                          className="absolute top-4 left-4 z-40 flex items-center gap-2 bg-slate-900 text-white text-[8px] font-black px-2 py-1 rounded-full uppercase tracking-tighter">
                        <EyeOff size={10} className="text-orange-400"/> Masqué
                      </div>
                  )}
                  {canManage && (
                      <div className="absolute top-4 right-4 z-50 scale-90">
                        <AdminActions id={item.id} isHidden={item.is_hidden}/>
                      </div>
                  )}
                  <Link href={`/actualites/${item.id}`} className="block h-full">
                    <div
                        className="h-full bg-white rounded-2xl overflow-hidden border border-slate-100 hover:border-red-100 hover:shadow-xl transition-all duration-300 flex flex-col">
                      <div className="relative h-48 overflow-hidden">
                        <img src={item.image_url} alt={item.title}
                             className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/>
                      </div>
                      <div className="p-5 flex flex-col flex-grow">
                        <h2 className="text-lg font-bold text-slate-800 mb-2 group-hover:text-red-600 transition-colors uppercase italic tracking-tighter line-clamp-2">
                          {item.title}
                        </h2>
                        <p className="text-slate-500 text-xs leading-relaxed mb-4 line-clamp-2">{item.content}</p>
                        <div
                            className="mt-auto pt-3 border-t border-slate-50 flex items-center gap-4 text-slate-400">
                          <div className="flex items-center gap-1">
                            <User size={12} className="text-red-600"/>
                            <span
                                className="text-[9px] font-black uppercase italic tracking-tighter">
                              {item.author?.full_name || "ACD"}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar size={12} className="text-red-600"/>
                            <span
                                className="text-[9px] font-black uppercase italic tracking-tighter">
                              {new Date(item.date_text).toLocaleDateString('fr-FR', {
                                day: '2-digit',
                                month: 'short'
                              }).toUpperCase()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </article>
            ))}
          </div>

          {/* SECTION DISCRÈTE : REMERCIEMENTS */}
          {redacteurs && redacteurs.length > 0 && (
              <footer
                  className="mt-20 pt-10 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6 px-4">
                <div className="flex items-center gap-3 text-slate-400">
                  <Heart size={16} className="text-red-600/40"/>
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] italic">Équipe de rédaction</span>
                </div>

                <div className="flex flex-wrap justify-center md:justify-end gap-x-6 gap-y-2">
                  {redacteurs.map((redac, idx) => (
                      <span key={idx}
                            className="text-[11px] font-black text-slate-500 uppercase italic tracking-tighter hover:text-red-600 transition-colors cursor-default">
                    {redac.full_name}
                  </span>
                  ))}
                </div>
              </footer>
          )}

        </main>
      </div>
  );
}