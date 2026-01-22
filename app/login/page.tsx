"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/navbar/navbar";
import { AlertCircle, Loader2 } from "lucide-react"; // Ajout des icônes

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null); // Nouvel état pour l'erreur
  const [loading, setLoading] = useState(false); // Nouvel état pour le chargement

  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // On efface l'erreur précédente
    setLoading(true); // On lance le chargement

    const { error: supabaseError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (supabaseError) {
      // On traduit le message technique en français pour l'utilisateur
      if (supabaseError.message === "Invalid login credentials") {
        setError("Email ou mot de passe incorrect.");
      } else {
        setError(supabaseError.message);
      }
      setLoading(false); // On arrête le chargement
    } else {
      router.push("/");
      router.refresh(); // Bonne pratique pour mettre à jour la Navbar
      // On ne met pas setLoading(false) ici pour éviter que le bouton se réactive pendant la redirection
    }
  };

  return (
      <div className="min-h-screen">
        <Navbar/>
        <div
            className="max-w-md mx-auto mt-32 p-8 bg-white rounded-[2rem] shadow-xl border border-slate-100">

          <h1 className="text-3xl font-black italic uppercase text-slate-900 mb-6 text-center">
            Page <span className="text-red-600">Connexion</span>
          </h1>

          {/* ZONE D'ERREUR */}
          {error && (
              <div
                  className="mb-6 p-4 bg-red-50 border-l-4 border-red-600 rounded-r-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
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
                  className="w-full p-4 bg-slate-50 rounded-xl border border-slate-200 font-bold text-slate-900 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all placeholder:text-slate-400 placeholder:font-normal"
                  onChange={(e) => setEmail(e.target.value)}
                  required
              />
            </div>

            <div>
              <input
                  type="password"
                  placeholder="Mot de passe"
                  value={password}
                  className="w-full p-4 bg-slate-50 rounded-xl border border-slate-200 font-bold text-slate-900 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all placeholder:text-slate-400 placeholder:font-normal"
                  onChange={(e) => setPassword(e.target.value)}
                  required
              />
            </div>

            <button
                disabled={loading}
                className="w-full bg-red-600 text-white font-black py-4 rounded-xl hover:bg-slate-900 hover:shadow-lg hover:-translate-y-1 active:scale-95 transition-all uppercase italic tracking-widest flex items-center justify-center gap-2 disabled:opacity-70 disabled:hover:bg-red-600 disabled:hover:translate-y-0"
            >
              {loading ? (
                  <Loader2 className="animate-spin"/>
              ) : (
                  "Se connecter"
              )}
            </button>
          </form>
        </div>
      </div>
  );
}