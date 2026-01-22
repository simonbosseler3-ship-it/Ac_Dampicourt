"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/navbar/navbar";
import { Upload, Check, ArrowLeft, Loader2 } from "lucide-react";

export default function NouveauArticle() {
  const [title, setTitle] = useState("");
  const [dateText, setDateText] = useState("");
  const [content, setContent] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

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

      const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

      const role = profile?.role?.toLowerCase().trim();

      // MODIFICATION ICI : On autorise admin OU redacteur
      if (role === 'admin' || role === 'redacteur') {
        setLoading(false);
      } else {
        router.push("/");
      }
    };

    checkAccess();
  }, [router]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      alert("Veuillez sélectionner une image pour l'article.");
      return;
    }

    setIsUploading(true);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `articles/${fileName}`;

      const { error: uploadError } = await supabase.storage
      .from('news-images')
      .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
      .from('news-images')
      .getPublicUrl(filePath);

      const { error: insertError } = await supabase.from('news').insert([
        {
          title,
          image_url: publicUrl,
          date_text: dateText,
          content
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
        <Navbar />
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
                  onChange={e => setTitle(e.target.value)}
                  required
              />
            </div>

            {/* IMAGE */}
            <div>
              <label className="block text-xs font-black uppercase italic text-slate-400 mb-2 tracking-widest">Image de couverture</label>
              <div className="border-4 border-dashed border-slate-100 rounded-3xl p-6 text-center bg-slate-50/50">
                {previewUrl ? (
                    <img
                        src={previewUrl}
                        alt="Preview"
                        className="h-56 w-full object-cover rounded-2xl mb-6 shadow-lg"
                    />
                ) : (
                    <div className="py-10 text-slate-300">Aucune image sélectionnée</div>
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

            {/* DATE */}
            <div>
              <label className="block text-xs font-black uppercase italic text-slate-400 mb-2 tracking-widest">Date (ex: 21 JANV. 2026)</label>
              <input
                  className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold focus:ring-2 focus:ring-red-500 outline-none"
                  placeholder="Ex: 21 JANV. 2026"
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