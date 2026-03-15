const en = {
  tabs: {
    explorer: "Explorer",
    favoris: "Favoris",
    profile: "Profile"
  },
  common: {
    loading: "Loading...",
    retry: "Retry",
    close: "Close",
    clear: "Clear",
    cancel: "Cancel",
    save: "Save",
    search: "Search",
    permissionsTitle: "Permission required",
    photoPermission: "Allow photo access to choose a profile photo.",
    favorite: "Favorite",
    favorites: "Favorites",
    directions: "Go there",
    unknown: "Unknown",
    source: "Source",
    community: "Community",
    filters: "Filters",
    comments: "Comments",
    reports: "Reports",
    nearby: "Nearby",
    list: "List",
    recent: "Recent",
    empty: "No results",
    statuses: {
      operational: "Operational",
      reported: "Reported recently",
      out_of_service: "Out of service",
      unknown: "Unknown status"
    },
    equipments: {
      accessible: "Wheelchair access",
      babyChange: "Baby changing",
      free: "Free",
      open: "Open",
      open24h: "24/7"
    }
  },
  onboarding: {
    title: "Welcome to SOS TOILETTES",
    subtitle:
      "Add your first name to personalize the app and keep your contributions easy to recognize.",
    inputLabel: "Your first name",
    inputPlaceholder: "e.g. Camille",
    avatarLabel: "Choose a profile photo",
    addPhoto: "Add my photo",
    cta: "Continue"
  },
  explorer: {
    searchPlaceholder: "Find an address or station...",
    searchEmpty: "No address found",
    locateMe: "Locate me",
    nearbyTitle: "Around You",
    sheetSubtitle: "{{count}} toilets ready to browse",
    mapError:
      "Unable to load toilets right now. Check your connection and try again.",
    permissionDenied:
      "Location is disabled. You can still explore Paris manually.",
    emptyNearby: "No toilets match the active filters in this visible area.",
    openSheetHint: "Tap a marker or card to open details.",
    communityLabel: "Community status",
    sourceLabel: "Open data source"
  },
  filters: {
    title: "Filters",
    reset: "Clear",
    sections: {
      status: "Status",
      amenities: "Amenities",
      type: "Type"
    },
    descriptions: {
      accessible: "Suitable for wheelchairs",
      babyChange: "Baby changing table available"
    },
    options: {
      open24h: "24/7",
      parisOnly: "Paris only",
      indoorOnly: "Inside a building",
      sanisetteOnly: "Street sanisettes"
    },
    applyCta: "Show {{count}} toilets"
  },
  favoris: {
    title: "Favorites",
    count: "{{count}} saved toilets",
    listTab: "List",
    recentTab: "Recent",
    emptyTitle: "No favorites yet",
    emptyBody:
      "Save toilets from Explorer to keep your most useful stops close at hand."
  },
  profile: {
    title: "Profile",
    greeting: "Hi, {{pseudo}}",
    memberSince: "Member since {{date}}",
    changeAvatar: "Change photo",
    avatarPickerTitle: "Choose a profile photo",
    addPhoto: "Add my photo",
    xp: "XP points",
    level: "Level {{level}}",
    nextLevelXp: "{{xp}} XP until the next level",
    levelInfoCta: "How levels and XP work",
    levelInfoBody:
      "Useful actions in the app earn XP. Favorites, comments, reports and direction taps help you level up and unlock badges as you contribute.",
    levelsTitle: "Levels",
    favoritesCount: "Favorites",
    reportsCount: "Reports",
    reviewsCount: "Comments",
    badgesTitle: "Badges",
    badgeUnlocked: "Unlocked",
    badgeLocked: "Locked",
    noBadges: "Add favorites, reviews and reports to unlock your first badges.",
    settingsTitle: "Account",
    settings: {
      account: "Account settings",
      theme: "Appearance",
      language: "Language",
      credits: "Credits"
    },
    languageValue: {
      fr: "French",
      en: "English",
      es: "Spanish"
    },
    badges: {
      toiletteur: "Le Toiletteur",
      toiletteurDescription: "Unlocked after 3 favorites",
      savior: "The Savior",
      saviorDescription: "Unlocked after 3 validated out-of-service reports",
      cleanMaster: "Mr / Mrs Clean",
      cleanMasterDescription: "Unlocked after 5 positive reviews",
      metroMole: "Metro Mole",
      metroMoleDescription: "Unlocked after 3 transport-only toilet interactions",
      nightOwl: "Night Owl",
      nightOwlDescription: "Unlocked after one action between midnight and 5am"
    },
    levelRanks: {
      level1: "Shy Bladder",
      level2: "Throne Explorer",
      level3: "Sanisette Inspector",
      level4: "Guardian Angel",
      level5: "Little Corner Legend"
    },
    levelDescriptions: {
      level1: "The base status for new users.",
      level2: "You are starting to rely on the map regularly.",
      level3: "Your reviews matter and your reports help the community.",
      level4: "Your contributions protect other users from bad surprises.",
      level5: "The ultimate rank for the mythical SOS TOILETTES users."
    }
  },
  settings: {
    title: "Settings",
    theme: "Theme",
    language: "Language",
    languageHelp:
      "The app follows your phone language by default and can be switched anytime from the side menu with a single tap.",
    apiCredits: "API credits",
    madeBy: "Made with ❤️ by BFMIX",
    themeValue: {
      system: "Auto",
      dark: "Dark",
      light: "Light"
    },
    languageValue: {
      system: "Auto",
      fr: "French",
      en: "English",
      es: "Spanish"
    }
  },
  menu: {
    greeting: "Hi {{pseudo}}",
    greetingFallback: "Hi",
    items: {
      explorer: "Toilet map",
      favoris: "My favorites",
      profile: "My profile"
    }
  },
  credits: {
    title: "Credits / Sources",
    intro:
      "Thanks to the services and open data providers that make SOS TOILETTES possible with a reliable, lightweight and practical foundation.",
    maps: {
      title: "Maps and navigation",
      body:
        "Apple Maps is used on iPhone and Google Maps on Android to render the map and open directions to each toilet."
    },
    openData: {
      title: "Open data sources",
      body:
        "Toilet locations come from the public Paris and Ile-de-France datasets, then get normalized to keep browsing clear and consistent."
    },
    community: {
      title: "Community layer",
      body:
        "Firebase and Firestore are only used for your profile, favorites, reviews, reports and community status updates."
    },
    links: {
      paris: "Paris Open Data source",
      idf: "Ile-de-France Open Data source",
      geopf: "Geoplateforme geocoding source"
    }
  },
  toiletDetails: {
    headerTitle: "Details",
    type: "Type",
    access: "Access",
    hours: "Hours",
    amenitiesTitle: "Amenities",
    basicAmenitiesTitle: "Soap & water",
    basicAmenitiesBody: "Basic amenities inferred from source data and community feedback.",
    locationTitle: "Location",
    reviewsTitle: "Community reviews",
    noReviews: "Be the first one to share a quick review for this toilet.",
    reportTitle: "Report an issue",
    reportDirty: "Dirty",
    reportOutOfService: "Out of service",
    favoriteAdded: "Added to favorites",
    favoriteRemoved: "Removed from favorites",
    directionsCta: "Go there",
    reviewPlaceholder: "Write a short review...",
    submitReview: "Post (+5 XP)",
    submitReviewSuccess: "Your comment has been published.",
    submitReviewEmpty: "Write a comment before posting.",
    submitReviewError: "Unable to post the comment right now.",
    reportSubmitted: "Thanks, your report has been recorded.",
    reportCooldown:
      "A similar report was already sent recently for this toilet."
  },
  setup: {
    mockFirebase:
      "Firebase is not configured. The app is running in local demo mode."
  }
};

export default en;
