"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/app/context/authContext";
import { ShieldCheck, Edit, FileText, ExternalLink, Download, File } from "lucide-react";
import Link from "next/link";

export default function EthiquePage() {
  const { profile, loading: authLoading } = useAuth();
  const [config, setConfig] = useState<any>(null);
  const [dataLoading, setDataLoading] = useState(true);

  const isAdmin = profile?.role?.toLowerCase().trim() === 'admin';

  useEffect(() => {
    async function fetchConfig() {
      try {
        const { data, error } = await supabase
        .from('training_page_config')
        .select('*')
        .single();

        if (error) throw error;

        if (data) {
          // On s'assure que official_documents est bien un tableau pour éviter les erreurs
          setConfig({
            ...data,
            official_documents: Array.isArray(data.official_documents) ? data.official_documents : []
          });
        }
      } catch (err) {
        console.error("Erreur chargement config éthique:", err);
      } finally {
        setDataLoading(false);
      }
    }

    fetchConfig();
  }, []);

  const contactEmail = config?.referent_email || "referent.ethique@lbfa.be";

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

          {/* EN-TÊTE & BOUTON ADMIN */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
            <div className="flex flex-col">
              <h1 className="text-4xl font-black text-slate-900 uppercase italic">
                Éthique <span className="text-red-600">& Dopage</span>
              </h1>
              <div className="h-2 w-24 bg-red-600 mt-2"></div>
            </div>

            {/* Le bouton Modifier n'apparaît que pour les admins */}
            {!authLoading && isAdmin && (
                <Link href="/infos/ethique/modifier">
                  <button className="flex items-center gap-2 bg-slate-900 text-white px-6 py-2 rounded-full font-bold hover:bg-red-600 transition-all text-xs uppercase italic shadow-lg active:scale-95">
                    <Edit size={16}/> Modifier la page
                  </button>
                </Link>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

            {/* COLONNE GAUCHE : TEXTE */}
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

            {/* COLONNE DROITE : CONTACT & DOCUMENTS */}
            <div className="lg:col-start-3 space-y-6">

              {/* Carte Contact */}
              <div className="bg-slate-900 text-white p-8 rounded-3xl shadow-xl relative overflow-hidden group">
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
                {/* Effet visuel en arrière-plan */}
                <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-red-600/20 rounded-full blur-3xl group-hover:bg-red-600/30 transition-colors"></div>
              </div>

              {/* Carte DOCUMENTS (Dynamique) */}
              <div className="bg-white p-8 rounded-3xl border-2 border-slate-100 shadow-sm">
                <div className="flex items-center gap-2 mb-6">
                  <div className="p-2 bg-red-50 text-red-600 rounded-lg">
                    <FileText size={20} />
                  </div>
                  <h3 className="text-lg font-black uppercase italic text-slate-900 tracking-tighter">
                    Documents <span className="text-red-600">Officiels</span>
                  </h3>
                </div>

                <div className="space-y-3">
                  {/* C'est ici que la magie opère : on boucle sur le JSON */}
                  {config?.official_documents && config.official_documents.length > 0 ? (
                      config.official_documents.map((doc: any, index: number) => (
                          <a
                              key={index}
                              href={doc.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-colors group border border-transparent hover:border-slate-200"
                          >
                            <div className="flex items-center gap-3 overflow-hidden">
                              <File size={14} className="text-slate-400 shrink-0" />
                              <span className="text-[10px] font-black uppercase italic text-slate-700 truncate">
                            {doc.name}
                          </span>
                            </div>
                            <ExternalLink size={14} className="text-slate-400 group-hover:text-red-600 transition-colors shrink-0"/>
                          </a>
                      ))
                  ) : (
                      <div className="p-6 bg-slate-50 rounded-2xl text-center border border-dashed border-slate-200">
                      <span className="text-[10px] font-bold uppercase italic text-slate-400">
                        Aucun document disponible
                      </span>
                      </div>
                  )}
                </div>
              </div>

            </div>

          </div>
        </main>
      </div>
  );
}