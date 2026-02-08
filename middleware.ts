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
            cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
            supabaseResponse = NextResponse.next({
              request,
            })
            cookiesToSet.forEach(({ name, value, options }) =>
                supabaseResponse.cookies.set(name, value, options)
            )
          },
        },
      }
  )

  // --- MODIFICATION POUR LWS ---
  // On ne déclenche getUser() que pour les routes protégées ou sensibles.
  // Cela évite de faire ramer (et planter en 503) les pages publiques comme /club ou /actualites.
  const isProtectedRoute =
      request.nextUrl.pathname.startsWith('/admin') ||
      request.nextUrl.pathname.startsWith('/recherche/modifier') ||
      request.nextUrl.pathname.startsWith('/mon-compte'); // Ajoute tes routes privées ici

  if (isProtectedRoute) {
    await supabase.auth.getUser()
  }
  // -----------------------------

  return supabaseResponse
}

export const config = {
  // On renforce le matcher pour exclure absolument tout ce qui est statique
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|api|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}