"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { Upload, Check, ArrowLeft, Loader2, Calendar, Trophy, FileText, X, Paperclip } from "lucide-react";

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
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      setUserId(user.id);

      const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

      const role = profile?.role?.toLowerCase().trim();

      if (role === 'admin' || role === 'redacteur') {
        setLoading(false);
      } else {
        router.push("/");
      }
    };

    checkAccess();
  }, [router]);

  // GESTION IMAGE COUVERTURE
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
    }
  };

  // GESTION FICHIER JOINT (TOUT TYPE)
  const handleScheduleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setScheduleFile(selectedFile);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      alert("Veuillez sélectionner une image de couverture pour l'article.");
      return;
    }

    if (!userId) {
      alert("Session utilisateur introuvable.");
      return;
    }

    setIsUploading(true);

    try {
      // 1. UPLOAD IMAGE PRINCIPALE
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


      // 2. UPLOAD DOCUMENT JOINT (SI PRÉSENT)
      let scheduleUrl = null;

      if (isCompetition && scheduleFile) {
        // On garde le nom d'origine pour que l'extension soit propre (ex: resultat.pdf, info.docx)
        const originalExt = scheduleFile.name.split('.').pop();
        const docName = `doc_${Date.now()}.${originalExt}`;
        const docPath = `files/${docName}`; // Stockage dans un dossier 'files' pour séparer des images

        const { error: scheduleUploadError } = await supabase.storage
        .from('news-images')
        .upload(docPath, scheduleFile);

        if (scheduleUploadError) throw scheduleUploadError;

        const { data: { publicUrl } } = supabase.storage
        .from('news-images')
        .getPublicUrl(docPath);

        scheduleUrl = publicUrl;
      }

      // 3. INSERTION DB
      const { error: insertError } = await supabase.from('news').insert([
        {
          title,
          image_url: imageUrl,
          date_text: dateText,
          content,
          author_id: userId,
          schedule_url: scheduleUrl // Stocke l'URL du fichier quel que soit son type
        }
      ]);

      if (insertError) throw insertError;

      router.push("/actualites");
      router.refresh();
    } catch (error: any) {
      alert("Erreur lors de la publication : " + error.message);
    } finally {
      setIsUploading(false);
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
            Nouvelle <span className="text-red-600">Actualité</span>
          </h1>

          <form onSubmit={handleSubmit} className="bg-white/90 backdrop-blur-md p-8 rounded-[2rem] shadow-2xl border-t-8 border-green-500 space-y-8">

            {/* TITRE */}
            <div>
              <label className="block text-xs font-black uppercase italic text-slate-400 mb-2 tracking-widest">Titre de l'article</label>
              <input
                  className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-lg focus:ring-2 focus:ring-red-500 outline-none transition-all"
                  placeholder="Ex: Record du club battu au 100m"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  required
              />
            </div>

            {/* IMAGE */}
            <div>
              <label className="block text-xs font-black uppercase italic text-slate-400 mb-2 tracking-widest">Image de couverture</label>
              <div className="border-4 border-dashed border-slate-100 rounded-3xl p-6 text-center bg-slate-50/50 hover:bg-slate-50 transition-colors">
                {previewUrl ? (
                    <div className="relative">
                      <img
                          src={previewUrl}
                          alt="Preview"
                          className="h-56 w-full object-cover rounded-2xl mb-4 shadow-lg"
                      />
                      <button
                          type="button"
                          onClick={() => { setFile(null); setPreviewUrl(null); }}
                          className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition"
                      >
                        <X size={14} />
                      </button>
                    </div>
                ) : (
                    <div className="py-8 text-slate-300">Aucune image sélectionnée</div>
                )}
                <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" id="file-upload" />
                <label
                    htmlFor="file-upload"
                    className="cursor-pointer bg-white text-slate-900 border border-slate-200 px-6 py-3 rounded-xl font-black text-sm inline-flex items-center gap-2 hover:bg-slate-900 hover:text-white transition-all shadow-sm"
                >
                  <Upload size={18} /> Sélectionner une photo
                </label>
              </div>
            </div>

            {/* TOGGLE COMPETITION / FICHIER */}
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

              {/* UPLOAD DOCUMENT (Apparait seulement si compétition/activé) */}
              {isCompetition && (
                  <div className="animate-in fade-in slide-in-from-top-2 duration-300 pt-4 border-t border-slate-200">
                    <label className="block text-xs font-black uppercase italic text-slate-400 mb-2 tracking-widest">
                      Document joint (Horaire, Résultats, Info...)
                    </label>
                    <div className="flex items-center gap-4">
                      {/* Note: Pas d'attribut accept ici, donc tous les fichiers sont autorisés */}
                      <input
                          type="file"
                          onChange={handleScheduleChange}
                          className="hidden"
                          id="schedule-upload"
                      />
                      <label
                          htmlFor="schedule-upload"
                          className="cursor-pointer bg-slate-900 text-white px-4 py-3 rounded-xl font-bold text-xs uppercase inline-flex items-center gap-2 hover:bg-red-600 transition-all"
                      >
                        <Paperclip size={16} />
                        {scheduleFile ? "Changer le fichier" : "Joindre un fichier"}
                      </label>
                      {scheduleFile && (
                          <div className="flex flex-col">
                            <span className="text-sm font-medium text-green-600 flex items-center gap-1">
                                <Check size={14} /> Fichier prêt
                            </span>
                            <span className="text-[10px] text-slate-500 truncate max-w-[150px]">
                                {scheduleFile.name}
                            </span>
                          </div>
                      )}
                    </div>
                    <p className="text-[10px] text-slate-400 mt-2 italic">
                      Formats acceptés : PDF, Image, Word, Excel, etc. Un bouton de téléchargement apparaîtra sur l'article.
                    </p>
                  </div>
              )}
            </div>

            {/* DATE */}
            <div>
              <label className="block text-xs font-black uppercase italic text-slate-400 mb-2 tracking-widest flex items-center gap-2">
                <Calendar size={14} /> Date de l'actualité
              </label>
              <input
                  type="date"
                  className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold focus:ring-2 focus:ring-red-500 outline-none text-slate-700"
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
                  placeholder="Rédigez l'actualité en détail ici..."
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  required
              />
            </div>

            {/* BOUTON PUBLIER */}
            <button
                type="submit"
                disabled={isUploading}
                className="w-full bg-green-600 text-white font-black py-5 rounded-2xl uppercase italic shadow-xl shadow-green-100 hover:bg-green-700 hover:-translate-y-1 active:scale-95 transition-all flex items-center justify-center gap-3 text-lg"
            >
              {isUploading ? (
                  <Loader2 className="animate-spin h-6 w-6" />
              ) : (
                  <><Check size={24} /> Publier l'article</>
              )}
            </button>
          </form>
        </main>
      </div>
  );
}