import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { STORAGE_KEYS } from "@/config/app";
import { AppLanguage, AppLanguagePreference, AppThemeMode } from "@/types/models";

interface PreferencesState {
  themeMode: AppThemeMode;
  language: AppLanguagePreference;
  setThemeMode: (themeMode: AppThemeMode) => void;
  setLanguage: (language: AppLanguagePreference) => void;
  toggleLanguage: (fallbackLanguage: AppLanguage) => void;
}

const languageCycle: AppLanguage[] = ["fr", "en", "es"];

export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set) => ({
      themeMode: "dark",
      language: "system",
      setThemeMode: (themeMode) => set({ themeMode }),
      setLanguage: (language) => set({ language }),
      toggleLanguage: (fallbackLanguage) =>
        set((state) => {
          const currentLanguage =
            state.language === "system" ? fallbackLanguage : state.language;
          const currentIndex = languageCycle.indexOf(currentLanguage);
          const nextLanguage =
            languageCycle[(currentIndex + 1) % languageCycle.length] ?? "fr";

          return { language: nextLanguage };
        })
    }),
    {
      name: STORAGE_KEYS.preferences,
      storage: createJSONStorage(() => AsyncStorage)
    }
  )
);
