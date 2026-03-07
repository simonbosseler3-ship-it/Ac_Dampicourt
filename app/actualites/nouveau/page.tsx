"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import {
  Upload, Check, ArrowLeft, Loader2, Trophy, X, Paperclip, Facebook
} from "lucide-react";

// Import dynamique pour éviter les erreurs de SSR (Server Side Rendering)
import dynamic from 'next/dynamic';
const ReactQuill = dynamic(() => import('react-quill-new'), {
  ssr: false,
  loading: () => <div className="h-64 w-full bg-slate-50 animate-pulse rounded-[2rem] border border-slate-100" />
});
import 'react-quill-new/dist/quill.snow.css';

export default function NouveauArticle() {
  const router = useRouter();

  // États des champs
  const [title, setTitle] = useState("");
  const [dateText, setDateText] = useState(new Date().toISOString().split('T')[0]);
  const [facebookUrl, setFacebookUrl] = useState("");
  const [content, setContent] = useState("");

  // Fichiers
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isCompetition, setIsCompetition] = useState(false);
  const [scheduleFile, setScheduleFile] = useState<File | null>(null);

  // Auth & UI
  const [userId, setUserId] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [loading, setLoading] = useState(true);

  // Configuration de la barre d'outils (identique à ta page de modification)
  const modules = {
    toolbar: [
      [{ 'header': [2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      ['link', 'clean']
    ],
  };

  useEffect(() => {
    const checkAccess = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) { router.replace("/login"); return; }

        const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single();

        const role = profile?.role?.toLowerCase().trim();
        if (role === 'admin' || role === 'redacteur') {
          setUserId(session.user.id);
          setLoading(false);
        } else { router.replace("/"); }
      } catch (err) { router.replace("/"); }
    };
    checkAccess();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file || !userId || !content || content === "<p><br></p>") {
      alert("Veuillez remplir le contenu et ajouter une image de couverture.");
      return;
    }

    setIsUploading(true);
    try {
      // 1. Upload Image de couverture
      const fileExt = file.name.split('.').pop();
      const fileName = `cover_${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
      .from('news-images')
      .upload(`articles/${fileName}`, file);

      if (uploadError) throw uploadError;
      const { data: { publicUrl: imageUrl } } = supabase.storage.from('news-images').getPublicUrl(`articles/${fileName}`);

      // 2. Upload Document joint (PDF)
      let scheduleUrl = null;
      if (isCompetition && scheduleFile) {
        const docName = `doc_${Date.now()}.${scheduleFile.name.split('.').pop()}`;
        await supabase.storage.from('news-images').upload(`files/${docName}`, scheduleFile);
        const { data: { publicUrl: pUrl } } = supabase.storage.from('news-images').getPublicUrl(`files/${docName}`);
        scheduleUrl = pUrl;
      }

      // 3. Insertion en base
      const { error } = await supabase.from('news').insert([{
        title,
        image_url: imageUrl,
        date_text: dateText,
        content: content, // Le HTML généré par Quill
        author_id: userId,
        schedule_url: scheduleUrl,
        facebook_url: facebookUrl
      }]);

      if (error) throw error;

      router.push("/actualites");
      router.refresh();
    } catch (error: any) {
      alert("Erreur : " + error.message);
      setIsUploading(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-red-600" /></div>;

  return (
      <div className="min-h-screen bg-slate-50/50 pb-12">
        {/* Styles pour harmoniser Quill avec ton design */}
        <style dangerouslySetInnerHTML={{ __html: `
        .ql-container { font-family: inherit; font-size: 1.1rem; border-bottom-left-radius: 2rem; border-bottom-right-radius: 2rem; background: #f8fafc; border-color: #f1f5f9 !important; }
        .ql-toolbar { border-top-left-radius: 2rem; border-top-right-radius: 2rem; background: white; border-color: #f1f5f9 !important; padding: 12px !important; }
        .ql-editor { min-height: 400px; padding: 2rem !important; }
        .ql-editor h2 { color: #dc2626; font-weight: 900; text-transform: uppercase; font-style: italic; }
      `}} />

        <main className="container mx-auto px-4 py-12 max-w-5xl">
          <button onClick={() => router.back()} className="flex items-center gap-2 text-slate-500 mb-8 hover:text-red-600 transition-colors uppercase font-black text-sm italic">
            <ArrowLeft size={18} /> Retour
          </button>

          <h1 className="text-4xl md:text-6xl font-black italic uppercase mb-10 tracking-tighter">
            Nouvelle <span className="text-red-600">Actualité</span>
          </h1>

          <form onSubmit={handleSubmit} className="bg-white p-8 md:p-12 rounded-[3rem] shadow-xl border border-slate-100 space-y-10">

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* TITRE & FB */}
              <div className="space-y-6">
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 tracking-[0.2em]">Titre de l'article</label>
                  <input
                      className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-lg focus:ring-2 focus:ring-red-500 outline-none transition-all"
                      placeholder="Ex: Résultats du weekend..."
                      value={title}
                      onChange={e => setTitle(e.target.value)}
                      required
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase text-blue-400 mb-2 tracking-[0.2em]">Lien Album Facebook</label>
                  <div className="relative">
                    <Facebook className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-600" size={18} />
                    <input
                        className="w-full pl-12 pr-4 py-4 bg-blue-50/30 border border-blue-100 rounded-2xl font-bold text-sm outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="https://facebook.com/..."
                        value={facebookUrl}
                        onChange={e => setFacebookUrl(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* IMAGE COVER */}
              <div>
                <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 tracking-[0.2em]">Image de couverture</label>
                <div className="relative group border-4 border-dashed border-slate-100 rounded-[2.5rem] overflow-hidden bg-slate-50/50 aspect-video flex flex-col items-center justify-center transition-all hover:border-red-200">
                  {previewUrl ? (
                      <>
                        <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                        <button type="button" onClick={() => { setFile(null); setPreviewUrl(null); }} className="absolute top-4 right-4 bg-red-600 text-white p-2 rounded-full hover:scale-110 transition shadow-lg"><X size={20} /></button>
                      </>
                  ) : (
                      <label htmlFor="file-up" className="cursor-pointer flex flex-col items-center gap-3 p-8">
                        <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center text-slate-300 group-hover:text-red-500 transition-colors">
                          <Upload size={32} />
                        </div>
                        <span className="text-[10px] font-black uppercase italic text-slate-400">Cliquez pour charger</span>
                      </label>
                  )}
                  <input type="file" accept="image/*" onChange={e => { const f = e.target.files?.[0]; if(f){ setFile(f); setPreviewUrl(URL.createObjectURL(f)); } }} className="hidden" id="file-up" />
                </div>
              </div>
            </div>

            {/* ÉDITEUR REACT-QUILL */}
            <div className="space-y-4">
              <label className="block text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Contenu de l'article</label>
              <div className="shadow-sm">
                <ReactQuill
                    theme="snow"
                    value={content}
                    onChange={setContent}
                    modules={modules}
                    placeholder="Rédigez votre article ici..."
                />
              </div>
            </div>

            {/* DATE & PDF */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-slate-100">
              <div>
                <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 tracking-[0.2em]">Date d'affichage</label>
                <input type="date" className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold outline-none focus:ring-2 focus:ring-red-500" value={dateText} onChange={e => setDateText(e.target.value)} />
              </div>
              <div className={`p-6 rounded-[2rem] border-2 transition-all flex flex-col justify-center ${isCompetition ? 'border-red-500 bg-red-50/50' : 'border-slate-100 bg-slate-50'}`}>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" className="hidden" checked={isCompetition} onChange={e => setIsCompetition(e.target.checked)} />
                  <div className={`w-12 h-6 rounded-full relative transition-colors ${isCompetition ? 'bg-red-600' : 'bg-slate-300'}`}>
                    <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-all ${isCompetition ? 'translate-x-6' : ''}`} />
                  </div>
                  <span className="text-[10px] font-black uppercase italic flex items-center gap-2 text-slate-700"><Trophy size={16}/> Joindre un document PDF</span>
                </label>
                {isCompetition && (
                    <div className="mt-4 flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                      <Paperclip size={16} className="text-red-600" />
                      <input type="file" accept=".pdf" onChange={e => setScheduleFile(e.target.files?.[0] || null)} className="text-[10px] font-bold text-slate-500" />
                    </div>
                )}
              </div>
            </div>

            <button
                type="submit"
                disabled={isUploading}
                className="w-full bg-slate-900 text-white font-black py-6 rounded-[2rem] uppercase italic shadow-2xl hover:bg-red-600 active:scale-[0.98] transition-all flex items-center justify-center gap-4 text-xl disabled:opacity-50"
            >
              {isUploading ? (
                  <><Loader2 className="animate-spin h-7 w-7" /> Publication en cours...</>
              ) : (
                  <><Check size={28} /> Publier l'actualité</>
              )}
            </button>
          </form>
        </main>
      </div>
  );
}