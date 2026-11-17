# AC Dampicourt — refonte du design (tout le site)

## Installer

```bash
git checkout -b refonte-design       # le site actuel reste intact sur ta branche principale
# copie le contenu du zip par-dessus le projet (.env.local, .git et .idea ne sont pas dans le zip)
npm install                          # aucune nouvelle dépendance
npm run dev
npm run build                        # avant la mise en ligne
```

## Principe

Tout ce qui existait est conservé : chaque page, chaque section, chaque bouton d'admin, les formulaires, Supabase, les thèmes saisonniers, le tutoriel et StatCounter. **Seule la présentation change**, de façon cohérente sur tout le site.

L'identité est gardée telle quelle : fond blanc → rouge avec les hexagones, rouge du club, ardoise, et titres italiques très gras en capitales comme le logo.

### Ce qui est nouveau

| Élément | Où | Ce que ça fait |
|---|---|---|
| **En-tête de page commun** | `components/layout/PageHero.tsx` | Bandeau ardoise sous la navbar sur toutes les pages : hexagones et bandes de vitesse en parallaxe, halo rouge, bord en biais souligné de rouge, fil d'Ariane, titre en grand (partie rouge avec `<em>`). Les boutons d'admin y sont repris. |
| **Police des titres** | `app/layout.tsx` + `app/acd.css` | *Barlow Condensed* (vraie italique grasse). Elle s'applique automatiquement à tous les titres `font-black italic uppercase`, sans toucher chaque page. |
| **Apparition au scroll** | `components/theme/ScrollReveal.tsx` | Les cartes, sections et articles apparaissent en douceur quand on les atteint. Ce qui est déjà visible ne bouge pas, et tout est désactivé si le visiteur a choisi « réduire les animations ». |
| **Transition entre pages** | `app/template.tsx` | Fondu à chaque changement de page. |
| **Navbar** | `components/navbar/navbar.tsx` | Même logique (connexion, thèmes admin, menus). Elle se cache en descendant et revient en remontant, avec un soulignement oblique animé. Le menu Infos devient un panneau avec descriptions, et le menu mobile un panneau sombre. |
| **Accueil** | `app/page.tsx`, `components/carousel/news.tsx` | Le carrousel des 3 actus passe en plein écran : fondu, zoom lent, barres de progression avec les titres, flèches, glisser au doigt et pause au survol. Le houx, le lapin et les fleurs sont conservés. Les 3 cartes et les blocs Forum / Communauté sont gardés, retravaillés. |
| **Footer** | `components/footer/footer.tsx` | Même contenu, avec les liens calendrier/résultats, l'adresse cliquable vers Google Maps et le nom du club en filigrane. |
| **Connexion** | `app/login/page.tsx` | Plein écran sombre avec les hexagones, et la même carte de connexion. |

### Pages repassées

Accueil, Le Club, Actualités (liste, article, nouvelle, modification), Forum (liste, sujet, poser une question), Entraîneurs, Officiels, Éthique, K.B.P.M., Méthode pédagogique, Records, Table hongroise, Inscriptions, Musculation, Sondages, Connexion, et toutes les pages « modifier ».

Sur les pages d'admin, le bouton principal (Sauvegarder, Ajouter un coach…) est dans l'en-tête, toujours visible en haut.

La **Speed Night** garde sa mise en page sombre d'événement. Elle profite de la nouvelle navbar, du footer et de la police.

## Version 2 : retours intégrés

| Retour | Correction |
|---|---|
| Ligne trop brusque sous le carrousel | Les photos se fondent progressivement dans le fond du site (masque en dégradé, `.hh__media`). |
| Barres de progression bloquées | Le survol mettait le carrousel en pause, et comme il couvre l'écran, il était presque toujours en pause. La progression est maintenant pilotée en JS, avec un bouton pause/lecture explicite. |
| Accès rapides trop gros | 3 tuiles compactes en verre sombre qui chevauchent le bas du carrousel, avec un remplissage rouge en biais au survol. |
| Icône de souris peu claire | Supprimée : les tuiles qui dépassent du carrousel montrent d'elles-mêmes qu'il y a du contenu en dessous. |
| « AC Dampicourt » du footer mal affiché | Dessiné en SVG ajusté à la largeur : toujours entier, quelle que soit la taille d'écran. |
| Transition brusque sous les titres de page | L'en-tête s'efface en dégradé (ardoise, puis rouge profond, puis fond du site) et le contenu de la page remonte par-dessus. |
| Trop de blocs blancs « bruts » | Sur toutes les pages, depuis `app/acd.css` (section 3) : blocs blancs en verre dépoli, blocs ardoise avec halo rouge et hexagones, blocs rouges avec les bandes de vitesse du logo, survol plus vivant. |
| Titres plus immersifs | Titres d'en-tête animés mot par mot, avec un reflet sur la partie rouge. Titres de section dévoilés en balayage au scroll, partie rouge en dégradé. |
| Bande rose entre une page sombre et le footer | Fondu vers le footer sur toutes les pages. Les pages sombres (connexion, Speed Night) enchaînent directement sur le footer. |

## Si tu veux ajuster

- **Le texte d'un en-tête** : cherche `<PageHero` dans la page concernée (`eyebrow`, `title`, `description`, `actions`).
- **Les couleurs et les animations** : `app/acd.css`, avec un commentaire par section.
- **Revenir aux blocs blancs pleins** : supprime la section 3 (« Surfaces modernisées ») d'`app/acd.css`.
- **Désactiver l'apparition au scroll** : retire `<ScrollReveal />` dans `app/layout.tsx`.
- **L'ancien carrousel Embla** n'est plus utilisé. `components/ui/carousel.tsx` reste dans le projet mais peut être supprimé.
