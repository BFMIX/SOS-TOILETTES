import React from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

import { useAppTheme } from "@/theme/ThemeProvider";

interface LoadingOverlayProps {
  fullscreen?: boolean;
}

export const LoadingOverlay = ({ fullscreen = false }: LoadingOverlayProps) => {
  const theme = useAppTheme();

  return (
    <View
      style={[
        styles.container,
        fullscreen && styles.fullscreen,
        { backgroundColor: fullscreen ? theme.colors.background : "transparent" }
      ]}
    >
      <ActivityIndicator color={theme.colors.primary} size="large" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center"
  },
  fullscreen: {
    flex: 1
  }
});
