'use client'

import { Trash2, AlertTriangle, Loader2 } from "lucide-react"
import { useState } from "react"
import { deleteTopic } from "@/actions/user-actions"

export function DeleteTopicButton({ topicId }: { topicId: string }) {
  const [isOpen, setIsOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const openModal = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOpen(true);
  }

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation(); // CRUCIAL : empêche le lien de s'ouvrir au moment de confirmer

    setIsDeleting(true)
    const result = await deleteTopic(topicId)

    if (result?.error) {
      alert("Erreur: " + result.error)
      setIsDeleting(false)
    } else {
      setIsOpen(false)
    }
  }

  return (
      <>
        <button
            onClick={openModal}
            className="p-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all z-40 relative"
        >
          <Trash2 size={18} />
        </button>

        {isOpen && (
            <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
              <div
                  className="bg-white rounded-[2rem] p-8 max-w-sm w-full shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200"
                  onClick={(e) => e.stopPropagation()}
              >
                <div className="w-16 h-16 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center mb-6">
                  <AlertTriangle size={32} />
                </div>

                <h3 className="text-2xl font-black uppercase italic text-slate-900 mb-2">
                  Supprimer le <span className="text-red-600">Sujet ?</span>
                </h3>
                <p className="text-slate-500 font-medium mb-8">
                  Cette action supprimera également tous les messages liés en base de données.
                </p>

                <div className="flex gap-3">
                  <button
                      disabled={isDeleting}
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsOpen(false); }}
                      className="flex-1 py-4 rounded-xl font-bold text-slate-500 hover:bg-slate-100 transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                      disabled={isDeleting}
                      onClick={handleDelete}
                      className="flex-1 py-4 bg-red-600 text-white rounded-xl font-black uppercase italic tracking-widest hover:bg-slate-900 transition-all flex items-center justify-center"
                  >
                    {isDeleting ? <Loader2 className="animate-spin" size={20} /> : "Confirmer"}
                  </button>
                </div>
              </div>
            </div>
        )}
      </>
  )
}