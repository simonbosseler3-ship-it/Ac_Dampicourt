"use client";

import Link from "next/link";
import Image from "next/image";
import {
  LogOut, ChevronDown, Menu, X, User as UserIcon, Sun, TreePine, Egg,
  CalendarDays, Trophy, ExternalLink, ArrowUpRight, Users, Scale, Flag, FileSignature, Footprints,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { usePathname } from "next/navigation";
import { useAuth } from "@/app/context/authContext";
import { useTheme } from "@/components/theme/ThemeContext";

// Sous-menu "Infos" (mêmes liens qu'avant, avec une courte description)
const INFOS = [
  { label: "K.B.P.M", desc: "Compétitions des jeunes", href: "/infos/kbpm", Icon: Flag },
  { label: "Entraîneurs", desc: "Le staff technique", href: "/infos/entraineurs", Icon: Users },
  { label: "Officiels", desc: "Les juges du club", href: "/infos/officiels", Icon: Trophy },
  { label: "Éthique & Dopage", desc: "Nos valeurs", href: "/infos/ethique", Icon: Scale },
];
const INFOS_EXT = [
  {
    label: "Affiliation au club",
    desc: "Formulaire en ligne",
    href: "https://forms.office.com/Pages/ResponsePage.aspx?id=8NDtava2GUyioHDog0RKA5OE9wvWsX5JlJ8w-lY0WKlURjNDMllWMkdEWUYzVFEwMFRQREZWU1NKWi4u",
    Icon: FileSignature,
  },
  { label: "Allures libres", desc: "Les courses de Gaume", href: "https://allures-libres-de-gaume.be/", Icon: Footprints },
];
const CALENDRIER = "https://www.beathletics.be/calendar";
const RESULTATS = "https://www.beathletics.be/results";

export function Navbar() {
  const { user, profile, loading } = useAuth();
  const { theme, setTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobileInfosOpen, setIsMobileInfosOpen] = useState(false);
  const [isDesktopInfosOpen, setIsDesktopInfosOpen] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const pathname = usePathname();

  useEffect(() => {
    setIsMenuOpen(false);
    setIsMobileInfosOpen(false);
    setIsDesktopInfosOpen(false);
  }, [pathname]);

  // La navbar se cache quand on descend, revient dès qu'on remonte
  useEffect(() => {
    let lastY = window.scrollY;
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const y = window.scrollY;
        setIsScrolled(y > 8);
        if (y > 320 && y > lastY + 6) setIsHidden(true);
        else if (y < lastY - 6 || y < 120) setIsHidden(false);
        lastY = y;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  // Bloque le scroll de la page quand le menu mobile est ouvert
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isMenuOpen]);

  const handleThemeChange = async (newTheme: string) => {
    setTheme(newTheme);
    await supabase.from('settings').update({ value: newTheme }).eq('key', 'active_theme');
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.assign('/');
  };

  const isActive = (path: string) => pathname === path || pathname.startsWith(path + "/");
  const linkStyle = (path: string) =>
      `acd-navlink font-black uppercase italic tracking-wider whitespace-nowrap transition-colors duration-300 ${
          isActive(path) ? "text-red-600" : "text-slate-700 hover:text-red-600"
      }`;
  const infosActive = pathname.startsWith('/infos') || isDesktopInfosOpen;

  return (
      <>
        <header
            className="acd-nav fixed top-0 left-0 right-0 z-[100] w-full border-b-4 border-red-600 bg-white/85 backdrop-blur-xl h-16 lg:h-20"
            data-hidden={isHidden && !isMenuOpen && !isDesktopInfosOpen ? "" : undefined}
            data-scrolled={isScrolled ? "" : undefined}
        >
          <div className="container mx-auto flex h-full items-center justify-between gap-3 px-4">

            {/* MENU BURGER (Mobile/Tablette) */}
            <button
                type="button"
                className="lg:hidden p-2 -ml-2 text-slate-700 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all active:scale-90 shrink-0"
                onClick={() => setIsMenuOpen(true)}
                aria-label="Ouvrir le menu"
                aria-expanded={isMenuOpen}
            >
              <Menu size={28} />
            </button>

            {/* LOGO */}
            <Link href="/" prefetch={false} className="flex items-center group shrink-0" aria-label="AC Dampicourt, accueil">
              <div className="relative h-10 w-32 sm:w-36 lg:h-12 lg:w-44 2xl:h-14 2xl:w-60 transition-transform duration-500 group-hover:scale-[1.03]">
                <Image src="/Logo-ACD-1024x193.svg" alt="Logo ACD" fill className="object-contain object-left" priority />
              </div>
            </Link>

            {/* NAVIGATION DESKTOP */}
            <nav className="hidden lg:flex items-center gap-4 xl:gap-6 2xl:gap-8 text-[13px] xl:text-[14px] 2xl:text-[15px] h-full mx-2" aria-label="Navigation principale">
              <Link href="/club" prefetch={false} className={linkStyle("/club")} aria-current={isActive("/club") ? "page" : undefined}>Le Club</Link>
              <Link href="/actualites" prefetch={false} className={linkStyle("/actualites")} aria-current={isActive("/actualites") ? "page" : undefined}>Actualités</Link>

              <div className="hidden xl:flex items-center gap-5 border-l-2 border-slate-200 pl-6 h-7">
                <a href={CALENDRIER} target="_blank" rel="noopener noreferrer" className="acd-navlink font-black uppercase italic tracking-wider text-slate-700 hover:text-red-600 transition-colors whitespace-nowrap inline-flex items-center gap-1">
                  Calendrier <ArrowUpRight size={14} className="opacity-50" />
                </a>
                <a href={RESULTATS} target="_blank" rel="noopener noreferrer" className="acd-navlink font-black uppercase italic tracking-wider text-slate-700 hover:text-red-600 transition-colors whitespace-nowrap inline-flex items-center gap-1">
                  Résultats <ArrowUpRight size={14} className="opacity-50" />
                </a>
              </div>

              {/* MENU INFOS */}
              <div
                  className="relative h-full flex items-center"
                  onMouseEnter={() => setIsDesktopInfosOpen(true)}
                  onMouseLeave={() => setIsDesktopInfosOpen(false)}
              >
                <button
                    type="button"
                    onClick={() => setIsDesktopInfosOpen(!isDesktopInfosOpen)}
                    aria-expanded={isDesktopInfosOpen}
                    className={`acd-navlink flex items-center gap-1 font-black uppercase italic tracking-wider whitespace-nowrap transition-colors ${infosActive ? 'text-red-600' : 'text-slate-700 hover:text-red-600'}`}
                    aria-current={pathname.startsWith('/infos') ? "page" : undefined}
                >
                  Infos
                  <ChevronDown size={15} className={`transition-transform duration-500 ${isDesktopInfosOpen ? 'rotate-180' : ''}`} />
                </button>

                <div className={`absolute top-full left-1/2 -translate-x-1/2 w-[560px] pt-1 transition-all duration-300 ease-out ${
                    isDesktopInfosOpen ? "opacity-100 translate-y-0 visible" : "opacity-0 translate-y-4 invisible pointer-events-none"}`}
                >
                  <div className="grid grid-cols-[1.25fr_1fr] gap-2 bg-white rounded-3xl shadow-[0_30px_70px_-20px_rgba(15,23,42,0.35)] ring-1 ring-slate-900/5 overflow-hidden p-2 border-t-4 border-red-600">
                    <div className="p-2">
                      {INFOS.map(({ label, desc, href, Icon }) => (
                          <Link key={href} href={href} prefetch={false} className={`flex items-center gap-4 p-3 rounded-2xl transition-colors group ${isActive(href) ? 'bg-red-50' : 'hover:bg-slate-50'}`}>
                            <span className="shrink-0 w-10 h-10 rounded-xl bg-slate-900 text-white grid place-items-center group-hover:bg-red-600 transition-colors"><Icon size={18} /></span>
                            <span>
                              <span className="block text-[15px] font-black uppercase italic text-slate-900 leading-none">{label}</span>
                              <span className="block text-xs text-slate-500 mt-1 normal-case not-italic font-medium tracking-normal">{desc}</span>
                            </span>
                          </Link>
                      ))}
                    </div>
                    <div className="bg-slate-900 rounded-[1.25rem] p-4 flex flex-col gap-2 text-white">
                      <p className="text-[10px] font-black uppercase tracking-[0.25em] text-red-500 px-2 pt-1">Liens utiles</p>
                      {INFOS_EXT.map(({ label, desc, href, Icon }) => (
                          <a key={href} href={href} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/10 transition-colors">
                            <Icon size={18} className="text-red-500 shrink-0" />
                            <span className="flex-1">
                              <span className="block text-sm font-black uppercase italic leading-none">{label}</span>
                              <span className="block text-[11px] text-slate-400 mt-1 normal-case not-italic font-medium tracking-normal">{desc}</span>
                            </span>
                            <ExternalLink size={14} className="text-slate-500" />
                          </a>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <Link href="/musculation" prefetch={false} className={linkStyle("/musculation")} aria-current={isActive("/musculation") ? "page" : undefined}>Musculation</Link>
            </nav>

            {/* THÈMES (admin) + COMPTE */}
            <div className="flex items-center gap-2 xl:gap-3 shrink-0 justify-end">
              {profile?.role === 'admin' && (
                  <div className="hidden sm:flex items-center gap-1 bg-slate-100 p-1 rounded-xl" role="group" aria-label="Thème du site">
                    <button onClick={() => handleThemeChange("default")} title="Thème normal" className={`p-1.5 rounded-lg transition-all ${theme === 'default' ? 'bg-white shadow text-red-600' : 'text-slate-400 hover:text-slate-700'}`}><Sun size={16} /></button>
                    <button onClick={() => handleThemeChange("christmas")} title="Thème Noël" className={`p-1.5 rounded-lg transition-all ${theme === 'christmas' ? 'bg-white shadow text-green-600' : 'text-slate-400 hover:text-green-600'}`}><TreePine size={16} /></button>
                    <button onClick={() => handleThemeChange("easter")} title="Thème Pâques" className={`p-1.5 rounded-lg transition-all ${theme === 'easter' ? 'bg-white shadow text-pink-500' : 'text-slate-400 hover:text-pink-500'}`}><Egg size={16} /></button>
                  </div>
              )}

              {!loading ? (
                  user ? (
                      <div className="flex items-center gap-2 lg:gap-3">
                        <div className="hidden 2xl:flex items-center gap-2.5 pl-1 pr-3 py-1 rounded-full bg-slate-100">
                          <span className="w-8 h-8 rounded-full bg-red-600 text-white grid place-items-center"><UserIcon size={16} /></span>
                          <span className="flex flex-col leading-tight">
                            <span className="text-[12px] font-black uppercase italic text-slate-900">{profile?.full_name || user.email?.split('@')[0]}</span>
                            <span className="text-[9px] font-bold uppercase tracking-widest text-red-600">{profile?.role || 'Membre'}</span>
                          </span>
                        </div>
                        <Button onClick={handleLogout} className="bg-slate-900 hover:bg-red-600 text-white font-bold rounded-xl px-3 h-10 group transition-all shrink-0 active:scale-95" aria-label="Se déconnecter">
                          <LogOut className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                          <span className="hidden 2xl:inline italic uppercase text-xs ml-1 font-black">Quitter</span>
                        </Button>
                      </div>
                  ) : (
                      <Link href="/login" prefetch={false}>
                        <Button className="bg-red-600 hover:bg-slate-900 text-white font-black rounded-xl px-4 xl:px-6 h-10 shadow-lg shadow-red-600/20 uppercase italic text-[11px] xl:text-xs tracking-wider transition-all active:scale-95 whitespace-nowrap">Connexion</Button>
                      </Link>
                  )
              ) : (
                  <div className="h-10 w-24 bg-slate-100 animate-pulse rounded-xl" />
              )}
            </div>
          </div>
        </header>

        {/* MENU MOBILE */}
        <div className={`fixed inset-0 bg-slate-950/60 z-[120] backdrop-blur-sm transition-opacity duration-500 lg:hidden ${isMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`} onClick={() => setIsMenuOpen(false)} />
        <div
            className={`fixed top-0 left-0 h-full w-[min(360px,88vw)] bg-slate-900 text-white z-[130] shadow-2xl transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] lg:hidden ${isMenuOpen ? "translate-x-0" : "-translate-x-full"}`}
            aria-hidden={!isMenuOpen}
        >
          <div className="flex flex-col h-full ph__hex-host relative overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b-4 border-red-600">
              {user ? (
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 bg-red-600 rounded-xl flex items-center justify-center"><UserIcon size={18} /></div>
                    <div className="flex flex-col leading-none">
                      <span className="text-sm font-black uppercase italic">{profile?.full_name?.split(' ')[0] || "Membre"}</span>
                      <span className="text-[10px] text-red-500 font-bold uppercase tracking-widest mt-1">{profile?.role}</span>
                    </div>
                  </div>
              ) : <span className="font-black italic uppercase text-lg">Navigation <span className="text-red-500">ACD</span></span>}
              <button onClick={() => setIsMenuOpen(false)} aria-label="Fermer le menu" className="p-2 hover:bg-white/10 text-white transition-colors rounded-full"><X size={24} /></button>
            </div>

            <nav className="flex-1 overflow-y-auto p-5 flex flex-col gap-1 font-black uppercase italic" aria-label="Navigation mobile">
              {[
                { label: "Accueil", href: "/" },
                { label: "Le Club", href: "/club" },
                { label: "Actualités", href: "/actualites" },
                { label: "Musculation", href: "/musculation" },
              ].map((l, i) => (
                  <Link
                      key={l.href}
                      href={l.href}
                      prefetch={false}
                      onClick={() => setIsMenuOpen(false)}
                      className={`text-3xl py-2 transition-all duration-500 ${pathname === l.href ? 'text-red-500' : 'hover:text-red-500'} ${isMenuOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}
                      style={{ transitionDelay: isMenuOpen ? `${120 + i * 50}ms` : '0ms' }}
                  >
                    {l.label}
                  </Link>
              ))}

              <div className="grid grid-cols-2 gap-2 my-4">
                <a href={CALENDRIER} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 p-3 rounded-2xl bg-white/5 hover:bg-red-600 transition-colors text-sm"><CalendarDays size={18} /> Calendrier</a>
                <a href={RESULTATS} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 p-3 rounded-2xl bg-white/5 hover:bg-red-600 transition-colors text-sm"><Trophy size={18} /> Résultats</a>
              </div>

              <button onClick={() => setIsMobileInfosOpen(!isMobileInfosOpen)} aria-expanded={isMobileInfosOpen} className="w-full flex items-center justify-between py-3 text-xl border-t border-white/10 font-black uppercase italic">
                Infos <ChevronDown size={18} className={`transition-transform duration-300 ${isMobileInfosOpen ? "rotate-180 text-red-500" : ""}`} />
              </button>
              {isMobileInfosOpen && (
                  <div className="flex flex-col gap-1 pb-2 animate-in fade-in slide-in-from-top-2 duration-300">
                    {INFOS_EXT.map((l) => (
                        <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-red-600 text-sm transition-colors">
                          {l.label === "Affiliation au club" ? "Affiliation" : l.label} <ExternalLink size={14} className="opacity-60" />
                        </a>
                    ))}
                    {INFOS.map((l) => (
                        <Link key={l.href} href={l.href} prefetch={false} className="p-3 rounded-xl bg-white/5 hover:bg-red-600 text-sm transition-colors">{l.label}</Link>
                    ))}
                  </div>
              )}

              {user && (
                  <button onClick={handleLogout} className="mt-auto p-4 bg-red-600 text-white rounded-2xl flex items-center justify-center gap-2 font-black uppercase italic hover:bg-red-700 transition-all active:scale-95">
                    <LogOut size={18} /> Déconnexion
                  </button>
              )}
            </nav>
          </div>
        </div>
      </>
  );
}
