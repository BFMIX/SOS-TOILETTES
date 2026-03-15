import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { useAppTheme } from "@/theme/ThemeProvider";

interface EmptyStateProps {
  title: string;
  body: string;
}

export const EmptyState = ({ title, body }: EmptyStateProps) => {
  const theme = useAppTheme();

  return (
    <View style={styles.container}>
      <Text
        style={[
          styles.title,
          { color: theme.colors.text, fontFamily: theme.typography.family.bold }
        ]}
      >
        {title}
      </Text>
      <Text
        style={[
          styles.body,
          {
            color: theme.colors.textSecondary,
            fontFamily: theme.typography.family.medium
          }
        ]}
      >
        {body}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 32
  },
  title: {
    fontSize: 18,
    marginBottom: 8,
    textAlign: "center"
  },
  body: {
    fontSize: 14,
    lineHeight: 22,
    textAlign: "center"
  }
});
