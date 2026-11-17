/**
 * Transition douce entre les pages : Next.js recrée ce composant à chaque
 * navigation, l'animation de fondu (opacité seule) se rejoue donc à chaque page.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="acd-page">{children}</div>;
}
