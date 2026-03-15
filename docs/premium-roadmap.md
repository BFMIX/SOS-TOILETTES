# SOS TOILETTES

## Roadmap Premium

Document fusionnant:
- les suggestions utilisateur de `/Users/bfmix/Downloads/suggestions.md`
- les recommandations produit, design et techniques identifiees dans le projet

Objectif:
- rendre l'application plus premium
- conserver une interface simple et rapide
- prioriser les gains visibles sans casser la base MVP

---

## Principes Directeurs

1. Une seule action principale par ecran.
2. Une seule couche d'overlay active a la fois.
3. Une hierarchie visuelle stable: meme logique de densite, rayons, transparence, ombres.
4. La carte reste utilitaire; le branding s'exprime dans l'onboarding, le profil, la gamification et les etats vides.
5. Chaque amelioration design doit avoir un impact produit ou perceptif clair.

---

## Backlog Fusionne

### P0 - Impact fort / effort faible a moyen

#### 1. Micro-animations et transitions
- Ajouter des animations d'apparition sur les marqueurs.
- Ajouter une animation de selection sur le marqueur actif.
- Ajouter une animation de coeur au toggle favori.
- Ajouter des transitions plus fluides pour menu, sheets et modals.
- Ajouter des animations d'entree sur les blocs du bottom sheet.

Pourquoi:
- c'est le levier le plus visible pour passer de "correct" a "premium"

Livrables:
- markers animes
- favoris animes
- ouverture/fermeture overlay adoucies
- reveal progressif des cards

#### 2. Haptic feedback
- Feedback sur selection marqueur.
- Feedback sur favori.
- Feedback sur publication commentaire.
- Feedback sur signalement.
- Feedback sur ouverture menu.

Pourquoi:
- augmente fortement la sensation de qualite avec peu de code

#### 3. Systeme de feedback unifie
- Remplacer `Alert.alert` pour les cas non bloquants par des toasts/snackbars.
- Definir 4 niveaux: success, warning, error, info.
- Uniformiser tous les messages de feedback app.

Pourquoi:
- aujourd'hui le feedback utilisateur n'est pas coherent

#### 4. Unification overlays et surfaces
- Formaliser une regle unique pour:
  - menu
  - onboarding
  - favoris
  - filtres
  - fiche detail
- Limiter a une seule couche active a la fois.
- Definir 3 niveaux de transparence maximum.

Pourquoi:
- c'est un point cle pour la sensation premium

#### 5. Mode urgence / plus proche maintenant
- Ajouter un acces rapide depuis Explorer.
- Prioriser les toilettes les plus proches et ouvertes.
- Interface simplifiee avec tres peu d'options.

Pourquoi:
- vraie valeur produit, simple, memorable

---

### P1 - Impact fort / effort moyen

#### 6. Cartes toilettes enrichies
- Ajouter icones equipements sur les cards.
- Ajouter un badge de statut plus visuel.
- Ajouter un overlay subtil sur l'image generique.
- Mieux differencier nom, adresse, distance, action.

Pourquoi:
- les cards sont au coeur de l'app

#### 7. Marqueurs dynamiques premium
- Etat visuel par statut.
- Variante par type.
- Indicateur favori.
- Selection plus premium.
- Ajustement selon zoom conserve mais plus controle.

Pourquoi:
- les marqueurs portent l'identite de l'app

#### 8. Splash et demarrage premium
- Ajouter un vrai splash anime.
- Transition propre vers la carte.
- Eventuellement animation du logo ou du marqueur principal.

Pourquoi:
- premiere impression determinante

#### 9. Empty states plus editoriaux
- Favoris vide
- Aucune toilette dans la zone
- Aucun commentaire
- Aucun badge
- Profil neuf

Pourquoi:
- un produit premium soigne aussi les cas vides

#### 10. Score de fiabilite des toilettes
- Indicateur simple: fiable / a verifier / signalee.
- Base sur recence des avis, signalements, volume communautaire.

Pourquoi:
- augmente la confiance sans compliquer l'UI

#### 11. Recherche plus intelligente
- Differencier adresse, station, quartier.
- Afficher des suggestions mieux priorisees.
- Mieux guider l'utilisateur dans la recherche.

Pourquoi:
- la recherche devient une vraie entree produit, pas juste un deplacement carte

---

### P2 - Impact moyen / effort moyen

#### 12. Onboarding multi-etapes
- Etape bienvenue
- Etape prenom + avatar
- Etape permission localisation
- Transition vers Explorer

Pourquoi:
- plus premium, meilleure comprehension

#### 13. Skeleton loaders
- Carte / nearby sheet
- Favoris
- Profil
- Fiche detail

Pourquoi:
- meilleur rendu percu que les spinners seuls

#### 14. Pull-to-refresh et fraicheur des donnees
- Refresh manuel sur liste de toilettes.
- Afficher "mis a jour il y a X temps".

Pourquoi:
- donne une impression de produit vivant et fiable

#### 15. Recent activity
- Dernieres toilettes vues
- Dernier trajet
- Dernier signalement
- Derniers avis

Pourquoi:
- rend l'app plus personnelle sans surcharge

#### 16. Systeme d'icones plus coherent
- Statut
- Action
- Equipement
- Communaute
- Navigation

Pourquoi:
- augmente la maturite percue du produit

---

### P3 - Structure / scale / qualite long terme

#### 17. Optimisation carte et clustering
- Remplacer le clustering actuel par une solution plus robuste.
- Stabiliser les recalculs sur region.
- Limiter les rerenders map/sheet.
- Profiler les composants les plus lourds.

Pourquoi:
- indispensable si le nombre de points augmente

