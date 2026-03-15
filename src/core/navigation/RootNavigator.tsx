import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { StyleSheet, View } from "react-native";

import { LoadingOverlay } from "@/components/common/LoadingOverlay";
import { MainTabs } from "@/core/navigation/MainTabs";
import { useSessionStore } from "@/core/store/useSessionStore";
import { FilterModalScreen } from "@/features/filters/screens/FilterModalScreen";
import { OnboardingScreen } from "@/features/onboarding/screens/OnboardingScreen";
import { FavorisSheetScreen } from "@/features/favoris/screens/FavorisSheetScreen";
import { CreditsScreen } from "@/features/settings/screens/CreditsScreen";
import { SettingsScreen } from "@/features/settings/screens/SettingsScreen";
import { useAppTheme } from "@/theme/ThemeProvider";
import { RootStackParamList } from "@/types/navigation";

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator = () => {
  const theme = useAppTheme();
  const status = useSessionStore((state) => state.status);
  const profile = useSessionStore((state) => state.profile);
  const needsOnboarding = !profile?.pseudo?.trim();

  if (status === "loading" || status === "idle") {
    return <LoadingOverlay fullscreen />;
  }

  return (
    <View style={styles.container}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: "slide_from_right",
          contentStyle: { backgroundColor: theme.colors.background }
        }}
      >
        <>
          <Stack.Screen name="MainTabs" component={MainTabs} />
          <Stack.Screen
            name="FiltersModal"
            component={FilterModalScreen}
            options={{ presentation: "modal" }}
          />
          <Stack.Screen
            name="FavorisSheet"
            component={FavorisSheetScreen}
            options={{
              animation: "fade",
              contentStyle: { backgroundColor: "transparent" },
              presentation: "transparentModal"
            }}
          />
          <Stack.Screen name="Settings" component={SettingsScreen} />
          <Stack.Screen name="Credits" component={CreditsScreen} />
        </>
      </Stack.Navigator>

      {needsOnboarding ? <OnboardingScreen /> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
