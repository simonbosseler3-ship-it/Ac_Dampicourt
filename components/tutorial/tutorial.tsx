// src/components/tutorial-overlay.tsx
'use client'
import { useState } from 'react'
import { X, CheckCircle } from 'lucide-react'

interface TutorialProps {
  role: string;
  onClose: () => void;
}

export function TutorialOverlay({ role, onClose }: TutorialProps) {
  const [step, setStep] = useState(1);

  const getTutorialContent = () => {
    switch(role) {
      case 'admin':
        return "Bienvenue Simon ! En tant qu'admin, tu peux gérer les membres et modérer tout le forum.";
      case 'redacteur':
        return "Salut ! Tu peux répondre aux questions des athlètes et publier des news.";
      default:
        return "Bienvenue sur le forum de l'ACD ! Pose tes questions ici, le staff te répondra.";
    }
  };

  return (
      <div className="fixed inset-0 z-[100] bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="bg-white rounded-[3rem] max-w-lg w-full p-10 shadow-2xl relative animate-in fade-in zoom-in duration-300">
          <button onClick={onClose} className="absolute top-6 right-6 text-slate-300 hover:text-slate-900">
            <X size={24} />
          </button>

          <div className="h-16 w-16 bg-red-100 rounded-2xl flex items-center justify-center text-red-600 mb-6">
            <CheckCircle size={32} />
          </div>

          <h2 className="text-3xl font-black uppercase italic text-slate-900 leading-none mb-4">
            Guide de <span className="text-red-600">Bienvenue</span>
          </h2>

          <p className="text-slate-600 font-medium text-lg leading-relaxed mb-8">
            {getTutorialContent()}
          </p>

          <button
              onClick={onClose}
              className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black uppercase italic hover:bg-red-600 transition-all shadow-xl"
          >
            C'est parti !
          </button>
        </div>
      </div>
  );
}