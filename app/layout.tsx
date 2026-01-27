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
      {/* On applique les polices et le dégradé directement sur le body */}
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-linear-to-b from-white via-red-50/50 to-red-600/60`}>
      <AuthProvider>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          {/* Le contenu (children) sera transparent par défaut, laissant voir le dégradé derrière */}
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