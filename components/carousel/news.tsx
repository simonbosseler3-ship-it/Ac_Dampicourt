// src/components/news.tsx
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

  // Si pas de news, on affiche un message ou un état vide
  if (!newsData.length) return null;

  return (
      <section className="w-full py-8">
        <Carousel
            plugins={[autoplayPlugin.current]}
            opts={{ loop: true }}
            className="w-full max-w-6xl mx-auto shadow-2xl rounded-3xl overflow-hidden group"
        >
          <CarouselContent>
            {newsData.map((item) => (
                <CarouselItem key={item.id}>
                  <div className="relative h-[500px] w-full">
                    <img
                        src={item.image_url}
                        alt={item.title}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div
                        className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"/>
                    <div className="absolute bottom-12 left-12 text-white max-w-2xl">
                        <span
                            className="bg-red-600 px-3 py-1 rounded-sm text-xs font-bold uppercase mb-4 inline-block italic tracking-widest">
                            À la une
                        </span>
                      <h2 className="text-5xl font-black mb-4 leading-tight uppercase italic drop-shadow-lg">
                        {item.title}
                      </h2>
                      <div className="flex items-center gap-6">
                        <p className="text-gray-300 font-medium border-l-2 border-red-600 pl-3">
                          {item.date_text}
                        </p>
                        {/* LIEN VERS LA PAGE ACTUALITÉS */}
                        <Link
                            href={`/actualites/${item.id}`} // Lien dynamique vers l'ID précis
                            className="bg-white text-black px-6 py-2 rounded-full font-bold text-sm hover:bg-red-600 hover:text-white transition-all duration-300"
                        >
                          Lire la suite
                        </Link>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious
              className="left-6 opacity-0 group-hover:opacity-100 transition-opacity bg-white/10 text-white border-none hover:bg-red-600"/>
          <CarouselNext
              className="right-6 opacity-0 group-hover:opacity-100 transition-opacity bg-white/10 text-white border-none hover:bg-red-600"/>
        </Carousel>
      </section>
  );
}