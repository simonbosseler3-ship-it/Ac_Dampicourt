"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/app/context/authContext";
import { Mail, Phone, Edit } from "lucide-react";
import Link from "next/link";

export default function EntraineursPage() {
  const { profile, loading: authLoading } = useAuth(); // Récupération instantanée du rôle admin
  const [trainers, setTrainers] = useState<any[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

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
        setDataLoading(false);
      }
    }

    fetchTrainers();
  }, []);

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
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-6">
            <div className="flex flex-col">
              <h1 className="text-4xl font-black text-slate-900 uppercase italic">
                Nos <span className="text-red-600">Entraîneurs</span>
              </h1>
              <div className="h-2 w-24 bg-red-600 mt-2"></div>
            </div>

            {/* Le bouton apparaît dès que l'auth est confirmée, sans rechargement de page */}
            {!authLoading && isAdmin && (
                <Link href="/infos/entraineurs/modifier">
                  <button className="flex items-center gap-2 bg-slate-900 text-white px-6 py-2 rounded-full font-bold hover:bg-red-600 transition-all text-xs uppercase italic shadow-lg active:scale-95">
                    <Edit size={16}/> Gérer les entraîneurs
                  </button>
                </Link>
            )}
          </div>

          {/* LISTE DES ENTRAÎNEURS */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trainers.map((t) => (
                <div
                    key={t.id}
                    className="bg-slate-50 p-6 rounded-3xl border border-slate-100 hover:shadow-xl hover:border-red-100 transition-all group animate-in slide-in-from-bottom-2 duration-500"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="bg-red-600 text-white font-black p-3 rounded-xl text-lg w-12 h-12 flex items-center justify-center italic group-hover:scale-110 transition-transform">
                      {t.sigle}
                    </div>
                    <div className="text-right">
                      <h3 className="font-black text-slate-900 uppercase italic leading-tight group-hover:text-red-600 transition-colors">
                        {t.name}
                      </h3>
                      <p className="text-[10px] font-bold text-red-600 uppercase tracking-widest mt-1">Entraîneur</p>
                    </div>
                  </div>

                  <div className="space-y-2 border-t border-slate-200 pt-4">
                    {t.phone && (
                        <p className="text-xs font-bold text-slate-500 flex items-center gap-2">
                          <Phone size={14} className="text-red-600"/> {t.phone}
                        </p>
                    )}
                    {t.email && (
                        <a
                            href={`mailto:${t.email}`}
                            className="text-xs font-bold text-slate-500 flex items-center gap-2 hover:text-red-600 transition-colors truncate"
                        >
                          <Mail size={14} className="text-red-600"/> {t.email}
                        </a>
                    )}
                  </div>
                </div>
            ))}
          </div>

          {/* Message si aucun entraîneur n'est trouvé */}
          {!dataLoading && trainers.length === 0 && (
              <div className="text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                <p className="text-slate-400 font-bold italic uppercase">Aucun entraîneur répertorié pour le moment.</p>
              </div>
          )}
        </main>
      </div>
  );
}