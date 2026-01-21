"use client";

import { useEffect, useState, use } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/navbar/navbar";
import { Upload, Check, ArrowLeft, Loader2 } from "lucide-react";

export default function ModifierArticle({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();

  // États du formulaire
  const [title, setTitle] = useState("");
  const [dateText, setDateText] = useState("");
  const [content, setContent] = useState(""); // Nouveau champ texte
  const [imageUrl, setImageUrl] = useState("");

  // États techniques
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const loadArticle = async () => {
      // 1. Vérifier si l'utilisateur est admin
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

      if (profile?.role?.toLowerCase() !== 'admin') {
        router.push("/actualites");
        return;
      }

      // 2. Charger les données actuelles de l'article
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

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);

    try {
      let finalImageUrl = imageUrl;

      // Si une nouvelle image a été sélectionnée, on l'uploade
      if (file) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
        .from('news-images')
        .upload(fileName, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
        .from('news-images')
        .getPublicUrl(fileName);

        finalImageUrl = publicUrl;
      }

      // Mise à jour des données dans la table 'news'
      const { error: updateError } = await supabase
      .from('news')
      .update({
        title,
        date_text: dateText,
        content, // Enregistrement du texte de l'article
        image_url: finalImageUrl,
      })
      .eq('id', id);

      if (updateError) throw updateError;

      // Retour à la page des actualités avec rafraîchissement
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
        <Navbar />
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