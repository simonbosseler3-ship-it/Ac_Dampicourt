"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/navbar/navbar";
import { Save, ArrowLeft, Plus, Trash2, Loader2, Check, Users, Shield } from "lucide-react";

export default function ModifierEntrainementPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  // États
  const [trainers, setTrainers] = useState<any[]>([]);
  const [officialsText, setOfficialsText] = useState("");
  const [ethicsText, setEthicsText] = useState("");

  useEffect(() => {
    const checkAdminAndFetch = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return router.push("/login");

      const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
      if (profile?.role?.toLowerCase() !== 'admin') return router.push("/entrainement");

      const { data: tr } = await supabase.from('trainers').select('*').order('order_index');
      const { data: off } = await supabase.from('officials').select('name').order('name');
      const { data: conf } = await supabase.from('training_page_config').select('*').single();

      if (tr) setTrainers(tr);
      if (off) setOfficialsText(off.map(o => o.name).join("\n"));
      if (conf) setEthicsText(conf.ethics_text);

      setLoading(false);
    };
    checkAdminAndFetch();
  }, [router]);

  const handleSave = async () => {
    setSaving(true);
    try {
      // 1. Sauvegarder Entraîneurs
      await supabase.from('trainers').delete().neq('sigle', 'TEMP_DELETE');
      await supabase.from('trainers').insert(trainers.map((t, i) => ({
        sigle: t.sigle, name: t.name, phone: t.phone, email: t.email, order_index: i
      })));

      // 2. Sauvegarder Officiels (Conversion du texte en liste)
      const names = officialsText.split("\n").filter(n => n.trim() !== "").map(n => ({ name: n.trim() }));
      await supabase.from('officials').delete().neq('name', 'TEMP_DELETE');
      if (names.length > 0) await supabase.from('officials').insert(names);

      // 3. Sauvegarder Config
      await supabase.from('training_page_config').update({ ethics_text: ethicsText }).eq('id', 'training_info');

      setSuccess(true);
      setTimeout(() => { router.push("/entrainement"); router.refresh(); }, 1500);
    } catch (e) {
      alert("Erreur de sauvegarde");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin text-red-600" /></div>;

  return (
      <div className="min-h-screen">
        <Navbar/>
        <main className="container mx-auto px-4 py-32">
          <div className="flex justify-between items-center mb-12">
            <button onClick={() => router.back()}
                    className="flex items-center gap-2 text-slate-400 font-bold uppercase italic text-xs">
              <ArrowLeft size={16}/> Retour
            </button>
            <button onClick={handleSave}
                    className={`px-8 py-3 rounded-xl font-black uppercase italic flex items-center gap-2 text-white ${success ? 'bg-green-600' : 'bg-red-600'}`}>
              {saving ? <Loader2 className="animate-spin"/> : success ? <Check/> :
                  <Save/>} {success ? "Validé" : "Enregistrer"}
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* GESTION DES ENTRAÎNEURS */}
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-black uppercase italic flex items-center gap-2"><Users
                    className="text-red-600"/> Entraîneurs</h2>
                <button onClick={() => setTrainers([...trainers, {
                  sigle: "",
                  name: "",
                  phone: "",
                  email: ""
                }])} className="bg-slate-900 text-white p-2 rounded-full"><Plus size={18}/></button>
              </div>
              {trainers.map((t, i) => (
                  <div key={i}
                       className="bg-white p-4 rounded-2xl border border-slate-200 relative grid grid-cols-4 gap-2">
                    <input placeholder="Sigle" className="p-2 border-b text-xs font-bold"
                           value={t.sigle} onChange={e => {
                      const n = [...trainers];
                      n[i].sigle = e.target.value;
                      setTrainers(n)
                    }}/>
                    <input placeholder="Nom" className="p-2 border-b text-xs font-bold col-span-2"
                           value={t.name} onChange={e => {
                      const n = [...trainers];
                      n[i].name = e.target.value;
                      setTrainers(n)
                    }}/>
                    <button onClick={() => setTrainers(trainers.filter((_, idx) => idx !== i))}
                            className="text-slate-300 hover:text-red-600 justify-self-end"><Trash2
                        size={16}/></button>
                    <input placeholder="Téléphone" className="p-2 border-b text-[10px] col-span-2"
                           value={t.phone} onChange={e => {
                      const n = [...trainers];
                      n[i].phone = e.target.value;
                      setTrainers(n)
                    }}/>
                    <input placeholder="Email" className="p-2 border-b text-[10px] col-span-2"
                           value={t.email} onChange={e => {
                      const n = [...trainers];
                      n[i].email = e.target.value;
                      setTrainers(n)
                    }}/>
                  </div>
              ))}
            </div>

            {/* GESTION DES OFFICIELS & ÉTHIQUE */}
            <div className="space-y-8">
              <div className="bg-white p-6 rounded-3xl border border-slate-200">
                <h2 className="text-xl font-black uppercase italic mb-4">Officiels (Un nom par
                  ligne)</h2>
                <textarea
                    className="w-full h-64 p-4 rounded-xl bg-slate-50 border-none text-xs font-bold uppercase leading-relaxed focus:ring-2 focus:ring-red-600 outline-none"
                    value={officialsText}
                    onChange={e => setOfficialsText(e.target.value)}
                />
              </div>

              <div className="bg-white p-6 rounded-3xl border border-slate-200">
                <h2 className="text-xl font-black uppercase italic mb-4 flex items-center gap-2">
                  <Shield className="text-red-600" size={20}/> Texte Éthique</h2>
                <textarea
                    className="w-full h-32 p-4 rounded-xl bg-slate-50 border-none text-xs leading-relaxed focus:ring-2 focus:ring-red-600 outline-none"
                    value={ethicsText}
                    onChange={e => setEthicsText(e.target.value)}
                />
              </div>
            </div>
          </div>
        </main>
      </div>
  );
}