"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/app/context/authContext";
import { Edit, Loader2, Award, Scale, HelpCircle, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function OfficielsPage() {
  const { profile } = useAuth();
  const [officials, setOfficials] = useState<any[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  // Détection du rôle admin sans bloquer le rendu
  const isAdmin = profile?.role?.toLowerCase().trim() === 'admin';

  useEffect(() => {
    async function fetchOfficials() {
      try {
        const { data, error } = await supabase
        .from('officials')
        .select('*')
        .order('name');

        if (error) throw error;
        setOfficials(data || []);
      } catch (err) {
        console.error("Erreur chargement officiels:", err);
      } finally {
        setDataLoading(false);
      }
    }

    fetchOfficials();
  }, []);

  if (dataLoading) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-white gap-4">
          <Loader2 className="animate-spin text-red-600" size={40} />
          <p className="text-[10px] font-black uppercase italic tracking-[0.3em] text-slate-400">Initialisation du jury...</p>
        </div>
    );
  }

  return (
      <div className="min-h-screen">
        <main className="container mx-auto px-4 py-12 pt-32 pb-24 animate-in fade-in duration-700">

          {/* HEADER SECTION */}
          <div className="flex flex-col lg:flex-row justify-between items-end mb-16 gap-8">
            <div className="max-w-2xl">
              <div className="flex items-center gap-3 mb-4">
                <span className="h-[2px] w-10 bg-red-600"></span>
                <span className="text-red-600 font-black uppercase italic tracking-[0.3em] text-[10px]">Régularité & Équité</span>
              </div>
              <h1 className="text-6xl md:text-8xl font-black text-slate-900 uppercase italic tracking-tighter leading-[0.85]">
                NOS <span className="text-red-600">OFFICIELS</span>
              </h1>
              <p className="text-slate-500 font-bold text-sm mt-6 uppercase tracking-widest max-w-md leading-relaxed">
                Garants de la conformité des performances et du respect des règles fédérales sur le terrain.
              </p>
            </div>

            {/* Bouton Admin conditionnel */}
            {isAdmin && (
                <Link href="/infos/officiels/modifier" className="animate-in slide-in-from-right-4 duration-700">
                  <button className="flex items-center gap-3 bg-slate-900 text-white px-8 py-4 rounded-2xl font-black hover:bg-red-600 transition-all text-[10px] uppercase italic shadow-2xl active:scale-95 group">
                    <Edit size={16} className="group-hover:rotate-12 transition-transform" />
                    Gérer le jury
                  </button>
                </Link>
            )}
          </div>

          {/* LISTE OFFICIELS - BLOC NOIR ACD */}
          <section className="mb-24 bg-slate-900 rounded-[3rem] p-10 md:p-20 text-white shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] relative overflow-hidden group">
            {/* Décoration de fond */}
            <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none group-hover:scale-110 transition-transform duration-[2000ms]">
              <Award size={300} />
            </div>

            <div className="relative z-10">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-16 border-b border-white/10 pb-10">
                <div>
                  <h2 className="text-3xl md:text-5xl font-black uppercase italic text-white tracking-tighter">
                    L'ÉQUIPE <span className="text-red-600">JUGE & ARBITRE</span>
                  </h2>
                  <p className="text-red-600 font-black uppercase tracking-[0.3em] text-[10px] mt-2 italic">
                    Le cœur battant des compétitions
                  </p>
                </div>
                <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/10 backdrop-blur-md">
                  <Scale className="text-red-600" size={24} />
                  <div className="text-left">
                    <div className="text-[14px] font-black italic uppercase leading-none">{officials.length}</div>
                    <div className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Membres actifs</div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-6">
                {officials.map((off, index) => (
                    <div
                        key={off.id}
                        style={{ animationDelay: `${index * 50}ms` }}
                        className="animate-in fade-in slide-in-from-left-4 fill-mode-backwards"
                    >
                      <div className="flex items-center gap-3 group/name cursor-default">
                        <span className="h-4 w-[2px] bg-red-600 group-hover:h-6 transition-all duration-300"></span>
                        <span className="text-[12px] font-black uppercase italic tracking-wider text-slate-300 group-hover:text-white transition-colors">
                      {off.name}
                    </span>
                      </div>
                    </div>
                ))}
              </div>

              {officials.length === 0 && (
                  <div className="py-10 text-center border-2 border-dashed border-white/10 rounded-3xl">
                    <p className="text-slate-500 font-bold italic uppercase text-xs tracking-widest">Aucun officiel répertorié pour le moment.</p>
                  </div>
              )}
            </div>
          </section>

          {/* FAQ - DESIGN MODERNE */}
          <section className="max-w-4xl mx-auto">
            <div className="flex items-center gap-4 mb-12">
              <div className="p-3 bg-slate-900 rounded-xl text-white shadow-lg">
                <HelpCircle size={24}/>
              </div>
              <div>
                <h2 className="text-3xl font-black text-slate-900 uppercase italic tracking-tighter leading-none">Questions Fréquentes</h2>
                <p className="text-[10px] font-black text-red-600 uppercase tracking-widest mt-1">Devenir Officiel à l'ACD</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-slate-50 p-10 rounded-[2.5rem] border border-slate-100 hover:border-red-200 transition-all group">
                <div className="mb-6 bg-white w-12 h-12 rounded-xl flex items-center justify-center shadow-sm group-hover:bg-red-600 transition-colors">
                  <CheckCircle2 className="text-red-600 group-hover:text-white transition-colors" size={24} />
                </div>
                <h3 className="font-black uppercase italic text-slate-900 mb-4 text-xl tracking-tight">Quel est son rôle ?</h3>
                <p className="text-slate-500 leading-relaxed text-sm font-medium">
                  Encadrer les concours et courses, juger du respect des règles et faire respecter les règlements de la fédération internationale et nationale (LBFA).
                </p>
              </div>

              <div className="bg-slate-50 p-10 rounded-[2.5rem] border border-slate-100 hover:border-red-200 transition-all group">
                <div className="mb-6 bg-white w-12 h-12 rounded-xl flex items-center justify-center shadow-sm group-hover:bg-red-600 transition-colors">
                  <Award className="text-red-600 group-hover:text-white transition-colors" size={24} />
                </div>
                <h3 className="font-black uppercase italic text-slate-900 mb-4 text-xl tracking-tight">Y a-t-il une formation ?</h3>
                <p className="text-slate-500 leading-relaxed text-sm font-medium">
                  Un syllabus succinct à assimiler, une formation pratique sur le terrain lors des compétitions et un test de contrôle amical organisé en début de saison.
                </p>
              </div>
            </div>

            <div className="mt-16 p-8 bg-red-50 rounded-[2.5rem] border border-red-100 text-center">
              <p className="text-red-600 font-black uppercase italic text-sm mb-2">Envie de rejoindre le jury ?</p>
              <p className="text-slate-600 text-xs font-bold uppercase tracking-widest">Parlez-en à un membre du comité lors du prochain entraînement.</p>
            </div>
          </section>
        </main>
      </div>
  );
}