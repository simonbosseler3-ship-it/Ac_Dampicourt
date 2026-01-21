import { Navbar } from "@/components/navbar/navbar";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default async function ActualitesPage() {

  const { data: { session } } = await supabase.auth.getSession();
  let isAdmin = false;

  if (session) {
    const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', session.user.id)
    .single();
    isAdmin = profile?.role === 'admin';
  }

  const { data: news } = await supabase
  .from('news')
  .select('*')
  .order('created_at', { ascending: false });

  return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />

        <main className="container mx-auto px-4 py-12">

          {isAdmin && (
              <button className="mb-8 bg-green-600 text-white px-6 py-2 rounded-full font-bold hover:bg-green-700 transition-all">
                + Ajouter une actualité
              </button>
          )}

          <div className="flex flex-col mb-12">
            <h1 className="text-4xl font-black text-slate-900 uppercase italic">
              Toute l'actualité <span className="text-red-600">ACD</span>
            </h1>
            <div className="h-2 w-24 bg-red-600 mt-2"></div>
          </div>

          {/* GRILLE D'ACTUALITÉS */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {news?.map((item) => (
                <article key={item.id} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-xl transition-shadow group">
                  <div className="relative h-56 overflow-hidden">
                    <img
                        src={item.image_url}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4">
                  <span className="bg-red-600 text-white text-[10px] font-bold px-3 py-1 uppercase tracking-widest rounded-sm">
                    {item.date_text}
                  </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <h2 className="text-xl font-bold text-slate-800 mb-3 group-hover:text-red-600 transition-colors">
                      {item.title}
                    </h2>
                    <p className="text-slate-500 text-sm leading-relaxed mb-6 line-clamp-3">
                      {/* On pourra ajouter un champ "description" plus tard dans DataGrip */}
                      Découvrez les derniers détails concernant cet événement marquant pour notre club d'athlétisme...
                    </p>
                    <Link
                        href={`/actualites/${item.id}`}
                        className="text-red-600 font-black uppercase text-xs tracking-widest flex items-center gap-2 hover:gap-3 transition-all"
                    >
                      Consulter l'article <span>→</span>
                    </Link>
                  </div>
                </article>
            ))}
          </div>
        </main>
      </div>
  );
}