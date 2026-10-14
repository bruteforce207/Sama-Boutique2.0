# Rules : Landing Page Cinématographique pour mon SaaS de gestion de stock et reçus WhatsApp

## Rôle

Tu es un Technologue Créatif Senior et Lead Ingénieur Frontend. Tu construis des landing pages haute fidélité, cinématographiques, pixel perfect. Chaque scroll est intentionnel, chaque animation est pesée. Pas de patterns génériques d'IA, pas de template reconnaissable.

## Mode d'exécution (IMPORTANT)

Ne pose AUCUNE question. Toutes les informations nécessaires sont dans ce fichier. Construis directement le site complet, puis résume en 5 lignes max ce que tu as fait. Si une info manque, fais le choix le plus raisonnable et signale-le à la fin.

## Le produit

- **Nom de la marque :** Sama-Boutique (utilise-le partout dans le site, avec cette orthographe exacte)
- **Objectif en une phrase :** Gérez le stock de votre magasin et envoyez des reçus professionnels à vos clients sur WhatsApp, en un clic.
- **Cible :** commerçants et gérants de boutiques en Afrique de l'Ouest (Sénégal en premier), qui utilisent surtout leur téléphone.
- **Langue du site :** français, ton simple, chaleureux, direct. Écris comme un humain : phrases courtes, zéro jargon, zéro formules creuses du genre « solution innovante » ou « révolutionnez votre business ».
- **Devise :** FCFA. Format obligatoire : `4 790 FCFA` (espace insécable pour les milliers).

### Les 3 arguments de vente (deviennent les cartes Fonctionnalités)

1. **Un stock toujours à jour :** chaque vente met à jour les quantités, et une alerte vous prévient avant la rupture.
2. **Des reçus envoyés sur WhatsApp :** le reçu est généré en ligne et part au client en un clic, avec le nom de votre boutique.
3. **Vos caisses sous contrôle :** suivez les ventes jour par jour, caisse par caisse, sans calculer à la main.

### Objectif du visiteur (CTA principal)

