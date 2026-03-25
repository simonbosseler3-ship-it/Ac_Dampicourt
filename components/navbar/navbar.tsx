"use client";

import Link from "next/link";
import Image from "next/image";
import { LogOut, ChevronDown, Menu, X, User as UserIcon, Sun, TreePine, Egg } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { usePathname } from "next/navigation";
import { useAuth } from "@/app/context/authContext";
import { useTheme } from "@/components/theme/ThemeContext";

export function Navbar() {
  const { user, profile, loading } = useAuth();
  const { theme, setTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobileInfosOpen, setIsMobileInfosOpen] = useState(false);
  const [isDesktopInfosOpen, setIsDesktopInfosOpen] = useState(false);

  const pathname = usePathname();

  useEffect(() => {
    setIsMenuOpen(false);
    setIsMobileInfosOpen(false);
    setIsDesktopInfosOpen(false);
  }, [pathname]);

  const handleThemeChange = async (newTheme: string) => {
    setTheme(newTheme);
    await supabase.from('settings').update({ value: newTheme }).eq('key', 'active_theme');
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.assign('/');
  };

  // STYLE ANIMÉ POUR LES LIENS
  const linkStyle = (path: string) =>
      `transition-all duration-300 ease-out flex items-center gap-1 whitespace-nowrap 
      hover:text-red-600 hover:scale-110 hover:-translate-y-0.5 active:scale-95 ${
          pathname === path
              ? "text-red-600 border-b-2 border-red-600"
              : "text-slate-600"
      }`;

  return (
      <>
        <header className="fixed top-0 left-0 right-0 z-[100] w-full border-b-4 border-red-600 bg-white/80 backdrop-blur-md shadow-sm h-16 lg:h-20">
          <div className="container mx-auto flex h-full items-center justify-between px-4">

            {/* MENU BURGER (Mobile/Tablette) */}
            <button
                type="button"
                className="lg:hidden p-2 text-slate-600 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all active:scale-90 shrink-0"
                onClick={() => setIsMenuOpen(true)}
            >
              <Menu size={28} />
            </button>

            {/* LOGO ANIMÉ */}
            <div className="flex items-center shrink-0">
              <Link href="/" prefetch={false} className="flex items-center group">
                <div className="relative h-10 w-28 sm:w-32 lg:h-12 lg:w-48 xl:h-14 xl:w-64 transition-all duration-500 group-hover:scale-105 group-hover:rotate-1">
                  <Image src="/Logo-ACD-1024x193.svg" alt="Logo ACD" fill className="object-contain object-left" priority />
                </div>
              </Link>
            </div>

            {/* NAVIGATION DESKTOP + ANIMATIONS */}
            <nav className="hidden lg:flex items-center gap-4 xl:gap-8 text-xs xl:text-sm font-black uppercase tracking-wider h-full mx-4">
              <Link href="/club" prefetch={false} className={linkStyle("/club")}>Le Club</Link>
              <Link href="/actualites" prefetch={false} className={linkStyle("/actualites")}>Actualités</Link>

              <div className="hidden xl:flex items-center gap-4 border-l-2 border-slate-100 pl-6 h-8 mx-1">
                <Link href="https://www.beathletics.be/calendar" target="_blank" className="text-slate-600 hover:text-red-600 hover:scale-105 transition-all whitespace-nowrap">Calendrier</Link>
                <Link href="https://www.beathletics.be/results" target="_blank" className="text-slate-600 hover:text-red-600 hover:scale-105 transition-all whitespace-nowrap">Résultats</Link>
              </div>

              {/* DROPDOWN INFOS (Hybride Click/Hover avec animation riche) */}
              <div
                  className="relative h-full flex items-center"
                  onMouseEnter={() => setIsDesktopInfosOpen(true)}
                  onMouseLeave={() => setIsDesktopInfosOpen(false)}
              >
                <button
                    onClick={() => setIsDesktopInfosOpen(!isDesktopInfosOpen)}
                    className={`transition-all duration-300 flex items-center gap-1 font-black uppercase tracking-wider text-xs xl:text-sm italic whitespace-nowrap outline-none hover:scale-110 hover:-translate-y-0.5 ${pathname.startsWith('/infos') || isDesktopInfosOpen ? 'text-red-600' : 'text-slate-600'}`}
                >
                  Infos
                  <ChevronDown size={14} className={`transition-transform duration-500 ${isDesktopInfosOpen ? 'rotate-180 text-red-600' : ''}`} />
                </button>

                {/* SOUS-MENU ANIMÉ */}
                <div className={`absolute top-[80%] left-0 w-72 pt-4 transition-all duration-300 ease-out 
                  ${isDesktopInfosOpen
                    ? "opacity-100 translate-y-0 visible"
                    : "opacity-0 translate-y-8 invisible pointer-events-none"}`}
                >
                  <div className="bg-white/95 backdrop-blur-xl border-t-4 border-red-600 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] overflow-hidden p-2 ring-1 ring-black/5">
                    {[
                      { label: "Affiliation au club", href: "https://forms.office.com/Pages/ResponsePage.aspx?id=8NDtava2GUyioHDog0RKA5OE9wvWsX5JlJ8w-lY0WKlURjNDMllWMkdEWUYzVFEwMFRQREZWU1NKWi4u", ext: true },
                      { label: "Allures libres", href: "https://allures-libres-de-gaume.be/", ext: true },
                      { label: "K.B.P.M", href: "/infos/kbpm" },
                      { label: "Entraîneurs", href: "/infos/entraineurs" },
                      { label: "Officiels", href: "/infos/officiels" },
                      { label: "Éthique & Dopage", href: "/infos/ethique" }
                    ].map((item, idx) => (
                        <Link
                            key={idx}
                            href={item.href}
                            target={item.ext ? "_blank" : undefined}
                            className="block px-4 py-3 text-[11px] font-black uppercase italic text-slate-600 hover:bg-red-600 hover:text-white rounded-xl transition-all duration-200 transform hover:translate-x-2"
                        >
                          {item.label}
                        </Link>
                    ))}
                  </div>
                </div>
              </div>

              <Link href="/musculation" prefetch={false} className={linkStyle("/musculation")}>Musculation</Link>
            </nav>

            {/* AUTH & THEME ANIMATIONS */}
            <div className="flex items-center gap-2 xl:gap-4 shrink-0 justify-end">
              {profile?.role === 'admin' && (
                  <div className="hidden sm:flex items-center gap-1 bg-slate-100/50 p-1 rounded-xl border border-slate-200">
                    <button onClick={() => handleThemeChange("default")} className={`p-1.5 rounded-lg transition-all hover:scale-120 ${theme === 'default' ? 'bg-white shadow-md text-red-600 scale-110' : 'text-slate-400 hover:text-slate-600'}`}><Sun size={16} /></button>
                    <button onClick={() => handleThemeChange("christmas")} className={`p-1.5 rounded-lg transition-all hover:scale-120 ${theme === 'christmas' ? 'bg-white shadow-md text-green-600 scale-110' : 'text-slate-400 hover:text-green-500'}`}><TreePine size={16} /></button>
                    <button onClick={() => handleThemeChange("easter")} className={`p-1.5 rounded-lg transition-all hover:scale-120 ${theme === 'easter' ? 'bg-white shadow-md text-pink-500 scale-110' : 'text-slate-400 hover:text-pink-400'}`}><Egg size={16} /></button>
                  </div>
              )}

              {!loading ? (
                  user ? (
                      <div className="flex items-center gap-2 lg:gap-3">
                        <div className="hidden xl:flex flex-col items-end leading-tight mr-1">
                          <span className="text-[11px] font-black uppercase italic text-slate-900">{profile?.full_name || user.email?.split('@')[0]}</span>
                          <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-md mt-0.5 ${profile?.role === 'admin' ? 'bg-slate-900 text-white' : 'bg-red-600 text-white shadow-sm'}`}>{profile?.role || 'Membre'}</span>
                        </div>
                        <Button onClick={handleLogout} className="bg-slate-900 hover:bg-red-600 text-white font-bold rounded-xl px-3 h-9 group transition-all shrink-0 hover:shadow-lg active:scale-90">
                          <LogOut className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                          <span className="hidden xl:inline italic uppercase text-xs ml-1 font-black">Quitter</span>
                        </Button>
                      </div>
                  ) : (
                      <Link href="/login" prefetch={false}>
                        <Button className="bg-red-600 hover:bg-red-700 hover:scale-105 hover:shadow-red-500/20 text-white font-black rounded-xl px-4 xl:px-6 h-10 shadow-lg uppercase italic text-[10px] xl:text-xs transition-all active:scale-95 whitespace-nowrap">Connexion</Button>
                      </Link>
                  )
              ) : (
                  <div className="h-10 w-24 bg-slate-100 animate-pulse rounded-xl" />
              )}
            </div>
          </div>
        </header>

        {/* MOBILE MENU (Côté gauche) - Pas de changement majeur ici pour la stabilité */}
        <div className={`fixed inset-0 bg-black/60 z-[120] backdrop-blur-sm transition-opacity duration-500 lg:hidden ${isMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`} onClick={() => setIsMenuOpen(false)} />
        <div className={`fixed top-0 left-0 h-full w-[300px] bg-white z-[130] shadow-2xl transition-transform duration-500 ease-in-out lg:hidden ${isMenuOpen ? "translate-x-0" : "-translate-x-full"}`}>
          {/* ... Contenu du menu mobile inchangé pour garder la logique fonctionnelle ... */}
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
              ) : <span className="font-black italic uppercase text-slate-900 text-sm">Navigation ACD</span>}
              <button onClick={() => setIsMenuOpen(false)} className="p-2 hover:bg-red-50 text-red-600 transition-colors rounded-full"><X size={24} /></button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2 font-black uppercase italic text-sm">
              <Link href="/club" prefetch={false} onClick={() => setIsMenuOpen(false)} className="p-3 border-b border-slate-50 hover:pl-6 transition-all">Le Club</Link>
              <Link href="/actualites" prefetch={false} onClick={() => setIsMenuOpen(false)} className="p-3 border-b border-slate-50 hover:pl-6 transition-all">Actualités</Link>
              <Link href="https://www.beathletics.be/calendar" target="_blank" className="p-3 border-b border-slate-50 text-red-600 hover:pl-6 transition-all">📅 Calendrier</Link>
              <Link href="https://www.beathletics.be/results" target="_blank" className="p-3 border-b border-slate-50 text-red-600 hover:pl-6 transition-all">🏆 Résultats</Link>
              <Link href="/musculation" prefetch={false} onClick={() => setIsMenuOpen(false)} className="p-3 border-b border-slate-50 hover:pl-6 transition-all">Musculation</Link>

              <div className="h-px bg-slate-100 my-2" />

              <button onClick={() => setIsMobileInfosOpen(!isMobileInfosOpen)} className="w-full flex items-center justify-between p-3 font-black uppercase italic hover:bg-slate-50 transition-colors">
                Infos <ChevronDown size={16} className={`transition-transform duration-300 ${isMobileInfosOpen ? "rotate-180 text-red-600" : ""}`} />
              </button>
              {isMobileInfosOpen && (
                  <div className="bg-slate-50 rounded-2xl flex flex-col overflow-hidden transition-all">
                    <Link href="https://forms.office.com/Pages/ResponsePage.aspx?id=8NDtava2GUyioHDog0RKA5OE9wvWsX5JlJ8w-lY0WKlURjNDMllWMkdEWUYzVFEwMFRQREZWU1NKWi4u" target="_blank" className="p-3 border-b border-white hover:bg-red-50 hover:text-red-600 pl-6 text-[11px]">Affiliation</Link>
                    <Link href="https://allures-libres-de-gaume.be/" target="_blank" className="p-3 border-b border-white hover:bg-red-50 hover:text-red-600 pl-6 text-[11px]">Allures libres</Link>
                    <Link href="/infos/kbpm" prefetch={false} className="p-3 border-b border-white hover:bg-red-50 hover:text-red-600 pl-6 text-[11px]">K.B.P.M</Link>
                    <Link href="/infos/entraineurs" prefetch={false} className="p-3 border-b border-white hover:bg-red-50 hover:text-red-600 pl-6 text-[11px]">Entraîneurs</Link>
                    <Link href="/infos/officiels" prefetch={false} className="p-3 border-b border-white hover:bg-red-50 hover:text-red-600 pl-6 text-[11px]">Officiels</Link>
                    <Link href="/infos/ethique" prefetch={false} className="p-3 hover:bg-red-50 hover:text-red-600 pl-6 text-[11px]">Éthique & Dopage</Link>
                  </div>
              )}

              {user && (
                  <button onClick={handleLogout} className="mt-8 p-4 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center gap-2 font-black uppercase italic hover:bg-red-600 hover:text-white transition-all active:scale-95 shadow-sm">
                    <LogOut size={18} /> Déconnexion
                  </button>
              )}
            </div>
          </div>
        </div>
      </>
  );
}