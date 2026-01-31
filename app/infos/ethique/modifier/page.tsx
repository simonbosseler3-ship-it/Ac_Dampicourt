"use client";

import { useState, useEffect } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { ArrowLeft, Save, ShieldCheck, Mail, FilePlus, Trash2, Globe, Upload, Loader2, FileText } from "lucide-react";
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
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null); // Pour savoir quel doc est en cours d'upload

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
      if (profile?.role?.toLowerCase() !== 'admin') {
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
  };

  const removeDocument = (index: number) => {
    const newDocs = config.official_documents.filter((_, i) => i !== index);
    setConfig({ ...config, official_documents: newDocs });
  };

  const updateDocument = (index: number, field: keyof DocItem, value: string) => {
    const newDocs = [...config.official_documents];
    newDocs[index][field] = value;
    setConfig({ ...config, official_documents: newDocs });
  };

  // --- NOUVELLE FONCTION D'UPLOAD ---
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingIndex(index); // Active le loader pour cette ligne

    try {
      // 1. Nettoyer le nom du fichier pour éviter les caractères spéciaux
      const fileExt = file.name.split('.').pop();
      const cleanName = `doc-${Date.now()}.${fileExt}`; // Nom unique : doc-16789...pdf

      // 2. Upload vers Supabase Storage (Bucket 'documents')
      const { error: uploadError } = await supabase.storage
      .from('documents')
      .upload(cleanName, file);

      if (uploadError) throw uploadError;

      // 3. Récupérer l'URL publique
      const { data: { publicUrl } } = supabase.storage
      .from('documents')
      .getPublicUrl(cleanName);

      // 4. Mettre à jour le champ URL automatiquement
      const newDocs = [...config.official_documents];
      newDocs[index].url = publicUrl;

      // Si le nom du document est vide, on met le nom du fichier par défaut
      if (!newDocs[index].name) {
        newDocs[index].name = file.name.split('.')[0];
      }

      setConfig({ ...config, official_documents: newDocs });
      toast.success("Fichier téléversé avec succès !");

    } catch (error: any) {
      console.error(error);
      toast.error("Erreur upload : " + error.message);
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
      toast.error("Erreur lors de l'enregistrement");
    } else {
      toast.success("Page et documents mis à jour !");
    }
    setIsSaving(false);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center font-black italic text-slate-400 uppercase">Chargement...</div>;

  return (
      <div className="min-h-screen bg-slate-50">
        <Toaster position="bottom-right" richColors />

        <main className="container mx-auto px-4 py-12 pt-32">

          <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
            <Link href="/infos/ethique" className="flex items-center gap-2 text-slate-500 hover:text-red-600 transition-colors font-bold uppercase text-xs italic">
              <ArrowLeft size={16} /> Retour
            </Link>
            <h1 className="text-3xl font-black text-slate-900 uppercase italic">
              Editer <span className="text-red-600">Éthique & Docs</span>
            </h1>
            <button
                onClick={handleSave}
                disabled={isSaving}
                className="bg-red-600 text-white px-8 py-4 rounded-2xl font-black uppercase italic text-xs hover:bg-slate-900 transition-all flex items-center gap-3 shadow-xl disabled:opacity-50"
            >
              <Save size={18} /> {isSaving ? "Enregistrement..." : "Enregistrer tout"}
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">

              {/* GESTION DES DOCUMENTS */}
              <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-3 text-slate-900">
                    <FilePlus className="text-red-600" size={24}/>
                    <span className="font-black uppercase italic">Documents Officiels</span>
                  </div>
                  <button
                      onClick={addDocument}
                      className="bg-slate-900 text-white px-4 py-2 rounded-xl font-black uppercase italic text-[10px] hover:bg-red-600 transition-colors flex items-center gap-2"
                  >
                    Ajouter un document
                  </button>
                </div>

                <div className="space-y-4">
                  {config.official_documents.map((doc, index) => (
                      <div key={index} className="flex flex-col sm:flex-row gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 items-end">

                        {/* 1. Nom du fichier */}
                        <div className="flex-1 w-full">
                          <label className="text-[9px] font-black uppercase text-slate-400 ml-1">Nom affiché</label>
                          <input
                              value={doc.name}
                              onChange={(e) => updateDocument(index, 'name', e.target.value)}
                              className="w-full bg-white border-none rounded-xl p-3 text-sm font-bold placeholder:font-normal"
                              placeholder="ex: Règlement intérieur"
                          />
                        </div>

                        {/* 2. URL ou Upload */}
                        <div className="flex-1 w-full">
                          <label className="text-[9px] font-black uppercase text-slate-400 ml-1 flex items-center justify-between">
                            <span className="flex items-center gap-1"><Globe size={10}/> Lien du fichier</span>

                            {/* BOUTON D'UPLOAD */}
                            <div className="relative cursor-pointer text-red-600 hover:text-red-700 transition-colors flex items-center gap-1">
                              {uploadingIndex === index ? (
                                  <span className="flex items-center gap-1 text-[9px]"><Loader2 size={10} className="animate-spin"/> Envoi...</span>
                              ) : (
                                  <>
                                    <Upload size={10} />
                                    <span className="text-[9px] font-bold underline decoration-red-600/30">Upload PDF</span>
                                  </>
                              )}
                              <input
                                  type="file"
                                  accept=".pdf,.doc,.docx" // Accepte PDF et Word
                                  onChange={(e) => handleFileUpload(e, index)}
                                  className="absolute inset-0 opacity-0 cursor-pointer"
                                  disabled={uploadingIndex === index}
                              />
                            </div>
                          </label>

                          <div className="relative">
                            <input
                                value={doc.url}
                                onChange={(e) => updateDocument(index, 'url', e.target.value)}
                                className="w-full bg-white border-none rounded-xl p-3 text-sm font-bold text-slate-500 pr-10 truncate"
                                placeholder="https://..."
                            />
                            {/* Petit indicateur si c'est un PDF */}
                            {doc.url.toLowerCase().includes('.pdf') && (
                                <FileText size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-red-600/50" />
                            )}
                          </div>
                        </div>

                        {/* Bouton Supprimer */}
                        <button
                            onClick={() => removeDocument(index)}
                            className="p-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors mb-[1px]"
                            title="Supprimer ce document"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                  ))}

                  {config.official_documents.length === 0 && (
                      <div className="text-center py-8 border-2 border-dashed border-slate-100 rounded-2xl">
                        <p className="text-slate-400 text-xs font-bold uppercase italic">Aucun document pour le moment.</p>
                        <p className="text-slate-300 text-[10px] mt-1">Cliquez sur "Ajouter" pour commencer.</p>
                      </div>
                  )}
                </div>
              </div>

              {/* TEXTE PRINCIPAL */}
              <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
                <div className="flex items-center gap-3 mb-6 text-slate-900">
                  <ShieldCheck className="text-red-600" size={24}/>
                  <span className="font-black uppercase italic">Texte de la Charte</span>
                </div>
                <textarea
                    value={config.ethics_text}
                    onChange={(e) => setConfig({...config, ethics_text: e.target.value})}
                    className="w-full min-h-[300px] bg-slate-50 border-none rounded-2xl p-6 text-slate-700 leading-relaxed focus:ring-2 focus:ring-red-500 transition-all"
                />
              </div>
            </div>

            {/* CONTACT SIDEBAR */}
            <div className="space-y-6 h-fit">
              <div className="bg-slate-900 p-8 rounded-[2.5rem] shadow-xl text-white">
                <div className="flex items-center gap-3 mb-6">
                  <Mail className="text-red-600" size={24}/>
                  <span className="font-black uppercase italic">Contact Référent</span>
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Email</label>
                  <input
                      type="email"
                      value={config.referent_email}
                      onChange={(e) => setConfig({...config, referent_email: e.target.value})}
                      className="w-full bg-slate-800 border-none rounded-xl p-4 mt-1 font-bold text-white focus:ring-2 focus:ring-red-600"
                  />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
  );
}