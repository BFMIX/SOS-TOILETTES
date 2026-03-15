export const APP_CONSTANTS = {
  appName: "SOS TOILETTES",
  cacheTtlMs: 1000 * 60 * 60 * 12,
  parisCenter: {
    latitude: 48.8566,
    longitude: 2.3522,
    latitudeDelta: 0.12,
    longitudeDelta: 0.12
  },
  visibleRadiusMeters: 2400,
  listCardWidth: 284,
  reportCooldownHours: 12,
  negativeReportWindowHours: 48,
  negativeReportThreshold: 2
} as const;

export const STORAGE_KEYS = {
  preferences: "sos_toilettes_preferences",
  filters: "sos_toilettes_filters",
  cachedToilets: "sos_toilettes_cached_toilets",
  sessionCache: "sos_toilettes_session_cache",
  mockProfile: "sos_toilettes_mock_profile",
  mockReviews: "sos_toilettes_mock_reviews",
  mockReports: "sos_toilettes_mock_reports",
  mockOverrides: "sos_toilettes_mock_overrides",
  mockAuth: "sos_toilettes_mock_auth"
} as const;
