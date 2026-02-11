"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/app/context/authContext";
import { Mail, Phone, Edit, Users, Loader2, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function EntraineursPage() {
  // On récupère le profil, mais on n'utilise PAS authLoading pour bloquer l'affichage principal
  const { profile } = useAuth();

  const [trainers, setTrainers] = useState<any[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  // Le bouton admin s'affichera uniquement si cette condition devient vraie
  const isAdmin = profile?.role?.toLowerCase().trim() === 'admin';

  useEffect(() => {
    async function fetchTrainers() {
      try {
        const { data, error } = await supabase
        .from('trainers')
        .select('*')
        .order('order_index');

        if (error) throw error;
        if (data) setTrainers(data);
      } catch (err) {
        console.error("Erreur lors du chargement des entraîneurs:", err);
      } finally {
        // On libère le spinner de données immédiatement
        setDataLoading(false);
      }
    }

    fetchTrainers();
  }, []);

  if (dataLoading) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-4">
          <Loader2 className="animate-spin text-red-600" size={40} />
          <p className="text-[10px] font-black uppercase italic tracking-[0.3em] text-slate-400">Chargement de l'équipe...</p>
        </div>
    );
  }

  return (
      <div className="min-h-screen">
        <main className="container mx-auto px-4 py-12 pt-32 pb-24 animate-in fade-in duration-700">

          {/* HEADER SECTION */}
          <div className="flex flex-col lg:flex-row justify-between items-end mb-20 gap-8">
            <div className="max-w-2xl">
              <div className="flex items-center gap-3 mb-4">
                <span className="h-[2px] w-10 bg-red-600"></span>
                <span className="text-red-600 font-black uppercase italic tracking-[0.3em] text-[10px]">Staff Technique</span>
              </div>
              <h1 className="text-6xl md:text-8xl font-black text-slate-900 uppercase italic tracking-tighter leading-[0.85]">
                NOS ENTRAÎ<span className="text-red-600">NEURS</span>
              </h1>
              <p className="text-slate-500 font-bold text-sm mt-6 uppercase tracking-widest max-w-md leading-relaxed">
                L'expertise au service de votre performance. Découvrez les encadrants de l'AC Dampicourt.
              </p>
            </div>

            {/* Bouton Admin : Apparition fluide si admin connecté */}
            {isAdmin && (
                <Link href="/infos/entraineurs/modifier" className="animate-in fade-in slide-in-from-right-4 duration-700">
                  <button className="flex items-center gap-3 bg-slate-900 text-white px-8 py-4 rounded-2xl font-black hover:bg-red-600 transition-all text-xs uppercase italic shadow-2xl hover:-translate-y-1 active:scale-95 group">
                    <Edit size={18} className="group-hover:rotate-12 transition-transform" />
                    Gérer le staff
                  </button>
                </Link>
            )}
          </div>

          {/* LISTE DES ENTRAÎNEURS */}
          {trainers.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {trainers.map((t, index) => (
                    <div
                        key={t.id}
                        style={{ animationDelay: `${index * 100}ms` }} // Effet cascade
                        className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100 hover:shadow-[0_20px_50px_rgba(0,0,0,0.05)] hover:border-red-200 hover:bg-white transition-all group animate-in slide-in-from-bottom-4 duration-500 fill-mode-backwards"
                    >
                      <div className="flex items-start justify-between mb-8">
                        {/* Sigle / Initiale */}
                        <div className="bg-slate-900 text-white font-black p-4 rounded-2xl text-xl w-14 h-14 flex items-center justify-center italic group-hover:bg-red-600 group-hover:rotate-6 transition-all duration-300 shadow-lg">
                          {t.sigle}
                        </div>

                        {/* Nom */}
                        <div className="text-right">
                          <h3 className="font-black text-2xl text-slate-900 uppercase italic leading-none group-hover:text-red-600 transition-colors tracking-tighter">
                            {t.name}
                          </h3>
                          <div className="inline-block bg-red-100 text-red-600 text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded-md mt-2">
                            Coach ACD
                          </div>
                        </div>
                      </div>

                      {/* Coordonnées */}
                      <div className="space-y-3 border-t border-slate-200 pt-6">
                        {t.phone && (
                            <div className="flex items-center justify-between group/link">
                              <div className="flex items-center gap-3">
                                <div className="p-2 bg-white rounded-lg border border-slate-100 text-red-600 shadow-sm group-hover/link:bg-red-600 group-hover/link:text-white transition-colors">
                                  <Phone size={14} />
                                </div>
                                <span className="text-xs font-black text-slate-600 uppercase italic tracking-wider">{t.phone}</span>
                              </div>
                            </div>
                        )}

                        {t.email && (
                            <a
                                href={`mailto:${t.email}`}
                                className="flex items-center justify-between group/link cursor-pointer"
                            >
                              <div className="flex items-center gap-3">
                                <div className="p-2 bg-white rounded-lg border border-slate-100 text-red-600 shadow-sm group-hover/link:bg-red-600 group-hover/link:text-white transition-colors">
                                  <Mail size={14} />
                                </div>
                                <span className="text-xs font-black text-slate-600 uppercase italic truncate max-w-[180px] tracking-wider">
                          {t.email}
                        </span>
                              </div>
                              <ArrowRight size={14} className="text-slate-200 group-hover/link:text-red-600 -translate-x-2 opacity-0 group-hover/link:translate-x-0 group-hover/link:opacity-100 transition-all" />
                            </a>
                        )}
                      </div>
                    </div>
                ))}
              </div>
          ) : (
              <div className="text-center py-32 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200 animate-in zoom-in duration-500">
                <Users size={48} className="mx-auto text-slate-200 mb-4" />
                <p className="text-slate-400 font-black italic uppercase tracking-widest text-sm">
                  L'effectif est en cours de mise à jour.
                </p>
              </div>
          )}

          {/* PIED DE PAGE / CTA REJOINDRE */}
          <div className="mt-20 p-10 bg-slate-900 rounded-[3rem] text-center relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:scale-110 transition-transform duration-1000">
              <Users size={200} className="text-white" />
            </div>
            <div className="relative z-10">
              <h4 className="text-white font-black italic uppercase text-2xl mb-2 tracking-tight">Vous souhaitez rejoindre le staff ?</h4>
              <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.3em]">Contactez le secrétariat technique du club</p>
            </div>
          </div>
        </main>
      </div>
  );
}