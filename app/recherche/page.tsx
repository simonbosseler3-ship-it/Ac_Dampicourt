"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { User, Search as SearchIcon, Loader2 } from "lucide-react";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q");

  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAthletes = async () => {
      if (!query) return;
      setLoading(true);

      const { data, error } = await supabase
      .from("athletes")
      .select("*")
      .or(`nom.ilike.%${query}%,prenom.ilike.%${query}%`)
      .order("nom", { ascending: true });

      if (!error) setResults(data || []);
      setLoading(false);
    };

    fetchAthletes();
  }, [query]);

  return (
      <main className="container mx-auto px-4 pt-32 pb-20 min-h-screen">
        {/* HEADER DE RECHERCHE */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div className="flex items-center gap-4">
            <div className="bg-red-600 p-3 rounded-2xl shadow-lg shadow-red-200">
              <SearchIcon className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-3xl font-black uppercase italic tracking-tighter text-slate-900">
                Résultats pour : <span className="text-red-600">"{query}"</span>
              </h1>
              <p className="text-slate-500 font-medium">
                {results.length} athlète(s) trouvé(s)
              </p>
            </div>
          </div>
        </div>

        {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <Loader2 className="animate-spin text-red-600" size={40} />
              <p className="text-slate-400 font-black uppercase italic text-xs tracking-widest">
                Recherche en cours...
              </p>
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.map((athlete) => (
                  <div
                      key={athlete.id}
                      className="group relative bg-white border border-slate-100 p-6 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex justify-between items-start mb-4">
                        <div className="bg-slate-100 p-3 rounded-2xl">
                          <User className="text-slate-400" size={24} />
                        </div>
                        {athlete.num_dossard && (
                            <span className="bg-slate-900 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase italic">
                      Dossard: {athlete.num_dossard}
                    </span>
                        )}
                      </div>

                      <div className="space-y-1">
                        <h3 className="text-xl font-black uppercase italic text-slate-900">
                          {athlete.prenom} {athlete.nom}
                        </h3>
                        {/* Affichage du numéro LIFE uniquement à titre informatif si besoin */}
                        {athlete.life_number && (
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">
                              ID: {athlete.life_number}
                            </p>
                        )}
                      </div>
                    </div>

                    {/* INFOS SPORTIVES COMPLÉMENTAIRES */}
                    <div className="mt-6 flex items-center gap-4 border-t border-slate-50 pt-4">
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">
                          Catégorie
                        </p>
                        <p className="font-bold text-slate-700 italic">
                          {athlete.categorie || "N/A"}
                        </p>
                      </div>
                      <div className="border-l border-slate-100 pl-4">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">
                          Année
                        </p>
                        <p className="font-bold text-slate-700 italic">
                          {athlete.annee_naissance || "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>
              ))}
            </div>
        )}

        {/* ÉTAT SI AUCUN RÉSULTAT */}
        {!loading && results.length === 0 && (
            <div className="text-center py-20 bg-slate-50 rounded-[40px] border-2 border-dashed border-slate-200">
              <p className="text-slate-400 font-bold italic">
                Aucun athlète trouvé pour cette recherche.
              </p>
            </div>
        )}
      </main>
  );
}