"use client";

import Link from "next/link";
import Image from "next/image";
import { Search, LogOut, ChevronDown, Menu, X, User as UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "../../app/context/authContext";

export function Navbar() {
  const { user, profile, loading } = useAuth();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobileInfosOpen, setIsMobileInfosOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setIsMenuOpen(false);
    setIsMobileInfosOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    // On force un rechargement complet de la page pour vider le cache d'authentification de Next.js
    window.location.assign('/');
  };

  const handleSearch = (e: React.KeyboardEvent | React.FormEvent) => {
    if ('preventDefault' in e) e.preventDefault();
    if (searchQuery.trim().length > 0) {
      const encodedQuery = encodeURIComponent(searchQuery.trim());
      const target = profile?.role === 'admin' ? `/recherche/modifier?q=${encodedQuery}` : `/recherche?q=${encodedQuery}`;
      router.push(target);
      setIsMenuOpen(false);
    }
  };

  const linkStyle = (path: string) =>
      `transition-all duration-300 hover:text-red-600 flex items-center gap-1 ${
          pathname === path ? "text-red-600 border-b-2 border-red-600" : "text-slate-600"
      }`;

  return (
      <>
        <header className="fixed top-0 left-0 right-0 z-[100] w-full border-b-4 border-red-600 bg-white/80 backdrop-blur-md shadow-sm h-16 md:h-20">
          <div className="container mx-auto flex h-full items-center justify-between px-4">

            <button type="button" className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg" onClick={() => setIsMenuOpen(true)}>
              <Menu size={28} />
            </button>

            <div className="flex items-center">
              <Link href="/" className="flex items-center group">
                <div className="relative h-10 w-40 md:h-14 md:w-64 transition-transform group-hover:scale-105">
                  <Image src="/Logo-ACD-1024x193.svg" alt="Logo ACD" fill className="object-contain object-left" priority />
                </div>
              </Link>
            </div>

            <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-sm font-black uppercase tracking-wider h-full">
              <Link href="/club" className={linkStyle("/club")}>Le Club</Link>
              <Link href="/actualites" className={linkStyle("/actualites")}>Actualités</Link>

              <div className="flex items-center gap-4 border-l-2 border-slate-100 pl-4 lg:pl-6 h-8 mx-2">
                <Link href="https://www.beathletics.be/calendar" target="_blank" className="text-slate-600 hover:text-red-600 transition-colors">Calendrier</Link>
                <Link href="https://www.beathletics.be/results" target="_blank" className="text-slate-600 hover:text-red-600 transition-colors">Résultats</Link>
              </div>

              <div className="relative group h-full flex items-center">
                <div className={`cursor-default transition-all duration-300 hover:text-red-600 flex items-center gap-1 font-black uppercase tracking-wider text-sm italic ${pathname.startsWith('/infos') ? 'text-red-600' : 'text-slate-600'}`}>
                  Infos <ChevronDown size={14} className="group-hover:rotate-180 transition-transform duration-300" />
                </div>

                <div className="absolute top-full left-0 w-72 pt-0 opacity-0 translate-y-4 invisible group-hover:opacity-100 group-hover:translate-y-0 group-hover:visible transition-all duration-300 ease-out">
                  <div className="bg-white border-t-4 border-red-600 rounded-b-2xl shadow-2xl overflow-hidden p-2 ring-1 ring-black/5">
                    <Link href="https://forms.office.com/Pages/ResponsePage.aspx?id=8NDtava2GUyioHDog0RKA5OE9wvWsX5JlJ8w-lY0WKlURjNDMllWMkdEWUYzVFEwMFRQREZWU1NKWi4u" target="_blank" className="block px-4 py-3 text-[11px] font-black uppercase italic text-slate-600 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all">Affiliation au club</Link>
                    <Link href="https://allures-libres-de-gaume.be/" target="_blank" className="block px-4 py-3 text-[11px] font-black uppercase italic text-slate-600 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all border-t">Allures libres</Link>
                    <Link href="/infos/kbpm" className="block px-4 py-3 text-[11px] font-black uppercase italic text-slate-600 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all border-t">K.B.P.M</Link>
                    <Link href="/infos/entraineurs" className="block px-4 py-3 text-[11px] font-black uppercase italic text-slate-600 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all border-t">Entraîneurs</Link>
                    <Link href="/infos/officiels" className="block px-4 py-3 text-[11px] font-black uppercase italic text-slate-600 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all border-t">Officiels</Link>
                    <Link href="/infos/ethique" className="block px-4 py-3 text-[11px] font-black uppercase italic text-slate-600 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all border-t">Éthique & Dopage</Link>
                    {/*<Link href="/infos/table-hongroise" className={`block px-4 py-3 text-[11px] font-black uppercase italic rounded-xl border-t ${pathname === "/infos/table-hongroise" ? "bg-red-50 text-red-600" : "text-slate-600 hover:bg-red-50 hover:text-red-600"}`}>Table hongroise</Link>]]*/}
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
                    placeholder={profile?.role === 'admin' ? "Gérer membre..." : "Rechercher membre..."}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch(e)}
                    className="w-48 pl-10 rounded-xl bg-gray-100/50 border-gray-200 focus:bg-white focus:ring-2 focus:ring-red-600 transition-all"
                />
              </div>

              <div className="flex items-center gap-4 border-l-2 border-gray-100 pl-4 min-w-[140px] justify-end">
                {!loading ? (
                    user ? (
                        <div className="flex items-center gap-3">
                          <div className="hidden lg:flex flex-col items-end leading-tight mr-1">
                            <span className="text-[11px] font-black uppercase italic text-slate-900">{profile?.full_name || user.email?.split('@')[0]}</span>
                            <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-md mt-0.5 ${profile?.role === 'admin' ? 'bg-slate-900 text-white' : 'bg-red-600 text-white'}`}>{profile?.role || 'Membre'}</span>
                          </div>
                          <Button onClick={handleLogout} className="bg-slate-900 hover:bg-red-600 text-white font-bold rounded-xl px-5 h-9 group transition-all">
                            <LogOut className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                            <span className="hidden sm:inline italic uppercase text-xs ml-1">Quitter</span>
                          </Button>
                        </div>
                    ) : (
                        <Link href="/login">
                          <Button className="bg-red-600 hover:bg-red-700 text-white font-black rounded-xl px-6 h-10 shadow-lg shadow-red-200 uppercase italic text-xs transition-all active:scale-95">
                            Connexion
                          </Button>
                        </Link>
                    )
                ) : (
                    <div className="h-10 w-24 bg-slate-100 animate-pulse rounded-xl" /> // Skeleton discret pendant le chargement
                )}
              </div>
            </div>
          </div>
        </header>

        {/* MOBILE MENU */}
        <div className={`fixed inset-0 bg-black/50 z-[110] transition-opacity duration-300 md:hidden ${isMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`} onClick={() => setIsMenuOpen(false)} />
        <div className={`fixed top-0 left-0 h-full w-[300px] bg-white z-[120] shadow-2xl transition-transform duration-300 md:hidden ${isMenuOpen ? "translate-x-0" : "-translate-x-full"}`}>
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-4 border-b border-red-600 bg-slate-50">
              {user ? (
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 bg-red-600 rounded-lg flex items-center justify-center text-white"><UserIcon size={18} /></div>
                    <div className="flex flex-col leading-none">
                      <span className="text-xs font-black uppercase italic text-slate-900">{profile?.full_name?.split(' ')[0] || "Membre"}</span>
                      <span className="text-[10px] text-red-600 font-bold uppercase">{profile?.role}</span>
                    </div>
                  </div>
              ) : <span className="font-black italic uppercase text-slate-900">Navigation</span>}
              <button onClick={() => setIsMenuOpen(false)} className="p-2 bg-white shadow-sm rounded-full"><X size={24} /></button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2 font-black uppercase italic text-sm">
              <form onSubmit={handleSearch} className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input type="search" placeholder="Rechercher..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 bg-slate-100 border-none rounded-xl" />
              </form>

              <Link href="/club" onClick={() => setIsMenuOpen(false)} className="p-3 border-b border-slate-50">Le Club</Link>
              <Link href="/actualites" onClick={() => setIsMenuOpen(false)} className="p-3 border-b border-slate-50">Actualités</Link>
              <Link href="https://www.beathletics.be/calendar" target="_blank" className="p-3 border-b border-slate-50 text-red-600">📅 Calendrier</Link>
              <Link href="https://www.beathletics.be/results" target="_blank" className="p-3 border-b border-slate-50 text-red-600">🏆 Résultats</Link>
              <Link href="/musculation" onClick={() => setIsMenuOpen(false)} className="p-3 border-b border-slate-50">Musculation</Link>

              <div className="h-px bg-slate-100 my-2" />
              <button onClick={() => setIsMobileInfosOpen(!isMobileInfosOpen)} className="w-full flex items-center justify-between p-3">Infos <ChevronDown size={16} className={isMobileInfosOpen ? "rotate-180 text-red-600" : ""} /></button>
              {isMobileInfosOpen && (
                  <div className="bg-slate-50 rounded-lg flex flex-col pl-4 text-[10px] text-slate-600">
                    <Link href="https://forms.office.com/Pages/ResponsePage.aspx?id=8NDtava2GUyioHDog0RKA5OE9wvWsX5JlJ8w-lY0WKlURjNDMllWMkdEWUYzVFEwMFRQREZWU1NKWi4u" target="_blank" className="p-3 border-b border-white">Affiliation</Link>
                    <Link href="https://allures-libres-de-gaume.be/" target="_blank" className="p-3 border-b border-white">Allures libres</Link>
                    <Link href="/infos/kbpm" className="p-3 border-b border-white">K.B.P.M</Link>
                    <Link href="/infos/entraineurs" className="p-3 border-b border-white">Entraîneurs</Link>
                    <Link href="/infos/officiels" className="p-3 border-b border-white">Officiels</Link>
                    <Link href="/infos/ethique" className="p-3 border-b border-white">Éthique</Link>
                    {/*<Link href="/infos/table-hongroise" className="p-3">Table hongroise</Link>*/}
                  </div>
              )}

              {user && (
                  <button onClick={handleLogout} className="mt-auto p-3 bg-red-50 text-red-600 rounded-xl flex items-center gap-2 font-black uppercase italic">
                    <LogOut size={18} /> Déconnexion
                  </button>
              )}
            </div>
          </div>
        </div>
      </>
  );
}