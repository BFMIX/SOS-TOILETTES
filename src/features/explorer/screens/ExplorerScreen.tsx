import BottomSheet from "@gorhom/bottom-sheet";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Keyboard, Linking, Platform, Pressable, StyleSheet, Text, View } from "react-native";
import MapView, {
  MapStyleElement,
  Marker,
  PROVIDER_GOOGLE,
  Region
} from "react-native-maps";
import { useTranslation } from "react-i18next";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { IconButton } from "@/components/common/IconButton";
import { useFeedback } from "@/components/feedback/FeedbackProvider";
import { AppMenuItem, AppMenuOverlay } from "@/components/navigation/AppMenuOverlay";
import { useAppShellStore } from "@/core/store/useAppShellStore";
import { useSessionStore } from "@/core/store/useSessionStore";
import { NearbyToiletsSheet } from "@/features/explorer/components/NearbyToiletsSheet";
import { ToiletMarker } from "@/features/explorer/components/ToiletMarker";
import { useExplorerController } from "@/features/explorer/hooks/useExplorerController";
import { ToiletDetailsBottomSheet } from "@/features/toilet-details/components/ToiletDetailsBottomSheet";
import { useUserLocation } from "@/hooks/useUserLocation";
import { triggerHaptic } from "@/services/haptics";
import { useAppTheme } from "@/theme/ThemeProvider";
import { MainTabParamList, RootStackParamList } from "@/types/navigation";
import { ToiletPoint } from "@/types/models";

type Navigation = BottomTabNavigationProp<MainTabParamList, "Explorer">;

