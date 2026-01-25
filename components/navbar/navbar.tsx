"use client";

import Link from "next/link";
import Image from "next/image";
import { Search, LogOut, ChevronDown, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter, usePathname } from "next/navigation";

export function Navbar() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobileInfosOpen, setIsMobileInfosOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setIsMenuOpen(false);
    setIsMobileInfosOpen(false);
  }, [pathname]);

  const handleSearch = (e: React.KeyboardEvent | React.FormEvent) => {
    if ('preventDefault' in e) e.preventDefault();
    if (searchQuery.trim().length > 0) {
      const encodedQuery = encodeURIComponent(searchQuery.trim());
      setIsMenuOpen(false);
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
        const { data } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
        setProfile(data);
      }
    };
    getSession();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsMenuOpen(false);
    router.refresh();
    router.push("/");
  };

  const linkStyle = (path: string) =>
      `transition-all duration-300 hover:text-red-600 flex items-center gap-1 ${
          pathname === path ? "text-red-600 border-b-2 border-red-600" : "text-slate-600"
      }`;

  return (
      <>
        <header className="fixed top-0 left-0 right-0 z-[100] w-full border-b-4 border-red-600 bg-white/80 backdrop-blur-md shadow-sm h-16 md:h-20">
          <div className="container mx-auto flex h-full items-center justify-between px-4">

            <button
                type="button"
                className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                onClick={() => setIsMenuOpen(true)}
            >
              <Menu size={28} />
            </button>

            <div className="flex items-center">
              <Link href="/" className="flex items-center group">
                <div className="relative h-10 w-40 md:h-14 md:w-64 transition-transform group-hover:scale-105">
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

            <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-sm font-black uppercase tracking-wider h-full">
              <Link href="/club" className={linkStyle("/club")}>Le Club</Link>
              <Link href="/actualites" className={linkStyle("/actualites")}>Actualités</Link>

              <div className="flex items-center gap-4 border-l-2 border-slate-100 pl-4 lg:pl-6 h-8 mx-2">
                <Link href="https://www.beathletics.be/calendar" target="_blank" rel="noopener noreferrer" className="text-slate-600 hover:text-red-600 transition-colors">Calendrier</Link>
                <Link href="https://www.beathletics.be/results" target="_blank" rel="noopener noreferrer" className="text-slate-600 hover:text-red-600 transition-colors">Résultats</Link>
              </div>

              <div className="relative group h-full flex items-center">
                <div className={`cursor-default transition-all duration-300 hover:text-red-600 flex items-center gap-1 font-black uppercase tracking-wider text-sm italic ${pathname.startsWith('/infos') ? 'text-red-600' : 'text-slate-600'}`}>
                  Infos <ChevronDown size={14} className="group-hover:rotate-180 transition-transform duration-300" />
                </div>

                <div className="absolute top-full left-0 w-72 pt-0 opacity-0 translate-y-4 invisible group-hover:opacity-100 group-hover:translate-y-0 group-hover:visible transition-all duration-300 ease-out">
                  <div className="bg-white border-t-4 border-red-600 rounded-b-2xl shadow-2xl overflow-hidden p-2 ring-1 ring-black/5">
                    <Link href="https://forms.office.com/Pages/ResponsePage.aspx?id=8NDtava2GUyioHDog0RKA5OE9wvWsX5JlJ8w-lY0WKlURjNDMllWMkdEWUYzVFEwMFRQREZWU1NKWi4u" target="_blank" rel="noopener noreferrer" className="block px-4 py-3 text-[11px] font-black uppercase italic text-slate-600 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all">Affiliation au club</Link>
                    <Link href="https://allures-libres-de-gaume.be/" target="_blank" rel="noopener noreferrer" className="block px-4 py-3 text-[11px] font-black uppercase italic text-slate-600 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all border-t border-slate-50">Allures libres</Link>
                    <Link href="/infos/kbpm" className="block px-4 py-3 text-[11px] font-black uppercase italic text-slate-600 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all border-t border-slate-50">K.B.P.M</Link>
                    <Link href="/infos/entraineurs" className="block px-4 py-3 text-[11px] font-black uppercase italic text-slate-600 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all border-t border-slate-50">Entraîneurs</Link>
                    <Link href="/infos/officiels" className="block px-4 py-3 text-[11px] font-black uppercase italic text-slate-600 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all border-t border-slate-50">Officiels</Link>
                    <Link href="/infos/ethique" className="block px-4 py-3 text-[11px] font-black uppercase italic text-slate-600 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all border-t border-slate-50">Éthique & Dopage</Link>
                    <Link href="/infos/table-hongroise" className={`block px-4 py-3 text-[11px] font-black uppercase italic rounded-xl transition-all border-t border-slate-50 ${pathname === "/infos/table-hongroise" ? "bg-red-50 text-red-600" : "text-slate-600 hover:bg-red-50 hover:text-red-600"}`}>Table hongroise</Link>
                  </div>
                </div>
              </div>

              <Link href="/musculation" className={linkStyle("/musculation")}>Musculation</Link>
            </nav>

            <div className="flex items-center gap-4">
              <div className="relative hidden xl:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                    type="search"
                    placeholder={profile?.role === 'admin' ? "Gérer..." : "Rechercher un membre"}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch(e)}
                    className={`w-48 pl-10 rounded-xl bg-gray-100/50 border-gray-200 focus:bg-white focus:ring-2 transition-all ${
                        profile?.role === 'admin' ? 'focus:ring-slate-900 border-slate-300' : 'focus:ring-red-600'
                    }`}
                />
              </div>

              <div className="flex items-center gap-4 border-l-2 border-gray-100 pl-4">
                {user ? (
                    <Button onClick={handleLogout} className="bg-slate-900 hover:bg-red-600 text-white font-bold rounded-xl px-5 transition-all flex items-center gap-2 group h-9">
                      <LogOut className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      <span className="hidden sm:inline italic uppercase text-xs">Quitter</span>
                    </Button>
                ) : (
                    <Link href="/login">
                      <Button className="bg-red-600 hover:bg-red-700 text-white font-black rounded-xl px-4 md:px-6 shadow-lg shadow-red-200 transition-all active:scale-95 uppercase italic h-9 md:h-10 text-xs">
                        Connexion
                      </Button>
                    </Link>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* TIROIR MOBILE */}
        <div
            className={`fixed inset-0 bg-black/50 z-[110] transition-opacity duration-300 md:hidden ${isMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
            onClick={() => setIsMenuOpen(false)}
        />
        <div className={`fixed top-0 left-0 h-full w-[300px] bg-white z-[120] shadow-2xl transition-transform duration-300 ease-in-out md:hidden ${isMenuOpen ? "translate-x-0" : "-translate-x-full"}`}>
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-4 border-b border-red-600 bg-slate-50">
              <span className="font-black italic uppercase text-slate-900">Navigation</span>
              <button type="button" onClick={() => setIsMenuOpen(false)} className="p-2 bg-white shadow-sm rounded-full text-slate-900"><X size={24} /></button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2 font-black uppercase italic text-sm">
              <form onSubmit={handleSearch} className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                    type="search"
                    placeholder="Rechercher un membre"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 bg-slate-100 border-none rounded-xl"
                />
              </form>

              <Link href="/club" onClick={() => setIsMenuOpen(false)} className="p-3 border-b border-slate-50 hover:text-red-600">Le Club</Link>
              <Link href="/actualites" onClick={() => setIsMenuOpen(false)} className="p-3 border-b border-slate-50 hover:text-red-600">Actualités</Link>
              <Link href="https://www.beathletics.be/calendar" target="_blank" className="p-3 border-b border-slate-50 text-red-600">📅 Calendrier</Link>
              <Link href="https://www.beathletics.be/results" target="_blank" className="p-3 border-b border-slate-50 text-red-600">🏆 Résultats</Link>
              <Link href="/musculation" onClick={() => setIsMenuOpen(false)} className="p-3 border-b border-slate-50 hover:text-red-600">Musculation</Link>

              <div className="h-px bg-slate-100 my-2" />

              <button onClick={() => setIsMobileInfosOpen(!isMobileInfosOpen)} className="w-full flex items-center justify-between p-3">
                Infos <ChevronDown size={16} className={`transition-transform ${isMobileInfosOpen ? "rotate-180 text-red-600" : ""}`} />
              </button>

              <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isMobileInfosOpen ? "max-h-[600px]" : "max-h-0"}`}>
                <div className="bg-slate-50 rounded-lg flex flex-col pl-4">
                  <Link href="https://forms.office.com/Pages/ResponsePage.aspx?id=8NDtava2GUyioHDog0RKA5OE9wvWsX5JlJ8w-lY0WKlURjNDMllWMkdEWUYzVFEwMFRQREZWU1NKWi4u" target="_blank" onClick={() => setIsMenuOpen(false)} className="block p-3 text-[10px] text-slate-600 border-b border-white/50">Affiliation au club</Link>
                  <Link href="https://allures-libres-de-gaume.be/" target="_blank" onClick={() => setIsMenuOpen(false)} className="block p-3 text-[10px] text-slate-600 border-b border-white/50">Allures libres</Link>
                  <Link href="/infos/kbpm" onClick={() => setIsMenuOpen(false)} className="block p-3 text-[10px] text-slate-600 border-b border-white/50">K.B.P.M</Link>
                  <Link href="/infos/entraineurs" onClick={() => setIsMenuOpen(false)} className="block p-3 text-[10px] text-slate-600 border-b border-white/50">Entraîneurs</Link>
                  <Link href="/infos/officiels" onClick={() => setIsMenuOpen(false)} className="block p-3 text-[10px] text-slate-600 border-b border-white/50">Officiels</Link>
                  <Link href="/infos/ethique" onClick={() => setIsMenuOpen(false)} className="block p-3 text-[10px] text-slate-600 border-b border-white/50">Éthique & Dopage</Link>
                  <Link href="/infos/table-hongroise" onClick={() => setIsMenuOpen(false)} className="block p-3 text-[10px] text-slate-600">Table hongroise</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
  );
}