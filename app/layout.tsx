import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar/navbar";
import { Footer } from "@/components/footer/footer";
import { AuthProvider } from "@/app/context/authContext";

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
      <html lang="fr">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen relative`}>

      {/* --- ARRIÈRE-PLAN "RED RISE" --- */}
      <div className="fixed inset-0 -z-50 overflow-hidden bg-white">

        {/* 1. Dégradé de fond : Le rouge monte plus haut (via-red-100) */}
        <div className="absolute inset-0 bg-linear-to-b from-white via-red-100/40 via-40% to-red-600/40"></div>

        {/* 2. Première couche d'hexagones (Plus présente dès le milieu) */}
        <div
            className="absolute inset-0 bg-honeycomb opacity-50"
            style={{
              // On monte le dégradé du masque : les hexagones deviennent bien nets plus tôt
              maskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.4) 30%, rgba(0,0,0,1) 100%)',
              WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.4) 30%, rgba(0,0,0,1) 100%)'
            }}
        ></div>

        {/* 3. Deuxième couche d'hexagones (Dynamique) */}
        <div
            className="absolute inset-0 bg-honeycomb opacity-30 animate-float-slow"
            style={{
              marginLeft: '60px',
              marginTop: '104px',
              maskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.2) 40%, rgba(0,0,0,0.8) 100%)',
              WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.2) 40%, rgba(0,0,0,0.8) 100%)'
            }}
        ></div>

        {/* 4. Halo de lisibilité (On le réduit pour laisser monter le rouge) */}
        <div className="absolute inset-0 bg-radial from-white/30 via-transparent to-transparent opacity-40"></div>
      </div>

      <AuthProvider>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow pt-20 relative">
            {children}
          </main>
          <Footer />
        </div>
      </AuthProvider>
      </body>
      </html>
  );
}