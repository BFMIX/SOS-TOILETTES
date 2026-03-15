export type AppLanguage = "fr" | "en" | "es";
export type AppLanguagePreference = AppLanguage | "system";
export type AppThemeMode = "light" | "dark" | "system";

export type ToiletSource = "paris" | "ile_de_france";
export type ReportType = "out_of_service" | "dirty";
export type CommunityStatus =
  | "unknown"
  | "operational"
  | "reported"
  | "out_of_service";

export interface ToiletEquipment {
  isAccessible: boolean;
  hasBabyChange: boolean;
  isFree: boolean;
}

export interface ToiletPoint {
  id: string;
  name: string;
  address: string;
  district?: string;
  city: string;
  department?: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  source: ToiletSource;
  sourceLabel: string;
  sourceId: string;
  typeLabel: string;
  openingHours?: string | null;
  isOpenNowApprox: boolean | null;
  isTwentyFourSeven: boolean;
  placeCategory: "street_sanisette" | "indoor_public_building" | "other";
  networkTag: "ratp" | "other";
  structuralStatus: "available" | "out_of_service" | "unknown";
  equipment: ToiletEquipment;
}

export interface ToiletFilters {
  openOnly: boolean;
  freeOnly: boolean;
  accessibleOnly: boolean;
  babyChangeOnly: boolean;
  open24hOnly: boolean;
  parisOnly: boolean;
  indoorOnly: boolean;
  sanisetteOnly: boolean;
}

export interface UserProfile {
  uid: string;
  pseudo: string;
  avatarPreset: string | null;
  avatarUri: string | null;
  xp: number;
  level: number;
  badges: string[];
  favorites: string[];
  reportsCount: number;
  outOfServiceReportsCount: number;
  reviewsCount: number;
  positiveReviewsCount: number;
  nightActionsCount: number;
  transitInteractionsCount: number;
  nonTransitInteractionsCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ToiletOverride {
  toiletId: string;
  communityStatus: CommunityStatus;
  negativeReportsCount: number;
  lastReportAt?: string | null;
  updatedAt: string;
}

export interface CommunityReview {
  id: string;
  toiletId: string;
  userId: string;
  pseudo: string;
  comment: string;
  createdAt: string;
}

export interface ReportRecord {
  id: string;
  toiletId: string;
  userId: string;
  type: ReportType;
  createdAt: string;
}

export interface BadgeDefinition {
  id: string;
  key: string;
  descriptionKey: string;
  threshold: number;
  metric:
    | "favorites"
    | "out_of_service_reports"
    | "positive_reviews"
    | "ratp_exclusive"
    | "night_actions";
}

export interface LevelDefinition {
  id: "level1" | "level2" | "level3" | "level4" | "level5";
  level: number;
  minXp: number;
  maxXp: number | null;
}

export interface ToiletCommunitySnapshot {
  override?: ToiletOverride | null;
  favorite: boolean;
  reviews: CommunityReview[];
}

export interface GeocodingSuggestion {
  id: string;
  label: string;
  subtitle: string;
  latitude: number;
  longitude: number;
}

export interface NearbyToiletCard extends ToiletPoint {
  distanceMeters: number;
  walkingMinutes: number;
  communityStatus: CommunityStatus;
  favorite: boolean;
}

export interface ExplorerState {
  isLoading: boolean;
  error?: string | null;
  toilets: ToiletPoint[];
  nearbyToilets: NearbyToiletCard[];
}