- CTA principal : **« Essayer gratuitement »** (ou « Commencer maintenant » si aucun essai n'existe, à confirmer avec moi).
- CTA secondaire : **« Parler à l'équipe sur WhatsApp »** via lien `https://wa.me/221784570993?text=Bonjour, je veux en savoir plus sur Sama-Boutique`.

### Tarification (section F)

| Nom | Prix | Pour qui | CTA |
|---|---|---|---|
| Solo | 4 790 FCFA / mois | 1 caisse, petit commerce | Choisir Solo |
| 3 Caisses (carte du milieu, mise en avant) | 9 900 FCFA / mois | jusqu'à 3 caisses | Choisir 3 Caisses |
| Multicaisse | Sur devis | 4 caisses ou plus, plusieurs points de vente | Demander un devis (ouvre WhatsApp) |

Liste de fonctionnalités par offre : tu les déduis des 3 arguments ci-dessus (nombre de caisses, produits, reçus WhatsApp, rapports). Ne promets rien d'absurde : pas de « illimité » sauf si c'est dans cette liste.

## Direction esthétique : Preset C « Signal Brutaliste »

Identité : une salle de contrôle du futur, aucune décoration inutile, densité d'information pure. Parfait pour un outil de gestion.

- **Palette :** Papier `#E8E4DD` (primaire), Rouge Signal `#E63B2E` (accent), Blanc cassé `#F5F3EE` (fond), Noir `#111111` (texte/sombre).
- **Typographie :** Titres : "Space Grotesk" (tracking serré). Dramatique : "DM Serif Display" italique. Données : "Space Mono".
- **Ambiance image :** béton, architecture brutaliste, étagères de magasin, entrepôt, matériaux bruts, industriel. Mots-clés Unsplash : `concrete`, `warehouse shelves`, `retail storage`, `industrial interior`.
- **Pattern titre hero :** « Gérez votre stock. » (Sans gras) / « Reçu. » ou « Envoyé. » (Serif italique massif, 3 à 5 fois plus grand). Propose la meilleure variante qui colle au produit.

## Système de design fixe (NE JAMAIS CHANGER)

**Texture visuelle**
- Overlay de bruit CSS global avec un filtre SVG inline `<feTurbulence>` à 0.05 d'opacité.
- Rayons `rounded-[2rem]` à `rounded-[3rem]` sur tous les conteneurs. Aucun angle vif.

**Micro-interactions**
- Boutons : effet magnétique `scale(1.03)` au survol, `cubic-bezier(0.25, 0.46, 0.45, 0.94)`.
- Boutons en `overflow-hidden` avec un `<span>` de fond glissant pour la transition de couleur.
- Liens et éléments interactifs : `translateY(-1px)` au survol.

**Animations**
- `gsap.context()` dans `useEffect` pour TOUTES les animations, avec `ctx.revert()` au cleanup.
- Easing : `power3.out` pour les entrées, `power2.inOut` pour les morphismes.
- Décalage (stagger) : `0.08` pour le texte, `0.15` pour les cartes.
- Respecte `prefers-reduced-motion` : si activé, désactive les animations lourdes et affiche le contenu directement.

## Animations supplémentaires (je veux un site très vivant)

En plus des animations déjà décrites ci-dessous, ajoute :
- **Chargement d'ouverture :** écran avec le nom « Sama-Boutique » qui se révèle lettre par lettre, puis un rideau qui se lève sur le hero (1,5 s max).
- **Hero :** léger zoom lent de l'image de fond (Ken Burns) et parallaxe au scroll.
- **Compteurs animés** qui montent de 0 à leur valeur au scroll (ex. « 3 caisses », « 1 clic », « 0 calcul à la main »), dans une bande de chiffres sous le hero.
- **Apparitions au scroll :** chaque section, titre et carte entre en fade-up avec stagger (`ScrollTrigger`).
- **Marquee** (bandeau défilant en boucle) de mots-clés : « Stock à jour · Reçus WhatsApp · Caisses sous contrôle · Fait au Sénégal ».
- **Boutons :** effet magnétique qui suit légèrement la souris, plus effet de pression au clic.
- **Cartes de tarification :** léger tilt 3D au survol, et le prix qui s'anime quand la carte entre à l'écran.
- **Curseur personnalisé** discret sur ordinateur (point + anneau qui suit la souris), désactivé sur mobile.
- **Barre de progression du scroll** fine en haut de page, couleur accent.
- Toutes ces animations restent fluides sur téléphone (60 fps visés) et respectent `prefers-reduced-motion`.

## Architecture des composants (structure fixe, adapte seulement contenu et couleurs)

### A. Navbar « L'Île Flottante »
- Conteneur `fixed`, en pilule, centré horizontalement.
- Transparent avec texte clair en haut du hero. Passe à `bg-[fond]/60 backdrop-blur-xl` avec texte foncé et bordure subtile après le hero (ScrollTrigger ou Intersection Observer).
- Contient : logo (nom en texte), liens Fonctionnalités / Comment ça marche / Tarifs / Contact, bouton CTA en couleur accent.
- Mobile : version minimale (logo + CTA + menu burger).

### B. Hero « Le Plan d'Ouverture »
- Hauteur `100dvh`. Image plein cadre Unsplash (ambiance du preset) avec un gradient lourd `bg-gradient-to-t` du noir vers transparent.
- Contenu poussé vers le tiers inférieur gauche (flex + padding).
- Titre en deux parties : sans-serif gras puis serif italique massif.
- Sous-titre : une phrase, celle de l'objectif de la marque.
- Animation GSAP fade-up en cascade (`y: 40→0`, `opacity: 0→1`) sur le texte et le CTA.
- Bouton CTA en couleur accent sous le titre, avec le CTA secondaire WhatsApp à côté.

### C. Fonctionnalités « Artefacts Fonctionnels Interactifs »
Trois cartes qui ressemblent à de vraies micro-interfaces logicielles, pas à des cartes marketing. Surface fond, bordure subtile, `rounded-[2rem]`, ombre portée. Chaque carte : titre (sans gras) + court descripteur.

1. **Carte « Stock » (Mélangeur Diagnostique) :** 3 cartes superposées qui cyclent verticalement avec `array.unshift(array.pop())` toutes les 3 secondes, transition rebond `cubic-bezier(0.34, 1.56, 0.64, 1)`. Chaque mini-carte est un produit réaliste (ex. « Riz parfumé 25 kg · 42 en stock », « Huile 5 L · 8 restants », « Sucre 50 kg · 3 restants » avec une pastille rouge d'alerte).
2. **Carte « Reçus WhatsApp » (Machine à Écrire Télémétrie) :** flux monospace en direct qui tape caractère par caractère un reçu (nom de la boutique, articles, total en FCFA, « Merci de votre achat ! »), puis le message « Envoyé sur WhatsApp ✓ ». Curseur clignotant en accent, label « Flux en direct » avec point pulsant.
3. **Carte « Caisses » (Planificateur Curseur) :** grille hebdomadaire L M M J V S D. Un curseur SVG animé entre, va sur un jour, clique (`scale(0.95)`), le jour s'active en accent, puis le curseur va sur un bouton « Voir le rapport » et disparaît. Boucle infinie.

### D. Philosophie « Le Manifeste »
- Pleine largeur, fond sombre, image texture béton en parallaxe à faible opacité.
- Deux déclarations :
  - Petite, neutre : « La plupart des logiciels de caisse se concentrent sur : des écrans compliqués et des formations interminables. »
  - Massive, serif italique : « Nous nous concentrons sur : **la vente qui se fait toute seule.** » (mot-clé en accent). Adapte la formulation si tu trouves mieux, mais garde ce contraste.
- Révélation mot par mot déclenchée par ScrollTrigger (découpe le texte à la main en `<span>` pour ne pas dépendre d'un plugin payant).

### E. Protocole « Archive Empilée Sticky »
3 cartes plein écran qui s'empilent au scroll (ScrollTrigger, `pin: true`). Quand la carte suivante arrive, la précédente passe à `scale(0.9)`, `blur(20px)`, `opacity 0.5`. Contenu de chaque carte : numéro d'étape (mono), titre, description en 2 lignes.

1. **01 · Ajoutez vos produits :** import rapide, quantités et prix. *Animation : motif géométrique en rotation lente (cercles concentriques).*
2. **02 · Vendez, le stock suit :** chaque vente met à jour les quantités. *Animation : ligne laser horizontale qui balaie une grille de cellules.*
3. **03 · Envoyez le reçu sur WhatsApp :** un clic, le client reçoit son reçu. *Animation : forme d'onde pulsante SVG style ECG avec `stroke-dashoffset`.*

### F. Tarification
Grille à trois niveaux (voir tableau plus haut). Carte du milieu (3 Caisses) : fond primaire sombre, bouton CTA accent, légèrement plus grande ou avec un ring, badge « Le plus choisi ». Mention sous la grille : « Sans engagement. Résiliable à tout moment » (à garder seulement si c'est vrai, sinon retire-la).

### G. Pied de page
- Fond sombre profond, `rounded-t-[4rem]`.
- Grille : nom + slogan, colonnes de navigation, liens légaux (Mentions légales, Confidentialité, CGU).
- Indicateur « Système opérationnel » avec point vert pulsant et label monospace.
- Lien WhatsApp de contact bien visible.
- Bloc « Contact » avec ces infos exactes (cliquables) :
  - WhatsApp : +221 78 457 09 93 (lien `https://wa.me/221784570993`)
  - E-mail : mouhamadoub275@gmail.com (lien `mailto:mouhamadoub275@gmail.com`)
  - Localisation : Guédiawaye, Dakar, Sénégal (texte avec icône Lucide `MapPin`)
- Le lien « Contact » de la navbar fait défiler jusqu'à ce bloc.

## Exigences techniques (NE JAMAIS CHANGER)

- **Stack :** React 19, Tailwind CSS v3.4.17, GSAP 3 (+ ScrollTrigger), Lucide React pour les icônes.
- **Polices :** balises `<link>` Google Fonts dans `index.html` (Space Grotesk, DM Serif Display italique, Space Mono).
- **Images :** vraies URLs Unsplash (`https://images.unsplash.com/photo-...?auto=format&fit=crop&w=1600&q=70`). Jamais de placeholder. Vérifie que chaque image se charge ; ajoute un fond de secours (couleur) si elle échoue.
- **Fichiers :** un seul `App.jsx` avec les composants dedans (sépare dans `components/` seulement si > 600 lignes). Un seul `index.css` pour les directives Tailwind, l'overlay de bruit et les utilitaires.
- **Responsive, mobile-first :** mes clients sont surtout sur téléphone. Cartes empilées sur mobile, titres hero réduits, navbar minimale, boutons faciles à toucher (44 px min).
- **Performance :** connexions parfois lentes. Images compressées (`q=70`, largeur adaptée), `loading="lazy"` hors hero, animations légères sur mobile.
- **Accessibilité :** contraste suffisant, `alt` sur les images, focus visible, `aria-label` sur les boutons-icônes.
- **Zéro placeholder :** chaque carte, label, animation et lien doit être implémenté et fonctionnel.

## Séquence de build

1. Scaffold : `npm create vite@latest` (React), installer Tailwind 3.4.17, GSAP, lucide-react.
2. Mapper le preset C aux tokens (palette, polices, ambiance image) dans `tailwind.config.js`.
3. Écrire le hero, les cartes, le manifeste, le protocole, la tarification et le footer avec le contenu ci-dessus.
4. Vérifier : chaque animation tourne, chaque lien (dont WhatsApp) fonctionne, chaque image se charge, le rendu mobile est propre.
5. Lancer `npm run dev`, corriger les erreurs, puis donner un résumé court.

## Directive finale

Ne construis pas un site web, construis un instrument digital. Chaque scroll doit sembler intentionnel, chaque animation pesée et professionnelle. Éradique tous les patterns génériques d'IA.
