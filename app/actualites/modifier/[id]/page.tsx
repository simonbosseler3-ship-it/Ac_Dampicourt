"use client";

import { useEffect, useState, use } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { Upload, Check, ArrowLeft, Loader2, Trophy, Paperclip, FileText, X } from "lucide-react";

export default function ModifierArticle({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [dateText, setDateText] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  // États pour le fichier joint / compétition
  const [isCompetition, setIsCompetition] = useState(false);
  const [existingScheduleUrl, setExistingScheduleUrl] = useState<string | null>(null);
  const [scheduleFile, setScheduleFile] = useState<File | null>(null);

  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const loadArticle = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/actualites");
        return;
      }

      const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

      const role = profile?.role?.toLowerCase().trim();

      if (role !== 'admin' && role !== 'redacteur') {
        router.push("/actualites");
        return;
      }

      const { data: article, error } = await supabase
      .from('news')
      .select('*')
      .eq('id', id)
      .single();

      if (error || !article) {
        router.push("/actualites");
        return;
      }

      setTitle(article.title);
      setDateText(article.date_text);
      setContent(article.content || "");
      setImageUrl(article.image_url);
      setPreviewUrl(article.image_url);

      // Récupération de l'horaire/fichier
      if (article.schedule_url) {
        setIsCompetition(true);
        setExistingScheduleUrl(article.schedule_url);
      }

      setLoading(false);
    };

    loadArticle();
  }, [id, router]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
    }
  };

  const handleScheduleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setScheduleFile(selectedFile);
    }
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
        const { error: uploadError } = await supabase.storage
        .from('news-images')
        .upload(fileName, file);

        if (uploadError) throw uploadError;
        const { data: { publicUrl } } = supabase.storage.from('news-images').getPublicUrl(fileName);
        finalImageUrl = publicUrl;
      }

      // 2. Gestion du document joint
      let finalScheduleUrl = existingScheduleUrl;

      if (!isCompetition) {
        finalScheduleUrl = null; // Si on décoche, on supprime le lien
      } else if (scheduleFile) {
        // Si un nouveau fichier est sélectionné
        const fileExt = scheduleFile.name.split('.').pop();
        const fileName = `doc_${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
        .from('news-images')
        .upload(`files/${fileName}`, scheduleFile);

        if (uploadError) throw uploadError;
        const { data: { publicUrl } } = supabase.storage.from('news-images').getPublicUrl(`files/${fileName}`);
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
        schedule_url: finalScheduleUrl, // Mise à jour du fichier
      })
      .eq('id', id);

      if (updateError) throw updateError;

      router.push("/actualites");
      router.refresh();
    } catch (error: any) {
      alert("Erreur lors de la mise à jour : " + error.message);
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) {
    return (
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="animate-spin h-8 w-8 text-red-600" />
        </div>
    );
  }

  return (
      <div className="min-h-screen">
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

          <form onSubmit={handleUpdate} className="bg-white/90 backdrop-blur-md p-8 rounded-[2rem] shadow-2xl border-t-8 border-red-600 space-y-8">

            {/* TITRE */}
            <div>
              <label className="block text-xs font-black uppercase italic text-slate-400 mb-2 tracking-widest">Titre de l'article</label>
              <input
                  className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-lg focus:ring-2 focus:ring-red-500 outline-none transition-all"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  required
              />
            </div>

            {/* IMAGE */}
            <div>
              <label className="block text-xs font-black uppercase italic text-slate-400 mb-2 tracking-widest">Image de couverture</label>
              <div className="border-4 border-dashed border-slate-100 rounded-3xl p-6 text-center bg-slate-50/50">
                {previewUrl && (
                    <img
                        src={previewUrl}
                        alt="Preview"
                        className="h-56 w-full object-cover rounded-2xl mb-6 shadow-lg"
                    />
                )}
                <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" id="file-edit" />
                <label
                    htmlFor="file-edit"
                    className="cursor-pointer bg-white text-slate-900 border border-slate-200 px-6 py-3 rounded-xl font-black text-sm inline-flex items-center gap-2 hover:bg-slate-900 hover:text-white transition-all shadow-sm"
                >
                  <Upload size={18} /> Choisir une nouvelle photo
                </label>
              </div>
            </div>

            {/* SECTION FICHIER JOINT (COMPÉTITION) */}
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
              <div className="flex items-center justify-between mb-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <div className={`w-12 h-7 rounded-full p-1 transition-colors ${isCompetition ? 'bg-red-600' : 'bg-slate-300'}`}>
                    <div className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform ${isCompetition ? 'translate-x-5' : 'translate-x-0'}`}></div>
                  </div>
                  <span className="font-black uppercase italic text-sm text-slate-700 flex items-center gap-2">
                    <Trophy size={16} className={isCompetition ? "text-red-600" : "text-slate-400"} />
                    Lier une compétition / un fichier ?
                  </span>
                  <input
                      type="checkbox"
                      className="hidden"
                      checked={isCompetition}
                      onChange={(e) => setIsCompetition(e.target.checked)}
                  />
                </label>
              </div>

              {isCompetition && (
                  <div className="animate-in fade-in slide-in-from-top-2 duration-300 pt-4 border-t border-slate-200">
                    <label className="block text-xs font-black uppercase italic text-slate-400 mb-2 tracking-widest">
                      Document joint (Horaire, Résultats, Info...)
                    </label>
                    <div className="flex items-center gap-4">
                      <input
                          type="file"
                          onChange={handleScheduleChange}
                          className="hidden"
                          id="schedule-edit"
                      />
                      <label
                          htmlFor="schedule-edit"
                          className="cursor-pointer bg-slate-900 text-white px-4 py-3 rounded-xl font-bold text-xs uppercase inline-flex items-center gap-2 hover:bg-red-600 transition-all"
                      >
                        <Paperclip size={16} />
                        {scheduleFile || existingScheduleUrl ? "Changer le fichier" : "Joindre un fichier"}
                      </label>

                      {(scheduleFile || existingScheduleUrl) && (
                          <div className="flex flex-col">
                            <span className="text-xs font-black text-green-600 uppercase italic">Fichier présent</span>
                            <span className="text-[10px] text-slate-400 truncate max-w-[200px] italic">
                              {scheduleFile ? scheduleFile.name : "Fichier déjà en ligne"}
                            </span>
                          </div>
                      )}
                    </div>
                  </div>
              )}
            </div>

            {/* DATE TEXTE */}
            <div>
              <label className="block text-xs font-black uppercase italic text-slate-400 mb-2 tracking-widest">Date (ex: 20 JANV. 2026)</label>
              <input
                  className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold focus:ring-2 focus:ring-red-500 outline-none"
                  value={dateText}
                  onChange={e => setDateText(e.target.value)}
                  required
              />
            </div>

            {/* CONTENU TEXTE */}
            <div>
              <label className="block text-xs font-black uppercase italic text-slate-400 mb-2 tracking-widest">Corps de l'article</label>
              <textarea
                  className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-medium h-64 resize-none focus:ring-2 focus:ring-red-500 outline-none leading-relaxed"
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  placeholder="Rédigez le contenu de votre actualité ici..."
                  required
              />
            </div>

            {/* BOUTON SUBMIT */}
            <button
                type="submit"
                disabled={isUpdating}
                className="w-full bg-red-600 text-white font-black py-5 rounded-2xl uppercase italic shadow-xl shadow-red-200 hover:bg-red-700 hover:-translate-y-1 active:scale-95 transition-all flex items-center justify-center gap-3 text-lg"
            >
              {isUpdating ? (
                  <Loader2 className="animate-spin h-6 w-6" />
              ) : (
                  <><Check size={24} /> Enregistrer les modifications</>
              )}
            </button>
          </form>
        </main>
      </div>
  );
}