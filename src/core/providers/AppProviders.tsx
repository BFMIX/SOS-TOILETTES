import {
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
  useFonts
} from "@expo-google-fonts/plus-jakarta-sans";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { NavigationContainer, DarkTheme, DefaultTheme } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import React, { PropsWithChildren, useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { FeedbackProvider } from "@/components/feedback/FeedbackProvider";
import i18n from "@/i18n";
import { usePreferencesStore } from "@/core/store/usePreferencesStore";
import { ThemeProvider, useAppTheme } from "@/theme/ThemeProvider";
import { resolveLanguagePreference } from "@/utils/preferences";

const NavigationThemeBridge = ({ children }: PropsWithChildren) => {
  const theme = useAppTheme();
  const language = usePreferencesStore((state) => state.language);
  const resolvedLanguage = resolveLanguagePreference(language);

  useEffect(() => {
    void i18n.changeLanguage(resolvedLanguage);
  }, [resolvedLanguage]);

  const navigationTheme = theme.mode === "dark" ? DarkTheme : DefaultTheme;

  return (
    <NavigationContainer
      theme={{
        ...navigationTheme,
        colors: {
          ...navigationTheme.colors,
          background: theme.colors.background,
          card: theme.colors.surface,
          text: theme.colors.text,
          border: theme.colors.border,
          primary: theme.colors.primary
        }
      }}
    >
      <StatusBar style={theme.mode === "dark" ? "light" : "dark"} />
      {children}
    </NavigationContainer>
  );
};

export const AppProviders = ({ children }: PropsWithChildren) => {
  const [fontsLoaded] = useFonts({
    PlusJakartaSans_400Regular,
    PlusJakartaSans_500Medium,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <FeedbackProvider>
            <BottomSheetModalProvider>
              <NavigationThemeBridge>{children}</NavigationThemeBridge>
            </BottomSheetModalProvider>
          </FeedbackProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};
