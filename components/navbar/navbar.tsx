"use client";

import Link from "next/link";
import Image from "next/image";
import { LogOut, ChevronDown, Menu, X, User as UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { usePathname } from "next/navigation";
import { useAuth } from "@/app/context/authContext";

export function Navbar() {
  const { user, profile, loading } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobileInfosOpen, setIsMobileInfosOpen] = useState(false);
  const pathname = usePathname();

  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { clientX, clientY, currentTarget } = e;
    const { left, top, width, height } = currentTarget.getBoundingClientRect();
    const x = ((clientX - left) / width) * 100;
    const y = ((clientY - top) / height) * 100;
    setMousePos({ x, y });
  };

  useEffect(() => {
    setIsMenuOpen(false);
    setIsMobileInfosOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.assign('/');
  };

  const linkStyle = (path: string) =>
      `relative z-10 transition-all duration-300 hover:text-red-600 flex items-center gap-1 whitespace-nowrap font-black uppercase italic tracking-wider py-2 ${
          pathname === path ? "text-red-600 border-b-2 border-red-600" : "text-slate-600"
      }`;

  return (
      <>
        {/* HEADER : On retire overflow-hidden ici */}
        <header
            onMouseMove={handleMouseMove}
            className="fixed top-0 left-0 right-0 z-[100] w-full border-b-4 border-red-600 bg-white shadow-md h-16 md:h-20"
        >
          {/* --- CONTENEUR DÉCOR (Lui est en overflow-hidden) --- */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
            <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>

            <svg className="absolute inset-0 w-full h-full opacity-[0.05]" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="piste-lines" width="100" height="20" patternUnits="userSpaceOnUse" patternTransform="rotate(-15)">
                  <line x1="0" y1="0" x2="100" y2="0" stroke="#dc2626" strokeWidth="2" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#piste-lines)" />
            </svg>

            <div
                className="absolute inset-0 transition-all duration-300 ease-out"
                style={{
                  background: `radial-gradient(circle 300px at ${mousePos.x}% ${mousePos.y}%, rgba(220, 38, 38, 0.12), transparent 70%)`
                }}
            />
          </div>

          <div className="container relative z-10 mx-auto flex h-full items-center justify-between px-4">
            {/* BOUTON MOBILE */}
            <button type="button" className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg relative z-20" onClick={() => setIsMenuOpen(true)}>
              <Menu size={28} />
            </button>

            {/* LOGO */}
            <div className="flex items-center shrink-0 relative z-20">
              <Link href="/" prefetch={false} className="flex items-center group">
                <div className="relative h-10 w-32 sm:w-40 md:h-12 md:w-48 lg:h-14 lg:w-64 transition-transform group-hover:scale-105">
                  <Image src="/Logo-ACD-1024x193.svg" alt="Logo ACD" fill className="object-contain object-left" priority />
                </div>
              </Link>
            </div>

            {/* NAVIGATION DESKTOP */}
            <nav className="hidden md:flex items-center gap-3 lg:gap-6 xl:gap-8 text-[11px] lg:text-sm h-full relative z-20">
              <Link href="/club" prefetch={false} className={linkStyle("/club")}>Le Club</Link>
              <Link href="/actualites" prefetch={false} className={linkStyle("/actualites")}>Actualités</Link>

              <div className="hidden lg:flex items-center gap-4 border-l-2 border-slate-200 pl-4 lg:pl-6 h-8 mx-1">
                <Link href="https://www.beathletics.be/calendar" target="_blank" className="text-slate-600 hover:text-red-600 transition-colors font-bold uppercase italic whitespace-nowrap">Calendrier</Link>
                <Link href="https://www.beathletics.be/results" target="_blank" className="text-slate-600 hover:text-red-600 transition-colors font-bold uppercase italic whitespace-nowrap">Résultats</Link>
              </div>

              {/* DROPDOWN INFOS */}
              <div className="relative group h-full flex items-center">
                <div className={`cursor-default transition-all duration-300 hover:text-red-600 flex items-center gap-1 font-black uppercase tracking-wider text-[11px] lg:text-sm italic whitespace-nowrap ${pathname.startsWith('/infos') ? 'text-red-600' : 'text-slate-600'}`}>
                  Infos <ChevronDown size={14} className="group-hover:rotate-180 transition-transform duration-300"/>
                </div>

                <div className="absolute top-[100%] left-0 w-72 pt-0 opacity-0 translate-y-4 invisible group-hover:opacity-100 group-hover:translate-y-0 group-hover:visible transition-all duration-300 ease-out z-[110]">
                  <div className="bg-white shadow-2xl rounded-b-2xl border-t-4 border-red-600 ring-1 ring-black/5 overflow-hidden">
                    <div className="flex flex-col">
                      <Link href="https://forms.office.com/Pages/ResponsePage.aspx?id=8NDtava2GUyioHDog0RKA5OE9wvWsX5JlJ8w-lY0WKlURjNDMllWMkdEWUYzVFEwMFRQREZWU1NKWi4u" target="_blank" className="px-4 py-3 text-[11px] font-black uppercase italic text-slate-600 hover:bg-red-50 hover:text-red-600 transition-all">Affiliation</Link>
                      <Link href="https://allures-libres-de-gaume.be/" target="_blank" className="block px-4 py-3 text-[11px] font-black uppercase italic text-slate-600 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all border-t">Allures libres</Link>
                      <Link href="/infos/kbpm" className="px-4 py-3 text-[11px] font-black uppercase italic text-slate-600 hover:bg-red-50 hover:text-red-600 border-t border-slate-50 transition-all">K.B.P.M</Link>
                      <Link href="/infos/entraineurs" className="px-4 py-3 text-[11px] font-black uppercase italic text-slate-600 hover:bg-red-50 hover:text-red-600 border-t border-slate-50 transition-all">Entraîneurs</Link>
                      <Link href="/infos/officiels" className="px-4 py-3 text-[11px] font-black uppercase italic text-slate-600 hover:bg-red-50 hover:text-red-600 border-t border-slate-50 transition-all">Officiels</Link>
                      <Link href="/infos/ethique" className="px-4 py-3 text-[11px] font-black uppercase italic text-slate-600 hover:bg-red-50 hover:text-red-600 border-t border-slate-50 transition-all">Éthique & Dopage</Link>
                    </div>
                  </div>
                </div>
              </div>

              <Link href="/musculation" prefetch={false} className={linkStyle("/musculation")}>Musculation</Link>
            </nav>

            {/* AUTH SECTION (CORRIGÉE AVEC LE PROFIL) */}
            <div className="flex items-center gap-2 lg:gap-4 shrink-0 min-w-[120px] justify-end relative z-20">
              {!loading ? (
                  user ? (
                      <div className="flex items-center gap-2 lg:gap-3">
                        {/* Bloc d'infos : Nom + Rôle (masqué sur petits écrans pour gagner de la place) */}
                        <div className="hidden xl:flex flex-col items-end leading-tight mr-1">
                          <span className="text-[10px] lg:text-[11px] font-black uppercase italic text-slate-900">
                            {profile?.full_name || user.email?.split('@')[0]}
                          </span>
                          <span className={`text-[8px] lg:text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-md mt-0.5 ${profile?.role === 'admin' ? 'bg-slate-900 text-white' : 'bg-red-600 text-white'}`}>
                            {profile?.role || 'Membre'}
                          </span>
                        </div>
                        <Button onClick={handleLogout} className="bg-slate-900 hover:bg-red-600 text-white font-bold rounded-xl px-3 lg:px-5 h-9 transition-all">
                          <LogOut className="h-4 w-4 mr-1"/>
                          <span className="hidden sm:inline italic uppercase text-[10px] lg:text-xs">Quitter</span>
                        </Button>
                      </div>
                  ) : (
                      <Link href="/login">
                        <Button className="bg-red-600 hover:bg-red-700 text-white font-black rounded-xl px-4 lg:px-6 h-10 shadow-lg shadow-red-200 uppercase italic text-[10px] lg:text-xs">
                          Connexion
                        </Button>
                      </Link>
                  )
              ) : (
                  <div className="h-10 w-24 bg-slate-100 animate-pulse rounded-xl" />
              )}
            </div>
          </div>
        </header>

        {/* MOBILE MENU (Inchangé) */}
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
              <Link href="/club" prefetch={false} onClick={() => setIsMenuOpen(false)} className="p-3 border-b border-slate-50">Le Club</Link>
              <Link href="/actualites" prefetch={false} onClick={() => setIsMenuOpen(false)} className="p-3 border-b border-slate-50">Actualités</Link>
              <Link href="https://www.beathletics.be/calendar" target="_blank" className="p-3 border-b border-slate-50 text-red-600">📅 Calendrier</Link>
              <Link href="https://www.beathletics.be/results" target="_blank" className="p-3 border-b border-slate-50 text-red-600">🏆 Résultats</Link>
              <Link href="/musculation" prefetch={false} onClick={() => setIsMenuOpen(false)} className="p-3 border-b border-slate-50">Musculation</Link>

              <div className="h-px bg-slate-100 my-2" />
              <button onClick={() => setIsMobileInfosOpen(!isMobileInfosOpen)} className="w-full flex items-center justify-between p-3">Infos <ChevronDown size={16} className={isMobileInfosOpen ? "rotate-180 text-red-600" : ""} /></button>
              {isMobileInfosOpen && (
                  <div className="bg-slate-50 rounded-lg flex flex-col pl-4 text-[10px] text-slate-600">
                    <Link href="https://forms.office.com/Pages/ResponsePage.aspx?id=8NDtava2GUyioHDog0RKA5OE9wvWsX5JlJ8w-lY0WKlURjNDMllWMkdEWUYzVFEwMFRQREZWU1NKWi4u" target="_blank" className="p-3 border-b border-white">Affiliation</Link>
                    <Link href="https://allures-libres-de-gaume.be/" target="_blank" className="p-3 border-b border-white">Allures libres</Link>
                    <Link href="/infos/kbpm" prefetch={false} className="p-3 border-b border-white">K.B.P.M</Link>
                    <Link href="/infos/entraineurs" prefetch={false} className="p-3 border-b border-white">Entraîneurs</Link>
                    <Link href="/infos/officiels" prefetch={false} className="p-3 border-b border-white">Officiels</Link>
                    <Link href="/infos/ethique" prefetch={false} className="p-3 border-b border-white">Éthique</Link>
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