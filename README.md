# SOS TOILETTES

MVP Expo SDK 54 pour iOS et Android, orienté features, avec carte native `react-native-maps`, authentification anonyme Firebase, couche communautaire Firestore minimale, open data Paris + Île-de-France fusionnées et i18n FR/EN.

## Stack

- React Native + Expo SDK 54
- TypeScript
- `react-native-maps`
- Firebase Authentication (anonyme)
- Firestore minimal
- `zustand` pour la persistance locale UI
- `i18next` / `react-i18next`

## Arborescence

```text
.
├── app.config.ts
├── assets
│   ├── images
│   │   ├── Toilette_generic.png
│   │   └── paris_sanisette.png
│   ├── android-icon-background.png
│   ├── android-icon-foreground.png
│   ├── android-icon-monochrome.png
│   ├── favicon.png
│   ├── icon.png
│   └── splash-icon.png
├── babel.config.js
├── eslint.config.js
├── firestore.indexes.json
├── firestore.rules
├── index.ts
├── package.json
├── src
│   ├── App.tsx
│   ├── components
│   │   ├── common
│   │   │   ├── Chip.tsx
│   │   │   ├── EmptyState.tsx
│   │   │   ├── FavoriteButton.tsx
│   │   │   ├── IconButton.tsx
│   │   │   ├── LoadingOverlay.tsx
│   │   │   ├── PrimaryButton.tsx
│   │   │   ├── ToggleRow.tsx
│   │   │   └── ToiletCard.tsx
│   │   └── navigation
│   │       └── AppTabBar.tsx
│   ├── config
│   │   ├── app.ts
│   │   ├── badges.ts
│   │   ├── firebase.ts
│   │   └── openData.ts
│   ├── core
│   │   ├── navigation
│   │   │   ├── MainTabs.tsx
│   │   │   └── RootNavigator.tsx
│   │   ├── providers
│   │   │   └── AppProviders.tsx
│   │   └── store
│   │       ├── usePreferencesStore.ts
│   │       └── useSessionStore.ts
│   ├── features
│   │   ├── explorer
│   │   │   ├── components
│   │   │   │   ├── NearbyToiletsCarousel.tsx
│   │   │   │   ├── SearchSuggestions.tsx
│   │   │   │   └── ToiletMarker.tsx
│   │   │   ├── hooks
│   │   │   │   └── useExplorerController.ts
│   │   │   └── screens
│   │   │       └── ExplorerScreen.tsx
│   │   ├── favoris
│   │   │   └── screens
│   │   │       └── FavorisScreen.tsx
│   │   ├── filters
│   │   │   ├── screens
│   │   │   │   └── FilterModalScreen.tsx
│   │   │   └── store
│   │   │       └── useFilterStore.ts
│   │   ├── onboarding
│   │   │   └── screens
│   │   │       └── OnboardingScreen.tsx
│   │   ├── profile
│   │   │   ├── components
│   │   │   │   ├── ProfileSettingRow.tsx
│   │   │   │   └── ProfileStatCard.tsx
│   │   │   └── screens
│   │   │       └── ProfileScreen.tsx
│   │   └── toilet-details
│   │       └── components
│   │           ├── CommunityReviewCard.tsx
│   │           └── ToiletDetailsBottomSheet.tsx
│   ├── hooks
│   │   ├── useAppBootstrap.ts
│   │   ├── useDebouncedValue.ts
│   │   └── useUserLocation.ts
│   ├── i18n
│   │   ├── index.ts
│   │   └── locales
│   │       ├── en.ts
│   │       └── fr.ts
│   ├── repositories
│   │   ├── community
│   │   │   └── communityRepository.ts
│   │   └── toilets
│   │       └── openDataRepository.ts
│   ├── services
│   │   ├── firebase
│   │   │   ├── authService.ts
│   │   │   └── client.ts
│   │   └── geocoding
│   │       └── geocodingService.ts
│   ├── theme
│   │   ├── ThemeProvider.tsx
│   │   ├── theme.ts
│   │   └── tokens.ts
│   ├── types
│   │   ├── models.ts
│   │   └── navigation.ts
│   └── utils
│       ├── date.ts
│       ├── distance.ts
│       ├── toilets.ts
│       └── xp.ts
└── stitch
```

## Sources de données

