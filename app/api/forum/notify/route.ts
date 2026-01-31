import { Resend } from 'resend';
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {

  console.log("CHECK ENV - KEY:", process.env.RESEND_API_KEY ? "PRÉSENTE" : "ABSENTE");
  console.log("CHECK ENV - URL:", process.env.NEXT_PUBLIC_SITE_URL);

  try {
    const body = await req.json();
    const { topicId, title, category, content } = body;

    // LOG DE DÉBOGAGE
    console.log("Tentative d'envoi pour le topic:", topicId);

    // 1. Récupérer les emails du staff
    const { data: staff, error: dbError } = await supabaseAdmin
    .from('profiles')
    .select('email')
    .or('role.eq.admin,role.eq.redacteur');

    if (dbError) {
      console.error("Erreur DB Supabase:", dbError);
      return NextResponse.json({ error: "Erreur base de données" }, { status: 500 });
    }

    const emails = staff
    ?.map(s => s.email?.toLowerCase())
    .filter(email => email && email.endsWith('@acdampicourt.be')) as string[];

    console.log("Emails cibles trouvés:", emails);

    if (!emails || emails.length === 0) {
      return NextResponse.json({ message: "Aucun destinataire staff trouvé" });
    }

    // 2. Envoi email via Resend avec gestion d'erreur spécifique
    const { data, error: resendError } = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: "simon.bosseler@acdampicourt.be", // Note: En local sans domaine validé, cela peut causer la 500 si 'emails' n'est pas ton mail perso
      subject: `[FORUM] Nouvelle question : ${title}`,
      html: `
        <h2>Nouvelle question dans la catégorie : ${category}</h2>
        <p><strong>Message :</strong></p>
        <div style="padding: 10px; border: 1px solid #ccc;">${content}</div>
        <br />
        <a href="${process.env.NEXT_PUBLIC_SITE_URL}/forum/${topicId}">Voir le sujet sur le site</a>
      `
    });

    if (resendError) {
      console.error("L'API Resend a renvoyé une erreur:", resendError);
      return NextResponse.json({ error: resendError.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, id: data?.id });
  } catch (error: any) {
    console.error("Erreur CRITIQUE API Notify:", error.message);
    return NextResponse.json({ error: error.message || "Erreur serveur" }, { status: 500 });
  }
}

/*
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
    const body = await req.json();
    const { topicId, title, category, content } = body;

    // 1. Récupérer les emails du staff (Admin & Rédacteurs)
    const { data: staff, error: dbError } = await supabaseAdmin
      .from('profiles')
      .select('email')
      .or('role.eq.admin,role.eq.redacteur');

    if (dbError) throw dbError;

    // 2. Filtrer les emails valides @acdampicourt.be
    const emailsToNotify = staff
      ?.map(s => s.email?.toLowerCase())
      .filter(email => email && email.endsWith('@acdampicourt.be')) as string[];

    if (!emailsToNotify || emailsToNotify.length === 0) {
      return NextResponse.json({ message: "Aucun destinataire staff trouvé" });
    }

    // 3. Envoi via le domaine officiel
    const { data, error: resendError } = await resend.emails.send({
      from: 'AC Dampicourt <info@ac-dampicourt.be>',
      to: emailsToNotify, // Envoi à tout le staff
      subject: `[FORUM] Nouvelle question : ${title}`,
      html: `
        <div style="font-family: sans-serif; color: #1e293b; padding: 20px;">
          <h2 style="color: #dc2626;">Nouvelle question : ${category}</h2>
          <p><strong>Sujet :</strong> ${title}</p>
          <div style="padding: 15px; background: #f8fafc; border-left: 4px solid #dc2626; margin: 20px 0;">
            ${content}
          </div>
          <a href="${process.env.NEXT_PUBLIC_SITE_URL}/forum/${topicId}"
             style="display: inline-block; background: #0f172a; color: white; padding: 12px 25px; text-decoration: none; border-radius: 8px; font-weight: bold;">
             Voir sur le site
          </a>
        </div>
      `
    });

    if (resendError) throw resendError;

    return NextResponse.json({ success: true, id: data?.id });
  } catch (error: any) {
    console.error("Erreur API Notify New Topic:", error);
    return NextResponse.json({ error: error.message || "Erreur serveur" }, { status: 500 });
  }
}
 */