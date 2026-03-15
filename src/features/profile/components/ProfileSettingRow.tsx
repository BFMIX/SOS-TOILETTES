import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, StyleSheet, Switch, Text, View } from "react-native";

import { useAppTheme } from "@/theme/ThemeProvider";

interface ProfileSettingRowProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  valueLabel?: string;
  toggleValue?: boolean;
  onPress?: () => void;
  onToggle?: (value: boolean) => void;
}

export const ProfileSettingRow = ({
  icon,
  label,
  valueLabel,
  toggleValue,
  onPress,
  onToggle
}: ProfileSettingRowProps) => {
  const theme = useAppTheme();

  const content = (
    <View style={styles.row}>
      <View style={styles.left}>
        <Ionicons color={theme.colors.textSecondary} name={icon} size={18} />
        <Text
          style={[
            styles.label,
            { color: theme.colors.text, fontFamily: theme.typography.family.semiBold }
          ]}
        >
          {label}
        </Text>
      </View>
      {typeof toggleValue === "boolean" ? (
        <Switch
          onValueChange={onToggle}
          thumbColor="#ffffff"
          trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
          value={toggleValue}
        />
      ) : (
        <View style={styles.valueWrap}>
          {valueLabel ? (
            <Text
              style={[
                styles.value,
                {
                  color: theme.colors.textSecondary,
                  fontFamily: theme.typography.family.medium
                }
              ]}
            >
              {valueLabel}
            </Text>
          ) : null}
          <Ionicons
            color={theme.colors.textTertiary}
            name="chevron-forward"
            size={16}
          />
        </View>
      )}
    </View>
  );

  if (!onPress) {
    return content;
  }

  return <Pressable onPress={onPress}>{content}</Pressable>;
};

const styles = StyleSheet.create({
  row: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    minHeight: 56
  },
  left: {
    alignItems: "center",
    flexDirection: "row",
    gap: 12
  },
  label: {
    fontSize: 15
  },
  valueWrap: {
    alignItems: "center",
    flexDirection: "row",
    gap: 8
  },
  value: {
    fontSize: 13
  }
});
