"use client";

import Link from "next/link";
import Image from "next/image";
import { Search, LogOut, ChevronDown, ShieldCheck } from "lucide-react"; // Ajout d'une icône admin
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

export function Navbar() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const router = useRouter();
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState("");

  // MODIFICATION ICI : Redirection intelligente
  const handleSearch = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && searchQuery.trim().length > 0) {
      const encodedQuery = encodeURIComponent(searchQuery.trim());

      // Si l'utilisateur est admin, on l'envoie sur la page de modification
      if (profile?.role === 'admin') {
        router.push(`/recherche/modifier?q=${encodedQuery}`);
      } else {
        router.push(`/recherche?q=${encodedQuery}`);
      }
    }
  };

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

  const linkStyle = (path: string) =>
      `transition-all duration-300 hover:text-red-600 flex items-center gap-1 ${
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
          <nav className="hidden md:flex items-center gap-8 text-sm font-black uppercase tracking-wider h-full">
            <Link href="/club" className={linkStyle("/club")}>Le Club</Link>
            <Link href="/actualites" className={linkStyle("/actualites")}>Toutes les actualités</Link>
            <Link
                href="https://www.beathletics.be/calendar"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-600 hover:text-red-600 transition-colors"
            >
              Calendrier
            </Link>

            {/* ONGLET INFOS */}
            <div className="relative group h-full flex items-center">
              <div className="cursor-default transition-all duration-300 hover:text-red-600 flex items-center gap-1 text-slate-600 font-black uppercase tracking-wider text-sm italic">
                Infos <ChevronDown size={14} className="group-hover:rotate-180 transition-transform duration-300" />
              </div>

              <div className="absolute top-[80px] left-0 w-72 pt-2 opacity-0 translate-y-4 invisible group-hover:opacity-100 group-hover:translate-y-0 group-hover:visible transition-all duration-300 ease-out">
                <div className="bg-white border-t-4 border-red-600 rounded-b-2xl shadow-2xl overflow-hidden p-2 ring-1 ring-black/5">
                  <Link
                      href="https://forms.office.com/Pages/ResponsePage.aspx?id=8NDtava2GUyioHDog0RKA5OE9wvWsX5JlJ8w-lY0WKlURjNDMllWMkdEWUYzVFEwMFRQREZWU1NKWi4u"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block px-4 py-3 text-[11px] font-black uppercase italic text-slate-600 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all"
                  >
                    Affiliation au club
                  </Link>
                  <Link
                      href="https://allures-libres-de-gaume.be/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block px-4 py-3 text-[11px] font-black uppercase italic text-slate-600 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all border-t border-slate-50"
                  >
                    Allures libres
                  </Link>
                  <Link
                      href="/infos/records"
                      className="block px-4 py-3 text-[11px] font-black uppercase italic text-slate-600 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all border-t border-slate-50"
                  >
                    Records
                  </Link>
                  <Link
                      href="/infos/kbpm"
                      className="block px-4 py-3 text-[11px] font-black uppercase italic text-slate-600 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all border-t border-slate-50"
                  >
                    K.B.P.M
                  </Link>
                </div>
              </div>
            </div>

            <Link href="/entrainement" className={linkStyle("/entrainement")}>Entraînements</Link>
          </nav>

          {/* RECHERCHE ET AUTHENTIFICATION */}
          <div className="flex items-center gap-4">
            <div className="relative hidden lg:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                  type="search"
                  placeholder={profile?.role === 'admin' ? "Gérer un athlète..." : "Rechercher un athlète"}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleSearch}
                  className={`w-48 pl-10 rounded-xl bg-gray-100/50 border-gray-200 focus:bg-white focus:ring-2 transition-all ${
                      profile?.role === 'admin' ? 'focus:ring-slate-900 border-slate-300' : 'focus:ring-red-600'
                  }`}
              />
            </div>

            <div className="flex items-center gap-4 border-l-2 border-gray-100 pl-4">
              {profile && (
                  <div className="hidden sm:flex items-center gap-3 text-right">
                    <div>
                      <p className="text-[10px] uppercase font-black text-gray-400 leading-none tracking-tighter flex items-center justify-end gap-1">
                        {profile.role === 'admin' && <ShieldCheck size={10} className="text-red-600" />}
                        {profile.role === 'admin' ? 'Espace Admin' : 'Membre'}
                      </p>
                      <p className="text-sm font-black italic text-slate-900 leading-tight">
                        {profile.full_name}
                      </p>
                    </div>
                  </div>
              )}

              {user ? (
                  <Button
                      onClick={handleLogout}
                      className="bg-slate-900 hover:bg-red-600 text-white font-bold rounded-xl px-5 transition-all flex items-center gap-2 group"
                  >
                    <LogOut className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    <span className="hidden sm:inline italic uppercase text-xs">Quitter</span>
                  </Button>
              ) : (
                  <Link href="/login">
                    <Button
                        className="bg-red-600 hover:bg-red-700 text-white font-black rounded-xl px-6 shadow-lg shadow-red-200 transition-all active:scale-95 uppercase italic tracking-tighter">
                      Connexion
                    </Button>
                  </Link>
              )}
            </div>
          </div>
        </div>
      </header>
  );
}