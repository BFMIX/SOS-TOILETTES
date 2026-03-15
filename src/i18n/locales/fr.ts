const fr = {
  tabs: {
    explorer: "Explorer",
    favoris: "Favoris",
    profile: "Profile"
  },
  common: {
    loading: "Chargement...",
    retry: "Réessayer",
    close: "Fermer",
    clear: "Effacer",
    cancel: "Annuler",
    save: "Enregistrer",
    search: "Rechercher",
    permissionsTitle: "Autorisation requise",
    photoPermission: "Autorisez l'acces aux photos pour choisir une photo de profil.",
    favorite: "Favori",
    favorites: "Favoris",
    directions: "Y aller",
    unknown: "Inconnu",
    source: "Source",
    community: "Communauté",
    filters: "Filtres",
    comments: "Commentaires",
    reports: "Signalements",
    nearby: "À proximité",
    list: "Liste",
    recent: "Récents",
    empty: "Aucun résultat",
    statuses: {
      operational: "En service",
      reported: "Signalé récemment",
      out_of_service: "Hors service",
      unknown: "Statut inconnu"
    },
    equipments: {
      accessible: "Accessible PMR",
      babyChange: "Relais bébé",
      free: "Gratuit",
      open: "Ouvert",
      open24h: "24h/24"
    }
  },
  onboarding: {
    title: "Bienvenue dans SOS TOILETTES",
    subtitle:
      "Ajoutez votre prénom pour personnaliser l'application et retrouver plus facilement vos contributions.",
    inputLabel: "Votre prénom",
    inputPlaceholder: "Ex. Camille",
    avatarLabel: "Choisissez une photo de profil",
    addPhoto: "Ajouter ma photo",
    cta: "Continuer"
  },
  explorer: {
    searchPlaceholder: "Trouver une adresse ou une station...",
    searchEmpty: "Aucune adresse trouvée",
    locateMe: "Me localiser",
    nearbyTitle: "Autour de vous",
    sheetSubtitle: "{{count}} toilettes prêtes à être consultées",
    mapError:
      "Impossible de charger les toilettes. Vérifiez la connexion puis réessayez.",
    permissionDenied:
      "La localisation est désactivée. Vous pouvez continuer à explorer Paris manuellement.",
    emptyNearby:
      "Aucune toilette ne correspond aux filtres visibles dans cette zone.",
    openSheetHint: "Touchez un marqueur ou une carte pour ouvrir la fiche.",
    communityLabel: "Statut communautaire",
    sourceLabel: "Donnée structurelle"
  },
  filters: {
    title: "Filtres",
    reset: "Effacer",
    sections: {
      status: "Statut",
      amenities: "Commodités",
      type: "Type"
    },
    descriptions: {
      accessible: "Adapté aux fauteuils roulants",
      babyChange: "Table à langer disponible"
    },
    options: {
      open24h: "24h/24",
      parisOnly: "Paris uniquement",
      indoorOnly: "Dans un bâtiment",
      sanisetteOnly: "Sanisettes de rue"
    },
    applyCta: "Afficher {{count}} toilettes"
  },
  favoris: {
    title: "Favoris",
    count: "{{count}} toilettes enregistrées",
    listTab: "Liste",
    recentTab: "Récents",
    emptyTitle: "Aucun favori pour le moment",
    emptyBody:
      "Ajoutez des toilettes depuis Explorer pour retrouver vos points utiles plus vite."
  },
  profile: {
    title: "Profil",
    greeting: "Bonjour, {{pseudo}}",
    memberSince: "Membre depuis {{date}}",
    changeAvatar: "Changer de photo",
    avatarPickerTitle: "Choisir une photo de profil",
    addPhoto: "Ajouter ma photo",
    xp: "Points XP",
    level: "Niveau {{level}}",
    nextLevelXp: "{{xp}} XP avant le prochain niveau",
    levelInfoCta: "Comprendre les niveaux et les XP",
    levelInfoBody:
      "Chaque action utile dans l'app rapporte des XP. Les favoris, commentaires, signalements et trajets validés font progresser votre niveau et débloquent des badges au fil de vos contributions.",
    levelsTitle: "Niveaux",
    favoritesCount: "Favoris",
    reportsCount: "Signalements",
    reviewsCount: "Commentaires",
    badgesTitle: "Badges",
    badgeUnlocked: "Débloqué",
    badgeLocked: "À débloquer",
    noBadges: "Ajoutez des favoris, des avis et des signalements pour débloquer vos premiers badges.",
    settingsTitle: "Compte",
    settings: {
      account: "Paramètres du compte",
      theme: "Apparence",
      language: "Langue",
      credits: "Crédits"
    },
    languageValue: {
      fr: "Français",
      en: "English",
      es: "Español"
    },
    badges: {
      toiletteur: "Le Toiletteur",
      toiletteurDescription: "Débloqué après 3 favoris",
      savior: "Le Sauveur",
      saviorDescription: "Débloqué après 3 signalements hors service validés",
      cleanMaster: "Monsieur / Madame Propre",
      cleanMasterDescription: "Débloqué après 5 avis positifs",
      metroMole: "Taupe du Métro",
      metroMoleDescription: "Débloqué après 3 interactions uniquement sur des toilettes de transport",
      nightOwl: "Oiseau de Nuit",
      nightOwlDescription: "Débloqué après une action entre minuit et 5h"
    },
    levelRanks: {
      level1: "Vessie Timide",
      level2: "Explorateur du Trône",
      level3: "Inspecteur des Sanisettes",
      level4: "Ange Gardien des Vessies",
      level5: "Légende du Petit Coin"
    },
    levelDescriptions: {
      level1: "Le statut de base pour les nouveaux utilisateurs.",
      level2: "Vous commencez à utiliser la carte régulièrement pour vous repérer.",
      level3: "Vos avis comptent et vos signalements deviennent utiles à toute la communauté.",
      level4: "Vous évitez de mauvaises surprises aux autres utilisateurs grâce à vos contributions.",
      level5: "Le grade ultime des utilisateurs mythiques de SOS TOILETTES."
    }
  },
  settings: {
    title: "Paramètres",
    theme: "Thème",
    language: "Langue",
    languageHelp:
      "La langue suit le réglage du téléphone par défaut et peut être changée depuis le menu latéral d'un simple appui.",
    apiCredits: "Crédits API",
    madeBy: "Fait avec ❤️ par BFMIX",
    themeValue: {
      system: "Auto",
      dark: "Sombre",
      light: "Clair"
    },
    languageValue: {
      system: "Auto",
      fr: "Français",
      en: "English",
      es: "Español"
    }
  },
  menu: {
    greeting: "Bonjour {{pseudo}}",
    greetingFallback: "Bonjour",
    items: {
      explorer: "Carte des toilettes",
      favoris: "Mes favoris",
      profile: "Mon profile"
    }
  },
  credits: {
    title: "Credits / Sources",
    intro:
      "Merci aux services et jeux de données qui permettent à SOS TOILETTES d'exister avec une base fiable, légère et utile au quotidien.",
    maps: {
      title: "Cartes et navigation",
      body:
        "Apple Maps est utilisé sur iPhone, Google Maps sur Android, pour afficher la carte et lancer l'itinéraire vers chaque toilette."
    },
    openData: {
      title: "Sources ouvertes",
      body:
        "Les toilettes proviennent des jeux de données publics de Paris et d'Île-de-France, ensuite normalisés pour offrir une recherche claire et cohérente."
    },
    community: {
      title: "Couche communautaire",
      body:
        "Firebase et Firestore servent uniquement à gérer votre profil, les favoris, les avis, les signalements et les statuts communautaires."
    },
    links: {
      paris: "Source Paris Open Data",
      idf: "Source Île-de-France Open Data",
      geopf: "Source Géocodage Géoplateforme"
    }
  },
  toiletDetails: {
    headerTitle: "Détails",
    type: "Type",
    access: "Accès",
    hours: "Horaires",
    amenitiesTitle: "Commodités",
    basicAmenitiesTitle: "Savon & eau",
    basicAmenitiesBody: "Équipements de base selon la source et les retours de la communauté.",
    locationTitle: "Localisation",
    reviewsTitle: "Avis de la communauté",
    noReviews: "Soyez le premier à laisser un avis sur cette toilette.",
    reportTitle: "Signaler un problème",
    reportDirty: "Sale",
    reportOutOfService: "Hors service",
    favoriteAdded: "Ajouté aux favoris",
    favoriteRemoved: "Retiré des favoris",
    directionsCta: "Y aller",
    reviewPlaceholder: "Écrire un commentaire rapide...",
    submitReview: "Publier (+5 XP)",
    submitReviewSuccess: "Votre commentaire a ete publie.",
    submitReviewEmpty: "Ajoutez un commentaire avant de publier.",
    submitReviewError: "Impossible de publier le commentaire pour le moment.",
    reportSubmitted: "Merci, votre signalement a été pris en compte.",
    reportCooldown:
      "Un signalement similaire a déjà été envoyé récemment pour cette toilette."
  },
  setup: {
    mockFirebase:
      "Firebase n'est pas configuré. L'application fonctionne en mode local de démonstration."
  }
};

export default fr;
