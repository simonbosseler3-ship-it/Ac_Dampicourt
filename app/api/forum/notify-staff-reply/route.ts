import { Resend } from 'resend';
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const { topicId, topicTitle, staffName, replyContent } = await req.json();

    const { data: staff, error: staffError } = await supabaseAdmin
    .from('profiles')
    .select('email')
    .or('role.eq.admin,role.eq.redacteur');

    if (staffError) throw staffError;

    // On garde ton filtrage habituel pour plus tard
    const emailsToNotify = staff
    ?.map(s => s.email?.toLowerCase())
    .filter(email => email && email.endsWith('@acdampicourt.be')) as string[];

    // --- CORRECTION POUR LE TEST ---
    // Tant que ton domaine n'est pas "Verified", tu DOIS utiliser onboarding@resend.dev
    // Et envoyer uniquement à ton adresse de compte (simon.bosseler@acdampicourt.be)

    const { data, error: resendError } = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'simon.bosseler@acdampicourt.be', // Force ton mail pour le test
      subject: `[FORUM] Réponse de ${staffName} sur : ${topicTitle}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #334155;">
          <h2 style="color: #dc2626;">Question traitée</h2>
          <p>Bonjour,</p>
          <p><strong>${staffName}</strong> vient de répondre à un message sur le forum.</p>
          <div style="background: #f1f5f9; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Sujet :</strong> ${topicTitle}</p>
            <p><strong>Réponse :</strong> ${replyContent}</p>
          </div>
          <a href="${process.env.NEXT_PUBLIC_SITE_URL}/forum/${topicId}" 
             style="background: #0f172a; color: white; padding: 12px 25px; text-decoration: none; border-radius: 6px; font-weight: bold;">
             Accéder à la discussion
          </a>
        </div>
      `
    });

    if (resendError) {
      console.error("Détails erreur Resend:", resendError);
      return NextResponse.json({ error: resendError.message }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Erreur API Notification:", error);
    return NextResponse.json({ error: error.message || "Erreur serveur" }, { status: 500 });
  }
}