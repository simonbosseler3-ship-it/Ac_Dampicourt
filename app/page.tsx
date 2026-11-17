"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/app/context/authContext";
import { HeroNews } from "@/components/carousel/news";
import { PageHero } from "@/components/layout/PageHero";
import Link from "next/link";
import {
  Timer,
  Trophy,
  CalendarCheck,
  ChevronRight,
  HelpCircle,
  MessageSquare,
  ArrowUpRight,
  Users
} from "lucide-react";
import { TutorialOverlay } from "@/components/tutorial/tutorial";

// Les 3 accès rapides (mêmes liens qu'avant)
const QUICK = [
  { href: "/infos/records", title: "Records Club", sub: "Historique & performance", Icon: Trophy, red: false },
  { href: "/inscription", title: "Inscriptions", sub: "Meetings", Icon: CalendarCheck, red: true },
  { href: "/speed-night", title: "Nos événements", sub: "Meetings & Speed Night/Race", Icon: Timer, red: false },
];

export default function Home() {
  const { user, profile } = useAuth();
  const [news, setNews] = useState<any[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    async function fetchHomeData() {
      try {
        // On ne récupère plus que les actualités pour le carousel
        const { data, error } = await supabase
        .from('news')
        .select('*')
        .eq('is_hidden', false)
        .order('date_text', { ascending: false })
        .limit(3);

        if (error) throw error;
        if (data) setNews(data);

      } catch (err) {
        console.error("Erreur accueil:", err);
      } finally {
        setDataLoading(false);
      }
    }

    fetchHomeData();
  }, []);

  return (
      <div className="pb-4">

        {user && profile && !profile.has_seen_tutorial && (
            <TutorialOverlay
                role={profile.role}
                userId={user.id}
                userName={profile.full_name || "Athlète"}
            />
        )}

        {/* 1. CAROUSEL — plein écran, se fond dans le fond du site */}
        {dataLoading ? (
            <div className="hh" aria-label="Chargement de l'actualité">
              <div className="hh__media"><div className="hh__shade" /><div className="hh__hex" /></div>
              <div className="hh__content">
                <div className="container mx-auto px-4 space-y-5">
                  <div className="h-6 w-28 bg-white/10 rounded animate-pulse" />
                  <div className="h-16 md:h-24 w-full max-w-3xl bg-white/10 rounded-2xl animate-pulse" />
                  <div className="h-16 md:h-24 w-2/3 max-w-2xl bg-white/10 rounded-2xl animate-pulse" />
                </div>
              </div>
            </div>
        ) : news.length > 0 ? (
            <HeroNews newsData={news} />
        ) : (
            <PageHero
                eyebrow="Le club de la Gaume"
                title={<>Athletic Club <em>Dampicourt</em></>}
                description="Former, s'entraîner et performer. L'athlétisme pour tous, de l'initiation au haut niveau."
            />
        )}

        <main className="container mx-auto px-4">

          {/* 2. ACCÈS RAPIDES — tuiles en verre qui chevauchent le bas du carrousel */}
          <nav className="qk-wrap" aria-label="Accès rapides" data-no-reveal>
            <div className="qk">
              {QUICK.map(({ href, title, sub, Icon, red }) => (
                  <Link key={href} href={href} prefetch={false} className={`qk__tile${red ? " qk__tile--red" : ""}`}>
                    <span className="qk__big" aria-hidden="true"><Icon strokeWidth={1} /></span>
                    <span className="qk__icon"><Icon /></span>
                    <span className="qk__txt">
                      <b>{title}</b>
                      <small>{sub}</small>
                    </span>
                    <span className="qk__go" aria-hidden="true"><ArrowUpRight /></span>
                  </Link>
              ))}
            </div>
          </nav>

          {/* 3. FORUM & COMMUNAUTÉ */}
          <div className="acd-sect">
            <div>
              <span className="acd-sect__line" />
              <h2>Échanger avec <em>le club</em></h2>
              <p>Une question pour le staff, un sondage, un encouragement : c&apos;est ici.</p>
            </div>
          </div>
          <section className="cm">
            <Link href="/forum" prefetch={false} className="cm__card cm__card--light">
              <span className="cm__big" aria-hidden="true"><MessageSquare strokeWidth={1} /></span>
              <span className="cm__icon"><HelpCircle /></span>
              <div className="cm__txt">
                <h3>Une question ? <em>Le Forum</em></h3>
                <p>Besoin d&apos;aide ou d&apos;infos ?</p>
              </div>
              <span className="cm__go">Accéder <ChevronRight /></span>
            </Link>

            <Link href="/sondage" prefetch={false} className="cm__card cm__card--dark">
              <span className="cm__big" aria-hidden="true"><Users strokeWidth={1} /></span>
              <span className="cm__icon"><Users /></span>
              <div className="cm__txt">
                <h3>La <em>Communauté</em></h3>
                <p>Sondages & Encouragements</p>
              </div>
              <span className="cm__go">Rejoindre <ChevronRight /></span>
            </Link>
          </section>
        </main>
      </div>
  );
}
