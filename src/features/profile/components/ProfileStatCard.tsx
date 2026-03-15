import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { useAppTheme } from "@/theme/ThemeProvider";

interface ProfileStatCardProps {
  value: string;
  label: string;
  accent: string;
}

export const ProfileStatCard = ({
  value,
  label,
  accent
}: ProfileStatCardProps) => {
  const theme = useAppTheme();

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border
        }
      ]}
    >
      <View style={[styles.dot, { backgroundColor: accent }]} />
      <Text
        style={[
          styles.value,
          { color: theme.colors.text, fontFamily: theme.typography.family.bold }
        ]}
      >
        {value}
      </Text>
      <Text
        style={[
          styles.label,
          {
            color: theme.colors.textSecondary,
            fontFamily: theme.typography.family.medium
          }
        ]}
      >
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 24,
    borderWidth: 1,
    flex: 1,
    minHeight: 110,
    padding: 18
  },
  dot: {
    borderRadius: 6,
    height: 12,
    marginBottom: 14,
    width: 12
  },
  value: {
    fontSize: 26,
    marginBottom: 6
  },
  label: {
    fontSize: 13
  }
});
