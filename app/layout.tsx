import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar/navbar";
import { Footer } from "@/components/footer/footer";
import { AuthProvider } from "@/app/context/authContext";
import { ThemeProvider } from "@/components/theme/ThemeContext";
import { GlobalDecorations } from "@/components/theme/Decorations";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AC Dampicourt",
  description: "Site officiel de l'Athlétic Club Dampicourt",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
      <html lang="fr" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen relative`}>
      <AuthProvider>
        <ThemeProvider>
          {/* --- ARRIÈRE-PLAN FIXE (Branding ACD) --- */}
          {/* Ce fond ne change jamais, peu importe le thème sélectionné */}
          <div className="fixed inset-0 -z-50 overflow-hidden bg-white">

            {/* 1. Dégradé de fond : Fixé sur les couleurs rouges de base */}
            <div
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(to bottom, white 0%, rgba(220, 38, 38, 0.15) 15%, rgba(220, 38, 38, 0.8) 100%)`
                }}
            ></div>

            {/* 2. Première couche d'hexagones (LIGNES BLANCHES) */}
            <div
                className="absolute inset-0 bg-honeycomb opacity-100"
                style={{
                  maskImage: 'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.3) 20%, rgba(0,0,0,1) 100%)',
                  WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.3) 20%, rgba(0,0,0,1) 100%)'
                }}
            ></div>

            {/* 3. Deuxième couche d'hexagones (Dynamique) */}
            <div
                className="absolute inset-0 bg-honeycomb opacity-80 animate-float-slow"
                style={{
                  backgroundPosition: '60px 104px',
                  maskImage: 'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.1) 40%, rgba(0,0,0,0.6) 100%)',
                  WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.1) 40%, rgba(0,0,0,0.6) 100%)'
                }}
            ></div>

            {/* 4. Halo de lisibilité central */}
            <div className="absolute inset-0 bg-radial from-white/40 via-transparent to-transparent opacity-50"></div>
          </div>

          {/* --- EFFETS SPÉCIAUX (Flocons, Éclairs, Fantômes...) --- */}
          {/* C'est ce composant qui va lire le thème et afficher les bonnes animations */}
          <GlobalDecorations />

          {/* --- STRUCTURE DU SITE --- */}
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow pt-20 relative">
              {children}
            </main>
            <Footer />
          </div>
        </ThemeProvider>
      </AuthProvider>
      </body>
      </html>
  );
}