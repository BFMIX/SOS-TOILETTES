import { Ionicons } from "@expo/vector-icons";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useChromeStore } from "@/core/store/useChromeStore";
import { useAppTheme } from "@/theme/ThemeProvider";

const tabIconMap = {
  Explorer: "map-outline",
  Favoris: "heart-outline",
  Profile: "person-outline"
} as const;

const activeTabIconMap = {
  Explorer: "map",
  Favoris: "heart",
  Profile: "person"
} as const;

export const AppTabBar = ({ state, descriptors, navigation }: BottomTabBarProps) => {
  const theme = useAppTheme();
  const insets = useSafeAreaInsets();
  const tabBarVisible = useChromeStore((store) => store.tabBarVisible);

  if (!tabBarVisible) {
    return null;
  }

  return (
    <View
      style={[
        styles.container,
        theme.shadow.soft,
        {
          backgroundColor:
            theme.mode === "dark" ? theme.colors.surface : theme.colors.surface,
          borderColor: theme.colors.border,
          paddingBottom: Math.max(insets.bottom, 14)
        }
      ]}
    >
      {state.routes.map((route, index) => {
        const isFocused = state.index === index;
        const descriptor = descriptors[route.key];
        const label =
          typeof descriptor.options.title === "string"
            ? descriptor.options.title
            : route.name;

        const iconName = isFocused
          ? activeTabIconMap[route.name as keyof typeof activeTabIconMap]
          : tabIconMap[route.name as keyof typeof tabIconMap];

        return (
          <Pressable
            key={route.key}
            onPress={() => navigation.navigate(route.name)}
            style={styles.tab}
          >
            <Ionicons
              color={isFocused ? theme.colors.primary : theme.colors.textTertiary}
              name={iconName}
              size={22}
            />
            <Text
              style={[
                styles.label,
                {
                  color: isFocused ? theme.colors.primary : theme.colors.textTertiary,
                  fontFamily: isFocused
                    ? theme.typography.family.bold
                    : theme.typography.family.medium
                }
              ]}
            >
              {label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderTopWidth: 1,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 18,
    paddingTop: 12
  },
  tab: {
    alignItems: "center",
    gap: 4,
    minWidth: 72
  },
  label: {
    fontSize: 11
  }
});
