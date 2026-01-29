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

  await supabase.from('forum_messages').delete().eq('topic_id', topicId)

  const { error } = await supabase.from('forum_topics').delete().eq('id', topicId)

  if (error) return { error: error.message }

  revalidatePath('/forum')
  return { success: true }
}