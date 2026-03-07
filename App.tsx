import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  useColorScheme,
  Platform,
  View,
  TouchableOpacity,
  Text,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import { db, loginAnonymously } from "./src/config/firebase";
import { useStore } from "./src/store/useStore";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { Theme } from "./src/config/theme";

// Screens
import MapScreen from "./src/screens/MapScreen";
import FavoritesScreen from "./src/screens/FavoritesScreen";
import SettingsScreen from "./src/screens/SettingsScreen";
import OnboardingScreen from "./src/screens/OnboardingScreen";

export default function App() {
  const systemColorScheme = useColorScheme();
  const { user, setUser, theme } = useStore();

  const isDark =
    theme === "auto" ? systemColorScheme === "dark" : theme === "dark";

  // Tabs based on Stitch design: explore | favorites | profile
  const [activeTab, setActiveTab] = useState<
    "explore" | "favorites" | "profile"
  >("explore");

  // Authentification anonyme au démarrage
  useEffect(() => {
    const initAuth = async () => {
      const fbUser = await loginAnonymously();
      if (fbUser && db) {
        try {
          const userRef = doc(db, "users", fbUser.uid);
          const userSnap = await getDoc(userRef);

          if (userSnap.exists()) {
            setUser(userSnap.data() as any);
          } else {
            const newProfile = {
              uid: fbUser.uid,
              xp: 0,
              level: "Vessie Timide",
              favorites: [],
              badges: [],
              reportsMade: 0,
              pseudo: "",
              createdAt: Date.now(),
            };
            try {
              await setDoc(userRef, newProfile);
            } catch (err) {
              console.error("[AUTH INIT] setDoc failed (Rules?): ", err);
            }
            setUser(newProfile as any);
          }
        } catch (error) {
          console.warn("Firestore profile error:", error);
          setUser({
            uid: fbUser.uid,
            xp: 0,
            level: "Vessie Timide",
            favorites: [],
            badges: [],
            reportsMade: 0,
            pseudo: "",
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

        {/* Content Area */}
        {!user?.pseudo ? (
          <OnboardingScreen />
        ) : (
          <>
            {activeTab === "explore" && <MapScreen />}
            {activeTab === "favorites" && <FavoritesScreen />}
            {activeTab === "profile" && <SettingsScreen />}

            {/* Custom Tab Bar - Stitch Translucent Design */}
            <View
              style={[
                styles.tabBar,
                {
                  backgroundColor: isDark
                    ? "rgba(15, 23, 42, 0.85)"
                    : "rgba(255, 255, 255, 0.85)",
                  borderTopColor: isDark
                    ? Theme.colors.borderDark
                    : Theme.colors.borderLight,
                },
              ]}
            >
              {/* Explore Tab */}
              <TouchableOpacity
                style={styles.tabItem}
                onPress={() => setActiveTab("explore")}
              >
                <View
                  style={[
                    styles.iconWrapper,
                    activeTab === "explore" && {
                      backgroundColor: `${Theme.colors.primary}33`,
                    },
                  ]}
                >
                  <Ionicons
                    name={
                      activeTab === "explore" ? "compass" : "compass-outline"
                    }
                    size={24}
                    color={
                      activeTab === "explore"
                        ? isDark
                          ? "#fff"
                          : Theme.colors.textLight
                        : isDark
                          ? Theme.colors.textMutedDark
                          : Theme.colors.textMutedLight
                    }
                    style={
                      activeTab === "explore"
                        ? { color: Theme.colors.primary }
                        : {}
                    }
                  />
                </View>
                <Text
                  style={[
                    styles.tabText,
                    {
                      color:
                        activeTab === "explore"
                          ? isDark
                            ? "#fff"
                            : Theme.colors.textLight
                          : isDark
                            ? Theme.colors.textMutedDark
                            : Theme.colors.textMutedLight,
                    },
                  ]}
                >
                  Explore
                </Text>
              </TouchableOpacity>

              {/* Favorites Tab */}
              <TouchableOpacity
                style={styles.tabItem}
                onPress={() => setActiveTab("favorites")}
              >
                <View
                  style={[
                    styles.iconWrapper,
                    activeTab === "favorites" && {
                      backgroundColor: `${Theme.colors.primary}33`,
                    },
                  ]}
                >
                  <Ionicons
                    name={activeTab === "favorites" ? "heart" : "heart-outline"}
                    size={24}
                    color={
                      activeTab === "favorites"
                        ? Theme.colors.primary
                        : isDark
                          ? Theme.colors.textMutedDark
                          : Theme.colors.textMutedLight
                    }
                  />
                </View>
                <Text
                  style={[
                    styles.tabText,
                    {
                      color:
                        activeTab === "favorites"
                          ? isDark
                            ? "#fff"
                            : Theme.colors.textLight
                          : isDark
                            ? Theme.colors.textMutedDark
                            : Theme.colors.textMutedLight,
                    },
                  ]}
                >
                  Favorites
                </Text>
              </TouchableOpacity>

              {/* Profile Tab */}
              <TouchableOpacity
                style={styles.tabItem}
                onPress={() => setActiveTab("profile")}
              >
                <View
                  style={[
                    styles.iconWrapper,
                    activeTab === "profile" && {
                      backgroundColor: `${Theme.colors.primary}33`,
                    },
                  ]}
                >
                  <Ionicons
                    name={activeTab === "profile" ? "person" : "person-outline"}
                    size={24}
                    color={
                      activeTab === "profile"
                        ? Theme.colors.primary
                        : isDark
                          ? Theme.colors.textMutedDark
                          : Theme.colors.textMutedLight
                    }
                  />
                </View>
                <Text
                  style={[
                    styles.tabText,
                    {
                      color:
                        activeTab === "profile"
                          ? isDark
                            ? "#fff"
                            : Theme.colors.textLight
                          : isDark
                            ? Theme.colors.textMutedDark
                            : Theme.colors.textMutedLight,
                    },
                  ]}
                >
                  Profile
                </Text>
              </TouchableOpacity>
            </View>
          </>
        )}
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
    height: Platform.OS === "ios" ? 75 : 65,
    borderRadius: 30, // fully rounded
    marginHorizontal: 20,
    position: "absolute",
    bottom: Platform.OS === "ios" ? 30 : 20,
    left: 0,
    right: 0,
    paddingBottom: 0,
    paddingTop: 0,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  iconWrapper: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: Theme.borderRadius.full,
  },
  tabText: {
    fontFamily: Theme.typography.fontFamily,
    fontSize: 10,
    fontWeight: "600",
  },
});
