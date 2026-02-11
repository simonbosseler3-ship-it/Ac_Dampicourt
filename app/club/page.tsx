"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/app/context/authContext";
import { Phone, Mail, MapPin, Edit, Loader2, Users, Trophy, Activity, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function ClubPage() {
  const { profile } = useAuth();
  const [info, setInfo] = useState<any>(null);
  const [comite, setComite] = useState<any[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  const isAdmin = profile?.role?.toLowerCase().trim() === 'admin';

  useEffect(() => {
    async function fetchData() {
      try {
        const [infoRes, comiteRes] = await Promise.all([
          supabase.from('club_info').select('*').single(),
          supabase.from('club_comite').select('*').order('order_index', { ascending: true })
        ]);

        if (infoRes.data) setInfo(infoRes.data);
        if (comiteRes.data) setComite(comiteRes.data);
      } catch (err) {
        console.error("Erreur chargement données:", err);
      } finally {
        setDataLoading(false);
      }
    }
    fetchData();
  }, []);

  if (dataLoading) {
    return (
        <div className="min-h-screen bg-slate-200 flex items-center justify-center">
          <Loader2 className="animate-spin text-red-600" size={40} />
        </div>
    );
  }

  return (
      <div className="min-h-screen">
        <main className="container mx-auto px-4 py-12 pt-32 pb-32">

          {/* HEADER AVEC TITRE RESPONSIVE */}
          <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-16">
            <div className="flex flex-col max-w-full">
              <h1 className="text-4xl sm:text-5xl md:text-7xl font-black text-slate-900 uppercase italic leading-[0.9] tracking-tighter break-words">
                L'Athlétic Club <br/>
                <span className="text-red-600">Dampicourt</span>
              </h1>
              <div className="h-2 w-32 bg-red-600 mt-4 shadow-lg shadow-red-200"></div>
            </div>

            {isAdmin && (
                <Link href="/club/modifier" className="w-full md:w-auto">
                  <button className="w-full flex items-center justify-center gap-3 bg-slate-900 text-white px-8 py-4 rounded-2xl font-black hover:bg-red-600 transition-all text-xs uppercase italic shadow-xl">
                    <Edit size={16}/> Modifier la page
                  </button>
                </Link>
            )}
          </div>

          {/* PRÉSENTATION & CHIFFRES */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20 animate-in fade-in duration-700">
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-white p-8 md:p-12 rounded-[2.5rem] border border-slate-300 shadow-xl">
                <p className="whitespace-pre-wrap text-slate-600 leading-relaxed font-medium italic text-lg mb-8">
                  {info?.history_text}
                </p>
                <p className="italic border-l-8 border-red-600 pl-6 bg-slate-50 py-6 font-black text-xl md:text-2xl text-slate-800 rounded-r-2xl">
                  "{info?.quote_text}"
                </p>
              </div>
            </div>

            <div className="bg-slate-900 text-white p-10 rounded-[2.5rem] shadow-2xl h-fit relative overflow-hidden group">
              <Trophy className="absolute -right-8 -bottom-8 text-white/5 w-48 h-48 -rotate-12 group-hover:rotate-0 transition-transform duration-700" />
              <h3 className="text-xl font-black uppercase italic mb-8 text-red-600 tracking-widest flex items-center gap-2">
                <Activity size={20}/> En quelques chiffres
              </h3>
              <ul className="space-y-6 font-black uppercase italic text-sm relative z-10">
                {[
                  { label: "Licenciés", val: "~400" },
                  { label: "Entraîneurs", val: "30+" },
                  { label: "Officiels", val: "50" },
                  { label: "Compétitions / an", val: "15+" }
                ].map((stat, i) => (
                    <li key={i} className="flex justify-between border-b border-white/10 pb-3">
                      <span className="opacity-60">{stat.label}</span>
                      <span className="text-red-600 text-lg">{stat.val}</span>
                    </li>
                ))}
              </ul>
            </div>
          </div>

          {/* SECTION STADE */}
          <div className="mb-24">
            <div className="flex items-center gap-4 mb-8">
              <h2 className="text-3xl md:text-4xl font-black text-slate-900 uppercase italic">Piste <span className="text-red-600">Daniel Thiry</span></h2>
              <div className="h-[2px] grow bg-slate-300 hidden sm:block"></div>
            </div>

            <p className="inline-flex items-center gap-3 bg-white px-5 py-2 rounded-full border border-slate-300 shadow-sm text-slate-500 font-black uppercase text-[10px] tracking-widest mb-10">
              <MapPin size={14} className="text-red-600"/> {info?.stade_location}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { title: "Piste", desc: "Piste synthétique 8 couloirs." },
                { title: "Sautoirs", desc: "Sautoir en longueur et piste de survitesse en Mondo (2010)." },
                { title: "Endurance", desc: "Circuit de copeaux de 1 km pour l'entraînement (2006)." },
                { title: "Perche", desc: "Portique multifonctionnel pour l'entraînement (2010)." },
                { title: "Musculation", desc: "Salle de musculation intérieur équipée" },
                { title: "Cage de lancer", desc: "Cages de lancers équipées" }
              ].map((item, idx) => (
                  <div key={idx} className="p-8 bg-white rounded-[2rem] border border-slate-300 hover:border-red-600 transition-all group shadow-sm hover:shadow-xl">
                    <h3 className="text-red-600 font-black text-lg uppercase italic mb-2 tracking-tighter group-hover:scale-105 transition-transform origin-left">{item.title}</h3>
                    <p className="text-slate-500 text-xs font-bold leading-relaxed">{item.desc}</p>
                  </div>
              ))}
            </div>
          </div>

          {/* SECTION COMITÉ */}
          <div>
            <div className="flex items-center gap-4 mb-12">
              <h2 className="text-3xl md:text-4xl font-black text-slate-900 uppercase italic">Le Bureau du <span className="text-red-600">Comité</span></h2>
              <div className="h-[2px] grow bg-slate-300 hidden sm:block"></div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {comite.map((member) => (
                  <div key={member.id} className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-300 hover:shadow-2xl transition-all hover:-translate-y-2 flex flex-col justify-between">
                    <div>
                      <span className="text-[9px] font-black uppercase tracking-widest text-red-600 italic block mb-3 bg-red-50 px-3 py-1 rounded-full w-fit">{member.role}</span>
                      <h3 className="text-xl font-black text-slate-900 uppercase italic leading-tight mb-8">{member.name}</h3>
                    </div>
                    <div className="space-y-4 pt-6 border-t border-slate-100">
                      <a href={`tel:${member.tel}`} className="flex items-center gap-3 text-[10px] font-black text-slate-400 hover:text-red-600 transition-colors uppercase italic tracking-widest">
                        <Phone size={14} className="text-red-600"/> {member.tel}
                      </a>
                      <a href={`mailto:${member.email}`} className="flex items-center gap-3 text-[10px] font-black text-slate-400 hover:text-red-600 transition-colors truncate uppercase italic tracking-widest">
                        <Mail size={14} className="text-red-600"/> {member.email}
                      </a>
                    </div>
                  </div>
              ))}
            </div>

            {/* BOX COORDINATEUR */}
            <div className="bg-slate-900 rounded-[3rem] p-10 flex flex-col md:flex-row justify-between items-center gap-8 border border-white/5 shadow-2xl relative overflow-hidden group">
              <ShieldCheck className="absolute right-10 top-1/2 -translate-y-1/2 text-white/5 w-40 h-40 group-hover:scale-110 transition-transform duration-700" />
              <div className="relative z-10 text-center md:text-left">
                <span className="text-[10px] font-black text-red-600 uppercase tracking-[0.3em] block mb-2">Responsable Technique Jeunesse</span>
                <h4 className="text-3xl font-black italic uppercase text-white">Coordinateur <span className="text-red-600">KBPM</span></h4>
              </div>
              <div className="relative z-10 bg-white/5 backdrop-blur-md px-8 py-4 rounded-2xl border border-white/10">
                <span className="text-2xl font-black italic uppercase text-white underline decoration-red-600 decoration-4 underline-offset-8">
                  {info?.kbpm_coordinator}
                </span>
              </div>
            </div>
          </div>
        </main>
      </div>
  );
}