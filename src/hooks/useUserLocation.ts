import { useCallback, useEffect, useState } from "react";

import * as Location from "expo-location";

type LocationRegion = {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
};

export const useUserLocation = () => {
  const [region, setRegion] = useState<LocationRegion | null>(null);
  const [permissionGranted, setPermissionGranted] = useState<boolean | null>(
    null
  );

  const refreshLocation = useCallback(async () => {
    const permission = await Location.requestForegroundPermissionsAsync();
    const granted = permission.status === "granted";
    setPermissionGranted(granted);

    if (!granted) {
      return null;
    }

    const position = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced
    });
    const nextRegion = {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      latitudeDelta: 0.045,
      longitudeDelta: 0.045
    };
    setRegion(nextRegion);
    return nextRegion;
  }, []);

  useEffect(() => {
    void refreshLocation();
  }, [refreshLocation]);

  return {
    region,
    permissionGranted,
    refreshLocation
  };
};
