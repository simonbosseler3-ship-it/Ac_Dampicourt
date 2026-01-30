"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Trash2, Loader2, X, Check } from "lucide-react";

interface DeleteTopicButtonProps {
  topicId: string;
  onDelete: () => void;
}

export function DeleteTopicButton({ topicId, onDelete }: DeleteTopicButtonProps) {
  const [status, setStatus] = useState<"idle" | "confirm" | "deleting">("idle");

  // Réinitialise le bouton si on ne clique pas sur "Confirmer" après 3 secondes
  useEffect(() => {
    if (status === "confirm") {
      const timer = setTimeout(() => setStatus("idle"), 3000);
      return () => clearTimeout(timer);
    }
  }, [status]);

  const handleInitialClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setStatus("confirm");
  };

  const handleCancel = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setStatus("idle");
  };

  const handleConfirmDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setStatus("deleting");

    try {
      // Suppression des messages puis du topic
      await supabase.from("forum_messages").delete().eq("topic_id", topicId);
      const { error } = await supabase.from("forum_topics").delete().eq("id", topicId);

      if (error) throw error;
      onDelete();
    } catch (error) {
      console.error("Erreur:", error);
      alert("Erreur lors de la suppression");
      setStatus("idle");
    }
  };

  if (status === "deleting") {
    return (
        <div className="p-3 bg-slate-100 text-slate-400 rounded-2xl animate-pulse">
          <Loader2 size={18} className="animate-spin" />
        </div>
    );
  }

  if (status === "confirm") {
    return (
        <div className="flex items-center gap-2 animate-in zoom-in duration-200">
          <button
              onClick={handleConfirmDelete}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white text-[10px] font-black uppercase italic tracking-widest rounded-xl hover:bg-red-700 shadow-lg shadow-red-200 transition-all active:scale-95"
          >
            <Check size={14} /> Confirmer
          </button>
          <button
              onClick={handleCancel}
              className="p-2 bg-slate-100 text-slate-500 rounded-xl hover:bg-slate-200 transition-all"
          >
            <X size={14} />
          </button>
        </div>
    );
  }

  return (
      <button
          onClick={handleInitialClick}
          className="p-3 bg-white border-2 border-slate-100 text-slate-400 hover:text-red-600 hover:border-red-600 hover:bg-red-50 rounded-2xl transition-all shadow-sm group/btn"
          title="Supprimer la discussion"
      >
        <Trash2 size={18} className="group-hover/btn:scale-110 transition-transform" />
      </button>
  );
}