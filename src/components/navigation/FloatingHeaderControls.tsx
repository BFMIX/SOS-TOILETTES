import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { useAppTheme } from "@/theme/ThemeProvider";

interface FloatingHeaderControlsProps {
  flag: string;
  onMenuPress: () => void;
  onFlagPress: () => void;
}

export const FloatingHeaderControls = ({
  flag,
  onMenuPress,
  onFlagPress
}: FloatingHeaderControlsProps) => {
  const theme = useAppTheme();

  return (
    <View style={styles.row}>
      <Pressable
        onPress={onMenuPress}
        style={[
          styles.iconButton,
          theme.shadow.card,
          {
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.border
          }
        ]}
      >
        <Ionicons color={theme.colors.text} name="menu" size={22} />
      </Pressable>

      <Pressable
        onPress={onFlagPress}
        style={[
          styles.flagButton,
          theme.shadow.card,
          {
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.border
          }
        ]}
      >
        <Text style={styles.flag}>{flag}</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  iconButton: {
    alignItems: "center",
    borderRadius: 24,
    borderWidth: 1,
    height: 56,
    justifyContent: "center",
    width: 56
  },
  flagButton: {
    alignItems: "center",
    borderRadius: 22,
    borderWidth: 1,
    height: 48,
    justifyContent: "center",
    width: 64
  },
  flag: {
    fontSize: 24
  }
});
