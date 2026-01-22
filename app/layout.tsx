import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar/navbar";
import { Footer } from "@/components/footer/footer";

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

export default function RootLayout({
                                     children,
                                   }: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <html lang="fr">
      <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased bg-linear-to-b from-white via-red-50/50 to-red-600/60`}
      >
      {/* On utilise une structure Flexbox sur toute la hauteur de l'écran */}
      <div className="flex flex-col min-h-screen">
        <Navbar />

        {/* Le contenu principal (main) prend tout l'espace disponible (flex-grow).
            Le padding-top (pt-20) évite que le contenu ne passe sous la Navbar fixe.
          */}
        <main className="flex-grow pt-20 relative">
          {children}
        </main>

        {/* Le Footer sera maintenant automatiquement en bas, peu importe la longueur de la page */}
        <Footer />
      </div>
      </body>
      </html>
  );
}