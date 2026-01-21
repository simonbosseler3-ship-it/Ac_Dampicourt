import Link from "next/link";
import Image from "next/image";
import { Search, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function Navbar() {
  return (
      <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur">
        <div className="container mx-auto flex h-20 items-center justify-between px-4">

          {/* LOGO LARGE SANS TEXTE */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center group">
              {/* On passe sur une largeur beaucoup plus grande (w-48 ou w-64)
                pour laisser respirer ton logo panoramique */}
              <div className="relative h-12 w-48 sm:h-14 sm:w-64 transition-transform group-hover:scale-105">
                <Image
                    src="/Logo-ACD-1024x193.svg"
                    alt="Logo AC Dampicourt"
                    fill
                    className="object-contain object-left"
                    priority
                />
              </div>
            </Link>
          </div>

          {/* MENU PRINCIPAL */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-bold uppercase tracking-wide">
            <Link href="/club" className="text-slate-600 hover:text-red-600 transition-colors">Le Club</Link>
            <Link href="/actualites" className="text-slate-600 hover:text-red-600 transition-colors">Actualités</Link>
            <Link
                href="https://www.beathletics.be/calendar"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-600 hover:text-red-600 transition-colors"
            >
              Calendrier
            </Link>
            <Link href="/infos" className="text-slate-600 hover:text-red-600 transition-colors">Infos</Link>
          </nav>

          {/* RECHERCHE ET LOGIN */}
          <div className="flex items-center gap-4">
            <div className="relative hidden lg:block">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                  type="search"
                  placeholder="Rechercher un athlète..."
                  className="w-64 pl-9 rounded-full bg-gray-100 border-none focus-visible:ring-2 focus-visible:ring-red-500"
              />
            </div>

            <div className="flex items-center gap-2 border-l pl-4 ml-2">
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-red-50 hover:text-red-600">
                <User className="h-5 w-5" />
              </Button>
              <Button className="bg-red-600 hover:bg-red-700 text-white font-bold rounded-full px-6 shadow-md shadow-red-200 transition-all active:scale-95">
                S'inscrire
              </Button>
            </div>
          </div>

        </div>
      </header>
  );
}