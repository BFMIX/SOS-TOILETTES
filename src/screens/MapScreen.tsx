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
  Keyboard,
} from "react-native";
import MapView from "react-native-map-clustering";
import { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { Ionicons } from "@expo/vector-icons";
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
    (mapRef.current as any)?.animateToRegion(
      {
        latitude: lat,
        longitude: lon,
        latitudeDelta: 0.004,
        longitudeDelta: 0.004,
      },
      1500,
    );
  };

  const handleMarkerPress = (item: any) => {
    // If it's an address from search bar, just pan to it
    if (!item.id && item.latitude && item.longitude) {
      animateTo3D(item.latitude, item.longitude);
      return;
    }
    // Otherwise it's a Toilet pin
    setSelectedToilet(item);
    // Slight offset to center the toilet while showing the sheet
    animateTo3D(item.location.latitude - 0.0005, item.location.longitude);
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
        onLocationSelect={handleMarkerPress}
      />

      <NearbyDropdown
        toilets={displayedToilets}
        isDark={isDark}
        onSelectToilet={handleMarkerPress}
      />

      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={{
          latitude: 48.8566,
          longitude: 2.3522,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        }}
        clusterColor="#1C1C1E"
        clusterTextColor="#FFF"
        onPress={() => Keyboard.dismiss()}
        onPanDrag={() => Keyboard.dismiss()}
      >
        {/* User Location Custom Marker */}
        {userLocation && (
          <Marker
            coordinate={userLocation}
            anchor={{ x: 0.5, y: 0.5 }}
            tracksViewChanges={false}
          >
            <View style={styles.userMarkerContainer}>
              <Ionicons name="person-circle" size={36} color="#007AFF" />
            </View>
          </Marker>
        )}
        {displayedToilets.map((toilet) => (
          <Marker
            key={toilet.id}
            coordinate={toilet.location}
            onPress={() => handleMarkerPress(toilet)}
            tracksViewChanges={true}
            anchor={{ x: 0.5, y: 0.5 }}
          >
            <View style={styles.markerContainer}>
              <Image
                source={require("../../assets/paris_sanisette.png")}
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
  userMarkerContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFF",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
  },
});
