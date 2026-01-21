import { Navbar } from "@/components/navbar/navbar";
import { HeroNews } from "@/components/carousel/news";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { MapPin, Phone, ExternalLink, Instagram, Facebook } from "lucide-react"; // Import des réseaux

export default async function Home() {
  const { data: news } = await supabase
  .from('news')
  .select('*')
  .order('created_at', { ascending: false });

  return (
      <div className="min-h-screen">
        <Navbar/>

        <main className="container mx-auto px-4 py-12 pt-32">
          <HeroNews newsData={news || []}/>

          <section className="grid grid-cols-1 md:grid-cols-3 gap-6 py-12 text-center">
            {/* RÉSULTATS */}
            <Link
                href="/resultats"
                className="bg-white/90 backdrop-blur-sm p-8 rounded-[32px] shadow-sm border-2 border-transparent hover:border-red-600 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group flex flex-col items-center justify-center min-h-[200px]"
            >
              <h3 className="text-xl font-black text-red-600 uppercase italic group-hover:scale-110 transition-transform">Résultats</h3>
              <p className="text-gray-500 mt-2 font-medium">Consultez les dernières performances</p>
            </Link>

            {/* INSCRIPTIONS COMPÉTITIONS */}
            <Link
                href="/inscriptions"
                className="bg-white/90 backdrop-blur-sm p-8 rounded-[32px] shadow-sm border-2 border-transparent hover:border-red-600 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group flex flex-col items-center justify-center min-h-[200px]"
            >
              <h3 className="text-xl font-black text-red-600 uppercase italic group-hover:scale-110 transition-transform">Inscriptions</h3>
              <p className="text-gray-500 mt-2 font-medium">S'inscrire aux compétitions &
                championnats</p>
            </Link>

            {/* DAMPICOURT SPEED NIGHT/RACE */}
            <Link
                href="/speed-night"
                className="bg-white/90 backdrop-blur-sm p-8 rounded-[32px] shadow-sm border-2 border-transparent hover:border-red-600 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group flex flex-col items-center justify-center min-h-[200px]"
            >
              <h3 className="text-xl font-black text-red-600 uppercase italic group-hover:scale-110 transition-transform">Speed
                Night / Race</h3>
              <p className="text-gray-500 mt-2 font-medium">L'événement majeur de l'année à
                Dampicourt</p>
            </Link>
          </section>
        </main>

        {/* FOOTER LARGE (FULL WIDTH) */}
        <footer className="bg-slate-900 text-white pt-20 pb-10 mt-20">
          <div className="container mx-auto px-4">

            {/* GRILLE DU FOOTER */}
            <div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 border-b border-white/10 pb-16">

              {/* COLONNE 1 : BRAND & BIO */}
              <div className="flex flex-col gap-6">
                <div>
                  <h4 className="text-red-600 font-black uppercase italic text-3xl leading-none">AC
                    Dampicourt</h4>
                  <p className="text-gray-500 text-xs font-bold uppercase tracking-[0.2em] mt-2">Province
                    du Luxembourg</p>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
                  Depuis sa création, l'AC Dampicourt forme les passionnés d'athlétisme du sud de la
                  Belgique, de l'initiation à la haute performance.
                </p>
              </div>

              {/* COLONNE 2 : NAVIGATION RAPIDE */}
              <div className="flex flex-col gap-6">
                <h4 className="text-white font-black uppercase italic text-sm tracking-widest">Navigation</h4>
                <nav className="flex flex-col gap-3">
                  <Link href="/club"
                        className="text-gray-400 hover:text-red-600 transition-colors text-sm font-bold uppercase italic">Le
                    Club</Link>
                  <Link href="/actualites"
                        className="text-gray-400 hover:text-red-600 transition-colors text-sm font-bold uppercase italic">Actualités</Link>
                  <Link href="/entrainement"
                        className="text-gray-400 hover:text-red-600 transition-colors text-sm font-bold uppercase italic">Entraînements</Link>
                  <Link href="/resultats"
                        className="text-gray-400 hover:text-red-600 transition-colors text-sm font-bold uppercase italic">Résultats</Link>
                </nav>
              </div>

              {/* COLONNE 3 : LOCALISATION & CONTACT */}
              <div className="flex flex-col gap-6">
                <h4 className="text-white font-black uppercase italic text-sm tracking-widest">Nous
                  Trouver</h4>
                <div className="space-y-4 text-sm">
                  <div className="flex items-start gap-3 text-gray-400">
                    <MapPin size={20} className="text-red-600 shrink-0 mt-1"/>
                    <div>
                      <p className="font-black text-white uppercase italic leading-none mb-1">Stade
                        des Fusillés</p>
                      <p>Rue du Stade 7</p>
                      <p>6762 SAINT-MARD (Virton)</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-gray-400">
                    <Phone size={18} className="text-red-600 shrink-0"/>
                    <a href="tel:+3263576974"
                       className="hover:text-white transition-colors font-bold">+32 63 57 69 74</a>
                  </div>
                  <a
                      href="https://www.google.com/maps/dir//Rue+du+Stade+7,+6762+Virton"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-red-600 font-black uppercase italic text-[10px] hover:text-white transition-all group pt-2"
                  >
                    <ExternalLink size={14}/> Itinéraire vers le stade
                  </a>
                </div>
              </div>

              {/* COLONNE 4 : RÉSEAUX SOCIAUX */}
              <div className="flex flex-col gap-6">
                <h4 className="text-white font-black uppercase italic text-sm tracking-widest">Suivre
                  l'ACD</h4>
                <p className="text-gray-400 text-sm italic">Rejoignez notre communauté sur les
                  réseaux sociaux pour ne rien manquer.</p>
                <div className="flex items-center gap-4">
                  <a
                      href="https://www.facebook.com/groups/111612989000083"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-white/5 p-4 rounded-2xl hover:bg-blue-600 transition-all group shadow-xl"
                  >
                    <Facebook size={24} className="group-hover:scale-110 transition-transform"/>
                  </a>
                  <a
                      href="https://www.instagram.com/acdampicourt_?utm_source=ig_web_button_share_sheet"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-white/5 p-4 rounded-2xl hover:bg-gradient-to-tr from-yellow-500 via-red-500 to-purple-600 transition-all group shadow-xl"
                  >
                    <Instagram size={24} className="group-hover:scale-110 transition-transform"/>
                  </a>
                </div>
              </div>

            </div>

            {/* COPYRIGHT & CRÉDITS */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-10">
              <div className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-600">
                © 2026 AC Dampicourt - Site Officiel
              </div>
              <div
                  className="flex gap-6 text-[9px] font-black uppercase text-gray-700 tracking-tighter italic">
                <span>Politique de confidentialité</span>
                <span>Réglement interne</span>
                <span>Mentions légales</span>
              </div>
            </div>

          </div>
        </footer>
      </div>
  );
}