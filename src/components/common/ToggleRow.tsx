import React from "react";
import { StyleSheet, Switch, Text, View } from "react-native";

import { useAppTheme } from "@/theme/ThemeProvider";

interface ToggleRowProps {
  title: string;
  subtitle: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  icon: React.ReactNode;
}

export const ToggleRow = ({
  title,
  subtitle,
  value,
  onValueChange,
  icon
}: ToggleRowProps) => {
  const theme = useAppTheme();

  return (
    <View style={styles.row}>
      <View style={styles.content}>
        <View
          style={[
            styles.iconContainer,
            {
              backgroundColor:
                theme.mode === "dark"
                  ? theme.colors.surfaceAlt
                  : theme.colors.backgroundMuted
            }
          ]}
        >
          {icon}
        </View>
        <View style={styles.texts}>
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
              styles.subtitle,
              {
                color: theme.colors.textSecondary,
                fontFamily: theme.typography.family.medium
              }
            ]}
          >
            {subtitle}
          </Text>
        </View>
      </View>
      <Switch
        onValueChange={onValueChange}
        trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
        thumbColor="#ffffff"
        value={value}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8
  },
  content: {
    alignItems: "center",
    flex: 1,
    flexDirection: "row",
    gap: 14
  },
  iconContainer: {
    alignItems: "center",
    borderRadius: 14,
    height: 44,
    justifyContent: "center",
    width: 44
  },
  texts: {
    flex: 1
  },
  title: {
    fontSize: 15,
    marginBottom: 2
  },
  subtitle: {
    fontSize: 12
  }
});
