export type ToiletSource = "paris" | "idf" | "ratp" | "community";
export type ToiletStatus = "open" | "closed" | "out_of_order" | "unknown";

export interface Location {
  latitude: number;
  longitude: number;
}

export interface Toilet {
  id: string; // ID unique généré ou composé (source_originalId)
  source: ToiletSource;
  location: Location;
  address: string;
  arrondissement?: string; // Spécifique Paris

  // Caractéristiques
  isPMR: boolean;
  hasBabyRelay: boolean;
  isPaid: boolean;
  price?: number;
  openingHours: string; // Ex: "06:00-22:00" ou "24/7"

  // État temps réel & Communauté
  status: ToiletStatus;
  negativeReportsCount: number; // Si >= 2 en 48h -> passe out_of_order
  lastUpdate: Date | number; // Timestamp de la dernière validation/mise à jour API

  // Évaluations
  rating?: number;
}

export interface UserProfile {
  uid: string; // Firebase Anonymous Auth UID
  firstName?: string;
  profileImage?: string;
  xp: number;
  level: number; // Gamification (ex: 1 = Débutant, 5 = Guide Expert)
  favorites: string[]; // Liste des IDs de toilettes favorites
  reportsMade: number;
}

export interface Report {
  id: string;
  toiletId: string;
  userId: string;
  type: "dirty" | "broken" | "closed" | "fake";
  comment: string | null;
  createdAt: Date | number;
}
