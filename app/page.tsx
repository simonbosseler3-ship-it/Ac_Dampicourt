import { Navbar } from "@/components/navbar/navbar";
import { HeroNews } from "@/components/carousel/news";
import { supabase } from "@/lib/supabase";
import Link from "next/link"; // Import nécessaire pour la navigation

export default async function Home() {
  const { data: news } = await supabase
  .from('news')
  .select('*')
  .order('created_at', { ascending: false });

  return (
      <div className="min-h-screen">
        <Navbar/>

        <main className="container mx-auto px-4 py-12">
          <HeroNews newsData={news || []}/>

          <section className="grid grid-cols-1 md:grid-cols-3 gap-6 py-12 text-center">
            {/* RÉSULTATS */}
            <Link
                href="/resultats"
                className="bg-white/90 backdrop-blur-sm p-8 rounded-3xl shadow-sm border-2 border-transparent hover:border-red-600 hover:border-4 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group flex flex-col items-center justify-center min-h-[200px]"
            >
              <h3 className="text-xl font-black text-red-600 uppercase italic group-hover:scale-110 transition-transform">Résultats</h3>
              <p className="text-gray-500 mt-2 font-medium">Consultez les dernières performances</p>
            </Link>

            {/* INSCRIPTIONS COMPÉTITIONS */}
            <Link
                href="/inscriptions"
                className="bg-white/90 backdrop-blur-sm p-8 rounded-3xl shadow-sm border-2 border-transparent hover:border-red-600 hover:border-4 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group flex flex-col items-center justify-center min-h-[200px]"
            >
              <h3 className="text-xl font-black text-red-600 uppercase italic group-hover:scale-110 transition-transform">Inscriptions</h3>
              <p className="text-gray-500 mt-2 font-medium">S'inscrire aux compétitions &
                championnats</p>
            </Link>

            {/* DAMPICOURT SPEED NIGHT/RACE */}
            <Link
                href="/speed-night"
                className="bg-white/90 backdrop-blur-sm p-8 rounded-3xl shadow-sm border-2 border-transparent hover:border-red-600 hover:border-4 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group flex flex-col items-center justify-center min-h-[200px]"
            >
              <h3 className="text-xl font-black text-red-600 uppercase italic group-hover:scale-110 transition-transform">Speed
                Night / Race</h3>
              <p className="text-gray-500 mt-2 font-medium">L'événement majeur de l'année à
                Dampicourt</p>
            </Link>
          </section>
        </main>

        <footer className="bg-slate-900 text-white py-12 mt-20">
          <div className="container mx-auto px-4 text-center text-sm text-gray-400">
            © 2026 AC Dampicourt - Le site officiel de l'AC Dampicourt
          </div>
        </footer>
      </div>
  );
}