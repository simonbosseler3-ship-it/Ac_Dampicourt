"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { AlertCircle, Loader2, LockKeyhole } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Sécurité : Si l'utilisateur est déjà connecté, on le sort de là
  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) window.location.href = "/";
    };
    checkUser();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

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
        return;
      }

      if (data?.session) {
        // SUCCESS : On force la redirection brute pour réinitialiser tout le site proprement
        window.location.href = "/";
      }
    } catch (err: any) {
      console.error("Erreur critique login:", err);
      setError("Erreur système. Essayez de rafraîchir la page.");
      setLoading(false);
    }
  };

  return (
      <div className="min-h-[80vh] flex items-center justify-center bg-transparent px-4">
        <div className="max-w-md w-full p-8 md:p-12 bg-white/80 backdrop-blur-md rounded-[2.5rem] shadow-2xl border border-white/20 animate-in fade-in zoom-in duration-500">

          <div className="flex justify-center mb-6">
            <div className="bg-red-600 p-4 rounded-2xl shadow-lg shadow-red-200">
              <LockKeyhole className="text-white" size={32} />
            </div>
          </div>

          <h1 className="text-3xl font-black italic uppercase text-slate-900 mb-2 text-center tracking-tighter leading-none">
            Espace <span className="text-red-600">Membre</span>
          </h1>
          <p className="text-center text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] mb-8">
            Athlétic Club Dampicourt
          </p>

          {error && (
              <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-600 rounded-r-xl flex items-center gap-3">
                <AlertCircle className="text-red-600 min-w-[20px]" size={20}/>
                <p className="text-red-600 text-[11px] font-black uppercase italic leading-tight">{error}</p>
              </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <input
                type="email"
                placeholder="Email"
                className="w-full p-4 bg-slate-100/50 rounded-xl border border-slate-200 font-bold text-slate-900 focus:ring-2 focus:ring-red-600 outline-none transition-all text-sm"
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
            />
            <input
                type="password"
                placeholder="Mot de passe"
                className="w-full p-4 bg-slate-100/50 rounded-xl border border-slate-200 font-bold text-slate-900 focus:ring-2 focus:ring-red-600 outline-none transition-all text-sm"
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
            />

            <button
                type="submit"
                disabled={loading}
                className="w-full bg-red-600 text-white font-black py-4 rounded-xl hover:bg-slate-900 shadow-xl shadow-red-100 hover:-translate-y-1 active:scale-95 transition-all uppercase italic tracking-widest flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    <span>Connexion en cours...</span>
                  </>
              ) : (
                  "Se connecter"
              )}
            </button>
          </form>
        </div>
      </div>
  );
}