const DARK_MAP_STYLE: MapStyleElement[] = [
  { elementType: "geometry", stylers: [{ color: "#0a1324" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#94a3b8" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#0a1324" }] },
  { featureType: "poi", elementType: "geometry", stylers: [{ color: "#111f35" }] },
  { featureType: "poi.park", elementType: "geometry", stylers: [{ color: "#102b2d" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#18263f" }] },
  { featureType: "road", elementType: "labels.text.fill", stylers: [{ color: "#7d92ad" }] },
  { featureType: "transit", elementType: "geometry", stylers: [{ color: "#162238" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#0b3143" }] }
];

export const ExplorerScreen = () => {
  const theme = useAppTheme();
  const { t } = useTranslation();
  const feedback = useFeedback();
  const isFocused = useIsFocused();
  const navigation = useNavigation<Navigation>();
  const rootNavigation =
    navigation.getParent<NativeStackNavigationProp<RootStackParamList>>();
  const insets = useSafeAreaInsets();
  const mapRef = useRef<MapView | null>(null);
  const sheetRef = useRef<BottomSheet | null>(null);
  const [sheetIndex, setSheetIndex] = useState(0);
  const menuOpen = useAppShellStore((state) => state.menuOpen);
  const openMenu = useAppShellStore((state) => state.openMenu);
  const closeMenu = useAppShellStore((state) => state.closeMenu);
  const pendingToiletId = useAppShellStore((state) => state.pendingToiletId);
  const clearPendingToiletDetails = useAppShellStore(
    (state) => state.clearPendingToiletDetails
  );
  const { region: userRegion, permissionGranted, refreshLocation } = useUserLocation();
  const {
    error,
    isLoading,
    isSearching,
    region,
    searchQuery,
    searchSuggestions,
    toilets,
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
  } = useExplorerController(userRegion);
  const toggleFavorite = useSessionStore((state) => state.toggleFavorite);
  const getCommunityStatus = useSessionStore((state) => state.getCommunityStatus);
  const addReview = useSessionStore((state) => state.addReview);
  const submitReport = useSessionStore((state) => state.submitReport);
  const recordDirections = useSessionStore((state) => state.recordDirections);

  useEffect(() => {
    if (!isFocused) {
      closeMenu();
    }
  }, [closeMenu, isFocused]);

  useEffect(() => {
    if (!pendingToiletId || !toilets.length) {
      return;
    }

    const pendingToilet = toilets.find((item) => item.id === pendingToiletId);
    if (!pendingToilet) {
      return;
    }

    openToilet(pendingToilet);
    clearPendingToiletDetails();
    mapRef.current?.animateToRegion(
      {
        latitude: pendingToilet.coordinates.latitude,
        longitude: pendingToilet.coordinates.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01
      },
      280
    );
    sheetRef.current?.snapToIndex(0);
  }, [clearPendingToiletDetails, openToilet, pendingToiletId, toilets]);

  const handleSuggestionSelect = (suggestion: Parameters<typeof selectSuggestion>[0]) => {
    Keyboard.dismiss();
    void triggerHaptic("selection");
    selectSuggestion(suggestion);
    mapRef.current?.animateToRegion(
      {
        latitude: suggestion.latitude,
        longitude: suggestion.longitude,
        latitudeDelta: 0.028,
        longitudeDelta: 0.028
      },
      350
    );
  };

  const handleRecenter = async () => {
    const nextRegion = await refreshLocation();
    if (nextRegion) {
      setRegion(nextRegion as Region);
      mapRef.current?.animateToRegion(nextRegion as Region, 350);
    }
  };

  const selectedStatus = useMemo(
    () =>
      selectedToilet
        ? getCommunityStatus(
            selectedToilet.id,
            selectedToilet.structuralStatus === "out_of_service"
              ? "out_of_service"
              : "operational"
          )
        : "unknown",
    [getCommunityStatus, selectedToilet]
  );

  const markerSize = useMemo(() => {
    if (region.latitudeDelta < 0.006) {
      return 84;
    }
    if (region.latitudeDelta < 0.01) {
      return 72;
    }
    if (region.latitudeDelta < 0.03) {
      return 62;
    }
    if (region.latitudeDelta < 0.08) {
      return 54;
    }
    return 44;
  }, [region.latitudeDelta]);

  const clusteredMarkers = useMemo(() => {
    const shouldShowIndividuals =
      region.latitudeDelta < 0.008 && visibleToilets.length < 120;

    if (shouldShowIndividuals || visibleToilets.length < 10) {
      return visibleToilets.map((toilet) => ({
        count: 1,
        coordinate: toilet.coordinates,
        toilets: [toilet]
      }));
    }

    const cellLat = region.latitudeDelta / 8;
    const cellLon = region.longitudeDelta / 8;
    const groups = new Map<
      string,
      {
        count: number;
        latitude: number;
        longitude: number;
        toilets: ToiletPoint[];
      }
    >();

    for (const toilet of visibleToilets) {
      const latBucket = Math.floor(toilet.coordinates.latitude / cellLat);
      const lonBucket = Math.floor(toilet.coordinates.longitude / cellLon);
      const key = `${latBucket}:${lonBucket}`;
      const current = groups.get(key);

      if (!current) {
        groups.set(key, {
          count: 1,
          latitude: toilet.coordinates.latitude,
          longitude: toilet.coordinates.longitude,
          toilets: [toilet]
        });
        continue;
      }

      current.count += 1;
      current.latitude += toilet.coordinates.latitude;
      current.longitude += toilet.coordinates.longitude;
      current.toilets.push(toilet);
    }

    return [...groups.values()].map((group) => ({
      count: group.count,
      coordinate: {
        latitude: group.latitude / group.count,
        longitude: group.longitude / group.count
      },
      toilets: group.toilets
    }));
  }, [region.latitudeDelta, region.longitudeDelta, visibleToilets]);

  const openDirectionsTo = async (toilet: ToiletPoint | null) => {
    if (!toilet) {
      return;
    }

    await recordDirections();
    const latitude = toilet.coordinates.latitude;
    const longitude = toilet.coordinates.longitude;
    const url =
      Platform.OS === "ios"
        ? `http://maps.apple.com/?daddr=${latitude},${longitude}`
        : `google.navigation:q=${latitude},${longitude}`;

    if (await Linking.canOpenURL(url)) {
      await Linking.openURL(url);
      return;
    }

    await Linking.openURL(
      `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`
    );
  };

  const handleDirections = async () => openDirectionsTo(selectedToilet);
  const handleOpenToilet = (toilet: ToiletPoint) => {
    void triggerHaptic("impactLight");
    openToilet(toilet);
  };
  const collapseNearbySheet = () => {
    Keyboard.dismiss();
    sheetRef.current?.snapToIndex(0);
  };

  const openFiltersModal = () => {
    collapseNearbySheet();
    rootNavigation?.navigate("FiltersModal");
  };

  const openFavorisSheet = () => {
    collapseNearbySheet();
    rootNavigation?.navigate("FavorisSheet");
  };

  const handleMenuSelect = (item: AppMenuItem) => {
    closeMenu();
    collapseNearbySheet();

    if (item === "Favoris") {
      rootNavigation?.navigate("FavorisSheet");
      return;
    }

    if (item === "Settings" || item === "Credits") {
      rootNavigation?.navigate(item);
      return;
    }

    navigation.navigate(item);
  };

  const handleMapPress = () => {
    Keyboard.dismiss();
    sheetRef.current?.snapToIndex(0);
  };

  return (
    <View style={styles.container}>
      <MapView
        customMapStyle={theme.mode === "dark" ? DARK_MAP_STYLE : undefined}
        onPress={handleMapPress}
        onRegionChangeComplete={setRegion}
        provider={Platform.OS === "android" ? PROVIDER_GOOGLE : undefined}
        ref={mapRef}
        region={region}
        style={StyleSheet.absoluteFillObject}
        toolbarEnabled={false}
        userInterfaceStyle={theme.mode === "dark" ? "dark" : "light"}
      >
        {userRegion ? (
          <Marker
            coordinate={{
              latitude: userRegion.latitude,
              longitude: userRegion.longitude
            }}
            tracksViewChanges={false}
          >
            <View style={styles.userMarkerOuter}>
              <View style={styles.userMarkerInner} />
            </View>
          </Marker>
        ) : null}

        {clusteredMarkers.map((cluster, index) =>
          cluster.count === 1 ? (
            <ToiletMarker
              key={cluster.toilets[0]?.id ?? index}
              latitude={cluster.coordinate.latitude}
              longitude={cluster.coordinate.longitude}
              onPress={() => handleOpenToilet(cluster.toilets[0] as ToiletPoint)}
              selected={selectedToilet?.id === cluster.toilets[0]?.id}
              size={markerSize}
            />
          ) : (
            <Marker
              key={`cluster-${index}`}
              coordinate={cluster.coordinate}
              onPress={() => {
                mapRef.current?.animateToRegion(
                  {
                    latitude: cluster.coordinate.latitude,
                    longitude: cluster.coordinate.longitude,
                    latitudeDelta: Math.max(region.latitudeDelta * 0.45, 0.008),
                    longitudeDelta: Math.max(region.longitudeDelta * 0.45, 0.008)
                  },
                  260
                );
              }}
              tracksViewChanges={false}
            >
              <Pressable
                style={[
                  styles.clusterMarker,
                  {
                    backgroundColor:
                      theme.mode === "dark"
                        ? "rgba(127, 216, 255, 0.22)"
                        : "rgba(19, 91, 236, 0.16)",
                    shadowColor: theme.colors.primary,
                    shadowOpacity: theme.mode === "dark" ? 0.28 : 0.16,
                    shadowRadius: 18,
                    elevation: 6
                  }
                ]}
              >
                <Text
                  style={[
                    styles.clusterLabel,
                    {
                      color: theme.colors.text,
                      fontFamily: theme.typography.family.bold
                    }
                  ]}
                >
                  {cluster.count}
                </Text>
              </Pressable>
            </Marker>
          )
        )}
      </MapView>

      <View style={[styles.menuButtonWrap, { left: 18, top: insets.top + 18 }]}>
        <IconButton icon="menu" onPress={openMenu} size={30} />
      </View>

      <View style={[styles.topActions, { right: 18, top: insets.top + 18 }]}>
        <IconButton
          color={theme.colors.text}
          icon="options-outline"
          onPress={openFiltersModal}
          size={28}
        />
        <IconButton
          color={theme.colors.favorite}
          icon="heart-outline"
          onPress={openFavorisSheet}
          size={28}
        />
      </View>

      {!selectedToilet && sheetIndex === 0 ? (
        <View style={[styles.bottomAction, { bottom: insets.bottom + 196, right: 18 }]}>
          <IconButton
            color={theme.colors.primary}
            icon="locate"
            onPress={handleRecenter}
            size={28}
          />
        </View>
      ) : null}

      <NearbyToiletsSheet
        bottomInset={0}
        emptyBody={
          permissionGranted === false
            ? t("explorer.permissionDenied")
            : t("explorer.emptyNearby")
        }
        error={error}
        isLoading={isLoading}
        isSearching={isSearching}
        items={nearbyToilets}
        onChange={(index) => {
          setSheetIndex(index);
          if (index > 0) {
            Keyboard.dismiss();
          }
        }}
        onRetry={() => void loadToilets(true)}
        onDirections={(item) => {
          void openDirectionsTo(item);
        }}
        onSearchQueryChange={setSearchQuery}
        onSearchSuggestionSelect={handleSuggestionSelect}
        onSelect={handleOpenToilet}
        onToggleFavorite={(item) => {
          void toggleFavorite(item.id);
          feedback.show({
            title: favoriteIds.has(item.id) ? t("toiletDetails.favoriteRemoved") : t("toiletDetails.favoriteAdded"),
            tone: "success"
          });
        }}
        searchQuery={searchQuery}
        searchSuggestions={searchSuggestions}
        sheetRef={sheetRef}
        topInset={insets.top + 86}
      />

      <ToiletDetailsBottomSheet
        favorite={selectedToilet ? favoriteIds.has(selectedToilet.id) : false}
        onClose={closeToilet}
        onDirectionsPress={handleDirections}
        onSubmitReport={async (type) => {
          if (!selectedToilet) {
            return false;
          }
          return submitReport(selectedToilet, type);
        }}
        onSubmitReview={async (comment) => {
          if (!selectedToilet) {
            return false;
          }
          return addReview(selectedToilet, comment);
        }}
        onToggleFavorite={() => {
          if (selectedToilet) {
            void toggleFavorite(selectedToilet.id);
            feedback.show({
              title: favoriteIds.has(selectedToilet.id)
                ? t("toiletDetails.favoriteRemoved")
                : t("toiletDetails.favoriteAdded"),
              tone: "success"
            });
          }
        }}
        status={selectedStatus}
        toilet={selectedToilet}
        visible={Boolean(selectedToilet)}
      />

      <AppMenuOverlay
        activeItem="Explorer"
        onClose={closeMenu}
        onSelect={handleMenuSelect}
        visible={menuOpen}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  menuButtonWrap: {
    position: "absolute",
    zIndex: 6
  },
  topActions: {
    gap: 12,
    position: "absolute",
    zIndex: 6
  },
  bottomAction: {
    position: "absolute",
    zIndex: 6
  },
  clusterMarker: {
    alignItems: "center",
    borderRadius: 22,
    height: 48,
    justifyContent: "center",
    minWidth: 48,
    paddingHorizontal: 12,
    shadowOffset: { width: 0, height: 8 }
  },
  clusterLabel: {
    fontSize: 14
  },
  userMarkerOuter: {
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderColor: "#135bec",
    borderRadius: 16,
    borderWidth: 3,
    height: 24,
    justifyContent: "center",
    width: 24
  },
  userMarkerInner: {
    backgroundColor: "#135bec",
    borderRadius: 7,
    height: 14,
    width: 14
  }
});
