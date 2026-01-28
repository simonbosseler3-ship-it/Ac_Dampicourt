# 🏃‍♂️ Site Web - Club d'Athlétisme

Ce projet est une application web moderne permettant de gérer les informations, les records, les officiels et les entraîneurs d'un club d'athlétisme. Il utilise **Next.js** pour le frontend et **Supabase** pour la base de données et l'authentification.

## 🚀 Technologies utilisées

* **Framework :** [Next.js 14+](https://nextjs.org/) (App Router)
* **Base de données & Auth :** [Supabase](https://supabase.com/)
* **Stylisation :** Tailwind CSS
* **Envoi d'emails :** [Resend](https://resend.com/)

## 🔒 Sécurité (Audit terminé)

Le projet a été conçu avec une priorité sur la sécurité des données, tout en restant Open Source :
* **Row Level Security (RLS) :** Toutes les tables de la base de données sont protégées. La lecture est publique, mais l'écriture/modification est réservée à l'administrateur authentifié.
* **Middleware SSR :** Gestion sécurisée des sessions et rafraîchissement automatique des cookies via Supabase Auth Helpers.
* **Protection des secrets :** Les clés API sensibles sont gérées via des variables d'environnement et ne sont jamais poussées sur le dépôt public.

## 🛠 Installation et Configuration

### 1. Cloner le projet
```bash
git clone [https://github.com/ton-pseudo/ton-repo.git](https://github.com/ton-pseudo/ton-repo.git)
cd ton-repo