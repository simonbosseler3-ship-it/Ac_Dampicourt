import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { AdminActions } from "@/components/admin/adminAction";
import { Navbar } from "@/components/navbar/navbar";
import Link from "next/link";
import { User, EyeOff, Calendar } from "lucide-react";

export const dynamic = "force-dynamic";

// Interface pour TypeScript
interface NewsItem {
  id: string;
  title: string;
  content: string;
  image_url: string;
  date_text: string; // Ce champ est maintenant de type DATE (YYYY-MM-DD)
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
    const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

    const role = profile?.role?.toLowerCase().trim();
    isAdmin = role === 'admin';
    canManage = isAdmin || role === 'redacteur';
  }

  // MODIFICATION ICI : On trie par date_text de la plus récente à la plus vieille
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
        <Navbar />
        <main className="container mx-auto px-4 py-12 pt-24">

          {canManage && (
              <Link href="/actualites/nouveau" className="block w-fit mb-8">
                <button className="bg-green-600 text-white px-6 py-2 rounded-full font-bold hover:bg-green-700 transition-all flex items-center gap-2 shadow-lg active:scale-95">
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
            {news?.map((item: NewsItem) => (
                <article key={item.id} className={`relative group ${item.is_hidden ? 'opacity-85' : ''}`}>

                  {item.is_hidden && (
                      <div className="absolute top-4 left-4 z-40 flex items-center gap-2 bg-slate-900 text-white text-[9px] font-black px-3 py-1.5 rounded-full uppercase tracking-tighter shadow-xl border border-white/20">
                        <EyeOff size={12} className="text-orange-400" />
                        Masqué pour le public
                      </div>
                  )}

                  {canManage && (
                      <div className="absolute top-4 right-4 z-50">
                        <AdminActions id={item.id} isHidden={item.is_hidden} />
                      </div>
                  )}

                  <Link href={`/actualites/${item.id}`} className="block h-full">
                    <div className={`h-full bg-white rounded-3xl overflow-hidden shadow-sm border transition-all duration-300 flex flex-col ${item.is_hidden ? 'border-orange-200 bg-slate-50' : 'border-slate-100 hover:shadow-xl hover:-translate-y-1'}`}>

                      <div className="relative h-56 overflow-hidden">
                        <img
                            src={item.image_url}
                            alt={item.title}
                            className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${item.is_hidden ? 'grayscale' : ''}`}
                        />
                      </div>

                      <div className="p-6 flex flex-col flex-grow">
                        <h2 className="text-xl font-bold text-slate-800 mb-3 group-hover:text-red-600 transition-colors uppercase italic tracking-tighter line-clamp-2">
                          {item.title}
                        </h2>

                        <p className="text-slate-500 text-sm leading-relaxed mb-6 line-clamp-3 font-medium">
                          {item.content || "Détails à venir..."}
                        </p>

                        <div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between">
                          <div className="flex flex-wrap items-center gap-4 text-slate-400">

                            {/* AUTEUR */}
                            <div className="flex items-center gap-1.5">
                              <User size={14} className="text-red-600" />
                              <span className="text-[10px] font-black uppercase italic tracking-tighter">
                                Par {item.author?.full_name || "Club ACD"}
                              </span>
                            </div>

                            {/* DATE FORMATÉE */}
                            <div className="flex items-center gap-1.5 border-l border-slate-200 pl-4 md:border-none md:pl-0">
                              <Calendar size={14} className="text-red-600" />
                              <span className="text-[10px] font-black uppercase italic tracking-tighter">
                                {new Date(item.date_text).toLocaleDateString('fr-FR', {
                                  day: '2-digit',
                                  month: 'short',
                                  year: 'numeric'
                                }).replace('.', '').toUpperCase()}
                              </span>
                            </div>

                          </div>
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