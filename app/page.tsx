import { Navbar } from "@/components/navbar/navbar";
import { HeroNews } from "@/components/carousel/news";
import { supabase } from "@/lib/supabase";

export default async function Home() {
  const { data: profiles } = await supabase.from('profiles').select('*');

  const { data: news } = await supabase
  .from('news')
  .select('*')
  .order('created_at', { ascending: false });

  return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />

        <main className="container mx-auto px-4">
          <HeroNews newsData={news || []}/>

          <section className="grid grid-cols-1 md:grid-cols-3 gap-6 py-12 text-center">
            {/* RÉSULTATS */}
            <div
                className="bg-white p-8 rounded-2xl shadow-sm border hover:border-red-500 transition-all cursor-pointer group">
              <h3 className="text-xl font-bold text-red-600 uppercase italic">Résultats</h3>
              <p className="text-gray-500 mt-2">Consultez les dernières performances</p>
            </div>

            {/* INSCRIPTIONS COMPÉTITIONS */}
            <div
                className="bg-white p-8 rounded-2xl shadow-sm border hover:border-red-500 transition-all cursor-pointer group">
              <h3 className="text-xl font-bold text-red-600 uppercase italic">Inscriptions</h3>
              <p className="text-gray-500 mt-2">S'inscrire aux prochaines compétitions/championnats/cross</p>
            </div>

            {/* ENTRAÎNEMENTS */}
            <div
                className="bg-white p-8 rounded-2xl shadow-sm border hover:border-red-500 transition-all cursor-pointer group">
              <h3 className="text-xl font-bold text-red-600 uppercase italic">Entraînements</h3>
              <p className="text-gray-500 mt-2">Horaires par catégories</p>
            </div>

          </section>
        </main>

        <footer className="bg-slate-900 text-white py-12 mt-20">
          <div className="container mx-auto px-4 text-center text-sm text-gray-400">
            © 2026 AC Dampicourt - Athlétisme de haut niveau
          </div>
        </footer>
      </div>
  );
}