import { SupabaseClient } from '@supabase/supabase-js';

interface StaffProfile {
  private_email: string | null;
}

/**
 * Récupère la liste des emails privés des administrateurs et rédacteurs
 */
export async function getStaffPrivateEmails(supabase: SupabaseClient): Promise<string[]> {
  const { data, error } = await supabase
  .from('profiles')
  .select('private_email')
  .in('role', ['admin', 'redacteur'])
  .not('private_email', 'is', null);

  if (error) {
    console.error("Erreur récupération emails privés:", error);
    return [];
  }

  // On extrait les emails et on filtre les éventuels doublons ou vides
  return data
  .map((p: any) => p.private_email)
  .filter((email): email is string => Boolean(email));
}