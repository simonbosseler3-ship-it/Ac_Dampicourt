import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { Navbar } from "@/components/navbar/navbar"
import { ArrowLeft, Send, AlertCircle } from "lucide-react"
import Link from "next/link"

export default async function NouveauTopicPage() {

  async function createTopic(formData: FormData) {
    'use server'

    const title = formData.get('title') as string
    const category = formData.get('category') as string
    const content = formData.get('content') as string

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

    // 1. On récupère l'utilisateur s'il existe, mais on ne bloque plus s'il est absent
    const { data: { user } } = await supabase.auth.getUser()

    // 2. Insertion du sujet (author_id sera null si personne n'est connecté)
    const { data: topic, error: topicError } = await supabase
    .from('forum_topics')
    .insert({
      title,
      category,
      author_id: user?.id || null, // Autorise le post anonyme
      is_closed: false
    })
    .select()
    .single()

    if (topicError) {
      console.error("Erreur lors de la création du sujet :", topicError.message)
      return
    }

    // 3. Insertion du premier message (le corps de la question)
    if (topic && content) {
      const { error: msgError } = await supabase
      .from('forum_messages')
      .insert({
        topic_id: topic.id,
        author_id: user?.id || null, // Autorise le post anonyme
        content: content,
        is_staff_answer: false // Forcément faux ici
      })

      if (msgError) {
        console.error("Erreur lors de la création du message :", msgError.message)
      }
    }

    // 4. Redirection vers la liste du forum
    redirect('/forum')
  }

  return (
      <div className="min-h-screen">
        <Navbar/>

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
              <p className="text-slate-500 font-medium mt-2">Tout le monde peut poser une question.
                Le staff vous répondra rapidement.</p>
            </div>

            <form action={createTopic} className="space-y-8">
              {/* TITRE */}
              <div className="space-y-2">
                <label
                    className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Objet
                  de la question</label>
                <input
                    name="title"
                    required
                    placeholder="Ex: Horaires du car pour le cross d'Etalle"
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 px-6 font-bold focus:border-red-600 outline-none transition-all placeholder:text-slate-300"
                />
              </div>

              {/* CATEGORIE */}
              <div className="space-y-2">
                <label
                    className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Catégorie</label>
                <select
                    name="category"
                    required
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 px-6 font-bold focus:border-red-600 outline-none transition-all appearance-none cursor-pointer"
                >
                  <option value="Inscriptions">Inscriptions</option>
                  <option value="Entraînements">Entraînements</option>
                  <option value="Compétitions">Compétitions</option>
                  <option value="Matériel">Matériel</option>
                  <option value="Autre">Autre</option>
                </select>
              </div>

              {/* MESSAGE */}
              <div className="space-y-2">
                <label
                    className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Votre
                  message détaillé</label>
                <textarea
                    name="content"
                    required
                    rows={6}
                    placeholder="Expliquez votre demande ici..."
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-[2rem] py-4 px-6 font-bold focus:border-red-600 outline-none transition-all placeholder:text-slate-300 resize-none"
                ></textarea>
              </div>

              <div className="bg-red-50 p-6 rounded-2xl flex gap-4 items-start mb-4">
                <AlertCircle className="text-red-600 shrink-0" size={20}/>
                <p className="text-xs font-bold text-red-800 leading-relaxed uppercase tracking-tight">
                  Votre question sera publiée publiquement. Le staff ACD vous répondra dans les plus
                  brefs délais.
                </p>
              </div>

              <button
                  type="submit"
                  className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black uppercase italic tracking-widest flex items-center justify-center gap-3 hover:bg-red-600 transition-all shadow-xl active:scale-95"
              >
                <Send size={20}/> Publier la question
              </button>
            </form>
          </div>
        </main>
      </div>
  )
}