- Paris direct: `https://opendata.paris.fr/api/explore/v2.1/catalog/datasets/sanisettesparis/records`
- Île-de-France consolidé: `https://data.iledefrance.fr/api/explore/v2.1/catalog/datasets/toilettes-publiques-en-ile-de-france/records`
- Géocodage / autocomplétion: `https://data.geopf.fr/geocodage`

## Configuration

### 1. Variables d'environnement

Copier `.env.example` vers `.env` puis renseigner:

```bash
EXPO_PUBLIC_FIREBASE_API_KEY=
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=
EXPO_PUBLIC_FIREBASE_PROJECT_ID=
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
EXPO_PUBLIC_FIREBASE_APP_ID=
EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID=
EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=
```

### 2. Firebase

1. Créer un projet Firebase.
2. Activer `Authentication > Anonymous`.
3. Créer une base Firestore en mode production.
4. Déployer les règles:

```bash
firebase deploy --only firestore:rules,firestore:indexes
```

Collections utilisées:

- `users`
- `toilet_overrides`
- `reviews`
- `reports`

### 3. Google Maps Android

- Renseigner `EXPO_PUBLIC_GOOGLE_MAPS_API_KEY`.
- Construire un dev client ou une build native:

```bash
npx expo run:android
```

Sur iOS, aucun provider Google n'est forcé: `react-native-maps` utilise Apple Maps par défaut.

### 4. Localisation

Les permissions sont déjà câblées dans `app.config.ts` via:

- plugin `expo-location`
- `NSLocationWhenInUseUsageDescription`
- permissions Android `ACCESS_COARSE_LOCATION` / `ACCESS_FINE_LOCATION`

### 5. Lancement

```bash
npm install
npm run typecheck
npm run lint
npm run ios
npm run android
```

## Modèle de données

### Open data normalisé

```ts
interface ToiletPoint {
  id: string;
  name: string;
  address: string;
  city: string;
  coordinates: { latitude: number; longitude: number };
  source: "paris" | "ile_de_france";
  sourceLabel: string;
  sourceId: string;
  typeLabel: string;
  openingHours?: string | null;
  isOpenNowApprox: boolean | null;
  structuralStatus: "available" | "out_of_service" | "unknown";
  equipment: {
    isAccessible: boolean;
    hasBabyChange: boolean;
    isFree: boolean;
  };
}
```

### Firestore minimal

```ts
type UserProfile = {
  uid: string;
  pseudo: string;
  xp: number;
  level: number;
  badges: string[];
  favorites: string[];
  reportsCount: number;
  reviewsCount: number;
  createdAt: string;
  updatedAt: string;
};

type ToiletOverride = {
  toiletId: string;
  communityStatus: "unknown" | "operational" | "reported" | "out_of_service";
  negativeReportsCount: number;
  lastReportAt?: string | null;
  updatedAt: string;
};

type ReportRecord = {
  id: string;
  toiletId: string;
  userId: string;
  type: "out_of_service" | "dirty";
  createdAt: string;
};

type CommunityReview = {
  id: string;
  toiletId: string;
  userId: string;
  pseudo: string;
  comment: string;
  createdAt: string;
};
```

## Règles métier intégrées

- `+10 XP` par signalement accepté
- `+5 XP` par commentaire
- `+1 XP` sur "S'y rendre"
- badge `Le Toiletteur` à `3 favoris`
- anti-spam simple via identifiant de signalement déterministe par utilisateur / toilette / type / bucket de 12h
- statut communautaire `Hors service` à partir de `2` signalements négatifs dans les `48h`

## Vérifications locales

- `npm run typecheck`
- `npm run lint`
- `npx expo-doctor`

## TODO manuels restants

- Remplacer `assets/images/paris_sanisette.png` par le vrai fichier fourni.
- Remplacer `assets/images/Toilette_generic.png` par le vrai fichier fourni.
- Définir les vrais `bundleIdentifier` / `package` si vous avez déjà une convention d’identifiants.
- Renseigner les vraies clés Firebase et Google Maps Android.
- Déployer Firestore rules + indexes sur le projet Firebase réel.
- Remplacer les icônes Expo par le branding final de l’application.
- Si vous voulez une authentification strictement persistée hors cache mémoire RN, valider la stratégie Firebase la plus adaptée à votre runtime cible.
