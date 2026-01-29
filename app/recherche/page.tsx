"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { User, Search as SearchIcon, Loader2, Trophy, ShieldCheck, HardHat } from "lucide-react";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q");

  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // --- LOGIQUE DE FUSION UNIVERSELLE ---
  const createUnificationKey = (text1: string, text2: string = "") => {
    return (text1 + text2)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z]/g, "")
    .split('')
    .sort()
    .join('');
  };

  useEffect(() => {
    const fetchGlobalSearch = async () => {
      if (!query) return;
      setLoading(true);

      try {
        const [athletesRes, coachesRes, officialsRes] = await Promise.all([
          supabase.from("athletes").select("*").or(`nom.ilike.%${query}%,prenom.ilike.%${query}%`),
          supabase.from("trainers").select("*").ilike("name", `%${query}%`),
          supabase.from("officials").select("*").ilike("name", `%${query}%`)
        ]);

        const merged: { [key: string]: any } = {};

        athletesRes.data?.forEach(item => {
          const key = createUnificationKey(item.nom, item.prenom);
          merged[key] = {
            ...item,
            roles: ['athlete'],
            dispNom: item.nom.toUpperCase(),
            dispPrenom: item.prenom
          };
        });

        coachesRes.data?.forEach(item => {
          const key = createUnificationKey(item.name);
          if (merged[key]) {
            if (!merged[key].roles.includes('entraineur')) merged[key].roles.push('entraineur');
            if (item.specialite) merged[key].specialite = item.specialite;
          } else {
            const parts = item.name.split(" ");
            merged[key] = {
              ...item,
              roles: ['entraineur'],
              dispPrenom: parts[0],
              dispNom: parts.slice(1).join(" ").toUpperCase()
            };
          }
        });

        officialsRes.data?.forEach(item => {
          const key = createUnificationKey(item.name);
          if (merged[key]) {
            if (!merged[key].roles.includes('officiel')) merged[key].roles.push('officiel');
            if (item.grade) merged[key].grade = item.grade;
          } else {
            const parts = item.name.split(" ");
            merged[key] = {
              ...item,
              roles: ['officiel'],
              dispNom: parts[0].toUpperCase(),
              dispPrenom: parts.slice(1).join(" ")
            };
          }
        });

        setResults(Object.values(merged).sort((a, b) => a.dispNom.localeCompare(b.dispNom)));
      } catch (err) {
        console.error("Search error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchGlobalSearch();
  }, [query]);

  return (
      <main className="container mx-auto px-4 pt-32 pb-20 min-h-screen bg-transparent animate-in fade-in duration-700">

        {/* HEADER FLUIDE */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div className="flex items-center gap-6">
            <div className="bg-red-600 p-4 rounded-2xl shadow-xl shadow-red-200">
              <SearchIcon className="text-white" size={28} />
            </div>
            <div>
              <span className="text-red-600 font-black uppercase italic tracking-[0.3em] text-[10px] mb-2 block">Base de données membres</span>
              <h1 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter text-slate-900 leading-none">
                RÉSULTATS : <span className="text-red-600">"{query}"</span>
              </h1>
              <p className="text-slate-400 font-bold text-[10px] mt-2 uppercase tracking-widest">
                {results.length} membre(s) identifié(s)
              </p>
            </div>
          </div>
        </div>

        {loading ? (
            <div className="flex flex-col items-center justify-center py-40 gap-4 bg-white/30 backdrop-blur-md rounded-[3rem] border border-white">
              <Loader2 className="animate-spin text-red-600" size={48} />
              <p className="text-slate-500 font-black uppercase italic text-xs tracking-widest">Recherche en cours...</p>
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.map((person, index) => (
                  <div
                      key={index}
                      className="group bg-white/70 backdrop-blur-md border border-white p-8 rounded-[2.5rem] shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 flex flex-col justify-between overflow-hidden relative"
                  >
                    {/* Effet de brillance au survol */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-600 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                    <div>
                      <div className="flex justify-between items-start mb-10">
                        <div className={`p-4 rounded-2xl shadow-inner ${
                            person.roles?.includes('entraineur') ? 'bg-blue-600 text-white shadow-blue-200' :
                                person.roles?.includes('officiel') ? 'bg-amber-500 text-white shadow-amber-200' : 'bg-slate-900 text-white'
                        }`}>
                          <User size={24} />
                        </div>

                        {/* BADGES ROLES EPURÉS */}
                        <div className="flex flex-col items-end gap-1.5">
                          {person.roles?.sort().map((role: string) => (
                              <span key={role} className={`text-[8px] font-black px-3 py-1.5 rounded-lg uppercase italic tracking-widest flex items-center gap-2 shadow-sm ${
                                  role === 'athlete' ? 'bg-red-600 text-white' :
                                      role === 'entraineur' ? 'bg-blue-600 text-white' : 'bg-amber-500 text-white'
                              }`}>
                        {role === 'athlete' && <Trophy size={10}/>}
                                {role === 'entraineur' && <HardHat size={10}/>}
                                {role === 'officiel' && <ShieldCheck size={10}/>}
                                {role}
                      </span>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h3 className="text-2xl font-black uppercase italic text-slate-900 leading-none tracking-tighter group-hover:text-red-600 transition-colors">
                          {person.dispPrenom} <br />
                          <span className="text-3xl">{person.dispNom}</span>
                        </h3>

                        <div className="flex flex-wrap gap-2 pt-2">
                          {person.num_dossard && (
                              <span className="text-[9px] font-black text-red-600 bg-red-50 px-3 py-1.5 rounded-full uppercase italic border border-red-100">
                        Dossard: {person.num_dossard}
                      </span>
                          )}
                          {person.specialite && (
                              <span className="text-[9px] font-black text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full uppercase italic border border-blue-100">
                        {person.specialite}
                      </span>
                          )}
                          {person.grade && (
                              <span className="text-[9px] font-black text-amber-600 bg-amber-50 px-3 py-1.5 rounded-full uppercase italic border border-amber-100">
                        {person.grade}
                      </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* FOOTER DE CARTE ATHLÈTE */}
                    {person.roles?.includes('athlete') && (
                        <div className="mt-10 flex items-center gap-6 border-t border-slate-100 pt-6">
                          <div>
                            <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Catégorie</p>
                            <p className="font-black text-slate-900 italic text-xs uppercase tracking-tighter">{person.categorie || "—"}</p>
                          </div>
                          <div className="h-8 w-px bg-slate-100" />
                          <div>
                            <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Année</p>
                            <p className="font-black text-slate-900 italic text-xs tracking-tighter">{person.annee_naissance || "—"}</p>
                          </div>
                        </div>
                    )}
                  </div>
              ))}
            </div>
        )}

        {/* ÉTAT VIDE DESIGNÉ */}
        {!loading && results.length === 0 && (
            <div className="text-center py-40 bg-white/50 backdrop-blur-md rounded-[3rem] border border-white shadow-xl">
              <div className="bg-slate-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <SearchIcon className="text-slate-300" size={32} />
              </div>
              <p className="text-slate-400 font-black uppercase italic tracking-[0.3em] text-sm">
                Aucun membre trouvé pour <span className="text-red-600">"{query}"</span>
              </p>
              <button onClick={() => window.history.back()} className="mt-8 text-xs font-black uppercase italic text-red-600 hover:underline">
                ← Retourner à l'accueil
              </button>
            </div>
        )}
      </main>
  );
}