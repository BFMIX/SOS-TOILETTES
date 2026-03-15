import AsyncStorage from "@react-native-async-storage/async-storage";

import { APP_CONSTANTS, STORAGE_KEYS } from "@/config/app";
import { OPEN_DATA_ENDPOINTS } from "@/config/openData";
import { ToiletPoint } from "@/types/models";
import {
  buildToiletId,
  dedupeToilets,
  parseBooleanish,
  parseParisOpenStatus,
  parseTwentyFourSeven
} from "@/utils/toilets";

type ParisRecord = {
  type?: string;
  statut?: string;
  adresse?: string;
  arrondissement?: string;
  horaire?: string;
  acces_pmr?: string;
  relais_bebe?: string;
  geo_point_2d?: {
    lon?: number;
    lat?: number;
  };
};

type IleDeFranceRecord = {
  file?: string;
  accessible_au_public?: string | null;
  tarif?: string | null;
  accessibilite_pmr?: string | null;
  indications_de_localisation?: string | null;
  type?: string | null;
  horaires_d_ouverture?: string | null;
  relais_bebe?: string | null;
  coord_geo?: {
    lon?: number;
    lat?: number;
  };
  osm_id?: string | null;
  nom_de_la_commune?: string | null;
  nom_departement?: string | null;
};

const OPEN_DATA_CACHE_VERSION = 2;
const MIN_VALID_TOILET_COUNT = 100;
const API_PAGE_SIZE = 100;

const inferNetworkTag = (...parts: (string | null | undefined)[]) => {
  const haystack = parts
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return /(ratp|metro|métro|rer|gare|station|transilien)/.test(haystack)
    ? "ratp"
    : "other";
};

const normalizeParisRecord = (record: ParisRecord): ToiletPoint | null => {
  const latitude = record.geo_point_2d?.lat;
  const longitude = record.geo_point_2d?.lon;

  if (!latitude || !longitude || !record.adresse) {
    return null;
  }

  return {
    id: buildToiletId("paris", record.adresse, latitude, longitude),
    name: "Sanisette JCDecaux",
    address: record.adresse,
    district: record.arrondissement,
    city: "Paris",
    coordinates: { latitude, longitude },
    source: "paris",
    sourceLabel: "Paris direct",
    sourceId: record.adresse,
    typeLabel: record.type ?? "Sanisette",
    openingHours: record.horaire ?? null,
    isOpenNowApprox: parseParisOpenStatus(record.statut, record.horaire),
    isTwentyFourSeven: parseTwentyFourSeven(record.horaire),
    placeCategory: "street_sanisette",
    networkTag: "other",
    structuralStatus:
      record.statut?.toLowerCase().includes("hors service") === true
        ? "out_of_service"
        : "available",
    equipment: {
      isAccessible: parseBooleanish(record.acces_pmr),
      hasBabyChange: parseBooleanish(record.relais_bebe),
      isFree: true
    }
  };
};

const normalizeIleDeFranceRecord = (
  record: IleDeFranceRecord
): ToiletPoint | null => {
  const latitude = record.coord_geo?.lat;
  const longitude = record.coord_geo?.lon;

  if (!latitude || !longitude || !record.osm_id) {
    return null;
  }

  const city = record.nom_de_la_commune ?? "Île-de-France";
  const name = record.indications_de_localisation
    ? `Toilette ${record.indications_de_localisation}`
    : `Toilette publique ${city}`;
  const normalizedType = String(record.type ?? "").toLowerCase();

  return {
    id: buildToiletId("ile_de_france", record.osm_id, latitude, longitude),
    name,
    address: record.indications_de_localisation ?? city,
    city,
    department: record.nom_departement ?? undefined,
    coordinates: { latitude, longitude },
    source: "ile_de_france",
    sourceLabel: "Île-de-France consolidé",
    sourceId: record.osm_id,
    typeLabel: record.type ?? "Toilette publique",
    openingHours: record.horaires_d_ouverture ?? null,
    isTwentyFourSeven: parseTwentyFourSeven(record.horaires_d_ouverture),
    placeCategory: normalizedType.includes("bâtiment") || normalizedType.includes("batiment")
      ? "indoor_public_building"
      : "other",
    networkTag: inferNetworkTag(
      record.type,
      record.indications_de_localisation,
      record.nom_de_la_commune,
      record.file
    ),
    isOpenNowApprox:
      record.accessible_au_public === "Non"
        ? false
        : parseBooleanish(record.accessible_au_public ?? "Oui"),
    structuralStatus:
      record.accessible_au_public === "Non" ? "out_of_service" : "unknown",
    equipment: {
      isAccessible: parseBooleanish(record.accessibilite_pmr),
      hasBabyChange: parseBooleanish(record.relais_bebe),
      isFree: !String(record.tarif ?? "").toLowerCase().includes("payant")
    }
  };
};

