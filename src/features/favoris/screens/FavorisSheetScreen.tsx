import BottomSheet, {
  BottomSheetBackgroundProps,
  BottomSheetFlatList,
  BottomSheetView
} from "@gorhom/bottom-sheet";
import { BlurView } from "expo-blur";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ListRenderItem,
  Pressable,
  StyleSheet,
  Text,
  View
} from "react-native";
import { useTranslation } from "react-i18next";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { EmptyState } from "@/components/common/EmptyState";
import { ToiletCard } from "@/components/common/ToiletCard";
import { useAppShellStore } from "@/core/store/useAppShellStore";
import { useSessionStore } from "@/core/store/useSessionStore";
import { openDataRepository } from "@/repositories/toilets/openDataRepository";
import { useAppTheme } from "@/theme/ThemeProvider";
import { ToiletPoint } from "@/types/models";
import { RootStackParamList } from "@/types/navigation";
import { estimateWalkingMinutes, haversineDistanceMeters } from "@/utils/distance";

type Props = NativeStackScreenProps<RootStackParamList, "FavorisSheet">;

export const FavorisSheetScreen = ({ navigation }: Props) => {
  const theme = useAppTheme();
  const { t } = useTranslation();
  const sheetRef = useRef<BottomSheet | null>(null);
  const profile = useSessionStore((state) => state.profile);
  const toggleFavorite = useSessionStore((state) => state.toggleFavorite);
  const getCommunityStatus = useSessionStore((state) => state.getCommunityStatus);
  const requestToiletDetails = useAppShellStore((state) => state.requestToiletDetails);
  const [toilets, setToilets] = useState<ToiletPoint[]>([]);

  useEffect(() => {
    void openDataRepository.getToilets().then(setToilets);
  }, []);
  const closeScreen = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
      return;
    }

    navigation.navigate("MainTabs", { screen: "Explorer" });
  };

  const favorites = useMemo(() => {
    if (!profile) {
      return [];
    }

    return profile.favorites
      .map((favoriteId) => toilets.find((toilet) => toilet.id === favoriteId))
      .filter(Boolean) as ToiletPoint[];
  }, [profile, toilets]);
  const backgroundComponent = ({ style }: BottomSheetBackgroundProps) => (
    <View
      pointerEvents="none"
      style={[
        style,
        styles.glassWrap,
        {
          borderColor: theme.colors.border
        }
      ]}
    >
      <BlurView
        intensity={theme.mode === "dark" ? 72 : 56}
        style={StyleSheet.absoluteFillObject}
        tint={theme.mode === "dark" ? "dark" : "light"}
      />
      <View
        style={[
          StyleSheet.absoluteFillObject,
          {
            backgroundColor: theme.colors.overlaySurface
          }
        ]}
      />
    </View>
  );

  const renderItem: ListRenderItem<ToiletPoint> = ({ item }) => {
    const distance = haversineDistanceMeters(
      item.coordinates.latitude,
      item.coordinates.longitude,
      48.8566,
      2.3522
    );

    return (
      <View style={styles.cardWrap}>
        <ToiletCard
          distanceMeters={distance}
          favorite
          onDirections={() => undefined}
          onPress={() => {
            requestToiletDetails(item.id);
            closeScreen();
          }}
          onToggleFavorite={() => {
            void toggleFavorite(item.id);
          }}
          status={getCommunityStatus(item.id, "operational")}
          subtitle={item.address}
          title={item.name}
          walkingMinutes={estimateWalkingMinutes(distance)}
        />
      </View>
    );
  };

  return (
    <View style={styles.root}>
      <Pressable onPress={closeScreen} style={StyleSheet.absoluteFillObject} />

      <BottomSheet
        backgroundComponent={backgroundComponent}
        enableDynamicSizing={false}
        enablePanDownToClose
        handleIndicatorStyle={{ backgroundColor: theme.colors.textTertiary, width: 52 }}
        index={0}
        onClose={closeScreen}
        ref={sheetRef}
        snapPoints={["88%"]}
      >
        {favorites.length ? (
          <BottomSheetFlatList
            contentContainerStyle={styles.content}
            data={favorites}
            keyExtractor={(item: ToiletPoint) => item.id}
            ListHeaderComponent={
              <View style={styles.header}>
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
                    {
                      color: theme.colors.textSecondary,
                      fontFamily: theme.typography.family.medium
                    }
                  ]}
                >
                  {t("favoris.count", { count: favorites.length })}
                </Text>
              </View>
            }
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <BottomSheetView style={styles.emptyState}>
            <Text
              style={[
                styles.title,
                { color: theme.colors.text, fontFamily: theme.typography.family.bold }
              ]}
            >
              {t("favoris.title")}
            </Text>
            <EmptyState body={t("favoris.emptyBody")} title={t("favoris.emptyTitle")} />
          </BottomSheetView>
        )}
      </BottomSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "flex-end"
  },
  glassWrap: {
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    borderWidth: 1,
    overflow: "hidden"
  },
  content: {
    paddingBottom: 42,
    paddingHorizontal: 18,
    paddingTop: 6
  },
  header: {
    gap: 4,
    marginBottom: 18
  },
  title: {
    fontSize: 26,
    textTransform: "uppercase"
  },
  subtitle: {
    fontSize: 13
  },
  cardWrap: {
    marginBottom: 14
  },
  emptyState: {
    gap: 18,
    paddingHorizontal: 18,
    paddingTop: 8
  }
});
