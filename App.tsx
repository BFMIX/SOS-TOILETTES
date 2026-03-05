import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, useColorScheme, Platform } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import MapScreen from "./src/screens/MapScreen";
import { db, loginAnonymously } from "./src/config/firebase";
import { useStore } from "./src/store/useStore";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { View, TouchableOpacity, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import SettingsScreen from "./src/screens/SettingsScreen";
import FavoritesScreen from "./src/screens/FavoritesScreen";

export default function App() {
  const systemColorScheme = useColorScheme();
  const { user, setUser, theme } = useStore();
  const isDark =
    theme === "auto" ? systemColorScheme === "dark" : theme === "dark";
  const [activeTab, setActiveTab] = useState<"map" | "favorites" | "settings">(
    "map",
  );

  // Authentification anonyme au démarrage
  useEffect(() => {
    const initAuth = async () => {
      const fbUser = await loginAnonymously();
      if (fbUser && db) {
        try {
          // Fetch or Create user profile in Firestore
          const userRef = doc(db, "Users", fbUser.uid);
          const userSnap = await getDoc(userRef);

          if (userSnap.exists()) {
            setUser(userSnap.data() as any);
          } else {
            // New User
            const newProfile = {
              uid: fbUser.uid,
              xp: 0,
              level: 1,
              favorites: [],
              reportsMade: 0,
              firstName: "",
            };
            await setDoc(userRef, newProfile);
            setUser(newProfile);
          }
        } catch (error) {
          console.warn("Firestore profile error (check rules):", error);
          // Fallback user state so app doesn't hang
          setUser({
            uid: fbUser.uid,
            xp: 0,
            level: 1,
            favorites: [],
            reportsMade: 0,
          });
        }
      }
    };

    initAuth();
  }, []);

  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaProvider>
        <StatusBar style={isDark ? "light" : "dark"} />

        {activeTab === "map" && <MapScreen />}
        {activeTab === "favorites" && <FavoritesScreen />}
        {activeTab === "settings" && <SettingsScreen />}

        {/* Custom Tab Bar */}
        <View
          style={[
            styles.tabBar,
            {
              backgroundColor: isDark
                ? "rgba(28,28,30,0.95)"
                : "rgba(255,255,255,0.95)",
            },
          ]}
        >
          <TouchableOpacity
            style={styles.tabItem}
            onPress={() => setActiveTab("map")}
          >
            <Ionicons
              name={activeTab === "map" ? "map" : "map-outline"}
              size={24}
              color={activeTab === "map" ? "#13e5ec" : "#8E8E93"}
            />
            <Text
              style={[
                styles.tabText,
                { color: activeTab === "map" ? "#13e5ec" : "#8E8E93" },
              ]}
            >
              Carte
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.tabItem}
            onPress={() => setActiveTab("favorites")}
          >
            <Ionicons
              name={activeTab === "favorites" ? "heart" : "heart-outline"}
              size={24}
              color={activeTab === "favorites" ? "#13e5ec" : "#8E8E93"}
            />
            <Text
              style={[
                styles.tabText,
                { color: activeTab === "favorites" ? "#13e5ec" : "#8E8E93" },
              ]}
            >
              Favoris
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.tabItem}
            onPress={() => setActiveTab("settings")}
          >
            <Ionicons
              name={activeTab === "settings" ? "person" : "person-outline"}
              size={24}
              color={activeTab === "settings" ? "#13e5ec" : "#8E8E93"}
            />
            <Text
              style={[
                styles.tabText,
                { color: activeTab === "settings" ? "#13e5ec" : "#8E8E93" },
              ]}
            >
              Profil
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabBar: {
    flexDirection: "row",
    height: Platform.OS === "ios" ? 85 : 65,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "rgba(0,0,0,0.1)",
    paddingBottom: Platform.OS === "ios" ? 25 : 10,
    paddingTop: 10,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  tabText: {
    fontSize: 10,
    marginTop: 4,
    fontWeight: "600",
  },
});
