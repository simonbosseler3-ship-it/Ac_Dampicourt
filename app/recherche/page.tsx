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

        // 1. ATHLÈTES
        athletesRes.data?.forEach(item => {
          const key = createUnificationKey(item.nom, item.prenom);
          merged[key] = {
            ...item,
            roles: ['athlete'],
            dispNom: item.nom.toUpperCase(),
            dispPrenom: item.prenom
          };
        });

        // 2. ENTRAÎNEURS
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

        // 3. OFFICIELS
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
      <main className="container mx-auto px-4 pt-24 pb-20 min-h-screen bg-slate-50/20">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div className="flex items-center gap-4">
            <div className="bg-red-600 p-3 rounded-2xl shadow-xl shadow-red-100">
              <SearchIcon className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-3xl font-black uppercase italic tracking-tighter text-slate-900 leading-none">
                Résultats : <span className="text-red-600">"{query}"</span>
              </h1>
              <p className="text-slate-500 font-bold text-xs mt-1 uppercase tracking-[0.2em]">
                {results.length} membre(s) trouvé(s)
              </p>
            </div>
          </div>
        </div>

        {loading ? (
            <div className="flex flex-col items-center justify-center py-32 gap-4">
              <Loader2 className="animate-spin text-red-600" size={40} />
              <p className="text-slate-400 font-black uppercase italic text-[10px] tracking-[0.3em]">Chargement...</p>
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {results.map((person, index) => (
                  <div
                      key={index}
                      className="group relative bg-white border border-slate-100 p-7 rounded-[2.5rem] shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col justify-between overflow-hidden"
                  >
                    <div>
                      <div className="flex justify-between items-start mb-8">
                        <div className={`p-4 rounded-2xl ${
                            person.roles?.includes('entraineur') ? 'bg-blue-50 text-blue-600' :
                                person.roles?.includes('officiel') ? 'bg-amber-50 text-amber-600' : 'bg-slate-50 text-slate-400'
                        }`}>
                          <User size={28} />
                        </div>

                        {/* LISTE DES BADGES */}
                        <div className="flex flex-col items-end gap-1.5">
                          {person.roles?.sort().map((role: string) => (
                              <div key={role}>
                                {role === 'athlete' && (
                                    <span className="bg-red-600 text-white text-[9px] font-black px-3 py-1.5 rounded-lg uppercase italic flex items-center gap-1.5 shadow-md shadow-red-50">
                            <Trophy size={11}/> Athlète
                          </span>
                                )}
                                {role === 'entraineur' && (
                                    <span className="bg-blue-600 text-white text-[9px] font-black px-3 py-1.5 rounded-lg uppercase italic flex items-center gap-1.5 shadow-md shadow-blue-50">
                            <HardHat size={11}/> Entraîneur
                          </span>
                                )}
                                {role === 'officiel' && (
                                    <span className="bg-amber-500 text-white text-[9px] font-black px-3 py-1.5 rounded-lg uppercase italic flex items-center gap-1.5 shadow-md shadow-amber-50">
                            <ShieldCheck size={11}/> Officiel
                          </span>
                                )}
                              </div>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h3 className="text-2xl font-black uppercase italic text-slate-900 leading-none tracking-tighter">
                          {person.dispPrenom} <span className="text-red-600">{person.dispNom}</span>
                        </h3>

                        <div className="flex flex-wrap gap-2">
                          {person.num_dossard && (
                              <span className="text-[10px] font-black text-red-600 bg-red-50 px-3 py-1 rounded-full uppercase border border-red-100 italic">
                        Dossard: {person.num_dossard}
                      </span>
                          )}
                          {person.specialite && (
                              <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-full uppercase border border-blue-100 italic">
                        {person.specialite}
                      </span>
                          )}
                          {person.grade && (
                              <span className="text-[10px] font-black text-amber-600 bg-amber-50 px-3 py-1 rounded-full uppercase border border-amber-100 italic">
                        {person.grade}
                      </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* INFOS ATHLÈTE */}
                    {person.roles?.includes('athlete') && (
                        <div className="mt-8 flex items-center gap-8 border-t border-slate-50 pt-6">
                          <div>
                            <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1.5">Catégorie</p>
                            <p className="font-black text-slate-700 italic text-sm leading-none">{person.categorie || "—"}</p>
                          </div>
                          <div className="border-l border-slate-100 pl-8">
                            <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1.5">Année</p>
                            <p className="font-black text-slate-700 italic text-sm leading-none">{person.annee_naissance || "—"}</p>
                          </div>
                        </div>
                    )}
                  </div>
              ))}
            </div>
        )}

        {/* ETAT VIDE */}
        {!loading && results.length === 0 && (
            <div className="text-center py-40 bg-white rounded-[3rem] border border-slate-50">
              <p className="text-slate-400 font-black uppercase italic tracking-widest text-sm">
                Aucun résultat trouvé
              </p>
            </div>
        )}
      </main>
  );
}