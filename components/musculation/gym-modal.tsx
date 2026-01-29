"use client";

import { createPortal } from "react-dom";
import { AlertTriangle, Info, LogIn } from "lucide-react";
import { useEffect, useState } from "react";

interface GymModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  type: "auth" | "confirm_delete" | "full";
  loading?: boolean;
}

export function GymModal({ isOpen, onClose, onConfirm, type, loading }: GymModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen || !mounted) return null;

  const content = {
    auth: {
      icon: <LogIn className="h-8 w-8 text-red-600" />,
      title: "Connexion requise",
      desc: "Vous devez être connecté pour réserver un créneau à la salle de muscu.",
      confirmText: "Se connecter",
      confirmColor: "bg-red-600 hover:bg-red-700",
      action: () => (window.location.href = "/login"),
    },
    confirm_delete: {
      icon: <AlertTriangle className="h-8 w-8 text-red-600" />,
      title: "Annuler la séance ?",
      desc: "Voulez-vous vraiment supprimer votre réservation pour ce créneau ?",
      confirmText: "Confirmer l'annulation",
      confirmColor: "bg-red-600 hover:bg-red-700",
      action: onConfirm,
    },
    full: {
      icon: <Info className="h-8 w-8 text-slate-600" />,
      title: "Créneau complet",
      desc: "Désolé, la limite de 8 athlètes a été atteinte pour cette heure.",
      confirmText: "Compris",
      confirmColor: "bg-slate-900",
      action: onClose,
    },
  }[type];

  return createPortal(
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm" onClick={onClose} />

        <div className="relative bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl border border-slate-100 animate-in fade-in zoom-in duration-200">
          <div className="flex flex-col items-center text-center">
            <div className="bg-slate-50 p-4 rounded-full mb-4">{content.icon}</div>

            <h3 className="text-xl font-black italic uppercase text-slate-900 mb-2">
              {content.title}
            </h3>

            <p className="text-slate-500 text-sm mb-8">{content.desc}</p>

            <div className="flex flex-col gap-2 w-full">
              <button
                  onClick={content.action}
                  disabled={loading}
                  className={`w-full py-4 rounded-xl font-bold text-white transition-all flex justify-center items-center ${content.confirmColor}`}
              >
                {loading ? <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : content.confirmText}
              </button>

              {type !== "full" && (
                  <button
                      onClick={onClose}
                      className="w-full py-3 rounded-xl font-bold text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    Retour
                  </button>
              )}
            </div>
          </div>
        </div>
      </div>,
      document.body
  );
}