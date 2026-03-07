"use client";

import { useEffect, useState, use } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { Upload, Check, ArrowLeft, Loader2, Trophy, Paperclip, Facebook } from "lucide-react";

// Import dynamique de l'éditeur pour éviter les erreurs au chargement
import dynamic from 'next/dynamic';
const ReactQuill = dynamic(() => import('react-quill-new'), {
  ssr: false,
  loading: () => <div className="h-64 w-full bg-slate-50 animate-pulse rounded-2xl border border-slate-100" />
});
import 'react-quill-new/dist/quill.snow.css';

export default function ModifierArticle({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [dateText, setDateText] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [facebookUrl, setFacebookUrl] = useState("");
  const [isCompetition, setIsCompetition] = useState(false);
  const [existingScheduleUrl, setExistingScheduleUrl] = useState<string | null>(null);
  const [scheduleFile, setScheduleFile] = useState<File | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  // Configuration de la barre d'outils pour les rédacteurs
  const modules = {
    toolbar: [
      [{ 'header': [2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      ['link', 'clean']
    ],
  };

  useEffect(() => {
    const loadArticle = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) { router.replace("/login"); return; }

        const [profileRes, articleRes] = await Promise.all([
          supabase.from('profiles').select('role').eq('id', session.user.id).single(),
          supabase.from('news').select('*').eq('id', id).single()
        ]);

        if (articleRes.data) {
          const article = articleRes.data;
          setTitle(article.title);
          setDateText(article.date_text);
          setContent(article.content || "");
          setImageUrl(article.image_url);
          setPreviewUrl(article.image_url);
          setFacebookUrl(article.facebook_url || "");
          if (article.schedule_url) {
            setIsCompetition(true);
            setExistingScheduleUrl(article.schedule_url);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadArticle();
  }, [id, router]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      let finalImageUrl = imageUrl;
      if (file) {
        const fileName = `cover_${Date.now()}`;
        await supabase.storage.from('news-images').upload(`articles/${fileName}`, file);
        const { data: { publicUrl } } = supabase.storage.from('news-images').getPublicUrl(`articles/${fileName}`);
        finalImageUrl = publicUrl;
      }

      let finalScheduleUrl = existingScheduleUrl;
      if (!isCompetition) finalScheduleUrl = null;
      else if (scheduleFile) {
        const fileName = `doc_${Date.now()}`;
        await supabase.storage.from('news-images').upload(`files/${fileName}`, scheduleFile);
        const { data: { publicUrl } } = supabase.storage.from('news-images').getPublicUrl(`files/${fileName}`);
        finalScheduleUrl = publicUrl;
      }

      const { error } = await supabase.from('news').update({
        title,
        date_text: dateText,
        content, // L'éditeur génère du HTML propre automatiquement
        image_url: finalImageUrl,
        schedule_url: finalScheduleUrl,
        facebook_url: facebookUrl,
      }).eq('id', id);

      if (!error) {
        router.push("/actualites");
        router.refresh();
      }
    } catch (err) {
      alert("Erreur");
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-red-600" /></div>;

  return (
      <div className="min-h-screen bg-slate-50/50">
        {/* Styles pour que l'éditeur ressemble au rendu final du site */}
        <style dangerouslySetInnerHTML={{ __html: `
        .ql-container { font-family: inherit; font-size: 1.1rem; border-bottom-left-radius: 1.5rem; border-bottom-right-radius: 1.5rem; background: white; }
        .ql-toolbar { border-top-left-radius: 1.5rem; border-top-right-radius: 1.5rem; background: white; border-color: #f1f5f9 !important; }
        .ql-editor { min-height: 400px; }
        .ql-editor h2 { color: #dc2626; font-weight: 900; text-transform: uppercase; font-style: italic; }
      `}} />

        <main className="container mx-auto px-4 py-12 max-w-5xl">
          <button onClick={() => router.back()} className="flex items-center gap-2 text-slate-400 mb-8 font-black text-[10px] uppercase italic tracking-widest hover:text-red-600 transition-colors">
            <ArrowLeft size={16} /> Annuler les modifications
          </button>

          <h1 className="text-4xl md:text-6xl font-black italic uppercase mb-10 tracking-tighter text-slate-900">
            Modifier <span className="text-red-600">l'actu</span>
          </h1>

          <form onSubmit={handleUpdate} className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* COLONNE GAUCHE : L'ÉDITEUR VISUEL */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-[2rem] shadow-xl border border-slate-100 overflow-hidden">
                <div className="p-4 bg-slate-50 border-bottom border-slate-100">
                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Contenu de l'article</span>
                </div>
                <ReactQuill
                    theme="snow"
                    value={content}
                    onChange={setContent}
                    modules={modules}
                />
              </div>
            </div>

            {/* COLONNE DROITE : RÉGLAGES ET INFOS */}
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-[2.5rem] shadow-xl border border-slate-100 space-y-6 sticky top-24">

                <div>
                  <label className="block text-[9px] font-black uppercase text-slate-400 mb-2 tracking-widest">Titre</label>
                  <input className="w-full p-4 bg-slate-50 border border-slate-100 rounded-xl font-bold" value={title} onChange={e => setTitle(e.target.value)} required />
                </div>

                <div>
                  <label className="block text-[9px] font-black uppercase text-slate-400 mb-2 tracking-widest">Date</label>
                  <input className="w-full p-4 bg-slate-50 border border-slate-100 rounded-xl font-bold" value={dateText} onChange={e => setDateText(e.target.value)} required />
                </div>

                <div>
                  <label className="block text-[9px] font-black uppercase text-slate-400 mb-2 tracking-widest">Lien Facebook</label>
                  <div className="relative">
                    <Facebook className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-600" size={16} />
                    <input className="w-full p-4 pl-10 bg-slate-50 border border-slate-100 rounded-xl text-sm" placeholder="URL Facebook..." value={facebookUrl} onChange={e => setFacebookUrl(e.target.value)} />
                  </div>
                </div>

                <div>
                  <label className="block text-[9px] font-black uppercase text-slate-400 mb-2 tracking-widest">Image</label>
                  <div className="relative rounded-xl overflow-hidden aspect-video bg-slate-100 border border-slate-200 group">
                    <img src={previewUrl || ""} className="w-full h-full object-cover" />
                    <label className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                      <input type="file" className="hidden" onChange={(e) => {
                        const f = e.target.files?.[0];
                        if(f) { setFile(f); setPreviewUrl(URL.createObjectURL(f)); }
                      }} />
                      <Upload className="text-white" />
                    </label>
                  </div>
                </div>

                <div className={`p-4 rounded-2xl border-2 transition-all ${isCompetition ? 'border-red-600 bg-red-50/30' : 'border-slate-100 bg-slate-50'}`}>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" className="hidden" checked={isCompetition} onChange={e => setIsCompetition(e.target.checked)} />
                    <div className={`w-10 h-5 rounded-full relative transition-colors ${isCompetition ? 'bg-red-600' : 'bg-slate-300'}`}>
                      <div className={`absolute top-1 left-1 bg-white w-3 h-3 rounded-full transition-transform ${isCompetition ? 'translate-x-5' : 'translate-x-0'}`} />
                    </div>
                    <span className="font-black uppercase italic text-[10px] text-slate-700">Document joint</span>
                  </label>
                  {isCompetition && (
                      <div className="mt-4 pt-4 border-t border-red-100 flex flex-col gap-2">
                        <input type="file" id="sch" className="hidden" onChange={e => setScheduleFile(e.target.files?.[0] || null)} />
                        <label htmlFor="sch" className="bg-white p-2 rounded-lg border border-red-200 text-[9px] font-black uppercase flex items-center justify-center gap-2 cursor-pointer hover:bg-red-600 hover:text-white transition-all">
                          <Paperclip size={12} /> {scheduleFile ? "Remplacé" : "Modifier le fichier"}
                        </label>
                      </div>
                  )}
                </div>

                <button type="submit" disabled={isUpdating} className="w-full bg-slate-900 text-white font-black py-4 rounded-2xl uppercase italic shadow-xl hover:bg-red-600 transition-all flex items-center justify-center gap-2 disabled:opacity-50">
                  {isUpdating ? <Loader2 className="animate-spin h-5 w-5" /> : <><Check size={20} /> Enregistrer</>}
                </button>

              </div>
            </div>
          </form>
        </main>
      </div>
  );
}