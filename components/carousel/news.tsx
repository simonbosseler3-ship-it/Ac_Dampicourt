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

  if (!newsData || newsData.length === 0) return null;

  const latestNews = newsData.slice(0, 3);

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
                  <div className="relative h-[500px] w-full">
                    {/* Image avec effet de zoom au survol du carousel */}
                    <img
                        src={item.image_url}
                        alt={item.title}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                    />

                    {/* Overlay sombre pour la lisibilité du texte */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                    {/* Contenu textuel */}
                    <div className="absolute bottom-12 left-12 text-white max-w-2xl z-10">
                  <span className="bg-red-600 px-4 py-1.5 rounded-sm text-[10px] font-black uppercase mb-4 inline-block italic tracking-[0.2em] shadow-lg">
                    À la une
                  </span>

                      <h2 className="text-5xl md:text-6xl font-black mb-6 leading-[0.9] uppercase italic drop-shadow-2xl tracking-tighter">
                        {item.title}
                      </h2>

                      <div className="flex items-center gap-6">
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
                </CarouselItem>
            ))}
          </CarouselContent>

          {/* Flèches de navigation (visibles au survol) */}
          <CarouselPrevious className="left-8 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-white/20 hover:bg-red-600 text-white border-none h-12 w-12" />
          <CarouselNext className="right-8 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-white/20 hover:bg-red-600 text-white border-none h-12 w-12" />
        </Carousel>
      </section>
  );
}