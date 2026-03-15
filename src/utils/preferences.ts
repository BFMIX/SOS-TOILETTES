import { getLocales } from "expo-localization";

import { AppLanguage, AppLanguagePreference, AppThemeMode } from "@/types/models";

export const getSystemLanguage = (): AppLanguage => {
  const locale = getLocales()[0]?.languageCode?.toLowerCase();
  if (locale === "en") {
    return "en";
  }
  if (locale === "es") {
    return "es";
  }
  return "fr";
};

export const resolveLanguagePreference = (
  language: AppLanguagePreference
): AppLanguage => (language === "system" ? getSystemLanguage() : language);

export const resolveThemePreference = (
  themeMode: AppThemeMode,
  systemColorScheme: "light" | "dark" | null | undefined
) => {
  if (themeMode === "system") {
    return systemColorScheme === "light" ? "light" : "dark";
  }

  return themeMode;
};
