"use client";

import { useState, useEffect } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { ArrowLeft, Save, ShieldCheck, Mail, Info } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Toaster, toast } from "sonner";

export default function ModifierEthiquePage() {
  const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // État pour les données de la page
  const [config, setConfig] = useState({
    ethics_text: "",
    referent_email: "referent.ethique@lbfa.be" // Valeur par défaut si vide
  });

  useEffect(() => {
    const checkAdminAndFetch = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/login"); return; }

      const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
      if (profile?.role?.toLowerCase() !== 'admin') {
        router.push("/infos/ethique");
        return;
      }

      const { data } = await supabase.from('training_page_config').select('*').single();
      if (data) {
        setConfig({
          ethics_text: data.ethics_text || "",
          referent_email: data.referent_email || "referent.ethique@lbfa.be"
        });
      }
      setLoading(false);
    };
    checkAdminAndFetch();
  }, [supabase, router]);

  const handleSave = async () => {
    setIsSaving(true);
    const { error } = await supabase
    .from('training_page_config')
    .update({
      ethics_text: config.ethics_text,
      referent_email: config.referent_email
    })
    .match({ id: 1 });

    if (error) {
      toast.error("Erreur lors de l'enregistrement");
    } else {
      toast.success("Page mise à jour avec succès !");
    }
    setIsSaving(false);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center font-black italic text-slate-400 uppercase">Chargement...</div>;

  return (
      <div className="min-h-screen bg-slate-50">
        <Toaster position="bottom-right" richColors />

        <main className="container mx-auto px-4 py-12 pt-32">

          {/* HEADER */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
            <Link href="/infos/ethique" className="flex items-center gap-2 text-slate-500 hover:text-red-600 transition-colors font-bold uppercase text-xs italic">
              <ArrowLeft size={16} /> Retour
            </Link>
            <h1 className="text-3xl font-black text-slate-900 uppercase italic">
              Editer <span className="text-red-600">Éthique</span>
            </h1>
            <button
                onClick={handleSave}
                disabled={isSaving}
                className="bg-red-600 text-white px-8 py-4 rounded-2xl font-black uppercase italic text-xs hover:bg-slate-900 transition-all flex items-center gap-3 shadow-xl disabled:opacity-50"
            >
              <Save size={18} /> {isSaving ? "Enregistrement..." : "Enregistrer les modifications"}
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* ÉDITION TEXTE PRINCIPAL */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
                <div className="flex items-center gap-3 mb-6 text-slate-900">
                  <ShieldCheck className="text-red-600" size={24}/>
                  <span className="font-black uppercase italic">Texte de la Charte</span>
                </div>
                <textarea
                    value={config.ethics_text}
                    onChange={(e) => setConfig({...config, ethics_text: e.target.value})}
                    placeholder="Rédigez ici le contenu relatif à l'éthique et au dopage..."
                    className="w-full min-h-[400px] bg-slate-50 border-none rounded-2xl p-6 text-slate-700 leading-relaxed focus:ring-2 focus:ring-red-500 transition-all"
                />
                <p className="mt-4 text-[10px] text-slate-400 font-bold uppercase flex items-center gap-2">
                  <Info size={12}/> Astuce : Le texte conserve les sauts de ligne automatiquement.
                </p>
              </div>
            </div>

            {/* ÉDITION CONTACT */}
            <div className="space-y-6">
              <div className="bg-slate-900 p-8 rounded-[2.5rem] shadow-xl text-white">
                <div className="flex items-center gap-3 mb-6">
                  <Mail className="text-red-600" size={24}/>
                  <span className="font-black uppercase italic">Contact Référent</span>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Email du référent</label>
                    <input
                        type="email"
                        value={config.referent_email}
                        onChange={(e) => setConfig({...config, referent_email: e.target.value})}
                        className="w-full bg-slate-800 border-none rounded-xl p-4 mt-1 font-bold text-white focus:ring-2 focus:ring-red-600"
                        placeholder="ex: contact@club.be"
                    />
                  </div>
                </div>
                <div className="mt-8 p-4 bg-red-600/10 border border-red-600/20 rounded-2xl">
                  <p className="text-[10px] text-red-400 font-bold leading-relaxed uppercase italic">
                    Attention : ce mail apparaîtra publiquement comme lien de contact.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </main>
      </div>
  );
}