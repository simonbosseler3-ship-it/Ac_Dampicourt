'use client'

import { Rocket, CheckCircle, Loader2, Dumbbell, MessageSquare, ShieldCheck, PenTool, Star } from 'lucide-react'
import { createBrowserClient } from '@supabase/ssr'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

interface TutorialProps {
  role: string;
  userId: string;
  userName: string; // Nouvelle prop pour le prénom
}

export function TutorialOverlay({ role, userId, userName }: TutorialProps) {
  const router = useRouter()
  const [isUpdating, setIsUpdating] = useState(false)
  const [isVisible, setIsVisible] = useState(true)

  const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const handleFinish = async () => {
    setIsUpdating(true)
    const { error } = await supabase
    .from('profiles')
    .update({ has_seen_tutorial: true })
    .eq('id', userId)

    if (!error) {
      setIsVisible(false)
      router.refresh()
    } else {
      console.error(error)
      setIsUpdating(false)
    }
  }

  const getContent = () => {
    switch (role) {
      case 'admin':
        return {
          badge: "Administrateur",
          color: "text-purple-600",
          welcome: `Salut ${userName}, tu as le contrôle total !`,
          features: [
            { icon: <ShieldCheck size={16}/>, text: "Modification intégrale du contenu du site" },
            { icon: <PenTool size={16}/>, text: "Gestion des actualités (Ajout/Modif/Cache)" },
            { icon: <Dumbbell size={16}/>, text: "Réservation des créneaux musculation" },
            { icon: <MessageSquare size={16}/>, text: "Réponses officielles sur le forum" }
          ]
        };
      case 'redacteur':
        return {
          badge: "Staff / Rédacteur",
          color: "text-red-600",
          welcome: `Ravi de te voir, ${userName} !`,
          features: [
            { icon: <PenTool size={16}/>, text: "Gestion des actualités (Ajout/Modif/Cache)" },
            { icon: <MessageSquare size={16}/>, text: "Réponses officielles sur le forum" },
            { icon: <Dumbbell size={16}/>, text: "Réservation des créneaux musculation" }
          ]
        };
      case 'athlete':
        return {
          badge: "Membre Athlète",
          color: "text-blue-600",
          welcome: `Bienvenue ${userName} !`,
          features: [
            { icon: <Dumbbell size={16}/>, text: "Réservation de tes créneaux de musculation" }
          ]
        };
      default:
        return {
          badge: "Membre",
          color: "text-slate-600",
          welcome: `Bienvenue ${userName} !`,
          features: [
            { icon: <MessageSquare size={16}/>, text: "Participation libre au forum communautaire" }
          ]
        };
    }
  };

  const content = getContent();
  if (!isVisible) return null;

  return (
      <div className="fixed inset-0 z-[100] bg-slate-900/90 backdrop-blur-md flex items-center justify-center p-4">
        <div className="bg-white rounded-[3rem] max-w-lg w-full p-10 shadow-2xl relative animate-in zoom-in duration-300">

          <div className="h-16 w-16 bg-red-100 rounded-2xl flex items-center justify-center text-red-600 mb-6">
            <CheckCircle size={32} />
          </div>

          <h2 className="text-3xl font-black uppercase italic text-slate-900 leading-none mb-2">
            Guide <span className="text-red-600">ACD</span>
          </h2>
          <div className={`text-sm font-black uppercase tracking-widest mb-4 ${content.color}`}>
            {content.badge}
          </div>

          <p className="text-slate-900 font-black text-xl italic uppercase mb-8">
            {content.welcome}
          </p>

          <div className="space-y-3 mb-10">
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2">Tes avantages activés :</p>
            {content.features.map((f, i) => (
                <div key={i} className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 group transition-all">
                  <div className="text-red-600 bg-white p-2 rounded-lg shadow-sm">
                    {f.icon}
                  </div>
                  <span className="text-slate-700 font-bold text-sm italic">{f.text}</span>
                </div>
            ))}
          </div>

          <button
              onClick={handleFinish}
              disabled={isUpdating}
              className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black uppercase italic tracking-widest hover:bg-red-600 transition-all shadow-xl flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isUpdating ? <Loader2 className="animate-spin" /> : (
                <>C'est parti ! <Rocket size={20} /></>
            )}
          </button>
        </div>
      </div>
  );
}