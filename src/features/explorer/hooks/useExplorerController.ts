import {
  startTransition,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";
import { Keyboard } from "react-native";
import { Region } from "react-native-maps";

import { APP_CONSTANTS } from "@/config/app";
import { useFilterStore } from "@/features/filters/store/useFilterStore";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { useSessionStore } from "@/core/store/useSessionStore";
import { openDataRepository } from "@/repositories/toilets/openDataRepository";
import { autocompleteAddress } from "@/services/geocoding/geocodingService";
import { GeocodingSuggestion, NearbyToiletCard, ToiletPoint } from "@/types/models";
import { estimateWalkingMinutes, haversineDistanceMeters } from "@/utils/distance";
import {
  applyToiletFilters,
  isToiletVisibleInRegion
} from "@/utils/toilets";

export const useExplorerController = (userRegion: Region | null) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchSuggestions, setSearchSuggestions] = useState<GeocodingSuggestion[]>([]);
  const [selectedToilet, setSelectedToilet] = useState<ToiletPoint | null>(null);
  const [region, setRegion] = useState<Region>(APP_CONSTANTS.parisCenter);
  const [toilets, setToilets] = useState<ToiletPoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const filters = useFilterStore();
  const debouncedQuery = useDebouncedValue(searchQuery.trim(), 280);
  const skipNextAutocomplete = useRef(false);
  const profile = useSessionStore((state) => state.profile);
  const getCommunityStatus = useSessionStore((state) => state.getCommunityStatus);

  const favoriteIds = useMemo(
    () => new Set(profile?.favorites ?? []),
    [profile?.favorites]
  );

  const loadToilets = useCallback(async (forceRefresh = false) => {
    setIsLoading(true);
    setError(null);

    try {
      const items = await openDataRepository.getToilets(forceRefresh);
      setToilets(items);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Unknown error");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadToilets();
  }, [loadToilets]);

  useEffect(() => {
    if (!debouncedQuery || debouncedQuery.length < 3) {
      setSearchSuggestions([]);
      return;
    }

    if (skipNextAutocomplete.current) {
      skipNextAutocomplete.current = false;
      setSearchSuggestions([]);
      setIsSearching(false);
      return;
    }

    const controller = new AbortController();
    setIsSearching(true);

    void autocompleteAddress(debouncedQuery, controller.signal)
      .then((results) => {
        startTransition(() => setSearchSuggestions(results));
      })
      .catch((error) => {
        if (error instanceof Error && error.name === "AbortError") {
          return;
        }
        setSearchSuggestions([]);
      })
      .finally(() => setIsSearching(false));

    return () => controller.abort();
  }, [debouncedQuery]);

  useEffect(() => {
    if (userRegion) {
      setRegion((current) => ({
        ...current,
        latitude: userRegion.latitude,
        longitude: userRegion.longitude
      }));
    }
  }, [userRegion]);

  const filteredToilets = useMemo(
    () => applyToiletFilters(toilets, filters),
    [filters, toilets]
  );

  const visibleToilets = useMemo(
    () => filteredToilets.filter((toilet) => isToiletVisibleInRegion(toilet, region)),
    [filteredToilets, region]
  );

  const nearbyToilets = useMemo<NearbyToiletCard[]>(() => {
    const baseLatitude = userRegion?.latitude ?? region.latitude;
    const baseLongitude = userRegion?.longitude ?? region.longitude;
    const source = visibleToilets.length ? visibleToilets : filteredToilets;

    return source
      .map((toilet) => {
        const distanceMeters = haversineDistanceMeters(
          baseLatitude,
          baseLongitude,
          toilet.coordinates.latitude,
          toilet.coordinates.longitude
        );
        return {
          ...toilet,
          distanceMeters,
          walkingMinutes: estimateWalkingMinutes(distanceMeters),
          communityStatus: getCommunityStatus(
            toilet.id,
            toilet.structuralStatus === "out_of_service"
              ? "out_of_service"
              : "operational"
          ),
          favorite: favoriteIds.has(toilet.id)
        };
      })
      .sort((a, b) => a.distanceMeters - b.distanceMeters)
      .slice(0, 10);
  }, [favoriteIds, filteredToilets, getCommunityStatus, region, userRegion, visibleToilets]);

  const selectSuggestion = useCallback((suggestion: GeocodingSuggestion) => {
    Keyboard.dismiss();
    skipNextAutocomplete.current = true;
    setSearchQuery(suggestion.label);
    setSearchSuggestions([]);
    setRegion({
      latitude: suggestion.latitude,
      longitude: suggestion.longitude,
      latitudeDelta: 0.028,
      longitudeDelta: 0.028
    });
  }, []);

  const openToilet = useCallback((toilet: ToiletPoint) => {
    Keyboard.dismiss();
    setSelectedToilet(toilet);
  }, []);

  const closeToilet = useCallback(() => setSelectedToilet(null), []);

  return {
    error,
    isLoading,
    isSearching,
    region,
    searchQuery,
    searchSuggestions,
    toilets,
    filteredToilets,
    visibleToilets,
    nearbyToilets,
    favoriteIds,
    selectedToilet,
    setRegion,
    setSearchQuery,
    selectSuggestion,
    openToilet,
    closeToilet,
    loadToilets
  };
};
