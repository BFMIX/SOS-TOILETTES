import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useEffect, useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import { SafeAreaView } from "react-native-safe-area-context";

import { Chip } from "@/components/common/Chip";
import { PrimaryButton } from "@/components/common/PrimaryButton";
import { ToggleRow } from "@/components/common/ToggleRow";
import { useFilterStore } from "@/features/filters/store/useFilterStore";
import { openDataRepository } from "@/repositories/toilets/openDataRepository";
import { useAppTheme } from "@/theme/ThemeProvider";
import { ToiletPoint } from "@/types/models";
import { RootStackParamList } from "@/types/navigation";
import { applyToiletFilters } from "@/utils/toilets";

type Props = NativeStackScreenProps<RootStackParamList, "FiltersModal">;

export const FilterModalScreen = ({ navigation }: Props) => {
  const theme = useAppTheme();
  const { t } = useTranslation();
  const {
    openOnly,
    freeOnly,
    accessibleOnly,
    babyChangeOnly,
    open24hOnly,
    parisOnly,
    indoorOnly,
    sanisetteOnly,
    setFilter,
    reset
  } = useFilterStore();
  const [toilets, setToilets] = useState<ToiletPoint[]>([]);

  useEffect(() => {
    void openDataRepository.getToilets().then(setToilets);
  }, []);

  const resultsCount = useMemo(
    () =>
      applyToiletFilters(toilets, {
        openOnly,
        freeOnly,
        accessibleOnly,
        babyChangeOnly,
        open24hOnly,
        parisOnly,
        indoorOnly,
        sanisetteOnly
      }).length,
    [
      accessibleOnly,
      babyChangeOnly,
      freeOnly,
      indoorOnly,
      open24hOnly,
      openOnly,
      parisOnly,
      sanisetteOnly,
      toilets
    ]
  );
  const hasActiveFilters =
    openOnly ||
    freeOnly ||
    accessibleOnly ||
    babyChangeOnly ||
    open24hOnly ||
    parisOnly ||
    indoorOnly ||
    sanisetteOnly;
  const closeScreen = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
      return;
    }

    navigation.navigate("MainTabs", { screen: "Explorer" });
  };

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: theme.colors.background }]}
    >
      <BlurView
        intensity={theme.mode === "dark" ? 70 : 52}
        style={StyleSheet.absoluteFillObject}
        tint={theme.mode === "dark" ? "dark" : "light"}
      />
      <View
        pointerEvents="none"
        style={[
          StyleSheet.absoluteFillObject,
          {
            backgroundColor: theme.colors.overlayMedium
          }
        ]}
      />
      <View
        style={[
          styles.header,
          {
            backgroundColor: "transparent"
          }
        ]}
      >
        <Pressable onPress={closeScreen}>
          <Ionicons color={theme.colors.text} name="close" size={24} />
        </Pressable>
        <Text
          style={[
            styles.headerTitle,
            { color: theme.colors.text, fontFamily: theme.typography.family.bold }
          ]}
        >
          {t("filters.title")}
        </Text>
        <Pressable onPress={reset}>
          <Text
            style={[
              styles.reset,
              {
                color: hasActiveFilters ? theme.colors.danger : theme.colors.textSecondary,
                fontFamily: theme.typography.family.bold
              }
            ]}
          >
            {t("filters.reset")}
          </Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View
          style={[
            styles.sectionCard,
            {
              backgroundColor:
                theme.mode === "dark"
                  ? "rgba(18, 28, 45, 0.54)"
                  : "rgba(255, 255, 255, 0.56)",
              borderColor: theme.colors.border
            }
          ]}
        >
          <Text
            style={[
              styles.sectionTitle,
              { color: theme.colors.text, fontFamily: theme.typography.family.bold }
            ]}
          >
            {t("filters.sections.status")}
          </Text>
          <View style={styles.chipsRow}>
            <Chip
              label={t("common.equipments.open")}
              onPress={() => setFilter("openOnly", !openOnly)}
              selected={openOnly}
            />
            <Chip
              label={t("common.equipments.free")}
              onPress={() => setFilter("freeOnly", !freeOnly)}
              selected={freeOnly}
            />
            <Chip
              label={t("filters.options.open24h")}
              onPress={() => setFilter("open24hOnly", !open24hOnly)}
              selected={open24hOnly}
            />
          </View>
        </View>

        <View
          style={[
            styles.sectionCard,
            {
              backgroundColor:
                theme.mode === "dark"
                  ? "rgba(18, 28, 45, 0.54)"
                  : "rgba(255, 255, 255, 0.56)",
              borderColor: theme.colors.border
            }
          ]}
        >
          <Text
            style={[
              styles.sectionTitle,
              { color: theme.colors.text, fontFamily: theme.typography.family.bold }
            ]}
          >
            {t("filters.sections.amenities")}
          </Text>

          <ToggleRow
            icon={<Ionicons color={theme.colors.text} name="accessibility" size={20} />}
            onValueChange={(value) => setFilter("accessibleOnly", value)}
            subtitle={t("filters.descriptions.accessible")}
            title={t("common.equipments.accessible")}
            value={accessibleOnly}
          />
          <ToggleRow
            icon={<Ionicons color={theme.colors.text} name="happy" size={20} />}
            onValueChange={(value) => setFilter("babyChangeOnly", value)}
            subtitle={t("filters.descriptions.babyChange")}
            title={t("common.equipments.babyChange")}
            value={babyChangeOnly}
          />
        </View>

        <View
          style={[
            styles.sectionCard,
            {
              backgroundColor:
                theme.mode === "dark"
                  ? "rgba(18, 28, 45, 0.54)"
                  : "rgba(255, 255, 255, 0.56)",
              borderColor: theme.colors.border
            }
          ]}
        >
          <Text
            style={[
              styles.sectionTitle,
              { color: theme.colors.text, fontFamily: theme.typography.family.bold }
            ]}
          >
            {t("filters.sections.type")}
          </Text>
          <View style={styles.chipsRow}>
            <Chip
              label={t("filters.options.sanisetteOnly")}
              onPress={() => setFilter("sanisetteOnly", !sanisetteOnly)}
              selected={sanisetteOnly}
            />
            <Chip
              label={t("filters.options.indoorOnly")}
              onPress={() => setFilter("indoorOnly", !indoorOnly)}
              selected={indoorOnly}
            />
            <Chip
              label={t("filters.options.parisOnly")}
              onPress={() => setFilter("parisOnly", !parisOnly)}
              selected={parisOnly}
            />
          </View>
        </View>
      </ScrollView>

      <View
        style={[
          styles.footer,
          { backgroundColor: "transparent" }
        ]}
      >
        <PrimaryButton
          label={t("filters.applyCta", { count: resultsCount })}
          onPress={closeScreen}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingVertical: 18
  },
  headerTitle: {
    fontSize: 18,
    textTransform: "uppercase"
  },
  reset: {
    fontSize: 14
  },
  content: {
    gap: 16,
    paddingHorizontal: 24,
    paddingVertical: 24
  },
  sectionCard: {
    borderRadius: 24,
    borderWidth: 1,
    padding: 18
  },
  sectionTitle: {
    fontSize: 22,
    marginBottom: 16,
    textTransform: "uppercase"
  },
  chipsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12
  },
  footer: {
    borderTopWidth: 1,
    paddingHorizontal: 24,
    paddingVertical: 20
  }
});
