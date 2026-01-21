"use client";

import Link from "next/link";
import Image from "next/image";
import { Search, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter, usePathname } from "next/navigation";

export function Navbar() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const router = useRouter();
  const pathname = usePathname(); // Pour détecter la page active

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);

      if (session?.user) {
        const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();
        setProfile(data);
      }
    };

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (!session) {
        setProfile(null);
      } else {
        getSession();
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.refresh();
    router.push("/");
  };

  // Fonction pour styliser le lien actif
  const linkStyle = (path: string) =>
      `transition-all duration-300 hover:text-red-600 ${
          pathname === path ? "text-red-600 border-b-2 border-red-600" : "text-slate-600"
      }`;

  return (
      <header className="fixed top-0 z-50 w-full border-b-4 border-red-600 bg-white/80 backdrop-blur-md shadow-sm">
        <div className="container mx-auto flex h-20 items-center justify-between px-4">

          {/* LOGO */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center group">
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
          <nav className="hidden md:flex items-center gap-8 text-sm font-black uppercase tracking-wider">
            <Link href="/club" className={linkStyle("/club")}>Le Club</Link>
            <Link href="/actualites" className={linkStyle("/actualites")}>Toute les actualités</Link>
            <Link
                href="https://www.beathletics.be/calendar"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-600 hover:text-red-600 transition-colors"
            >
              Calendrier
            </Link>
            <Link href="/infos" className={linkStyle("/infos")}>Infos</Link>
            <Link href="/entrainement" className={linkStyle("/entrainement")}>Entrainements</Link>
          </nav>

          {/* RECHERCHE ET AUTHENTIFICATION */}
          <div className="flex items-center gap-4">

            {/* BARRE DE RECHERCHE */}
            <div className="relative hidden lg:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                  type="search"
                  placeholder="Rechercher un athlète..."
                  className="w-64 pl-10 rounded-xl bg-gray-100/50 border-gray-200 focus:bg-white focus:ring-2 focus:ring-red-600 transition-all"
              />
            </div>

            <div className="flex items-center gap-4 border-l-2 border-gray-100 pl-4">
              {/* AFFICHAGE NOM ADMIN */}
              {profile && (
                  <div className="hidden sm:block text-right">
                    <p className="text-[10px] uppercase font-black text-gray-400 leading-none">Espace Admin</p>
                    <p className="text-sm font-black italic text-red-600 leading-tight">
                      {profile.full_name}
                    </p>
                  </div>
              )}

              {user ? (
                  <Button
                      onClick={handleLogout}
                      className="bg-slate-900 hover:bg-red-600 text-white font-bold rounded-xl px-5 transition-all flex items-center gap-2 group"
                  >
                    <LogOut className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    <span className="hidden sm:inline italic uppercase">Quitter</span>
                  </Button>
              ) : (
                  <Link href="/login">
                    <Button className="bg-red-600 hover:bg-red-700 text-white font-black rounded-xl px-6 shadow-lg shadow-red-200 transition-all active:scale-95 uppercase italic tracking-tighter">
                      Se connecter
                    </Button>
                  </Link>
              )}
            </div>
          </div>
        </div>
      </header>
  );
}