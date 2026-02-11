"use client";

import { useEffect, useState, use } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { Upload, Check, ArrowLeft, Loader2, Trophy, Paperclip, X } from "lucide-react";

export default function ModifierArticle({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();

  // États des champs
  const [title, setTitle] = useState("");
  const [dateText, setDateText] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  // États pour le fichier joint / compétition
  const [isCompetition, setIsCompetition] = useState(false);
  const [existingScheduleUrl, setExistingScheduleUrl] = useState<string | null>(null);
  const [scheduleFile, setScheduleFile] = useState<File | null>(null);

  // États pour l'image de couverture
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // États de chargement
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const loadArticle = async () => {
      try {
        // 1. Vérification rapide de la session
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          router.replace("/login");
          return;
        }

        // 2. Vérification du rôle et récupération de l'article en parallèle
        const [profileRes, articleRes] = await Promise.all([
          supabase.from('profiles').select('role').eq('id', session.user.id).single(),
          supabase.from('news').select('*').eq('id', id).single()
        ]);

        const role = profileRes.data?.role?.toLowerCase().trim();
        if (role !== 'admin' && role !== 'redacteur') {
          router.replace("/actualites");
          return;
        }

        if (articleRes.error || !articleRes.data) {
          router.replace("/actualites");
          return;
        }

        const article = articleRes.data;
        setTitle(article.title);
        setDateText(article.date_text);
        setContent(article.content || "");
        setImageUrl(article.image_url);
        setPreviewUrl(article.image_url);

        if (article.schedule_url) {
          setIsCompetition(true);
          setExistingScheduleUrl(article.schedule_url);
        }
      } catch (err) {
        console.error("Erreur chargement:", err);
        router.replace("/actualites");
      } finally {
        setLoading(false);
      }
    };

    loadArticle();
  }, [id, router]);

  // Nettoyage des URLs de prévisualisation
  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (previewUrl && previewUrl.startsWith('blob:')) URL.revokeObjectURL(previewUrl);
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
    }
  };

  const handleScheduleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) setScheduleFile(selectedFile);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);

    try {
      // 1. Gestion de l'image de couverture
      let finalImageUrl = imageUrl;
      if (file) {
        const fileExt = file.name.split('.').pop();
        const fileName = `cover_${Date.now()}.${fileExt}`;
        const filePath = `articles/${fileName}`; // Chemin structuré

        const { error: uploadError } = await supabase.storage
        .from('news-images')
        .upload(filePath, file);

        if (uploadError) throw uploadError;
        const { data: { publicUrl } } = supabase.storage.from('news-images').getPublicUrl(filePath);
        finalImageUrl = publicUrl;
      }

      // 2. Gestion du document joint
      let finalScheduleUrl = existingScheduleUrl;

      if (!isCompetition) {
        finalScheduleUrl = null;
      } else if (scheduleFile) {
        const fileExt = scheduleFile.name.split('.').pop();
        const fileName = `doc_${Date.now()}.${fileExt}`;
        const filePath = `files/${fileName}`;

        const { error: uploadError } = await supabase.storage
        .from('news-images')
        .upload(filePath, scheduleFile);

        if (uploadError) throw uploadError;
        const { data: { publicUrl } } = supabase.storage.from('news-images').getPublicUrl(filePath);
        finalScheduleUrl = publicUrl;
      }

      // 3. Mise à jour de la base de données
      const { error: updateError } = await supabase
      .from('news')
      .update({
        title,
        date_text: dateText,
        content,
        image_url: finalImageUrl,
        schedule_url: finalScheduleUrl,
      })
      .eq('id', id);

      if (updateError) throw updateError;

      router.push("/actualites");
      router.refresh();
    } catch (error: any) {
      alert("Erreur lors de la mise à jour : " + error.message);
      setIsUpdating(false);
    }
  };

  if (loading) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-4">
          <Loader2 className="animate-spin h-10 w-10 text-red-600" />
          <p className="text-[10px] font-black uppercase italic text-slate-400">Chargement de l'article...</p>
        </div>
    );
  }

  return (
      <div className="min-h-screen bg-slate-50/30">
        <main className="container mx-auto px-4 py-12 max-w-3xl">
          <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-slate-500 mb-8 hover:text-red-600 transition-colors uppercase font-black text-sm italic"
          >
            <ArrowLeft size={18} /> Retour
          </button>

          <h1 className="text-4xl font-black italic uppercase mb-10 tracking-tighter">
            Modifier <span className="text-red-600">l'actualité</span>
          </h1>

          <form onSubmit={handleUpdate} className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100 space-y-8">

            {/* TITRE */}
            <div>
              <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 tracking-[0.2em]">Titre de l'article</label>
              <input
                  className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-lg focus:ring-2 focus:ring-red-500 outline-none transition-all"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  required
              />
            </div>

            {/* IMAGE */}
            <div>
              <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 tracking-[0.2em]">Image de couverture</label>
              <div className="border-4 border-dashed border-slate-100 rounded-3xl p-6 text-center bg-slate-50/50">
                {previewUrl && (
                    <div className="relative mb-6">
                      <img src={previewUrl} alt="Preview" className="h-64 w-full object-cover rounded-2xl shadow-md" />
                      <div className="absolute top-2 right-2 bg-slate-900/80 text-white text-[8px] px-2 py-1 rounded-full uppercase font-bold">Aperçu</div>
                    </div>
                )}
                <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" id="file-edit" />
                <label htmlFor="file-edit" className="cursor-pointer bg-slate-900 text-white px-8 py-3 rounded-xl font-black text-xs uppercase inline-flex items-center gap-2 hover:bg-red-600 transition-all shadow-lg">
                  <Upload size={18} /> Remplacer la photo
                </label>
              </div>
            </div>

            {/* SECTION FICHIER JOINT */}
            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
              <label className="flex items-center gap-3 cursor-pointer mb-4">
                <input
                    type="checkbox"
                    className="hidden"
                    checked={isCompetition}
                    onChange={(e) => setIsCompetition(e.target.checked)}
                />
                <div className={`w-12 h-6 rounded-full transition-colors relative ${isCompetition ? 'bg-red-600' : 'bg-slate-300'}`}>
                  <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${isCompetition ? 'translate-x-6' : 'translate-x-0'}`} />
                </div>
                <span className="font-black uppercase italic text-xs text-slate-700 flex items-center gap-2">
                <Trophy size={16} /> Lier un document (Horaire, Résultats...)
              </span>
              </label>

              {isCompetition && (
                  <div className="pt-4 border-t border-slate-200 animate-in fade-in slide-in-from-top-2">
                    <div className="flex items-center gap-4">
                      <input type="file" onChange={handleScheduleChange} className="hidden" id="schedule-edit" />
                      <label htmlFor="schedule-edit" className="cursor-pointer bg-white border-2 border-slate-900 text-slate-900 px-4 py-2 rounded-xl font-black text-[10px] uppercase inline-flex items-center gap-2 hover:bg-slate-900 hover:text-white transition-all">
                        <Paperclip size={14} /> {scheduleFile || existingScheduleUrl ? "Changer le fichier" : "Joindre"}
                      </label>
                      {(scheduleFile || existingScheduleUrl) && (
                          <span className="text-[10px] font-bold text-green-600 uppercase italic truncate max-w-[200px]">
                      {scheduleFile ? scheduleFile.name : "Fichier déjà en ligne"}
                    </span>
                      )}
                    </div>
                  </div>
              )}
            </div>

            {/* DATE & CONTENU */}
            <div className="space-y-8">
              <div>
                <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 tracking-[0.2em]">Date (ex: 20 JANV. 2026)</label>
                <input
                    className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold focus:ring-2 focus:ring-red-500 outline-none"
                    value={dateText}
                    onChange={e => setDateText(e.target.value)}
                    required
                />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 tracking-[0.2em]">Corps de l'article</label>
                <textarea
                    className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-medium h-64 resize-none focus:ring-2 focus:ring-red-500 outline-none leading-relaxed"
                    value={content}
                    onChange={e => setContent(e.target.value)}
                    required
                />
              </div>
            </div>

            <button
                type="submit"
                disabled={isUpdating}
                className="w-full bg-red-600 text-white font-black py-5 rounded-2xl uppercase italic shadow-lg hover:bg-red-700 hover:-translate-y-1 active:scale-95 transition-all flex items-center justify-center gap-3 text-lg disabled:opacity-50 disabled:translate-y-0"
            >
              {isUpdating ? <Loader2 className="animate-spin h-6 w-6" /> : <><Check size={24} /> Enregistrer les modifications</>}
            </button>
          </form>
        </main>
      </div>
  );
}