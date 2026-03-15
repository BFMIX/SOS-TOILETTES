import BottomSheet, {
  BottomSheetBackgroundProps,
  BottomSheetFlatList,
  BottomSheetTextInput,
  BottomSheetView
} from "@gorhom/bottom-sheet";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import React, { RefObject, useMemo } from "react";
import {
  ActivityIndicator,
  ListRenderItem,
  StyleSheet,
  Text,
  View
} from "react-native";
import { useTranslation } from "react-i18next";

import { EmptyState } from "@/components/common/EmptyState";
import { ToiletCard } from "@/components/common/ToiletCard";
import { SearchSuggestions } from "@/features/explorer/components/SearchSuggestions";
import { GeocodingSuggestion, NearbyToiletCard } from "@/types/models";
import { useAppTheme } from "@/theme/ThemeProvider";

interface NearbyToiletsSheetProps {
  bottomInset: number;
  emptyBody: string;
  error: string | null;
  isLoading: boolean;
  isSearching: boolean;
  items: NearbyToiletCard[];
  onChange: (index: number) => void;
  onRetry: () => void;
  onSearchQueryChange: (value: string) => void;
  onSearchSuggestionSelect: (suggestion: GeocodingSuggestion) => void;
  onDirections: (item: NearbyToiletCard) => void;
  onSelect: (item: NearbyToiletCard) => void;
  onToggleFavorite: (item: NearbyToiletCard) => void;
  searchQuery: string;
  searchSuggestions: GeocodingSuggestion[];
  sheetRef: RefObject<BottomSheet | null>;
  topInset: number;
}

export const NearbyToiletsSheet = ({
  bottomInset,
  emptyBody,
  error,
  isLoading,
  isSearching,
  items,
  onChange,
  onRetry,
  onSearchQueryChange,
  onSearchSuggestionSelect,
  onDirections,
  onSelect,
  onToggleFavorite,
  searchQuery,
  searchSuggestions,
  sheetRef,
  topInset
}: NearbyToiletsSheetProps) => {
  const theme = useAppTheme();
  const { t } = useTranslation();
  const snapPoints = useMemo(() => ["21%", "49%", "88%"], []);
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
        intensity={theme.mode === "dark" ? 70 : 55}
        style={StyleSheet.absoluteFillObject}
        tint={theme.mode === "dark" ? "dark" : "light"}
      />
      <View
        style={[
          StyleSheet.absoluteFillObject,
          {
            backgroundColor:
              theme.mode === "dark"
                ? "rgba(4, 11, 23, 0.76)"
                : "rgba(255, 255, 255, 0.82)"
          }
        ]}
      />
    </View>
  );
  const renderItem: ListRenderItem<NearbyToiletCard> = ({ item }) => (
    <View style={styles.cardWrap}>
      <ToiletCard
        distanceMeters={item.distanceMeters}
        favorite={item.favorite}
        onDirections={() => onDirections(item)}
        onPress={() => onSelect(item)}
        onToggleFavorite={() => onToggleFavorite(item)}
        status={item.communityStatus}
        subtitle={item.address}
        title={item.name}
        walkingMinutes={item.walkingMinutes}
      />
    </View>
  );

  const header = (
    <View style={styles.headerContent}>
      <View
        style={[
          styles.searchBox,
          {
            backgroundColor: theme.colors.surfaceAlt,
            borderColor: theme.colors.border
          }
        ]}
      >
        <Ionicons color={theme.colors.textTertiary} name="search" size={22} />
        <BottomSheetTextInput
          onChangeText={onSearchQueryChange}
          placeholder={t("explorer.searchPlaceholder")}
          placeholderTextColor={theme.colors.textTertiary}
          style={[
            styles.searchInput,
            {
              color: theme.colors.text,
              fontFamily: theme.typography.family.medium
            }
          ]}
          value={searchQuery}
        />
        {isSearching ? (
          <ActivityIndicator color={theme.colors.primary} size="small" />
        ) : null}
      </View>

      <SearchSuggestions
        onSelect={onSearchSuggestionSelect}
        suggestions={searchSuggestions}
      />

      <View style={styles.headerText}>
        <Text
          style={[
            styles.title,
            { color: theme.colors.text, fontFamily: theme.typography.family.bold }
          ]}
        >
          {t("explorer.nearbyTitle")}
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
          {t("explorer.sheetSubtitle", { count: items.length })}
        </Text>
      </View>
    </View>
  );

  return (
    <BottomSheet
      animateOnMount={false}
      backgroundComponent={backgroundComponent}
      bottomInset={bottomInset}
      enableDynamicSizing={false}
      enablePanDownToClose={false}
      handleIndicatorStyle={{
        backgroundColor: theme.colors.textTertiary,
        width: 52
      }}
      handleStyle={styles.handle}
      index={0}
      onChange={onChange}
      ref={sheetRef}
      snapPoints={snapPoints}
      style={theme.shadow.soft}
      topInset={topInset}
    >
      {isLoading ? (
        <BottomSheetView style={styles.stateWrap}>
          {header}
          <View style={styles.loadingWrap}>
            <ActivityIndicator color={theme.colors.primary} size="small" />
            <Text
              style={[
                styles.subtitle,
                {
                  color: theme.colors.textSecondary,
                  fontFamily: theme.typography.family.medium
                }
              ]}
            >
              {t("common.loading")}
            </Text>
          </View>
        </BottomSheetView>
      ) : error ? (
        <BottomSheetView style={styles.stateWrap}>
          {header}
          <EmptyState body={error} title={t("explorer.mapError")} />
          <Text
            onPress={onRetry}
            style={[
              styles.retry,
              { color: theme.colors.primary, fontFamily: theme.typography.family.bold }
            ]}
          >
            {t("common.retry")}
          </Text>
        </BottomSheetView>
      ) : !items.length ? (
        <BottomSheetView style={styles.stateWrap}>
          {header}
          <EmptyState body={emptyBody} title={t("common.empty")} />
        </BottomSheetView>
      ) : (
        <BottomSheetFlatList<NearbyToiletCard>
          contentContainerStyle={[
            styles.content,
            { paddingBottom: bottomInset + theme.spacing.xxxl }
          ]}
          data={items}
          keyExtractor={(item: NearbyToiletCard) => item.id}
          ListHeaderComponent={header}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
        />
      )}
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  glassWrap: {
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    borderWidth: 1,
    overflow: "hidden"
  },
  handle: {
    paddingTop: 14
  },
  content: {
    paddingHorizontal: 18
  },
  headerContent: {
    paddingBottom: 12,
    paddingTop: 2
  },
  searchBox: {
    alignItems: "center",
    borderRadius: 24,
    borderWidth: 1,
    flexDirection: "row",
    gap: 10,
    minHeight: 58,
    paddingHorizontal: 16
  },
  searchInput: {
    flex: 1,
    fontSize: 15
  },
  headerText: {
    gap: 4,
    marginTop: 14
  },
  title: {
    fontSize: 20
  },
  subtitle: {
    fontSize: 13
  },
  cardWrap: {
    marginBottom: 14
  },
  retry: {
    fontSize: 14,
    marginTop: 12
  },
  stateWrap: {
    paddingHorizontal: 18,
    paddingTop: 2
  },
  loadingWrap: {
    alignItems: "center",
    gap: 12,
    paddingTop: 36
  }
});
