"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/navbar/navbar";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) alert(error.message);
    else router.push("/"); // Redirection vers l'accueil après connexion
  };

  return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <div className="max-w-md mx-auto mt-20 p-8 bg-white rounded-3xl shadow-xl">
          <h1 className="text-3xl font-black italic uppercase text-slate-900 mb-6">Connexion <span className="text-red-600">Admin</span></h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
                type="email" placeholder="Email"
                className="w-full p-3 rounded-xl border focus:ring-2 focus:ring-red-500 outline-none"
                onChange={(e) => setEmail(e.target.value)}
            />
            <input
                type="password" placeholder="Mot de passe"
                className="w-full p-3 rounded-xl border focus:ring-2 focus:ring-red-500 outline-none"
                onChange={(e) => setPassword(e.target.value)}
            />
            <button className="w-full bg-red-600 text-white font-bold py-3 rounded-xl hover:bg-red-700 transition-all uppercase italic">
              Se connecter
            </button>
          </form>
        </div>
      </div>
  );
}