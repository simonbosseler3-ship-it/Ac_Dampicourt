"use client";

import { useState, useEffect } from "react";
import { createBrowserClient } from "@supabase/ssr";
import {
  ArrowLeft,
  Save,
  ShieldCheck,
  Mail,
  FilePlus,
  Trash2,
  Globe,
  Upload,
  Loader2,
  FileText,
  AlertCircle,
  CheckCircle,
  FileSearch
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Toaster, toast } from "sonner";

interface DocItem {
  name: string;
  url: string;
}

export default function ModifierEthiquePage() {
  const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);

  const [config, setConfig] = useState({
    ethics_text: "",
    referent_email: "referent.ethique@lbfa.be",
    official_documents: [] as DocItem[]
  });

  useEffect(() => {
    const checkAdminAndFetch = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/login"); return; }

      const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
      if (profile?.role?.toLowerCase().trim() !== 'admin') {
        router.push("/infos/ethique");
        return;
      }

      const { data } = await supabase.from('training_page_config').select('*').single();
      if (data) {
        setConfig({
          ethics_text: data.ethics_text || "",
          referent_email: data.referent_email || "referent.ethique@lbfa.be",
          official_documents: Array.isArray(data.official_documents) ? data.official_documents : []
        });
      }
      setLoading(false);
    };
    checkAdminAndFetch();
  }, [supabase, router]);

  const addDocument = () => {
    setConfig({
      ...config,
      official_documents: [...config.official_documents, { name: "", url: "" }]
    });
    toast.info("Nouveau document ajouté à la liste");
  };

  const removeDocument = (index: number) => {
    const newDocs = config.official_documents.filter((_, i) => i !== index);
    setConfig({ ...config, official_documents: newDocs });
    toast.error("Document retiré de la liste");
  };

  const updateDocument = (index: number, field: keyof DocItem, value: string) => {
    const newDocs = [...config.official_documents];
    newDocs[index][field] = value;
    setConfig({ ...config, official_documents: newDocs });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingIndex(index);

    try {
      const fileExt = file.name.split('.').pop();
      const cleanName = `ethique/doc-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
      .from('documents')
      .upload(cleanName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
      .from('documents')
      .getPublicUrl(cleanName);

      const newDocs = [...config.official_documents];
      newDocs[index].url = publicUrl;

      if (!newDocs[index].name) {
        newDocs[index].name = file.name.split('.')[0];
      }

      setConfig({ ...config, official_documents: newDocs });
      toast.success("Fichier synchronisé avec succès !");

    } catch (error: any) {
      console.error(error);
      toast.error("Échec de l'upload : " + error.message);
    } finally {
      setUploadingIndex(null);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    const { error } = await supabase
    .from('training_page_config')
    .update({
      ethics_text: config.ethics_text,
      referent_email: config.referent_email,
      official_documents: config.official_documents
    })
    .match({ id: 1 });

    if (error) {
      toast.error("Erreur lors de la sauvegarde");
    } else {
      toast.success("Configuration mise à jour !", {
        description: "Les modifications sont en ligne.",
        icon: <CheckCircle className="text-green-500" />
      });
    }
    setIsSaving(false);
  };

  if (loading) return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <Loader2 className="animate-spin text-red-600" size={40} />
        <p className="text-[10px] font-black uppercase italic tracking-[0.3em] text-slate-400">Accès administrateur...</p>
      </div>
  );

  return (
      <div className="min-h-screen">
        <Toaster position="bottom-right" richColors expand={true}/>

        <main className="container mx-auto px-4 py-12 pt-32 pb-32">

          {/* TOP BAR */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-8">
            <div className="flex items-center gap-6">
              <Link href="/infos/ethique"
                    className="group flex items-center gap-3 bg-white p-4 rounded-2xl shadow-sm border border-slate-200 hover:border-red-600 transition-all">
                <ArrowLeft size={20}
                           className="text-slate-400 group-hover:text-red-600 transition-colors"/>
              </Link>
              <div>
                <h1 className="text-4xl font-black text-slate-900 uppercase italic tracking-tighter leading-none">
                  ÉDITION <span className="text-red-600">ÉTHIQUE</span>
                </h1>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-2 italic">Gérez
                  la charte et les ressources</p>
              </div>
            </div>

            <button
                onClick={handleSave}
                disabled={isSaving}
                className="w-full md:w-auto bg-slate-900 text-white px-10 py-5 rounded-[2rem] font-black uppercase italic text-xs hover:bg-red-600 transition-all flex items-center justify-center gap-3 shadow-2xl disabled:opacity-50 active:scale-95 group"
            >
              {isSaving ? <Loader2 size={18} className="animate-spin"/> :
                  <Save size={18} className="group-hover:scale-110 transition-transform"/>}
              {isSaving ? "Sauvegarde..." : "Enregistrer les modifications"}
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

            <div className="lg:col-span-2 space-y-10">

              {/* DOCUMENTS MANAGER */}
              <div
                  className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/40">
                <div
                    className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
                  <div className="flex items-center gap-4 text-slate-900">
                    <div className="p-3 bg-red-50 text-red-600 rounded-2xl">
                      <FileSearch size={24}/>
                    </div>
                    <div>
                      <span className="font-black uppercase italic text-xl tracking-tight block">Ressources PDF</span>
                      <span
                          className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Documents en libre accès</span>
                    </div>
                  </div>
                  <button
                      onClick={addDocument}
                      className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-black uppercase italic text-[10px] hover:bg-red-600 transition-all flex items-center gap-2 shadow-lg active:scale-95"
                  >
                    <FilePlus size={14}/> Ajouter un fichier
                  </button>
                </div>

                <div className="space-y-4">
                  {config.official_documents.map((doc, index) => (
                      <div key={index}
                           className="flex flex-col xl:flex-row gap-6 p-6 bg-slate-50/50 rounded-3xl border border-slate-100 hover:border-red-200 transition-all animate-in slide-in-from-bottom-2 duration-300">

                        {/* Nom affiché */}
                        <div className="flex-1">
                          <label
                              className="text-[9px] font-black uppercase text-slate-400 mb-2 block ml-2">Intitulé
                            du document</label>
                          <input
                              value={doc.name}
                              onChange={(e) => updateDocument(index, 'name', e.target.value)}
                              className="w-full bg-white border-2 border-slate-100 rounded-2xl px-5 py-3.5 text-sm font-bold text-slate-900 outline-none focus:border-red-600 transition-all placeholder:font-normal italic"
                              placeholder="ex: Règlement d'Ordre Intérieur..."
                          />
                        </div>

                        {/* URL & Upload */}
                        <div className="flex-[1.5]">
                          <div className="flex items-center justify-between mb-2 px-2">
                            <label
                                className="text-[9px] font-black uppercase text-slate-400 flex items-center gap-2">
                              Lien / Source
                            </label>
                            <div className="relative cursor-pointer group/upload">
                              <div
                                  className="flex items-center gap-2 text-red-600 font-black text-[9px] uppercase tracking-widest italic group-hover/upload:text-slate-900 transition-colors">
                                {uploadingIndex === index ? (
                                    <Loader2 size={12} className="animate-spin"/>
                                ) : <Upload size={12}/>}
                                {uploadingIndex === index ? "Envoi..." : "Envoyer un PDF"}
                              </div>
                              <input
                                  type="file"
                                  accept=".pdf,.doc,.docx"
                                  onChange={(e) => handleFileUpload(e, index)}
                                  className="absolute inset-0 opacity-0 cursor-pointer"
                                  disabled={uploadingIndex === index}
                              />
                            </div>
                          </div>

                          <div className="relative group">
                            <Globe size={16}
                                   className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-red-600 transition-colors"/>
                            <input
                                value={doc.url}
                                onChange={(e) => updateDocument(index, 'url', e.target.value)}
                                className="w-full bg-white border-2 border-slate-100 rounded-2xl pl-12 pr-12 py-3.5 text-sm font-bold text-slate-500 outline-none focus:border-red-600 transition-all truncate"
                                placeholder="https://..."
                            />
                            {doc.url.toLowerCase().includes('.pdf') && (
                                <div
                                    className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 bg-red-50 text-red-600 rounded-lg">
                                  <FileText size={14}/>
                                </div>
                            )}
                          </div>
                        </div>

                        {/* Bouton Supprimer */}
                        <div className="flex items-end pb-1">
                          <button
                              onClick={() => removeDocument(index)}
                              className="p-4 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-2xl transition-all"
                              title="Supprimer"
                          >
                            <Trash2 size={20}/>
                          </button>
                        </div>
                      </div>
                  ))}

                  {config.official_documents.length === 0 && (
                      <div
                          className="text-center py-20 border-3 border-dashed border-slate-100 rounded-[2.5rem] bg-slate-50/30">
                        <FileBox size={40} className="mx-auto text-slate-200 mb-4"/>
                        <p className="text-slate-400 text-xs font-black uppercase italic tracking-widest">Aucun
                          document configuré</p>
                        <button onClick={addDocument}
                                className="mt-4 text-red-600 font-black uppercase text-[10px] italic hover:underline">
                          Créer le premier document
                        </button>
                      </div>
                  )}
                </div>
              </div>

              {/* TEXT EDITOR */}
              <div
                  className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/40">
                <div className="flex items-center gap-4 mb-8">
                  <div className="p-3 bg-slate-900 rounded-2xl text-white">
                    <ShieldCheck size={24}/>
                  </div>
                  <div>
                    <h2 className="text-2xl font-black uppercase italic text-slate-900 tracking-tight">Texte
                      de la Charte</h2>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Supporte
                      les retours à la ligne</p>
                  </div>
                </div>

                <textarea
                    value={config.ethics_text}
                    onChange={(e) => setConfig({...config, ethics_text: e.target.value})}
                    className="w-full min-h-[500px] bg-slate-50 border-2 border-slate-100 rounded-[2rem] p-8 text-slate-700 font-medium leading-relaxed focus:border-red-600 focus:bg-white outline-none transition-all shadow-inner"
                    placeholder="Rédigez ici le contenu éthique de l'ACD..."
                />
              </div>
            </div>

            {/* SIDEBAR PARAMETERS */}
            <div className="space-y-8 lg:sticky lg:top-32">

              <div
                  className="bg-slate-900 p-10 rounded-[3rem] shadow-2xl text-white relative overflow-hidden group">
                {/* Décoration fond */}
                <div
                    className="absolute top-0 right-0 p-10 text-white/5 group-hover:scale-110 transition-transform duration-1000">
                  <Mail size={120}/>
                </div>

                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-10">
                    <div className="p-3 bg-red-600 rounded-2xl shadow-lg shadow-red-600/20">
                      <Mail size={22}/>
                    </div>
                    <span
                        className="font-black uppercase italic text-lg tracking-tight">Référent</span>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label
                          className="text-[10px] font-black uppercase text-slate-500 mb-2 block ml-1 tracking-[0.2em]">Contact
                        Email</label>
                      <input
                          type="email"
                          value={config.referent_email}
                          onChange={(e) => setConfig({...config, referent_email: e.target.value})}
                          className="w-full bg-white/5 border-2 border-white/10 rounded-2xl px-6 py-4 font-black italic text-red-500 focus:border-red-600 focus:bg-white/10 outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div
                      className="mt-12 flex items-start gap-3 bg-white/5 p-4 rounded-2xl border border-white/5">
                    <AlertCircle size={16} className="text-red-600 shrink-0 mt-0.5"/>
                    <p className="text-[9px] font-bold text-slate-400 uppercase leading-relaxed italic">
                      Cet email sera affiché publiquement sur la page éthique pour permettre aux
                      membres de contacter le référent.
                    </p>
                  </div>
                </div>
              </div>

              {/* QUICK PREVIEW CARD */}
              <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
                <h3 className="text-xs font-black uppercase text-slate-900 mb-4 flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  Stats Page
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b border-slate-50 pb-3">
                    <span
                        className="text-[10px] font-bold text-slate-400 uppercase italic">Documents</span>
                    <span
                        className="text-sm font-black italic">{config.official_documents.length}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-slate-50 pb-3">
                    <span className="text-[10px] font-bold text-slate-400 uppercase italic">Mots charte</span>
                    <span
                        className="text-sm font-black italic">{config.ethics_text.split(/\s+/).filter(Boolean).length}</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </main>
      </div>
  );
}

// Sous-composant pour les icônes de type de fichier
const FileBox = ({ size, className }: { size: number, className?: string }) => (
    <div className={className}>
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m7.5 4.27 9 5.15"/>
        <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/>
        <path d="m3.3 7 8.7 5 8.7-5"/>
        <path d="M12 22V12"/>
      </svg>
    </div>
);