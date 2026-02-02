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

    // 1. Récupérer uniquement les admins et rédacteurs
    const { data: staff, error: staffError } = await supabaseAdmin
      .from('profiles')
      .select('email')
      .or('role.eq.admin,role.eq.redacteur');

    if (staffError) throw staffError;

    // 2. Filtrer les emails
    const emailsToNotify = staff
      ?.map(s => s.email?.toLowerCase())
      .filter(email => email && email.endsWith('@acdampicourt.be')) as string[];

    if (!emailsToNotify || emailsToNotify.length === 0) {
      return NextResponse.json({ message: "Aucun destinataire trouvé" });
    }

    // 3. Envoi groupé officiel
    const { data, error: resendError } = await resend.emails.send({
      from: 'AC Dampicourt <info@acdampicourt.org>',
      to: emailsToNotify,
      subject: `[FORUM] Réponse de ${staffName} sur : ${topicTitle}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #334155;">
          <h2 style="color: #dc2626;">Réponse Staff</h2>
          <p>Bonjour,</p>
          <p><strong>${staffName}</strong> a répondu à la discussion : <strong>${topicTitle}</strong></p>
          <div style="background: #f1f5f9; padding: 15px; border-radius: 8px; margin: 20px 0; font-style: italic;">
            "${replyContent}"
          </div>
          <a href="${process.env.NEXT_PUBLIC_SITE_URL}/forum/${topicId}"
             style="background: #0f172a; color: white; padding: 12px 25px; text-decoration: none; border-radius: 6px; font-weight: bold;">
             Accéder à la discussion
          </a>
        </div>
      `
    });

    if (resendError) throw resendError;

    return NextResponse.json({ success: true, id: data?.id });
  } catch (error: any) {
    console.error("Erreur API Notify Reply:", error);
    return NextResponse.json({ error: error.message || "Erreur serveur" }, { status: 500 });
  }
}