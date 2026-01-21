import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import {Navbar} from "@/components/navbar/navbar";

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
          className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-linear-to-b from-white via-red-50/50 to-red-600/60`}
      >
      <Navbar/>
      {/* Le contenu commence ici */}
      <div className="relative pt-20">
        {children}
      </div>
      </body>
      </html>
  );
}