const loadCachedToilets = async () => {
  const rawValue = await AsyncStorage.getItem(STORAGE_KEYS.cachedToilets);
  if (!rawValue) {
    return null;
  }

  const cached = JSON.parse(rawValue) as {
    version?: number;
    timestamp: number;
    toilets: ToiletPoint[];
  };

  if (
    cached.version !== OPEN_DATA_CACHE_VERSION ||
    !Array.isArray(cached.toilets) ||
    cached.toilets.length < MIN_VALID_TOILET_COUNT
  ) {
    return null;
  }

  if (Date.now() - cached.timestamp > APP_CONSTANTS.cacheTtlMs) {
    return null;
  }

  return cached.toilets;
};

const saveCachedToilets = async (toilets: ToiletPoint[]) => {
  await AsyncStorage.setItem(
    STORAGE_KEYS.cachedToilets,
    JSON.stringify({
      version: OPEN_DATA_CACHE_VERSION,
      timestamp: Date.now(),
      toilets
    })
  );
};

const fetchPage = async <T>(baseUrl: string, offset: number) => {
  const url = `${baseUrl}?limit=${API_PAGE_SIZE}&offset=${offset}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}`);
  }

  const payload = (await response.json()) as { results?: T[]; total_count?: number };
  return payload;
};

const fetchRecords = async <T>(baseUrl: string) => {
  const firstPage = await fetchPage<T>(baseUrl, 0);
  const totalCount = firstPage.total_count ?? firstPage.results?.length ?? 0;
  const requests: Promise<{ results?: T[]; total_count?: number }>[] = [];

  for (let offset = API_PAGE_SIZE; offset < totalCount; offset += API_PAGE_SIZE) {
    requests.push(fetchPage<T>(baseUrl, offset));
  }

  const pages = await Promise.all(requests);
  return [firstPage, ...pages].flatMap((page) => page.results ?? []);
};

const seedFallbackToilets: ToiletPoint[] = [
  {
    id: "seed:palais_justice",
    name: "Sanisette JCDecaux",
    address: "23 bd de Sebastopol",
    district: "75001",
    city: "Paris",
    coordinates: { latitude: 48.85988, longitude: 2.348837 },
    source: "paris",
    sourceLabel: "Paris direct",
    sourceId: "23 bd de Sebastopol",
    typeLabel: "Sanisette",
    openingHours: "24/24h",
    isOpenNowApprox: true,
    isTwentyFourSeven: true,
    placeCategory: "street_sanisette",
    networkTag: "other",
    structuralStatus: "available",
    equipment: {
      isAccessible: true,
      hasBabyChange: false,
      isFree: true
    }
  }
];

export const openDataRepository = {
  async getToilets(forceRefresh = false) {
    if (!forceRefresh) {
      const cached = await loadCachedToilets();
      if (cached) {
        return cached;
      }
    }

    try {
      const [parisRecords, ileDeFranceRecords] = await Promise.all([
        fetchRecords<ParisRecord>(OPEN_DATA_ENDPOINTS.paris),
        fetchRecords<IleDeFranceRecord>(OPEN_DATA_ENDPOINTS.ileDeFrance)
      ]);

      const toilets = dedupeToilets(
        [
          ...parisRecords.map(normalizeParisRecord),
          ...ileDeFranceRecords.map(normalizeIleDeFranceRecord)
        ].filter(Boolean) as ToiletPoint[]
      );

      if (toilets.length < MIN_VALID_TOILET_COUNT) {
        throw new Error("Open data payload is unexpectedly small");
      }

      await saveCachedToilets(toilets);
      return toilets;
    } catch {
      const cached = await loadCachedToilets();
      if (cached) {
        return cached;
      }

      return seedFallbackToilets;
    }
  }
};
