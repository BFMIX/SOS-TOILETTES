import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { BlurView } from "expo-blur";
import React, { useEffect, useMemo, useState } from "react";
import { Linking, Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { SafeAreaView } from "react-native-safe-area-context";

import { EmptyState } from "@/components/common/EmptyState";
import { IconButton } from "@/components/common/IconButton";
import { ToiletCard } from "@/components/common/ToiletCard";
import { AppMenuItem, AppMenuOverlay } from "@/components/navigation/AppMenuOverlay";
import { useAppShellStore } from "@/core/store/useAppShellStore";
import { useSessionStore } from "@/core/store/useSessionStore";
import { openDataRepository } from "@/repositories/toilets/openDataRepository";
import { useAppTheme } from "@/theme/ThemeProvider";
import { ToiletPoint } from "@/types/models";
import { MainTabParamList, RootStackParamList } from "@/types/navigation";
import { estimateWalkingMinutes, haversineDistanceMeters } from "@/utils/distance";

type TabNavigation = BottomTabNavigationProp<MainTabParamList, "Favoris">;

export const FavorisScreen = () => {
  const theme = useAppTheme();
  const { t } = useTranslation();
  const navigation = useNavigation<TabNavigation>();
  const menuOpen = useAppShellStore((state) => state.menuOpen);
  const openMenu = useAppShellStore((state) => state.openMenu);
  const closeMenu = useAppShellStore((state) => state.closeMenu);
  const requestToiletDetails = useAppShellStore((state) => state.requestToiletDetails);
  const profile = useSessionStore((state) => state.profile);
  const toggleFavorite = useSessionStore((state) => state.toggleFavorite);
  const getCommunityStatus = useSessionStore((state) => state.getCommunityStatus);
  const [toilets, setToilets] = useState<ToiletPoint[]>([]);

  const rootNavigation =
    navigation.getParent<NativeStackNavigationProp<RootStackParamList>>();

  useEffect(() => {
    void openDataRepository.getToilets().then(setToilets);
  }, []);

  const favorites = useMemo(() => {
    if (!profile) {
      return [];
    }

    return profile.favorites
      .map((favoriteId) => toilets.find((toilet) => toilet.id === favoriteId))
      .filter(Boolean) as ToiletPoint[];
  }, [profile, toilets]);

  if (!profile) {
    return null;
  }

  const handleSelect = (item: AppMenuItem) => {
    closeMenu();
    if (item === "Settings" || item === "Credits") {
      rootNavigation?.navigate(item);
      return;
    }

    navigation.navigate(item);
  };

  const handleOpenMenu = () => {
    navigation.navigate("Explorer");
    openMenu();
  };

  const openDirectionsTo = async (toilet: ToiletPoint) => {
    const latitude = toilet.coordinates.latitude;
    const longitude = toilet.coordinates.longitude;
    const url =
      Platform.OS === "ios"
        ? `http://maps.apple.com/?daddr=${latitude},${longitude}`
        : `google.navigation:q=${latitude},${longitude}`;

    if (await Linking.canOpenURL(url)) {
      await Linking.openURL(url);
      return;
    }

    await Linking.openURL(
      `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`
    );
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.background }]}>
      <BlurView
        intensity={theme.mode === "dark" ? 64 : 46}
        style={StyleSheet.absoluteFillObject}
        tint={theme.mode === "dark" ? "dark" : "light"}
      />
      <View
        pointerEvents="none"
        style={[
          StyleSheet.absoluteFillObject,
          {
            backgroundColor:
              theme.mode === "dark"
                ? "rgba(4, 11, 23, 0.56)"
                : "rgba(255, 255, 255, 0.52)"
          }
        ]}
      />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.topBar}>
          <IconButton icon="menu" onPress={handleOpenMenu} />
        </View>

        <Text
          style={[
            styles.title,
            { color: theme.colors.text, fontFamily: theme.typography.family.bold }
          ]}
        >
          {t("favoris.title")}
        </Text>
        <Text
          style={[
            styles.subtitle,
            { color: theme.colors.textSecondary, fontFamily: theme.typography.family.medium }
          ]}
        >
          {t("favoris.count", { count: favorites.length })}
        </Text>

        {favorites.length ? (
          <View style={styles.list}>
            {favorites.map((toilet) => {
              const distance = haversineDistanceMeters(
                toilet.coordinates.latitude,
                toilet.coordinates.longitude,
                48.8566,
                2.3522
              );

              return (
                <ToiletCard
                  key={toilet.id}
                  distanceMeters={distance}
                  favorite
                  onDirections={() => {
                    void openDirectionsTo(toilet);
                  }}
                  onPress={() => {
                    requestToiletDetails(toilet.id);
                    navigation.navigate("Explorer");
                  }}
                  onToggleFavorite={() => {
                    void toggleFavorite(toilet.id);
                  }}
                  status={getCommunityStatus(toilet.id, "operational")}
                  subtitle={toilet.address}
                  title={toilet.name}
                  walkingMinutes={estimateWalkingMinutes(distance)}
                />
              );
            })}
          </View>
        ) : (
          <View
            style={[
              styles.emptyCard,
              { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }
            ]}
          >
            <EmptyState body={t("favoris.emptyBody")} title={t("favoris.emptyTitle")} />
          </View>
        )}
      </ScrollView>

      <AppMenuOverlay
        activeItem="Favoris"
        onClose={closeMenu}
        onSelect={handleSelect}
        visible={menuOpen}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1
  },
  content: {
    gap: 16,
    paddingBottom: 48,
    paddingHorizontal: 20,
    paddingTop: 18
  },
  topBar: {
    alignItems: "flex-start"
  },
  title: {
    fontSize: 32
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 22
  },
  list: {
    gap: 14
  },
  emptyCard: {
    borderRadius: 24,
    borderWidth: 1,
    padding: 18
  }
});
