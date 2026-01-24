import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { Navbar } from "@/components/navbar/navbar"
import { ArrowLeft, Send, User, ShieldCheck, Lock } from "lucide-react"
import Link from "next/link"

export const dynamic = "force-dynamic";

export default async function TopicDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const cookieStore = await cookies()
  const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { cookies: { getAll() { return cookieStore.getAll() } } }
  )

  // 1. RÉCUPÉRATION DU STAFF
  const { data: { user } } = await supabase.auth.getUser()
  let isStaff = false;
  if (user) {
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).maybeSingle()
    isStaff = profile?.role === 'admin' || profile?.role === 'redacteur';
  }

  // 2. RÉCUPÉRER LE SUJET
  const { data: topic } = await supabase.from('forum_topics').select('*').eq('id', id).maybeSingle()

  // 3. RÉCUPÉRER LES RÉPONSES
  // Utilisation de !left pour ne pas invalider la ligne si le profil est manquant
  const { data: messages } = await supabase
  .from('forum_messages')
  .select('*, profiles!left(full_name, role)')
  .eq('topic_id', id)
  .order('created_at', { ascending: true })

  async function postReply(formData: FormData) {
    'use server'
    const cookieStore = await cookies()
    const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, { cookies: { getAll() { return cookieStore.getAll() } } })
    const { data: { user: u } } = await supabase.auth.getUser()
    if (!u) return

    await supabase.from('forum_messages').insert({
      topic_id: formData.get('topicId'),
      author_id: u.id,
      content: formData.get('content'),
      is_staff_answer: true
    })

    revalidatePath(`/forum/${id}`)
  }

  if (!topic) return <div className="pt-40 text-center font-black text-slate-400">Discussion introuvable</div>

  return (
      <div className="min-h-screen">
        <Navbar/>
        <main className="container mx-auto px-4 pt-32 pb-20 max-w-4xl">
          <Link href="/forum"
                className="flex items-center gap-2 text-slate-400 hover:text-red-600 font-bold uppercase italic text-[10px] mb-10 transition-colors group">
            <ArrowLeft size={14}
                       className="group-hover:-translate-x-1 transition-transform"/> Retour au forum
          </Link>

          <h1 className="text-5xl font-black text-slate-900 uppercase italic tracking-tighter mb-12 leading-none">{topic.title}</h1>

          <div className="space-y-6 mb-16">
            <div className="bg-white p-8 rounded-[2.5rem] border-2 border-white shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div
                    className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400">
                  <User size={18}/></div>
                <span className="text-[10px] font-black uppercase text-slate-900">Question</span>
              </div>
              <p className="text-lg italic font-medium text-slate-800 whitespace-pre-wrap">{topic.title}</p>
            </div>

            {/* BOUCLE DE RÉPONSES */}
            {messages && messages.length > 0 ? (
                messages.map((msg) => (
                    <div key={msg.id}
                         className={`p-8 rounded-[2.5rem] border-2 transition-all shadow-sm ${msg.is_staff_answer ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-900 border-white"}`}>
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                          <div
                              className={`h-10 w-10 rounded-xl flex items-center justify-center ${msg.is_staff_answer ? "bg-red-600" : "bg-slate-100 text-slate-400"}`}>
                            <User size={18}/>
                          </div>
                          <div>
                            <p className={`text-[10px] font-black uppercase tracking-widest ${msg.is_staff_answer ? "text-red-500" : "text-slate-900"}`}>
                              {msg.profiles?.full_name || (msg.is_staff_answer ? "STAFF ACD" : "VISITEUR")}
                            </p>
                          </div>
                        </div>
                        {msg.is_staff_answer && <ShieldCheck className="text-red-500" size={20}/>}
                      </div>
                      <p className="text-lg italic font-medium whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                    </div>
                ))
            ) : (
                <div
                    className="p-10 border-2 border-dashed border-slate-200 rounded-[2.5rem] text-center bg-white/50">
                  <p className="text-slate-400 font-bold uppercase text-[10px]">En attente de
                    réponses...</p>
                </div>
            )}
          </div>

          {isStaff ? (
              <div className="bg-white p-10 rounded-[3rem] shadow-2xl border border-slate-100">
                <form action={postReply} className="space-y-4">
                  <input type="hidden" name="topicId" value={topic.id}/>
                  <textarea name="content" required rows={4}
                            className="w-full bg-slate-50 border-2 border-slate-100 rounded-[2rem] p-6 outline-none focus:border-red-600 font-bold text-slate-900"
                            placeholder="Répondre..."></textarea>
                  <button type="submit"
                          className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black uppercase italic hover:bg-red-600 transition-all">Envoyer
                  </button>
                </form>
              </div>
          ) : (
              <div
                  className="bg-slate-100 rounded-[2.5rem] p-10 text-center border-2 border-dashed border-slate-200">
                <Lock className="mx-auto mb-2 text-slate-400" size={24}/>
                <p className="text-[10px] font-black uppercase text-slate-400">Espace réservé au
                  Staff</p>
              </div>
          )}
        </main>
      </div>
  )
}