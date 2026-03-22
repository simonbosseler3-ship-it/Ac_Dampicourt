"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

// On définit ce que le contexte contient
interface ThemeContextType {
  theme: string;
  setTheme: (theme: string) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "normal",
  setTheme: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState("normal");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true); // Indique que le composant est bien monté côté navigateur

    const fetchTheme = async () => {
      const { data, error } = await supabase
      .from("settings")
      .select("value")
      .eq("key", "active_theme")
      .single();

      if (data && !error) setTheme(data.value);
    };
    fetchTheme();

    // Écoute des changements en temps réel
    const channel = supabase
    .channel("theme-realtime")
    .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "settings", filter: "key=eq.active_theme" },
        (payload) => {
          setTheme(payload.new.value);
        }
    )
    .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // On attend que le client soit prêt pour éviter un flash visuel
  if (!mounted) {
    return <div className="min-h-screen opacity-0" />;
  }

  return (
      <ThemeContext.Provider value={{ theme, setTheme }}>
        {/* On applique la classe theme-XXX uniquement si ce n'est pas "normal" */}
        <div className={`${theme !== "normal" ? `theme-${theme}` : ""} min-h-screen transition-colors duration-500`}>
          {children}
        </div>
      </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);