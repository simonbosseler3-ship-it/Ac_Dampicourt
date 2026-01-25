'use server'

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'

export async function deleteTopic(topicId: string) {
  const cookieStore = await cookies()
  const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { cookies: { getAll() { return cookieStore.getAll() } } }
  )

  // 1. On supprime les messages liés (obligatoire pour éviter l'erreur de clé étrangère)
  await supabase.from('forum_messages').delete().eq('topic_id', topicId)

  // 2. On supprime le sujet
  const { error } = await supabase.from('forum_topics').delete().eq('id', topicId)

  if (error) return { error: error.message }

  // 3. On rafraîchit la page Forum pour faire disparaître la carte
  revalidatePath('/forum')
  return { success: true }
}