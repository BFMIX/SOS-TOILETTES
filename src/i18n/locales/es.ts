const es = {
  tabs: {
    explorer: "Explorer",
    favoris: "Favoris",
    profile: "Profile"
  },
  common: {
    loading: "Cargando...",
    retry: "Reintentar",
    close: "Cerrar",
    clear: "Borrar",
    cancel: "Cancelar",
    save: "Guardar",
    search: "Buscar",
    permissionsTitle: "Permiso necesario",
    photoPermission: "Autoriza el acceso a las fotos para elegir una foto de perfil.",
    favorite: "Favorito",
    favorites: "Favoritos",
    directions: "Ir",
    unknown: "Desconocido",
    source: "Fuente",
    community: "Comunidad",
    filters: "Filtros",
    comments: "Comentarios",
    reports: "Reportes",
    nearby: "Cerca",
    list: "Lista",
    recent: "Recientes",
    empty: "Sin resultados",
    statuses: {
      operational: "En servicio",
      reported: "Señalado recientemente",
      out_of_service: "Fuera de servicio",
      unknown: "Estado desconocido"
    },
    equipments: {
      accessible: "Accesible PMR",
      babyChange: "Cambiador para bebés",
      free: "Gratis",
      open: "Abierto",
      open24h: "24/7"
    }
  },
  onboarding: {
    title: "Bienvenido a SOS TOILETTES",
    subtitle:
      "Añade tu nombre para personalizar la aplicación y reconocer más fácilmente tus contribuciones.",
    inputLabel: "Tu nombre",
    inputPlaceholder: "Ej. Camille",
    avatarLabel: "Elige una foto de perfil",
    addPhoto: "Añadir mi foto",
    cta: "Continuar"
  },
  explorer: {
    searchPlaceholder: "Buscar una dirección o estación...",
    searchEmpty: "No se encontró ninguna dirección",
    locateMe: "Ubicarme",
    nearbyTitle: "Alrededor de Usted",
    sheetSubtitle: "{{count}} baños listos para consultar",
    mapError:
      "No se pueden cargar los baños ahora mismo. Comprueba la conexión e inténtalo de nuevo.",
    permissionDenied:
      "La localización está desactivada. Aún puedes explorar París manualmente.",
    emptyNearby:
      "Ningún baño coincide con los filtros activos en esta zona visible.",
    openSheetHint: "Toca un marcador o una ficha para abrir los detalles.",
    communityLabel: "Estado comunitario",
    sourceLabel: "Fuente estructural"
  },
  filters: {
    title: "Filtros",
    reset: "Borrar",
    sections: {
      status: "Estado",
      amenities: "Comodidades",
      type: "Tipo"
    },
    descriptions: {
      accessible: "Adaptado para sillas de ruedas",
      babyChange: "Cambiador disponible"
    },
    options: {
      open24h: "24/7",
      parisOnly: "Solo París",
      indoorOnly: "Dentro de un edificio",
      sanisetteOnly: "Sanisettes de calle"
    },
    applyCta: "Mostrar {{count}} baños"
  },
  favoris: {
    title: "Favoritos",
    count: "{{count}} baños guardados",
    listTab: "Lista",
    recentTab: "Recientes",
    emptyTitle: "Aún no hay favoritos",
    emptyBody:
      "Añade baños desde Explorer para tener tus paradas más útiles siempre a mano."
  },
  profile: {
    title: "Perfil",
    greeting: "Hola, {{pseudo}}",
    memberSince: "Miembro desde {{date}}",
    changeAvatar: "Cambiar foto",
    avatarPickerTitle: "Elegir una foto de perfil",
    addPhoto: "Añadir mi foto",
    xp: "Puntos XP",
    level: "Nivel {{level}}",
    nextLevelXp: "{{xp}} XP hasta el siguiente nivel",
    levelInfoCta: "Entender niveles y XP",
    levelInfoBody:
      "Cada acción útil en la app da XP. Los favoritos, comentarios, reportes y rutas validadas te hacen subir de nivel y desbloquear insignias.",
    levelsTitle: "Niveles",
    favoritesCount: "Favoritos",
    reportsCount: "Reportes",
    reviewsCount: "Comentarios",
    badgesTitle: "Insignias",
    badgeUnlocked: "Desbloqueado",
    badgeLocked: "Por desbloquear",
    noBadges: "Añade favoritos, opiniones y reportes para desbloquear tus primeras insignias.",
    settingsTitle: "Cuenta",
    settings: {
      account: "Configuración de cuenta",
      theme: "Apariencia",
      language: "Idioma",
      credits: "Créditos"
    },
    languageValue: {
      fr: "Francés",
      en: "Inglés",
      es: "Español"
    },
    badges: {
      toiletteur: "Le Toiletteur",
      toiletteurDescription: "Se desbloquea tras 3 favoritos",
      savior: "El Salvador",
      saviorDescription: "Se desbloquea tras 3 reportes validados de fuera de servicio",
      cleanMaster: "Señor / Señora Limpieza",
      cleanMasterDescription: "Se desbloquea tras 5 opiniones positivas",
      metroMole: "Topo del Metro",
      metroMoleDescription: "Se desbloquea tras 3 interacciones solo en baños de transporte",
      nightOwl: "Búho Nocturno",
      nightOwlDescription: "Se desbloquea tras una acción entre medianoche y las 5:00"
    },
    levelRanks: {
      level1: "Vejiga Tímida",
      level2: "Explorador del Trono",
      level3: "Inspector de Sanisettes",
      level4: "Ángel Guardián",
      level5: "Leyenda del Rincón"
    },
    levelDescriptions: {
      level1: "El estado base para los nuevos usuarios.",
      level2: "Empiezas a usar el mapa con regularidad.",
      level3: "Tus opiniones cuentan y tus reportes ayudan a la comunidad.",
      level4: "Tus contribuciones evitan malas sorpresas a otros usuarios.",
      level5: "El rango definitivo para los usuarios míticos de SOS TOILETTES."
    }
  },
  settings: {
    title: "Ajustes",
    theme: "Tema",
    language: "Idioma",
    languageHelp:
      "La app sigue el idioma del teléfono por defecto y puede cambiarse en cualquier momento desde el menú lateral.",
    apiCredits: "Créditos API",
    madeBy: "Hecho con ❤️ por BFMIX",
    themeValue: {
      system: "Auto",
      dark: "Oscuro",
      light: "Claro"
    },
    languageValue: {
      system: "Auto",
      fr: "Francés",
      en: "Inglés",
      es: "Español"
    }
  },
  menu: {
    greeting: "Hola {{pseudo}}",
    greetingFallback: "Hola",
    items: {
      explorer: "Mapa de baños",
      favoris: "Mis favoritos",
      profile: "Mi perfil"
    }
  },
  credits: {
    title: "Créditos / Fuentes",
    intro:
      "Gracias a los servicios y fuentes de datos abiertas que hacen posible SOS TOILETTES con una base fiable, ligera y útil.",
    maps: {
      title: "Mapas y navegación",
      body:
        "Apple Maps se usa en iPhone y Google Maps en Android para mostrar el mapa y abrir la ruta hasta cada baño."
    },
    openData: {
      title: "Fuentes abiertas",
      body:
        "Los baños proceden de los datos públicos de París e Île-de-France y luego se normalizan para mantener una navegación clara y coherente."
    },
    community: {
      title: "Capa comunitaria",
      body:
        "Firebase y Firestore se usan solo para tu perfil, favoritos, opiniones, reportes y estados comunitarios."
    },
    links: {
      paris: "Fuente Paris Open Data",
      idf: "Fuente Île-de-France Open Data",
      geopf: "Fuente Geoplateforme"
    }
  },
  toiletDetails: {
    headerTitle: "Detalles",
    type: "Tipo",
    access: "Acceso",
    hours: "Horarios",
    amenitiesTitle: "Comodidades",
    basicAmenitiesTitle: "Jabón y agua",
    basicAmenitiesBody: "Equipamientos básicos según la fuente y la comunidad.",
    locationTitle: "Ubicación",
    reviewsTitle: "Opiniones de la comunidad",
    noReviews: "Sé la primera persona en dejar una opinión sobre este baño.",
    reportTitle: "Señalar un problema",
    reportDirty: "Sucio",
    reportOutOfService: "Fuera de servicio",
    favoriteAdded: "Añadido a favoritos",
    favoriteRemoved: "Quitado de favoritos",
    directionsCta: "Ir",
    reviewPlaceholder: "Escribe un comentario breve...",
    submitReview: "Publicar (+5 XP)",
    submitReviewSuccess: "Tu comentario ha sido publicado.",
    submitReviewEmpty: "Añade un comentario antes de publicar.",
    submitReviewError: "No se puede publicar el comentario por ahora.",
    reportSubmitted: "Gracias, tu reporte ha sido registrado.",
    reportCooldown:
      "Ya se envió recientemente un reporte similar para este baño."
  },
  setup: {
    mockFirebase:
      "Firebase no está configurado. La aplicación funciona en modo de demostración local."
  }
};

export default es;
