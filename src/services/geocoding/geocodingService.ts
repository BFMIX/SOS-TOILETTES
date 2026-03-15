import { GEOCODING_ENDPOINTS } from "@/config/openData";
import { GeocodingSuggestion } from "@/types/models";

const ILE_DE_FRANCE_POSTAL_PREFIXES = ["75", "77", "78", "91", "92", "93", "94", "95"];

const isIleDeFranceResult = (result: { zipcode?: string; city?: string }) => {
  const zipcode = String(result.zipcode ?? "");

  if (ILE_DE_FRANCE_POSTAL_PREFIXES.some((prefix) => zipcode.startsWith(prefix))) {
    return true;
  }

  return result.city?.toLowerCase() === "paris";
};

const mapGeocodingResults = (payload: {
  results?: {
    fulltext?: string;
    city?: string;
    zipcode?: string;
    x?: number;
    y?: number;
  }[];
}) =>
  (payload.results ?? [])
    .filter(isIleDeFranceResult)
    .slice(0, 6)
    .map(
    (result, index): GeocodingSuggestion => ({
      id: `${result.fulltext ?? "suggestion"}-${index}`,
      label: result.fulltext ?? "",
      subtitle: [result.city, result.zipcode].filter(Boolean).join(" • "),
      latitude: Number(result.y ?? 0),
      longitude: Number(result.x ?? 0)
    })
  );

export const autocompleteAddress = async (
  query: string,
  signal?: AbortSignal
) => {
  const url = new URL(GEOCODING_ENDPOINTS.completion);
  url.searchParams.set("text", query);
  url.searchParams.set("type", "StreetAddress");
  url.searchParams.set("maximumResponses", "12");

  const response = await fetch(url.toString(), { signal });
  if (!response.ok) {
    throw new Error("Autocomplete request failed");
  }

  const payload = await response.json();
  return mapGeocodingResults(payload);
};
