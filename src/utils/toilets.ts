import { APP_CONSTANTS } from "@/config/app";
import { ToiletFilters, ToiletPoint, ToiletSource } from "@/types/models";
import { haversineDistanceMeters } from "@/utils/distance";

const normalizeText = (value: string | null | undefined) =>
  (value ?? "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/\s+/g, " ");

export const buildToiletId = (
  source: ToiletSource,
  sourceId: string,
  latitude: number,
  longitude: number
) => `${source}:${sourceId}:${latitude.toFixed(5)}:${longitude.toFixed(5)}`;

export const parseBooleanish = (value: unknown) => {
  const normalized = normalizeText(String(value ?? ""));
  return normalized === "oui" || normalized === "yes" || normalized === "true";
};

export const parseParisOpenStatus = (
  structuralStatus: string | null | undefined,
  hours: string | null | undefined
) => {
  const normalizedStatus = normalizeText(structuralStatus);

  if (normalizedStatus.includes("hors service")) {
    return false;
  }

  if (!hours) {
    return true;
  }

  if (normalizeText(hours).includes("24/24")) {
    return true;
  }

  const match = hours.match(/(\d{2})h(\d{2})\s*-\s*(\d{2})h(\d{2})/);
  if (!match) {
    return true;
  }

  const fromHour = match[1];
  const fromMinute = match[2];
  const toHour = match[3];
  const toMinute = match[4];
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const from = Number(fromHour) * 60 + Number(fromMinute);
  const to = Number(toHour) * 60 + Number(toMinute);

  return currentMinutes >= from && currentMinutes <= to;
};

export const parseTwentyFourSeven = (hours: string | null | undefined) =>
  normalizeText(hours).includes("24/24") || normalizeText(hours).includes("24/7");

export const dedupeToilets = (items: ToiletPoint[]) => {
  const deduped: ToiletPoint[] = [];

  for (const candidate of items) {
    const existingIndex = deduped.findIndex((current) => {
      const addressMatch =
        normalizeText(current.address) === normalizeText(candidate.address) &&
        normalizeText(current.city) === normalizeText(candidate.city);
      const distance = haversineDistanceMeters(
        current.coordinates.latitude,
        current.coordinates.longitude,
        candidate.coordinates.latitude,
        candidate.coordinates.longitude
      );

      return addressMatch || distance < 35;
    });

    if (existingIndex === -1) {
      deduped.push(candidate);
      continue;
    }

    const current = deduped[existingIndex];
    const preferred = current.source === "paris" ? current : candidate;
    const other = preferred === current ? candidate : current;

    deduped[existingIndex] = {
      ...preferred,
      equipment: {
        isAccessible:
          preferred.equipment.isAccessible || other.equipment.isAccessible,
        hasBabyChange:
          preferred.equipment.hasBabyChange || other.equipment.hasBabyChange,
        isFree: preferred.equipment.isFree || other.equipment.isFree
      },
      openingHours: preferred.openingHours ?? other.openingHours,
      isOpenNowApprox: preferred.isOpenNowApprox ?? other.isOpenNowApprox,
      isTwentyFourSeven: preferred.isTwentyFourSeven || other.isTwentyFourSeven
    };
  }

  return deduped;
};

export const applyToiletFilters = (
  toilets: ToiletPoint[],
  filters: ToiletFilters
) =>
  toilets.filter((toilet) => {
    if (filters.openOnly && toilet.isOpenNowApprox === false) {
      return false;
    }

    if (filters.freeOnly && !toilet.equipment.isFree) {
      return false;
    }

    if (filters.accessibleOnly && !toilet.equipment.isAccessible) {
      return false;
    }

    if (filters.babyChangeOnly && !toilet.equipment.hasBabyChange) {
      return false;
    }

    if (filters.open24hOnly && !toilet.isTwentyFourSeven) {
      return false;
    }

    if (filters.parisOnly && toilet.city !== "Paris") {
      return false;
    }

    if (filters.indoorOnly && toilet.placeCategory !== "indoor_public_building") {
      return false;
    }

    if (filters.sanisetteOnly && toilet.placeCategory !== "street_sanisette") {
      return false;
    }

    return true;
  });

export const isToiletVisibleInRegion = (
  toilet: ToiletPoint,
  region: {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  }
) => {
  const latitudeBoundary = region.latitudeDelta / 2;
  const longitudeBoundary = region.longitudeDelta / 2;

  return (
    toilet.coordinates.latitude >= region.latitude - latitudeBoundary &&
    toilet.coordinates.latitude <= region.latitude + latitudeBoundary &&
    toilet.coordinates.longitude >= region.longitude - longitudeBoundary &&
    toilet.coordinates.longitude <= region.longitude + longitudeBoundary
  );
};

export const buildReportBucket = (date = new Date()) => {
  const bucket = new Date(date);
  bucket.setMinutes(0, 0, 0);
  bucket.setHours(
    Math.floor(bucket.getHours() / APP_CONSTANTS.reportCooldownHours) *
      APP_CONSTANTS.reportCooldownHours
  );
  return bucket.toISOString();
};
