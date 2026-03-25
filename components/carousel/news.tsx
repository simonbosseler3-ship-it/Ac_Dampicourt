"use client";

import * as React from "react";
import Autoplay from "embla-carousel-autoplay";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import Link from "next/link";
import Image from "next/image"; // Importation pour plus de stabilité
import { useTheme } from "@/components/theme/ThemeContext";
import { useEffect, useState } from "react";

interface NewsItem {
  id: string;
  title: string;
  date_text: string;
  image_url: string;
}

export function HeroNews({ newsData }: { newsData: NewsItem[] }) {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const autoplayPlugin = React.useRef(
      Autoplay({ delay: 10000, stopOnInteraction: false })
  );

  const [imagePositions, setImagePositions] = React.useState<Record<string, string>>({});

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !newsData || newsData.length === 0) return null;

  const latestNews = newsData.slice(0, 3);

  const handleImageLoad = (id: string, event: React.SyntheticEvent<HTMLImageElement>) => {
    const { naturalWidth, naturalHeight } = event.currentTarget;
    if (naturalHeight > naturalWidth) {
      setImagePositions(prev => ({ ...prev, [id]: "center 35%" }));
    } else {
      setImagePositions(prev => ({ ...prev, [id]: "center center" }));
    }
  };

  return (
      <section className="w-full pt-10 pb-12 relative">
        <style>{`
          @keyframes holly-float {
            0%, 100% { transform: translateY(0) rotate(0deg); }
            50% { transform: translateY(-10px) rotate(-3deg); }
          }
          
          @keyframes bunny-peek {
            0%, 100% { transform: translateX(0) rotate(0deg); }
            50% { transform: translateX(-15px) rotate(-2deg); }
          }

          @keyframes flower-sway-right {
            0%, 100% { transform: rotate(-20deg) scale(1); }
            50% { transform: rotate(-12deg) scale(1.05); }
          }
          
          .animate-holly-left { animation: holly-float 6s ease-in-out infinite; }
          .animate-holly-right { animation: holly-float 6s ease-in-out infinite reverse; }
          .animate-bunny { animation: bunny-peek 5s ease-in-out infinite; }
          .animate-flower-right { animation: flower-sway-right 4s ease-in-out infinite; }
        `}</style>

        <div className="relative w-full max-w-6xl mx-auto px-4 md:px-0">

          {/* --- DÉCORATIONS NOËL --- */}
          {theme === "christmas" && (
              <div className="contents"> {/* Utilisation de contents pour ne pas briser le flux */}
                <div className="absolute -top-12 -left-6 md:-top-32 md:-left-24 z-[60] w-32 sm:w-48 md:w-80 pointer-events-none animate-holly-left">
                  <img
                      src="/holly.png"
                      alt="Houx"
                      className="w-full h-auto"
                      style={{ filter: 'drop-shadow(0 15px 20px rgba(0,0,0,0.4))' }}
                  />
                </div>
                <div className="absolute -top-12 -right-6 md:-top-32 md:-right-24 z-[60] w-32 sm:w-48 md:w-80 pointer-events-none animate-holly-right scale-x-[-1]">
                  <img
                      src="/holly.png"
                      alt="Houx"
                      className="w-full h-auto"
                      style={{ filter: 'drop-shadow(0 15px 20px rgba(0,0,0,0.4))' }}
                  />
                </div>
              </div>
          )}

          {/* --- DÉCORATION PÂQUES --- */}
          {theme === "easter" && (
              <>
                <div className="absolute -top-8 -left-10 md:-top-40 md:-left-29 z-[60] w-32 md:w-72 pointer-events-none animate-bunny">
                  <img
                      src="/lapin.png"
                      alt="Lapin de Pâques"
                      className="w-full h-auto"
                      style={{filter: 'drop-shadow(10px 10px 15px rgba(0,0,0,0.3))'}}
                  />
                </div>

                <div className="absolute -bottom-6 -right-4 md:-bottom-12 md:-right-25 z-[60] w-28 md:w-56 pointer-events-none animate-flower-right" style={{ transformOrigin: 'bottom right' }}>
                  <img
                      src="/fleur.png"
                      alt="Fleurs de Pâques"
                      className="w-full h-auto"
                      style={{ filter: 'drop-shadow(10px 10px 15px rgba(0,0,0,0.3))' }}
                  />
                </div>
              </>
          )}

          <Carousel
              plugins={[autoplayPlugin.current]}
              opts={{loop: true}}
              className="relative z-10 w-full shadow-2xl rounded-[2rem] sm:rounded-[3rem] overflow-hidden group border border-white/10 bg-slate-900"
          >
            <CarouselContent>
              {latestNews.map((item) => (
                  <CarouselItem key={item.id}>
                    <div className="relative h-[400px] sm:h-[450px] md:h-[600px] w-full">
                      <img
                          src={item.image_url}
                          alt={item.title}
                          onLoad={(e) => handleImageLoad(item.id, e)}
                          className="absolute inset-0 w-full h-full object-cover transition-all duration-1000 group-hover:scale-105"
                          style={{ objectPosition: imagePositions[item.id] || "center 40%" }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent z-10" />

                      <div className="absolute bottom-0 left-0 w-full p-6 sm:p-8 md:p-14 z-20">
                        <div className="max-w-3xl">
                          <span className="bg-red-600 px-3 py-1 rounded-sm text-[9px] sm:text-[10px] font-black uppercase mb-3 inline-block italic tracking-[0.2em] shadow-lg text-white">À la une</span>
                          <h2 className="text-3xl sm:text-4xl md:text-6xl font-black mb-4 md:mb-6 leading-[0.95] uppercase italic drop-shadow-2xl tracking-tighter text-white">{item.title}</h2>
                          <div className="flex flex-wrap items-center gap-4 md:gap-6">
                            <p className="text-gray-300 font-bold border-l-4 border-red-600 pl-4 italic uppercase text-[10px] sm:text-sm tracking-wider">{item.date_text}</p>
                            <Link href={`/actualites/${item.id}`} className="bg-white text-black px-6 py-2.5 sm:px-8 sm:py-3 rounded-full font-black text-[10px] sm:text-xs uppercase italic hover:bg-red-600 hover:text-white transition-all duration-300 hover:scale-105 active:scale-95 shadow-xl">Lire la suite</Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CarouselItem>
              ))}
            </CarouselContent>

            <CarouselPrevious className="hidden sm:flex left-8 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-white/20 hover:bg-red-600 text-white border-none h-12 w-12 z-30" />
            <CarouselNext className="hidden sm:flex right-8 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-white/20 hover:bg-red-600 text-white border-none h-12 w-12 z-30" />
          </Carousel>
        </div>
      </section>
  );
}