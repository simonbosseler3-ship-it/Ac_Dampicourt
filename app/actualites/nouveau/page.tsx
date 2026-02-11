"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { Upload, Check, ArrowLeft, Loader2, Calendar, Trophy, X, Paperclip } from "lucide-react";

export default function NouveauArticle() {
  const [title, setTitle] = useState("");
  const [dateText, setDateText] = useState(new Date().toISOString().split('T')[0]);
  const [content, setContent] = useState("");

  // Image principale
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Compétition & Fichiers
  const [isCompetition, setIsCompetition] = useState(false);
  const [scheduleFile, setScheduleFile] = useState<File | null>(null);

  const [userId, setUserId] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAccess = async () => {
      try {
        // 1. On vérifie la session de manière légère
        const { data: { session } } = await supabase.auth.getSession();

        if (!session) {
          router.replace("/login");
          return;
        }

        // 2. Vérification du rôle
        const { data: profile, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single();

        if (error || !profile) {
          router.replace("/");
          return;
        }

        const role = profile.role?.toLowerCase().trim();
        if (role === 'admin' || role === 'redacteur') {
          setUserId(session.user.id);
          setLoading(false);
        } else {
          router.replace("/");
        }
      } catch (err) {
        console.error("Erreur accès:", err);
        router.replace("/");
      }
    };

    checkAccess();
  }, [router]);

  // Nettoyage de l'URL de preview pour éviter les fuites mémoire
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
    }
  };

  const handleScheduleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) setScheduleFile(selectedFile);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file || !userId) {
      alert("Veuillez vérifier l'image et votre connexion.");
      return;
    }

    setIsUploading(true);

    try {
      // 1. Upload Image de couverture
      const fileExt = file.name.split('.').pop();
      const fileName = `cover_${Date.now()}.${fileExt}`;
      const filePath = `articles/${fileName}`;

      const { error: uploadError } = await supabase.storage
      .from('news-images')
      .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl: imageUrl } } = supabase.storage
      .from('news-images')
      .getPublicUrl(filePath);

      // 2. Upload Document Joint
      let scheduleUrl = null;
      if (isCompetition && scheduleFile) {
        const originalExt = scheduleFile.name.split('.').pop();
        const docName = `doc_${Date.now()}.${originalExt}`;
        const docPath = `files/${docName}`;

        const { error: docError } = await supabase.storage
        .from('news-images')
        .upload(docPath, scheduleFile);

        if (docError) throw docError;

        const { data: { publicUrl } } = supabase.storage
        .from('news-images')
        .getPublicUrl(docPath);

        scheduleUrl = publicUrl;
      }

      // 3. Insertion DB
      const { error: insertError } = await supabase.from('news').insert([
        {
          title,
          image_url: imageUrl,
          date_text: dateText,
          content,
          author_id: userId,
          schedule_url: scheduleUrl
        }
      ]);

      if (insertError) throw insertError;

      router.push("/actualites");
      router.refresh();
    } catch (error: any) {
      alert("Erreur : " + error.message);
      setIsUploading(false);
    }
  };

  if (loading) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-4">
          <Loader2 className="animate-spin h-10 w-10 text-red-600" />
          <p className="text-xs font-black uppercase italic text-slate-400 animate-pulse">Vérification des droits...</p>
        </div>
    );
  }

  return (
      <div className="min-h-screen bg-slate-50/50">
        <main className="container mx-auto px-4 py-12 max-w-3xl">
          <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-slate-500 mb-8 hover:text-red-600 transition-colors uppercase font-black text-sm italic"
          >
            <ArrowLeft size={18} /> Retour
          </button>

          <h1 className="text-4xl font-black italic uppercase mb-10 tracking-tighter">
            Nouvelle <span className="text-red-600">Actualité</span>
          </h1>

          <form onSubmit={handleSubmit} className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100 space-y-8">

            {/* Titre */}
            <div>
              <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 tracking-[0.2em]">Titre de l'article</label>
              <input
                  className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-lg focus:ring-2 focus:ring-red-500 outline-none transition-all"
                  placeholder="Ex: Record du club battu au 100m"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  required
              />
            </div>

            {/* Image */}
            <div>
              <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 tracking-[0.2em]">Image de couverture</label>
              <div className="border-4 border-dashed border-slate-100 rounded-3xl p-6 text-center bg-slate-50/50">
                {previewUrl ? (
                    <div className="relative mb-4">
                      <img src={previewUrl} alt="Preview" className="h-64 w-full object-cover rounded-2xl shadow-md" />
                      <button
                          type="button"
                          onClick={() => { setFile(null); setPreviewUrl(null); }}
                          className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full hover:scale-110 transition"
                      >
                        <X size={16} />
                      </button>
                    </div>
                ) : (
                    <div className="py-12 text-slate-300 font-bold uppercase italic text-sm">Aucune image sélectionnée</div>
                )}
                <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" id="file-upload" />
                <label htmlFor="file-upload" className="cursor-pointer bg-slate-900 text-white px-8 py-3 rounded-xl font-black text-xs uppercase inline-flex items-center gap-2 hover:bg-red-600 transition-all shadow-lg">
                  <Upload size={18} /> Choisir une photo
                </label>
              </div>
            </div>

            {/* Section Document joint */}
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
                <Trophy size={16} /> Joindre un document (Horaire, PDF, etc.)
              </span>
              </label>

              {isCompetition && (
                  <div className="pt-4 border-t border-slate-200 animate-in fade-in slide-in-from-top-2">
                    <div className="flex items-center gap-4">
                      <input type="file" onChange={handleScheduleChange} className="hidden" id="schedule-upload" />
                      <label htmlFor="schedule-upload" className="cursor-pointer bg-white border-2 border-slate-900 text-slate-900 px-4 py-2 rounded-xl font-black text-[10px] uppercase inline-flex items-center gap-2 hover:bg-slate-900 hover:text-white transition-all">
                        <Paperclip size={14} /> {scheduleFile ? "Changer" : "Sélectionner le fichier"}
                      </label>
                      {scheduleFile && <span className="text-[10px] font-bold text-green-600 uppercase italic truncate max-w-[200px]">{scheduleFile.name}</span>}
                    </div>
                  </div>
              )}
            </div>

            {/* Date et Contenu */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="md:col-span-2">
                <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 tracking-[0.2em]">Date de l'actualité</label>
                <input
                    type="date"
                    className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold focus:ring-2 focus:ring-red-500 outline-none"
                    value={dateText}
                    onChange={e => setDateText(e.target.value)}
                    required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 tracking-[0.2em]">Contenu</label>
                <textarea
                    className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-medium h-64 resize-none focus:ring-2 focus:ring-red-500 outline-none leading-relaxed"
                    placeholder="Écrivez ici..."
                    value={content}
                    onChange={e => setContent(e.target.value)}
                    required
                />
              </div>
            </div>

            <button
                type="submit"
                disabled={isUploading}
                className="w-full bg-green-600 text-white font-black py-5 rounded-2xl uppercase italic shadow-lg hover:bg-green-700 hover:-translate-y-1 active:scale-95 transition-all flex items-center justify-center gap-3 text-lg disabled:opacity-50 disabled:translate-y-0"
            >
              {isUploading ? <Loader2 className="animate-spin h-6 w-6" /> : <><Check size={24} /> Publier l'actualité</>}
            </button>
          </form>
        </main>
      </div>
  );
}