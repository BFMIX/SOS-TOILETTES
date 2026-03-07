import { create } from "zustand";
import { Toilet, UserProfile, Location } from "../models/types";
import { fetchAllToilets } from "../api/toilets";
import * as ExpoLocation from "expo-location";
import { db } from "../config/firebase";

interface AppState {
  user: UserProfile | null;
  userLocation: Location | null;
  toilets: Toilet[];
  isLoading: boolean;
  error: string | null;
  theme: "light" | "dark" | "auto";
  searchRadius: number; // in meters
  showGlobal: boolean;
  setTheme: (theme: "light" | "dark" | "auto") => void;
  setSearchRadius: (radius: number) => void;
  setShowGlobal: (show: boolean) => void;
  setUser: (user: UserProfile | null) => void;
  updateProfile: (profile: Partial<UserProfile>) => void;
  toggleFavorite: (toiletId: string) => Promise<void>;
  fetchUserLocation: () => Promise<void>;
  loadToilets: (radius?: number) => Promise<void>;
}

export const useStore = create<AppState>((set, get) => ({
  user: null,
  userLocation: null,
  toilets: [],
  isLoading: false,
  error: null,
  theme: "auto",
  searchRadius: 30000,
  showGlobal: true,

  setTheme: (theme) => set({ theme }),
  setSearchRadius: (searchRadius) => set({ searchRadius }),
  setShowGlobal: (showGlobal) => set({ showGlobal }),
  setUser: (user) => set({ user }),
  updateProfile: (profile) =>
    set((state) => {
      const newUser = state.user ? { ...state.user, ...profile } : null;
      if (newUser && profile.xp !== undefined) {
        // Gamification logic
        if (newUser.xp < 20) newUser.level = "Vessie Timide";
        else if (newUser.xp < 50) newUser.level = "Explorateur";
        else if (newUser.xp < 100) newUser.level = "Le Toiletteur";
        else newUser.level = "Expert Sanisette";
      }
      return { user: newUser };
    }),

  toggleFavorite: async (toiletId: string) => {
    const { user } = get();
    if (!user || user.uid === "mock_user_123") {
      // Local preview mode for mock users
      const currentFavs = user?.favorites || [];
      const newFavs = currentFavs.includes(toiletId)
        ? currentFavs.filter((id) => id !== toiletId)
        : [...currentFavs, toiletId];
      set((state) => ({
        user: state.user ? { ...state.user, favorites: newFavs } : null,
      }));
      return;
    }

    if (!db) return;

    const favorites = [...(user.favorites || [])];
    const index = favorites.indexOf(toiletId);

    if (index > -1) {
      favorites.splice(index, 1);
    } else {
      favorites.push(toiletId);
    }

    try {
      const { doc, setDoc, arrayUnion } = await import("firebase/firestore");
      const userRef = doc(db, "users", user.uid);

      const updates: any = { favorites };
      const currentBadges = user.badges || [];

      if (favorites.length >= 3 && !currentBadges.includes("Le Toiletteur")) {
        updates.badges = arrayUnion("Le Toiletteur");
        currentBadges.push("Le Toiletteur");
      }

      await setDoc(userRef, updates, { merge: true });
      set((state) => ({
        user: state.user
          ? { ...state.user, favorites, badges: currentBadges }
          : null,
      }));
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  },

  fetchUserLocation: async () => {
    try {
      let { status } = await ExpoLocation.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        set({ error: "Permission to access location was denied" });
        // Fallback: Paris Center
        set({ userLocation: { latitude: 48.8566, longitude: 2.3522 } });
        return;
      }

      let location = await ExpoLocation.getCurrentPositionAsync({});
      set({
        userLocation: {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        },
      });
    } catch (err) {
      set({
        error: "Error getting location",
        userLocation: { latitude: 48.8566, longitude: 2.3522 },
      });
    }
  },

  loadToilets: async (radius?: number) => {
    set({ isLoading: true, error: null });
    try {
      const state = get();
      const loc = state.userLocation || {
        latitude: 48.8566,
        longitude: 2.3522,
      };

      const r = radius !== undefined ? radius : state.searchRadius;

      const data = await fetchAllToilets(loc, r, state.showGlobal);
      set({ toilets: data, isLoading: false });
    } catch (error) {
      set({ error: "Failed to fetch toilets", isLoading: false });
    }
  },
}));
