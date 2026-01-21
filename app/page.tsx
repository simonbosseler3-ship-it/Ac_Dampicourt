import { supabase } from "@/lib/supabase";

// En Next.js (App Router), les composants peuvent être async pour charger des données
export default async function Home() {

  // 1. Appel à la base de données
  const { data: profiles, error } = await supabase
  .from('profiles')
  .select('*');

  // Affichage en cas d'erreur
  if (error) {
    return <div className="p-10 text-red-500">Erreur DB: {error.message}</div>
  }

  return (
      <div className="p-10 font-sans">
        <h1 className="text-3xl font-bold mb-6 text-red-600">
          Test de connexion AC Dampicourt
        </h1>

        <div className="border p-4 rounded shadow bg-slate-50">
          <h2 className="text-xl font-semibold mb-4">Liste des membres (depuis Supabase) :</h2>

          {profiles && profiles.length > 0 ? (
              <ul>
                {profiles.map((profile) => (
                    <li key={profile.id} className="mb-2 p-2 bg-white border rounded flex justify-between">
                      <span>{profile.full_name}</span>
                      <span className="text-sm font-bold bg-blue-100 text-blue-800 px-2 rounded">
                  {profile.role}
                </span>
                    </li>
                ))}
              </ul>
          ) : (
              <p>Aucun profil trouvé.</p>
          )}
        </div>

        <div className="mt-8 text-sm text-gray-500">
          Si tu vois "Jean-Testeur" ci-dessus, IntelliJ est bien connecté à DataGrip/Supabase !
        </div>
      </div>
  );
}