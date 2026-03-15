import React, { PropsWithChildren, createContext, useContext, useMemo } from "react";
import { useColorScheme } from "react-native";

import { usePreferencesStore } from "@/core/store/usePreferencesStore";
import { AppTheme, createTheme } from "@/theme/theme";
import { resolveThemePreference } from "@/utils/preferences";

const ThemeContext = createContext<AppTheme | null>(null);

export const ThemeProvider = ({ children }: PropsWithChildren) => {
  const systemColorScheme = useColorScheme();
  const themeMode = usePreferencesStore((state) => state.themeMode);
  const resolvedMode = resolveThemePreference(themeMode, systemColorScheme);

  const theme = useMemo(() => createTheme(resolvedMode), [resolvedMode]);

  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
};

export const useAppTheme = () => {
  const theme = useContext(ThemeContext);

  if (!theme) {
    throw new Error("useAppTheme must be used within ThemeProvider");
  }

  return theme;
};
