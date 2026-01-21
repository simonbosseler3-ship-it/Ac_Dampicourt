"use client";

import Link from "next/link";
import Image from "next/image";
import { Search, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export function Navbar() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const router = useRouter();

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
        // Si on vient de se connecter, on recharge le profil
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

  return (
      <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur">
        <div className="container mx-auto flex h-20 items-center justify-between px-4">

          {/* LOGO */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center group">
              <div className="relative h-12 w-48 sm:h-14 sm:w-64 transition-transform group-hover:scale-105">
                <Image src="/Logo-ACD-1024x193.svg" alt="Logo AC Dampicourt" fill className="object-contain object-left" priority />
              </div>
            </Link>
          </div>

          {/* MENU PRINCIPAL (RÉTABLI) */}
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
          </nav>

          {/* RECHERCHE ET AUTHENTIFICATION */}
          <div className="flex items-center gap-4">

            {/* BARRE DE RECHERCHE (RÉTABLIE) */}
            <div className="relative hidden lg:block">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                  type="search"
                  placeholder="Rechercher un athlète..."
                  className="w-64 pl-9 rounded-full bg-gray-100 border-none focus-visible:ring-2 focus-visible:ring-red-500"
              />
            </div>

            <div className="flex items-center gap-4 border-l pl-4 ml-2">
              {/* AFFICHAGE NOM ADMIN */}
              {profile && (
                  <div className="hidden sm:block text-right">
                    <p className="text-[9px] uppercase font-bold text-gray-400 leading-none">Admin</p>
                    <p className="text-sm font-black italic text-red-600 leading-tight">
                      {profile.full_name}
                    </p>
                  </div>
              )}

              {user ? (
                  <Button
                      onClick={handleLogout}
                      className="bg-slate-900 hover:bg-red-600 text-white font-bold rounded-full px-6 transition-all flex items-center gap-2"
                  >
                    <LogOut className="h-4 w-4" />
                    <span className="hidden sm:inline">Déconnexion</span>
                  </Button>
              ) : (
                  <Link href="/login">
                    <Button className="bg-red-600 hover:bg-red-700 text-white font-bold rounded-full px-6 shadow-md shadow-red-200 transition-all active:scale-95">
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