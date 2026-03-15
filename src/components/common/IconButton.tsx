import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, StyleSheet, ViewStyle } from "react-native";

import { HapticPreset, triggerHaptic } from "@/services/haptics";
import { useAppTheme } from "@/theme/ThemeProvider";

interface IconButtonProps {
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  size?: number;
  style?: ViewStyle;
  color?: string;
  hapticPreset?: HapticPreset;
}

export const IconButton = ({
  icon,
  onPress,
  size = 22,
  style,
  color,
  hapticPreset = "selection"
}: IconButtonProps) => {
  const theme = useAppTheme();

  return (
    <Pressable
      onPress={() => {
        void triggerHaptic(hapticPreset);
        onPress();
      }}
      style={({ pressed }) => [
        styles.button,
        theme.shadow.card,
        {
          backgroundColor:
            theme.mode === "dark" ? theme.colors.surface : theme.colors.surface,
          borderColor: theme.colors.border,
          borderWidth: 1,
          opacity: pressed ? 0.85 : 1
        },
        style
      ]}
    >
      <Ionicons
        color={color ?? theme.colors.text}
        name={icon}
        size={size}
      />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    borderRadius: 16,
    height: 50,
    justifyContent: "center",
    width: 50
  }
});