#### 18. Cache et offline-first renforces
- Detecter le mode hors ligne.
- File d'attente locale pour favoris/avis/signalements.
- Cache local des avis.
- Synchronisation au retour du reseau.

Pourquoi:
- fort avantage produit pour une app utilitaire

#### 19. Monitoring et analytics minimaux
- Crash reporting
- Evenements produit essentiels
- Funnel onboarding
- Clics Y aller
- Usage filtres
- Usage favoris

Pourquoi:
- permet de piloter les choix au lieu d'avancer a l'instinct

#### 20. Couche data plus formelle
- Clarifier `open data snapshot` vs `community live layer`.
- Mieux separer loading / stale / error / cached.
- Evoluer vers une couche de query/cache plus explicite.

Pourquoi:
- evite les regressions quand l'app grossit

---

## Ordre Recommande

### Phase 1 - Perception premium immediate
- Micro-animations
- Haptics
- Toasts/snackbars
- Unification overlays/surfaces

Resultat attendu:
- l'app parait beaucoup plus haut de gamme sans changer le fond fonctionnel

### Phase 2 - Renforcement du coeur produit
- Cartes toilettes enrichies
- Marqueurs dynamiques
- Mode urgence
- Empty states
- Recherche plus intelligente

Resultat attendu:
- meilleure utilite percue
- meilleure lisibilite
- vraie personnalite produit

### Phase 3 - Finition et confiance
- Score de fiabilite
- Splash anime
- Skeletons
- Pull-to-refresh
- Recent activity

Resultat attendu:
- produit plus fini
- meilleure confiance utilisateur

### Phase 4 - Robustesse et scale
- Perf map / clustering
- Offline-first
- Monitoring / analytics
- Couche data formelle

Resultat attendu:
- base saine pour une vraie mise en production

---

## Plan de Travail Precis

## Sprint 1 - Fondations premium

### Objectif
Creer les briques transverses reutilisables qui ameliorent toute l'app.

### Taches
1. Ajouter `expo-haptics`.
2. Creer un systeme `app-feedback` avec toast global.
3. Creer un petit systeme `motion presets` avec Reanimated.
4. Definir des tokens d'overlay:
   - `overlaySoft`
   - `overlayMedium`
   - `overlayStrong`
5. Appliquer ces tokens a:
   - menu
   - onboarding
   - favoris
   - filtres
   - details

### Definition of done
- aucune `Alert.alert` hors cas systeme bloquant
- haptics sur 5 interactions cles
- animations d'ouverture/fermeture homogenes
- overlays visuellement coherents

---

## Sprint 2 - Explorer premium

### Objectif
Faire d'Explorer un ecran visuellement fort et tres lisible.

### Taches
1. Animer les marqueurs.
2. Ajouter une variation visuelle par statut.
3. Ajouter indicateur favori sur marqueurs.
4. Enrichir `ToiletCard`:
   - icones equipements
   - badge statut
   - meilleur footer
5. Ajouter skeletons de chargement nearby list.
6. Ajouter pull-to-refresh.
7. Ajouter affichage discret de fraicheur des donnees.

### Definition of done
- la map parait plus vivante
- les cards sont plus informatives sans etre plus chargees
- le chargement semble propre et moderne

---

## Sprint 3 - Feature produit differentiant

### Objectif
Ajouter une fonction simple mais forte qui rend l'app memorisable.

### Taches
1. Concevoir le mode urgence.
2. Ajouter acces rapide depuis Explorer.
3. Filtrer sur:
   - proximite
   - disponibilite
   - simplicite d'action
4. Ajouter un affichage dedie tres minimal.
5. Ajouter haptics + motion dedies.

### Definition of done
- l'utilisateur peut obtenir une reponse utile en 1 action

---

## Sprint 4 - Confiance et personnalisation

### Objectif
Rendre les donnees et le profil plus utiles.

### Taches
1. Ajouter score de fiabilite.
2. Ajouter recent activity dans profil ou favoris.
3. Revoir les empty states.
4. Revoir onboarding en multi-etapes.
5. Ajouter splash anime.

### Definition of done
- meilleure confiance dans les fiches
- meilleure personnalisation
- meilleure premiere impression

---

## Sprint 5 - Stabilite et scale

### Objectif
Rendre l'app robuste pour une mise en circulation plus large.

### Taches
1. Refaire clustering avec algo plus robuste.
2. Profiler les rerenders carte et sheets.
3. Ajouter mode hors ligne detecte.
4. Ajouter queue locale de sync.
5. Brancher crash reporting.
6. Brancher analytics minimales.

### Definition of done
- moins de lag
- experience plus fiable
- meilleure observabilite produit

---

## Decoupage Technique Recommande

### A. Design system
- `src/theme/tokens.ts`
- `src/theme/theme.ts`
- `src/components/common`

### B. Experience transversale
- `src/components/feedback`
- `src/components/motion`
- `src/hooks`

### C. Explorer
- `src/features/explorer`
- `src/features/toilet-details`
- `src/features/filters`

### D. Gamification / profile
- `src/features/profile`
- `src/config/gamificationAssets.ts`
- `src/utils/xp.ts`

### E. Data / offline / perf
- `src/repositories`
- `src/services`
- `src/core/store`

---

## Recommandation Finale

Si l'objectif est de rendre l'app nettement plus professionnelle rapidement, il faut commencer par:

1. micro-animations
2. haptics
3. toasts/snackbars
4. overlays unifies
5. mode urgence

Si l'objectif est plutot de fiabiliser une future mise en production:

1. perf map
2. clustering robuste
3. offline-first
4. monitoring
5. analytics

Le meilleur compromis produit est:

1. Sprint 1
2. Sprint 2
3. Sprint 3

Ce trio apportera deja un saut de qualite tres visible sans rendre l'app plus complexe pour l'utilisateur.
