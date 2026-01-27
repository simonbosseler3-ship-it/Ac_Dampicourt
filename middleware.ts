import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // 1. On crée une réponse de base
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet) {
            // On met à jour la requête pour que les Server Components voient les cookies
            cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
            // On recrée la réponse avec la requête mise à jour
            supabaseResponse = NextResponse.next({
              request,
            })
            // On écrit les cookies dans la réponse finale pour le navigateur
            cookiesToSet.forEach(({ name, value, options }) =>
                supabaseResponse.cookies.set(name, value, options)
            )
          },
        },
      }
  )

  // IMPORTANT : On vérifie l'utilisateur.
  // Si le token est expiré, setAll() sera appelé automatiquement au-dessus.
  await supabase.auth.getUser()

  return supabaseResponse
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}