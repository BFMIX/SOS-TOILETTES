import React, { useState, useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  useColorScheme,
  ActivityIndicator,
  Image,
  Dimensions,
  TouchableOpacity,
  Text,
  Platform,
} from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import Modal from "react-native-modal";
import CustomMapStyleDark from "../config/mapStyleDark.json";
import CustomMapStyleLight from "../config/mapStyleLight.json";
import { Toilet } from "../models/types";
import ToiletDetailsSheet from "../components/Shared/ToiletDetailsSheet";
import FloatingActionButtons from "../components/Map/FloatingActionButtons";
import SearchBar from "../components/Map/SearchBar";
import NearbyDropdown from "../components/Map/NearbyDropdown";
import { useStore } from "../store/useStore";

export default function MapScreen() {
  const theme = useStore((state) => state.theme);
  const systemColorScheme = useColorScheme();
  const isDark =
    theme === "auto" ? systemColorScheme === "dark" : theme === "dark";
  const mapRef = useRef<MapView>(null);

  const {
    user,
    userLocation,
    toilets,
    isLoading,
    fetchUserLocation,
    loadToilets,
    searchRadius,
    showGlobal,
  } = useStore();
  const [selectedToilet, setSelectedToilet] = useState<Toilet | null>(null);
  const [showAll, setShowAll] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [currentZoomDelta, setCurrentZoomDelta] = useState<number>(0);

  // Initialization
  useEffect(() => {
    console.log("📍 Initializing Location...");
    fetchUserLocation();
  }, []);

  const [hasLocatedOnce, setHasLocatedOnce] = useState(false);

  // Reload toilets when location, radius or global mode changes
  useEffect(() => {
    if (userLocation) {
      loadToilets();
      if (!hasLocatedOnce) {
        locateUser();
        setHasLocatedOnce(true);
      }
    }
  }, [userLocation, user?.uid, searchRadius, showGlobal]);

  const animateTo3D = (lat: number, lon: number) => {
    mapRef.current?.animateCamera(
      {
        center: { latitude: lat, longitude: lon },
        pitch: 60, // Better 3D angle
        heading: 0,
        altitude: 800, // Balanced altitude for detail
        zoom: 17.5,
      },
      { duration: 1500 },
    );
  };

  const handleMarkerPress = (toilet: Toilet) => {
    setSelectedToilet(toilet);
    // Slight offset to center the toilet while showing the sheet
    animateTo3D(toilet.location.latitude - 0.0005, toilet.location.longitude);
  };

  const locateUser = () => {
    if (userLocation) {
      animateTo3D(userLocation.latitude, userLocation.longitude);
    }
  };

  // Filtrer les toilettes affichées
  const displayedToilets = toilets.filter((t) => {
    // Basic show/hide closed
    if (!showAll && t.status !== "open") return false;

    // Search Query Filter
    if (
      searchQuery &&
      !t.address.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }

    // Quick Filters
    if (activeFilters.includes("pmr") && !t.isPMR) return false;
    if (activeFilters.includes("free") && t.isPaid) return false;
    if (activeFilters.includes("open") && t.status !== "open") return false;
    if (activeFilters.includes("baby") && !t.hasBabyRelay) return false;

    return true;
  });

  const isZoomedOut = currentZoomDelta > 0.04;

  const getMarkerColor = (t: Toilet) => {
    // 2 negative reports in 48h drops it to out of order
    const isCommunityClosed =
      t.communityStatus === "hors_service" || t.negativeReportsCount >= 2;
    if (
      isCommunityClosed ||
      t.status === "out_of_order" ||
      t.status === "closed"
    )
      return "#FF3B30"; // Red
    if (t.source === "ratp") return "#AF52DE"; // Purple
    if (t.isPaid) return "#FF9500"; // Orange
    return "#34C759"; // Green
  };

  return (
    <View style={styles.container}>
      <SearchBar
        isDark={isDark}
        onSearch={setSearchQuery}
        onFilterChange={setActiveFilters}
      />

      <NearbyDropdown
        toilets={displayedToilets}
        isDark={isDark}
        onSelectToilet={handleMarkerPress}
      />

      {isZoomedOut && (
        <View style={styles.zoomWarning}>
          <Text style={styles.zoomWarningText}>
            Zommez pour voir les sanisettes
          </Text>
        </View>
      )}

      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialCamera={{
          center: { latitude: 48.8566, longitude: 2.3522 },
          pitch: 45,
          heading: 0,
          altitude: 10000,
          zoom: 13,
        }}
        onRegionChangeComplete={(region) => {
          setCurrentZoomDelta(region.latitudeDelta);
        }}
        customMapStyle={isDark ? CustomMapStyleDark : CustomMapStyleLight}
        showsUserLocation
        showsMyLocationButton={false}
        showsCompass={false}
      >
        {!isZoomedOut &&
          displayedToilets.map((toilet) => (
            <Marker
              key={toilet.id}
              coordinate={toilet.location}
              onPress={() => handleMarkerPress(toilet)}
              tracksViewChanges={true}
              anchor={{ x: 0.5, y: 0.5 }}
            >
              <View style={styles.markerContainer}>
                <Image
                  source={require("../../assets/Toilette_generic.png")}
                  style={styles.markerImage}
                  resizeMode="contain"
                />
                <View
                  style={[
                    styles.halo,
                    { backgroundColor: getMarkerColor(toilet) },
                  ]}
                />
              </View>
            </Marker>
          ))}
      </MapView>

      <FloatingActionButtons
        showAll={showAll}
        onToggleShowAll={() => setShowAll(!showAll)}
        onLocateUser={locateUser}
      />

      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      )}

      <Modal
        isVisible={!!selectedToilet}
        onBackdropPress={() => setSelectedToilet(null)}
        onSwipeComplete={() => setSelectedToilet(null)}
        swipeDirection="down"
        style={styles.modal}
        propagateSwipe={true}
      >
        <View
          style={[
            styles.sheetContainer,
            { backgroundColor: isDark ? "#0f172a" : "#FFFFFF" },
          ]}
        >
          <View style={styles.dragIndicator} />
          {selectedToilet && <ToiletDetailsSheet toilet={selectedToilet} />}
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  map: { width: "100%", height: "100%" },
  zoomWarning: {
    position: "absolute",
    top: Platform.OS === "ios" ? 140 : 120, // below search bar
    alignSelf: "center",
    backgroundColor: "rgba(15, 23, 42, 0.9)",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 9999,
    zIndex: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  zoomWarningText: {
    color: "#fff",
    fontFamily: "Plus Jakarta Sans",
    fontWeight: "600",
    fontSize: 13,
  },
  loadingContainer: {
    position: "absolute",
    top: Platform.OS === "ios" ? 120 : 100,
    alignSelf: "center",
    backgroundColor: "rgba(255,255,255,0.9)",
    padding: 10,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  markerContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: 50,
    height: 50,
  },
  markerImage: {
    width: 50,
    height: 50,
  },
  halo: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: "#FFF",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  modal: {
    justifyContent: "flex-end",
    margin: 0,
  },
  sheetContainer: {
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingTop: 10,
    paddingBottom: Platform.OS === "ios" ? 40 : 20,
    minHeight: Dimensions.get("window").height * 0.4,
  },
  dragIndicator: {
    width: 48,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#cbd5e1", // slate-300
    alignSelf: "center",
    marginBottom: 10,
    marginTop: 4,
  },
});
