import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
  ViewStyle
} from "react-native";

import { HapticPreset, triggerHaptic } from "@/services/haptics";
import { useAppTheme } from "@/theme/ThemeProvider";

interface PrimaryButtonProps {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: "primary" | "secondary";
  style?: ViewStyle;
  icon?: keyof typeof Ionicons.glyphMap;
  hapticPreset?: HapticPreset;
}

export const PrimaryButton = ({
  label,
  onPress,
  disabled,
  loading,
  variant = "primary",
  style,
  icon,
  hapticPreset = "selection"
}: PrimaryButtonProps) => {
  const theme = useAppTheme();
  const isPrimary = variant === "primary";

  return (
    <Pressable
      disabled={disabled || loading}
      onPress={() => {
        void triggerHaptic(hapticPreset);
        onPress();
      }}
      style={({ pressed }) => [
        styles.button,
        theme.shadow.soft,
        {
          backgroundColor: isPrimary
            ? theme.colors.primary
            : theme.mode === "dark"
              ? theme.colors.surfaceAlt
              : theme.colors.surface,
          borderColor: isPrimary ? "transparent" : theme.colors.border,
          opacity: pressed || disabled ? 0.9 : 1
        },
        style
      ]}
    >
      {loading ? (
        <ActivityIndicator color="#ffffff" />
      ) : (
        <View style={styles.content}>
          {icon ? (
            <Ionicons
              color={isPrimary ? "#ffffff" : theme.colors.text}
              name={icon}
              size={18}
            />
          ) : null}
          <Text
            style={[
              styles.label,
              {
                color: isPrimary ? "#ffffff" : theme.colors.text,
                fontFamily: theme.typography.family.bold
              }
            ]}
          >
            {label}
          </Text>
        </View>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    borderRadius: 18,
    borderWidth: 1,
    justifyContent: "center",
    minHeight: 52,
    paddingHorizontal: 18
  },
  content: {
    alignItems: "center",
    flexDirection: "row",
    gap: 8
  },
  label: {
    fontSize: 16
  }
});
