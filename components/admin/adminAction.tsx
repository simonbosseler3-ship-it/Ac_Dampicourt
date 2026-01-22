"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { Trash2, Edit, AlertTriangle } from "lucide-react";
import Link from "next/link";

export function AdminActions({ id }: { id: string, name?: string }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);

    const { error } = await supabase.from('athletes').delete().eq('id', id);

    if (error) {
      alert("Erreur lors de la suppression de l'athlète");
      setIsDeleting(false);
    } else {
      setShowConfirm(false);
      router.refresh();
      // Si on est sur la fiche de l'athlète, on redirige vers la recherche
      if (window.location.pathname.includes(id)) {
        router.push("/recherche");
      }
    }
  };

  return (
      <>
        <div className="flex gap-2">
          {/* BOUTON MODIFIER */}
          <Link
              href={`/athletes/modifier/${id}`}
              className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 shadow-lg transition-transform active:scale-95 flex items-center justify-center"
          >
            <Edit size={16} />
          </Link>

          {/* BOUTON SUPPRIMER */}
          <button
              onClick={() => setShowConfirm(true)}
              className="bg-slate-900 text-white p-2 rounded-lg hover:bg-red-600 shadow-lg transition-all active:scale-95 flex items-center justify-center"
          >
            <Trash2 size={16} />
          </button>
        </div>

        {/* MODALE DE CONFIRMATION */}
        {showConfirm && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <div
                  className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                  onClick={() => !isDeleting && setShowConfirm(false)}
              />

              <div className="relative bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl border border-slate-100 animate-in fade-in zoom-in duration-200">
                <div className="flex flex-col items-center text-center">
                  <div className="bg-red-50 p-4 rounded-full mb-4">
                    <AlertTriangle className="h-8 w-8 text-red-600" />
                  </div>

                  <h3 className="text-xl font-black italic uppercase text-slate-900 mb-2">
                    Supprimer l'athlète ?
                  </h3>

                  <p className="text-slate-500 text-sm mb-8">
                    Voulez-vous vraiment supprimer cet athlète ? Toutes ses performances et données seront effacées.
                  </p>

                  <div className="flex gap-3 w-full">
                    <button
                        onClick={() => setShowConfirm(false)}
                        disabled={isDeleting}
                        className="flex-1 px-4 py-3 rounded-xl font-bold text-slate-600 hover:bg-slate-100 transition-colors disabled:opacity-50"
                    >
                      Annuler
                    </button>
                    <button
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="flex-1 px-4 py-3 rounded-xl font-bold bg-red-600 text-white hover:bg-red-700 transition-all shadow-lg shadow-red-200 disabled:opacity-50 flex justify-center items-center"
                    >
                      {isDeleting ? (
                          <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                          "Supprimer"
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
        )}
      </>
  );
}