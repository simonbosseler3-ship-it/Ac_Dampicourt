import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { Navbar } from "@/components/navbar/navbar"
import { ArrowLeft, Send, AlertCircle, Check } from "lucide-react"
import Link from "next/link"
import { Resend } from 'resend'
import { getStaffPrivateEmails } from "@/lib/forum_notifications"

// Initialisation de Resend (pense à ajouter ta clé dans le .env)
const resend = new Resend(process.env.RESEND_API_KEY)

// Catégories fixes pour le forum
const CATEGORIES = ["Inscriptions", "Entraînements", "Compétitions", "Matériel", "Autre"];

export default async function NouveauTopicPage() {

  async function createTopic(formData: FormData) {
    'use server'

    const title = formData.get('title') as string
    const category = formData.get('category') as string
    const content = formData.get('content') as string

    // Sécurité : on arrête si les champs sont vides
    if (!category || !title || !content) return;

    const cookieStore = await cookies()
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
          cookies: {
            getAll() { return cookieStore.getAll() }
          }
        }
    )

    const { data: { user } } = await supabase.auth.getUser()

    // 1. Insertion du sujet dans 'forum_topics'
    const { data: topic, error: topicError } = await supabase
    .from('forum_topics')
    .insert({
      title,
      category,
      author_id: user?.id || null,
      is_closed: false
    })
    .select()
    .single()

    if (topicError) {
      console.error("Erreur topic:", topicError.message)
      return
    }

    if (topic && content) {
      // 2. Insertion du contenu détaillé dans 'forum_messages'
      await supabase.from('forum_messages').insert({
        topic_id: topic.id,
        author_id: user?.id || null,
        content: content,
        is_staff_answer: false
      })

      // 3. LOGIQUE DE NOTIFICATION PAR EMAIL
      try {
        // Récupération des emails privés (dont le tien simonbosseler3@gmail.com)
        const emails = await getStaffPrivateEmails(supabase);

        if (emails.length > 0) {
          await resend.emails.send({
            from: 'ACD Forum <notifications@resend.dev>', // Change par ton domaine une fois validé
            to: emails,
            subject: `🔥 Nouveau sujet : ${title}`,
            html: `
              <div style="font-family: sans-serif; max-width: 600px; border: 1px solid #e2e8f0; border-radius: 20px; padding: 30px; color: #0f172a;">
                <h1 style="font-size: 24px; font-weight: 900; font-style: italic; text-transform: uppercase; margin-bottom: 20px;">
                  Une nouvelle question vient d'être posée
                </h1>
                <p style="text-transform: uppercase; font-size: 12px; font-weight: 800; color: #ef4444; letter-spacing: 1px;">
                  Catégorie : ${category}
                </p>
                <div style="background-color: #f8fafc; border-radius: 15px; padding: 20px; margin: 20px 0; border: 1px solid #f1f5f9;">
                  <h2 style="margin-top: 0; font-size: 18px;">${title}</h2>
                  <p style="font-style: italic; color: #475569; line-height: 1.6;">"${content}"</p>
                </div>
                <a href="${process.env.NEXT_PUBLIC_SITE_URL}/forum/${topic.id}" 
                   style="display: inline-block; background-color: #0f172a; color: #ffffff; padding: 14px 28px; border-radius: 12px; text-decoration: none; font-weight: bold; font-size: 14px; text-transform: uppercase; font-style: italic;">
                   Répondre sur le site
                </a>
              </div>
            `
          });
        }
      } catch (err) {
        console.error("Erreur lors de l'envoi de l'email :", err);
      }
    }

    // Redirection après succès
    redirect('/forum')
  }

  return (
      <div className="min-h-screen">

        <main className="container mx-auto px-4 pt-32 pb-20 max-w-3xl">

          <Link href="/forum"
                className="flex items-center gap-2 text-slate-400 hover:text-red-600 font-bold uppercase italic text-xs mb-8 transition-colors group">
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform"/>
            Retour au forum
          </Link>

          <div className="bg-white rounded-[3rem] p-8 md:p-12 shadow-xl border border-slate-100">
            <div className="mb-10">
              <h1 className="text-4xl font-black text-slate-900 uppercase italic tracking-tighter">
                Poser une <span className="text-red-600">Question</span>
              </h1>
              <p className="text-slate-500 font-medium mt-2">
                Tout le monde peut poser une question. Le staff vous répondra rapidement.
              </p>
            </div>

            <form action={createTopic} className="space-y-8">

              {/* TITRE */}
              <div className="space-y-3">
                <label
                    className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">
                  Objet de la question
                </label>
                <input
                    name="title"
                    required
                    placeholder="Ex: Horaires du car pour le cross d'Etalle"
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 px-6 font-bold focus:border-red-600 outline-none transition-all placeholder:text-slate-300 text-slate-900"
                />
              </div>

              {/* SELECTEUR DE CATÉGORIE */}
              <div className="space-y-3">
                <label
                    className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">
                  Choisissez une catégorie
                </label>

                <div className="flex flex-wrap gap-3">
                  {CATEGORIES.map((cat) => (
                      <label key={cat} className="cursor-pointer group relative">
                        <input
                            type="radio"
                            name="category"
                            value={cat}
                            required
                            className="peer sr-only"
                        />
                        <div className="px-6 py-3 rounded-full font-black uppercase italic text-[10px] tracking-widest border-2 border-slate-100 text-slate-400 bg-slate-50 transition-all
                        peer-checked:bg-red-600 peer-checked:text-white peer-checked:border-red-600 peer-checked:shadow-lg peer-checked:shadow-red-200
                        hover:border-red-200 hover:bg-white
                        flex items-center gap-2
                      ">
                          {cat}
                          <Check size={12}
                                 className="hidden peer-checked:block animate-in zoom-in duration-200"/>
                        </div>
                      </label>
                  ))}
                </div>
              </div>

              {/* MESSAGE DÉTAILLÉ */}
              <div className="space-y-3">
                <label
                    className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">
                  Votre message détaillé
                </label>
                <textarea
                    name="content"
                    required
                    rows={6}
                    placeholder="Expliquez votre demande ici..."
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-[2rem] py-4 px-6 font-bold focus:border-red-600 outline-none transition-all placeholder:text-slate-300 resize-none text-slate-900"
                ></textarea>
              </div>

              {/* ALERTE */}
              <div
                  className="bg-red-50 p-6 rounded-2xl flex gap-4 items-start mb-4 border border-red-100">
                <AlertCircle className="text-red-600 shrink-0 mt-0.5" size={20}/>
                <p className="text-xs font-bold text-red-800 leading-relaxed uppercase tracking-tight">
                  Votre question sera publiée publiquement. Le staff ACD vous répondra dans les plus
                  brefs délais.
                </p>
              </div>

              <button
                  type="submit"
                  className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black uppercase italic tracking-widest flex items-center justify-center gap-3 hover:bg-red-600 transition-all shadow-xl active:scale-95 group"
              >
                <Send size={20}
                      className="group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform"/>
                Publier la question
              </button>
            </form>
          </div>
        </main>
      </div>
  )
}