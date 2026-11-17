import Link from "next/link";
import { Children, cloneElement, isValidElement, type ReactElement, type ReactNode } from "react";
import { ArrowLeft } from "lucide-react";
import { HeroFx } from "./HeroFx";

/**
 * En-tête commun à toutes les pages (bandeau ardoise sous la navbar).
 * Utilisable dans les pages serveur comme client : aucun hook ici,
 * la parallaxe est gérée par le petit composant client <HeroFx />.
 *
 *   <PageHero
 *     eyebrow="Staff technique"
 *     title={<>Nos <em>entraîneurs</em></>}     // <em> = partie en rouge
 *     description="…"
 *     crumbs={[{ label: "Infos" }, { label: "Entraîneurs" }]}
 *     actions={<button>…</button>}              // boutons admin, etc.
 *   />
 */

type Crumb = { label: string; href?: string };

/**
 * Découpe le titre en mots (<span class="w"><span>mot</span></span>) pour que
 * chaque mot se lève l'un après l'autre. Les balises (<em>, <br/>) sont gardées.
 */
function splitWords(node: ReactNode, counter = { i: 0 }): ReactNode {
  if (typeof node === "string" || typeof node === "number") {
    return String(node)
      .split(/(\s+)/)
      .map((part, k) =>
        /^\s+$/.test(part) || part === "" ? part : (
          <span className="w" key={k}>
            <span style={{ "--i": counter.i++ } as React.CSSProperties}>{part}</span>
          </span>
        )
      );
  }
  if (Array.isArray(node)) return Children.map(node, (c) => splitWords(c, counter));
  if (isValidElement(node)) {
    const el = node as ReactElement<{ children?: ReactNode }>;
    if (el.props.children === undefined) return el;
    return cloneElement(el, undefined, splitWords(el.props.children, counter));
  }
  return node;
}

export function PageHero({
  eyebrow,
  title,
  description,
  crumbs,
  back,
  actions,
  meta,
  image,
  size = "lg",
  titleSize = "xl",
}: {
  eyebrow?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  crumbs?: Crumb[];
  /** Lien de retour, ou bouton (onBack) pour les pages qui utilisent router.back() */
  back?: { href?: string; label?: string; onBack?: () => void };
  actions?: React.ReactNode;
  meta?: React.ReactNode;
  /** Image de fond (ex. couverture d'un article) */
  image?: string | null;
  size?: "lg" | "sm";
  /** "md" pour les titres longs venant de la base (article, sujet du forum) */
  titleSize?: "xl" | "md";
}) {
  return (
    <section className={`ph ph--${size}${image ? " ph--image" : ""}`}>
      <div className="ph__bg" aria-hidden="true">
        {image ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="ph__img" src={image} alt="" />
            <div className="ph__shade" />
          </>
        ) : (
          <>
            <div className="ph__hex" />
            <div className="ph__stripes" />
          </>
        )}
      </div>
      <HeroFx />

      <div className="container mx-auto px-4 ph__inner">
        {crumbs && crumbs.length > 0 && !back && (
          <nav className="ph__crumbs" aria-label="Fil d'Ariane">
            <Link href="/" prefetch={false}>Accueil</Link>
            {crumbs.map((c) => (
              <span key={c.label} className="contents">
                <span aria-hidden="true">/</span>
                {c.href ? <Link href={c.href} prefetch={false}>{c.label}</Link> : <span>{c.label}</span>}
              </span>
            ))}
          </nav>
        )}
        {back &&
          (back.onBack ? (
            <button type="button" onClick={back.onBack} className="ph__back">
              <ArrowLeft /> {back.label ?? "Retour"}
            </button>
          ) : (
            <Link href={back.href ?? "/"} prefetch={false} className="ph__back">
              <ArrowLeft /> {back.label ?? "Retour"}
            </Link>
          ))}

        <div className="ph__row">
          <div className="ph__text">
            {eyebrow && <p className="ph__eyebrow">{eyebrow}</p>}
            <h1 className={`ph__title${titleSize === "md" ? " ph__title--md" : ""}`}><span className="sr-only">{title}</span><span aria-hidden="true">{splitWords(title)}</span></h1>
            {description && <p className="ph__desc">{description}</p>}
            {meta && <div className="ph__meta">{meta}</div>}
          </div>
          {actions && <div className="ph__actions">{actions}</div>}
        </div>
      </div>
    </section>
  );
}
