"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
// SUPPRESSION DE L'IMPORT NAVBAR ICI
import { AlertCircle, Loader2 } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { data, error: supabaseError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (supabaseError) {
        if (supabaseError.message === "Invalid login credentials") {
          setError("Email ou mot de passe incorrect.");
        } else {
          setError(supabaseError.message);
        }
        setLoading(false);
      } else if (data.user) {
        // AJOUT D'UN REFRESH AVANT LA REDIRECTION
        // Cela force Next.js à invalider le cache de session côté serveur
        router.refresh();

        // Petite temporisation pour laisser le temps au refresh de s'amorcer
        setTimeout(() => {
          router.push("/");
        }, 100);
      }
    } catch (err) {
      setError("Une erreur inattendue est survenue.");
      setLoading(false);
    }
  };

  return (
      <div className="min-h-[80vh] flex items-center justify-center">
        {/* LA NAVBAR EST DÉJÀ DANS LE LAYOUT, ON NE LA MET PAS ICI */}

        <div className="max-w-md w-full p-8 bg-white rounded-[2rem] shadow-xl border border-slate-100">
          <h1 className="text-3xl font-black italic uppercase text-slate-900 mb-6 text-center">
            Page <span className="text-red-600">Connexion</span>
          </h1>

          {error && (
              <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-600 rounded-r-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                <AlertCircle className="text-red-600 min-w-[20px]" size={20}/>
                <p className="text-red-600 text-sm font-bold">{error}</p>
              </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  className="w-full p-4 bg-slate-50 rounded-xl border border-slate-200 font-bold text-slate-900 focus:ring-2 focus:ring-red-500 outline-none transition-all"
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
              />
            </div>

            <div>
              <input
                  type="password"
                  placeholder="Mot de passe"
                  value={password}
                  className="w-full p-4 bg-slate-50 rounded-xl border border-slate-200 font-bold text-slate-900 focus:ring-2 focus:ring-red-500 outline-none transition-all"
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
              />
            </div>

            <button
                disabled={loading}
                className="w-full bg-red-600 text-white font-black py-4 rounded-xl hover:bg-slate-900 hover:shadow-lg hover:-translate-y-1 active:scale-95 transition-all uppercase italic tracking-widest flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {loading ? <Loader2 className="animate-spin" /> : "Se connecter"}
            </button>
          </form>
        </div>
      </div>
  );
}