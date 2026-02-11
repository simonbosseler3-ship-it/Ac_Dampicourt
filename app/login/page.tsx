"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { AlertCircle, Loader2, LockKeyhole, Mail, KeyRound } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Vérifier si l'utilisateur est déjà connecté
  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        router.replace("/");
      }
    };
    checkUser();
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    setError(null);
    setLoading(true);

    try {
      const { data, error: supabaseError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password,
      });

      if (supabaseError) {
        // Traduction des erreurs communes
        if (supabaseError.message.includes("Invalid login credentials")) {
          setError("Email ou mot de passe incorrect.");
        } else if (supabaseError.message.includes("Email not confirmed")) {
          setError("Veuillez confirmer votre email avant de vous connecter.");
        } else {
          setError("Identifiants invalides ou problème de connexion.");
        }
        setLoading(false);
        return;
      }

      if (data?.session) {
        // Redirection brutale nécessaire pour réinitialiser le AuthContext global
        window.location.href = "/";
      }
    } catch (err) {
      console.error("Erreur critique login:", err);
      setError("Une erreur système est survenue.");
      setLoading(false);
    }
  };

  return (
      <div className="min-h-[90vh] flex flex-col items-center justify-center px-4">
        {/* LOGO OU TITRE DE RAPPEL */}
        <div className="mb-10 text-center animate-in fade-in slide-in-from-top-4 duration-700">
          <h2 className="text-[10px] font-black uppercase italic tracking-[0.4em] text-red-600 mb-2">
            Portail Athlète
          </h2>
          <div className="h-1 w-12 bg-slate-900 mx-auto"></div>
        </div>

        <div className="max-w-md w-full p-10 md:p-14 bg-slate-50 rounded-[3.5rem] border border-slate-100 shadow-2xl shadow-slate-200/50 animate-in fade-in zoom-in duration-500">

          <div className="flex justify-center mb-8">
            <div className="bg-slate-900 p-5 rounded-[1.5rem] shadow-xl shadow-slate-200 rotate-3 hover:rotate-0 transition-transform duration-500">
              <LockKeyhole className="text-red-600" size={32} />
            </div>
          </div>

          <h1 className="text-4xl font-black italic uppercase text-slate-900 mb-2 text-center tracking-tighter leading-none">
            Connexion <br /><span className="text-red-600">ACD</span>
          </h1>
          <p className="text-center text-slate-400 text-[9px] font-black uppercase tracking-[0.2em] mb-10">
            Athlétic Club Dampicourt
          </p>

          {error && (
              <div className="mb-8 p-5 bg-red-50 border-2 border-red-100 rounded-3xl flex items-center gap-4 animate-in shake duration-300">
                <AlertCircle className="text-red-600 shrink-0" size={20}/>
                <p className="text-red-600 text-[10px] font-black uppercase italic leading-tight tracking-widest">{error}</p>
              </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="relative group">
              <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-red-600 transition-colors" size={18} />
              <input
                  type="email"
                  placeholder="votre@email.com"
                  className="w-full py-5 pl-14 pr-6 bg-white rounded-2xl border-2 border-slate-100 font-bold text-slate-900 focus:border-red-600 outline-none transition-all text-sm placeholder:text-slate-300 shadow-sm"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
              />
            </div>

            <div className="relative group">
              <KeyRound className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-red-600 transition-colors" size={18} />
              <input
                  type="password"
                  placeholder="Mot de passe"
                  className="w-full py-5 pl-14 pr-6 bg-white rounded-2xl border-2 border-slate-100 font-bold text-slate-900 focus:border-red-600 outline-none transition-all text-sm placeholder:text-slate-300 shadow-sm"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
              />
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full bg-slate-900 text-white font-black py-6 rounded-2xl hover:bg-red-600 shadow-2xl shadow-slate-200 hover:-translate-y-1 active:scale-95 transition-all uppercase italic tracking-[0.2em] flex items-center justify-center gap-3 disabled:opacity-50 mt-4 text-xs"
            >
              {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    <span>Identification...</span>
                  </>
              ) : (
                  "Accéder au compte"
              )}
            </button>
          </form>

          <div className="mt-10 text-center">
            <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest leading-relaxed">
              En cas de perte de mot de passe, <br />contactez l'administrateur du club.
            </p>
          </div>
        </div>
      </div>
  );
}