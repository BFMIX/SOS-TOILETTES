import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { GestureResponderEvent, Pressable, StyleSheet } from "react-native";

import { triggerHaptic } from "@/services/haptics";
import { useAppTheme } from "@/theme/ThemeProvider";

interface FavoriteButtonProps {
  active: boolean;
  onPress: () => void;
  compact?: boolean;
}

export const FavoriteButton = ({ active, onPress, compact }: FavoriteButtonProps) => {
  const theme = useAppTheme();

  return (
    <Pressable
      onPress={(event: GestureResponderEvent) => {
        event.stopPropagation();
        void triggerHaptic("impactMedium");
        onPress();
      }}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor:
            theme.mode === "dark" ? theme.colors.surfaceAlt : theme.colors.surface,
          opacity: pressed ? 0.85 : 1
        },
        compact ? styles.compact : null
      ]}
    >
      <Ionicons
        color={theme.colors.favorite}
        name={active ? "heart" : "heart-outline"}
        size={compact ? 17 : 22}
      />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    borderRadius: 14,
    height: 40,
    justifyContent: "center",
    width: 40
  },
  compact: {
    borderRadius: 10,
    height: 30,
    width: 30
  }
});
