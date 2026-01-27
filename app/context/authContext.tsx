"use client";
import { createContext, useContext, useEffect, useState, useMemo } from "react";
import { supabase } from "@/lib/supabase";

const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function getAuth() {
      try {
        // On récupère l'utilisateur actuel
        const { data: { user: currUser } } = await supabase.auth.getUser();

        if (currUser && isMounted) {
          setUser(currUser);
          const { data: prof } = await supabase.from('profiles').select('*').eq('id', currUser.id).single();
          if (isMounted) setProfile(prof);
        }
      } catch (e) {
        console.error("Auth error:", e);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    getAuth();

    // On ne garde que l'écouteur de SIGNED_OUT pour nettoyer si l'utilisateur quitte
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT' && isMounted) {
        setUser(null);
        setProfile(null);
        window.location.href = '/login';
      }
    });

    return () => { isMounted = false; subscription.unsubscribe(); };
  }, []);

  const value = useMemo(() => ({ user, profile, loading }), [user?.id, profile?.role, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);