"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/app/context/authContext";
import {
  ShieldCheck,
  Edit,
  FileText,
  ExternalLink,
  Scale,
  ShieldAlert,
  Mail,
  Loader2,
  FileBox,
  ChevronRight
} from "lucide-react";
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
        <div className="min-h-screen flex flex-col items-center justify-center bg-white gap-4">
          <Loader2 className="animate-spin text-red-600" size={40} />
          <p className="text-[10px] font-black uppercase italic tracking-[0.3em] text-slate-400">Chargement du cadre légal...</p>
        </div>
    );
  }

  return (
      <div className="min-h-screen">
        <main className="container mx-auto px-4 py-12 pt-32 pb-24 animate-in fade-in duration-1000">

          {/* HEADER SECTION */}
          <div className="flex flex-col lg:flex-row justify-between items-end mb-16 gap-8">
            <div className="max-w-3xl">
              <div className="flex items-center gap-3 mb-4">
                <span className="h-[2px] w-10 bg-red-600"></span>
                <span className="text-red-600 font-black uppercase italic tracking-[0.3em] text-[10px]">Intégrité & Valeurs</span>
              </div>
              <h1 className="text-6xl md:text-8xl font-black text-slate-900 uppercase italic tracking-tighter leading-[0.85]">
                ÉTHIQUE <br /><span className="text-red-600">& DOPAGE</span>
              </h1>
            </div>

            {!authLoading && isAdmin && (
                <Link href="/infos/ethique/modifier" className="animate-in slide-in-from-right-4 duration-700">
                  <button className="flex items-center gap-3 bg-slate-900 text-white px-8 py-4 rounded-2xl font-black hover:bg-red-600 transition-all text-[10px] uppercase italic shadow-2xl active:scale-95 group">
                    <Edit size={16} className="group-hover:rotate-12 transition-transform" />
                    Modifier la page
                  </button>
                </Link>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">

            {/* COLONNE GAUCHE : TEXTE RÉGLEMENTAIRE */}
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-white p-10 md:p-16 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 relative overflow-hidden group">
                {/* Filigrane décoratif */}
                <Scale size={200} className="absolute -right-20 -top-20 text-slate-50/50 pointer-events-none group-hover:rotate-12 transition-transform duration-[2000ms]" />

                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-10">
                    <div className="p-4 bg-red-600 rounded-2xl text-white shadow-lg shadow-red-200">
                      <ShieldCheck size={28} />
                    </div>
                    <div>
                      <h2 className="text-2xl font-black uppercase italic text-slate-900 leading-none">Charte de bonne conduite</h2>
                      <p className="text-[10px] font-black text-red-600 uppercase tracking-widest mt-1">Règlements & Engagements</p>
                    </div>
                  </div>

                  <div className="text-slate-600 leading-relaxed whitespace-pre-wrap font-medium text-base md:text-lg">
                    {config?.ethics_text || "Le contenu de la charte éthique est en cours de mise à jour..."}
                  </div>

                  <div className="mt-12 pt-12 border-t border-slate-50 flex flex-col md:flex-row gap-6 items-center justify-between">
                    <div className="flex items-center gap-3">
                      <ShieldAlert className="text-red-600" size={20} />
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Fair-play & Respect avant tout</span>
                    </div>
                    <img src="/logo-acd.png" alt="ACD" className="h-8 opacity-20 grayscale" />
                  </div>
                </div>
              </div>
            </div>

            {/* COLONNE DROITE : CONTACT & DOCUMENTS */}
            <div className="space-y-8">

              {/* CARTE CONTACT RÉFÉRENT */}
              <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none group-hover:scale-110 transition-transform duration-700">
                  <Mail size={120} />
                </div>

                <div className="relative z-10">
                  <h3 className="text-xl font-black uppercase italic mb-2 tracking-tighter">
                    Besoin d'un <span className="text-red-600">Conseil ?</span>
                  </h3>
                  <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-8 leading-relaxed">
                    Contactez notre référent pour toute question relative à l'éthique ou à la santé.
                  </p>

                  <a
                      href={`mailto:${contactEmail}`}
                      className="flex items-center justify-center gap-3 w-full bg-white text-slate-900 font-black px-6 py-4 rounded-2xl hover:bg-red-600 hover:text-white transition-all uppercase text-[10px] tracking-widest shadow-xl group/btn"
                  >
                    <Mail size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                    Envoyer un message
                  </a>

                  <div className="mt-6 text-center">
                    <span className="text-[9px] font-black text-red-600 uppercase tracking-[0.3em] italic">
                        {contactEmail}
                    </span>
                  </div>
                </div>
              </div>

              {/* CARTE DOCUMENTS OFFICIELS */}
              <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50">
                <div className="flex items-center gap-3 mb-8">
                  <div className="p-3 bg-slate-50 text-slate-900 rounded-xl">
                    <FileBox size={20} />
                  </div>
                  <div>
                    <h3 className="text-lg font-black uppercase italic text-slate-900 leading-none">Ressources</h3>
                    <p className="text-[9px] font-black text-red-600 uppercase tracking-widest mt-1 italic">Téléchargements</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {config?.official_documents && config.official_documents.length > 0 ? (
                      config.official_documents.map((doc: any, index: number) => (
                          <a
                              key={index}
                              href={doc.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center justify-between p-5 bg-slate-50 rounded-2xl hover:bg-red-600 group transition-all duration-300 border border-transparent"
                          >
                            <div className="flex items-center gap-4 overflow-hidden">
                              <FileText size={18} className="text-red-600 group-hover:text-white transition-colors shrink-0" />
                              <span className="text-[11px] font-black uppercase italic text-slate-700 group-hover:text-white transition-colors truncate">
                          {doc.name}
                        </span>
                            </div>
                            <ChevronRight size={16} className="text-slate-300 group-hover:text-white group-hover:translate-x-1 transition-all shrink-0"/>
                          </a>
                      ))
                  ) : (
                      <div className="p-10 bg-slate-50 rounded-[2rem] text-center border-2 border-dashed border-slate-100">
                    <span className="text-[10px] font-black uppercase italic text-slate-300 tracking-widest">
                      Aucun document <br />répertorié
                    </span>
                      </div>
                  )}
                </div>

                <p className="mt-8 text-[9px] font-bold text-slate-400 uppercase tracking-widest text-center italic px-4 leading-relaxed">
                  Les règlements antidopage sont mis à jour annuellement par l'ONAD et la WADA.
                </p>
              </div>

            </div>

          </div>
        </main>
      </div>
  );
}