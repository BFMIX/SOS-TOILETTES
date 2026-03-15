import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { HapticPreset, triggerHaptic } from "@/services/haptics";
import { useAppTheme } from "@/theme/ThemeProvider";

interface ChipProps {
  label: string;
  selected?: boolean;
  icon?: React.ReactNode;
  onPress?: () => void;
  compact?: boolean;
  hapticPreset?: HapticPreset;
}

export const Chip = ({
  label,
  selected,
  icon,
  onPress,
  compact,
  hapticPreset = "selection"
}: ChipProps) => {
  const theme = useAppTheme();

  const content = (
    <View
      style={[
        styles.container,
        compact ? styles.compactContainer : null,
        {
          backgroundColor: selected ? theme.colors.primaryMuted : "transparent",
          borderColor: selected ? theme.colors.primary : theme.colors.border
        }
      ]}
    >
      {icon}
      <Text
        style={[
          styles.label,
          compact ? styles.compactLabel : null,
          {
            color: selected ? theme.colors.primary : theme.colors.textSecondary,
            fontFamily: theme.typography.family.bold
          }
        ]}
      >
        {label}
      </Text>
    </View>
  );

  if (!onPress) {
    return content;
  }

  return (
    <Pressable
      onPress={() => {
        void triggerHaptic(hapticPreset);
        onPress();
      }}
    >
      {content}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    borderRadius: 999,
    borderWidth: 1.5,
    flexDirection: "row",
    gap: 7,
    paddingHorizontal: 14,
    paddingVertical: 9
  },
  compactContainer: {
    gap: 6,
    paddingHorizontal: 8,
    paddingVertical: 5
  },
  label: {
    fontSize: 14
  },
  compactLabel: {
    fontSize: 11
  }
});
