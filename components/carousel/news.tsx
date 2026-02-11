"use client";

import * as React from "react";
import Autoplay from "embla-carousel-autoplay";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import Link from "next/link";

interface NewsItem {
  id: string;
  title: string;
  date_text: string;
  image_url: string;
}

export function HeroNews({ newsData }: { newsData: NewsItem[] }) {
  const autoplayPlugin = React.useRef(
      Autoplay({ delay: 10000, stopOnInteraction: false })
  );

  // État pour gérer la position dynamique de chaque image
  const [imagePositions, setImagePositions] = React.useState<Record<string, string>>({});

  if (!newsData || newsData.length === 0) return null;

  const latestNews = newsData.slice(0, 3);

  const handleImageLoad = (id: string, event: React.SyntheticEvent<HTMLImageElement>) => {
    const { naturalWidth, naturalHeight } = event.currentTarget;

    // Si l'image est verticale (Portrait)
    if (naturalHeight > naturalWidth) {
      // On vise 35% (Le milieu est à 50%, le haut à 0%. 35% c'est le "tiers haut", idéal pour les visages)
      setImagePositions(prev => ({ ...prev, [id]: "center 35%" }));
    } else {
      // Si l'image est horizontale ou carrée, on reste pile au milieu
      setImagePositions(prev => ({ ...prev, [id]: "center center" }));
    }
  };

  return (
      <section className="w-full py-8">
        <Carousel
            plugins={[autoplayPlugin.current]}
            opts={{ loop: true }}
            className="w-full max-w-6xl mx-auto shadow-2xl rounded-[2.5rem] overflow-hidden group border border-white/10"
        >
          <CarouselContent>
            {latestNews.map((item) => (
                <CarouselItem key={item.id}>
                  <div className="relative h-[450px] md:h-[600px] w-full bg-slate-900">

                    {/* IMAGE AVEC CADRAGE DYNAMIQUE */}
                    <img
                        src={item.image_url}
                        alt={item.title}
                        onLoad={(e) => handleImageLoad(item.id, e)}
                        className="absolute inset-0 w-full h-full object-cover transition-all duration-1000 group-hover:scale-105"
                        style={{
                          // On applique le réglage calculé, sinon un défaut à 40% (légèrement haut) pendant le chargement
                          objectPosition: imagePositions[item.id] || "center 40%"
                        }}
                    />

                    {/* OVERLAY : Dégradé pour la lisibilité */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent z-10" />

                    {/* CONTENU TEXTUEL */}
                    <div className="absolute bottom-0 left-0 w-full p-8 md:p-14 z-20">
                      <div className="max-w-3xl">
                    <span className="bg-red-600 px-4 py-1.5 rounded-sm text-[10px] font-black uppercase mb-4 inline-block italic tracking-[0.2em] shadow-lg text-white">
                      À la une
                    </span>

                        <h2 className="text-4xl md:text-6xl font-black mb-6 leading-[0.95] uppercase italic drop-shadow-2xl tracking-tighter text-white">
                          {item.title}
                        </h2>

                        <div className="flex flex-wrap items-center gap-6">
                          <p className="text-gray-300 font-bold border-l-4 border-red-600 pl-4 italic uppercase text-sm tracking-wider">
                            {item.date_text}
                          </p>

                          <Link
                              href={`/actualites/${item.id}`}
                              className="bg-white text-black px-8 py-3 rounded-full font-black text-xs uppercase italic hover:bg-red-600 hover:text-white transition-all duration-300 hover:scale-105 active:scale-95 shadow-xl"
                          >
                            Lire la suite
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
            ))}
          </CarouselContent>

          <CarouselPrevious className="left-8 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-white/20 hover:bg-red-600 text-white border-none h-12 w-12 z-30" />
          <CarouselNext className="right-8 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-white/20 hover:bg-red-600 text-white border-none h-12 w-12 z-30" />
        </Carousel>
      </section>
  );
}