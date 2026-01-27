"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/app/context/authContext";
import { ShieldCheck, Edit } from "lucide-react";
import Link from "next/link";

export default function EthiquePage() {
  const { profile, loading: authLoading } = useAuth(); // Récupération instantanée du rôle
  const [config, setConfig] = useState<any>(null);
  const [dataLoading, setDataLoading] = useState(true);

  // Vérification admin simplifiée
  const isAdmin = profile?.role?.toLowerCase().trim() === 'admin';

  useEffect(() => {
    async function fetchConfig() {
      try {
        const { data, error } = await supabase
        .from('training_page_config')
        .select('*')
        .single();

        if (error) throw error;
        if (data) setConfig(data);
      } catch (err) {
        console.error("Erreur chargement config éthique:", err);
      } finally {
        setDataLoading(false);
      }
    }

    fetchConfig();
  }, []);

  const contactEmail = config?.referent_email || "referent.ethique@lbfa.be";

  // Optionnel : Un petit skeleton pendant que les données chargent
  if (dataLoading) {
    return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-red-600"></div>
        </div>
    );
  }

  return (
      <div className="min-h-screen">
        <main className="container mx-auto px-4 py-12 pt-32 animate-in fade-in duration-500">

          {/* TITRE & ACTION ADMIN */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
            <div className="flex flex-col">
              <h1 className="text-4xl font-black text-slate-900 uppercase italic">
                Éthique <span className="text-red-600">& Dopage</span>
              </h1>
              <div className="h-2 w-24 bg-red-600 mt-2"></div>
            </div>

            {!authLoading && isAdmin && (
                <Link href="/infos/ethique/modifier">
                  <button className="flex items-center gap-2 bg-slate-900 text-white px-6 py-2 rounded-full font-bold hover:bg-red-600 transition-all text-xs uppercase italic shadow-lg active:scale-95">
                    <Edit size={16}/> Modifier la page
                  </button>
                </Link>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

            {/* Colonne principale texte */}
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 shadow-sm">
                <div className="flex items-center gap-3 mb-6 text-red-600">
                  <ShieldCheck size={32} className="animate-pulse-slow" />
                  <span className="font-black uppercase italic tracking-tighter text-xl">Charte et Règlements</span>
                </div>
                <div className="text-slate-600 leading-relaxed whitespace-pre-wrap text-sm md:text-base">
                  {config?.ethics_text || "Contenu en cours de rédaction..."}
                </div>
              </div>
            </div>

            {/* Sidebar Contact */}
            <div className="lg:col-start-3">
              <div className="bg-slate-900 text-white p-8 rounded-3xl shadow-xl relative overflow-hidden group hover:shadow-red-900/10 transition-shadow">
                <h3 className="text-xl font-black uppercase italic mb-4 relative z-10 tracking-tighter">
                  Contact <span className="text-red-600">Référent</span>
                </h3>
                <p className="text-slate-400 text-xs font-bold uppercase italic mb-6 relative z-10 leading-tight">
                  Pour toute question relative à l'éthique sportive ou au dopage au sein de la LBFA.
                </p>

                <a
                    href={`mailto:${contactEmail}`}
                    className="inline-block w-full text-center bg-red-600 text-white font-black px-6 py-3 rounded-xl hover:bg-white hover:text-red-600 transition-all relative z-10 uppercase text-[10px] tracking-wider truncate"
                >
                  {contactEmail}
                </a>

                {/* Décoration d'arrière-plan */}
                <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-red-600/20 rounded-full blur-3xl group-hover:bg-red-600/30 transition-colors"></div>
              </div>
            </div>

          </div>
        </main>
      </div>
  );
}