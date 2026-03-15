import { Ionicons } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import { SafeAreaView } from "react-native-safe-area-context";

import { IconButton } from "@/components/common/IconButton";
import { AppMenuOverlay } from "@/components/navigation/AppMenuOverlay";
import { useAppShellStore } from "@/core/store/useAppShellStore";
import { usePreferencesStore } from "@/core/store/usePreferencesStore";
import { useAppTheme } from "@/theme/ThemeProvider";
import { RootStackParamList } from "@/types/navigation";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

const themeModes = ["system", "dark", "light"] as const;
const languageModes = ["system", "fr", "en", "es"] as const;

type Props = NativeStackScreenProps<RootStackParamList, "Settings">;

export const SettingsScreen = ({ navigation }: Props) => {
  const theme = useAppTheme();
  const { t } = useTranslation();
  const menuOpen = useAppShellStore((state) => state.menuOpen);
  const openMenu = useAppShellStore((state) => state.openMenu);
  const closeMenu = useAppShellStore((state) => state.closeMenu);
  const themeMode = usePreferencesStore((state) => state.themeMode);
  const setThemeMode = usePreferencesStore((state) => state.setThemeMode);
  const languagePref = usePreferencesStore((state) => state.language);
  const setLanguage = usePreferencesStore((state) => state.setLanguage);
  const [picker, setPicker] = useState<null | "theme" | "language">(null);

  const selectedTheme = useMemo(
    () => themeModes.find((mode) => mode === themeMode) ?? "system",
    [themeMode]
  );
  const selectedLanguage = useMemo(
    () => languageModes.find((mode) => mode === languagePref) ?? "system",
    [languagePref]
  );

  const handleSelect = (
    item: "Explorer" | "Favoris" | "Profile" | "Settings" | "Credits"
  ) => {
    closeMenu();
    if (item === "Settings" || item === "Credits") {
      navigation.navigate(item);
      return;
    }
    navigation.navigate("MainTabs", { screen: item });
  };

  const handleOpenMenu = () => {
    navigation.navigate("MainTabs", { screen: "Explorer" });
    openMenu();
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.background }]}>
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
          {t("settings.title")}
        </Text>

        <View
          style={[
            styles.card,
            {
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border
            }
          ]}
        >
          <Text
            style={[
              styles.sectionTitle,
              { color: theme.colors.textSecondary, fontFamily: theme.typography.family.bold }
            ]}
          >
            {t("settings.theme")}
          </Text>
          <Pressable
            onPress={() => setPicker("theme")}
            style={[
              styles.selectorRow,
              { backgroundColor: theme.colors.surfaceAlt, borderColor: theme.colors.border }
            ]}
          >
            <View style={styles.selectorValueWrap}>
              <Ionicons
                color={theme.colors.text}
                name={
                  selectedTheme === "system"
                    ? "contrast-outline"
                    : selectedTheme === "dark"
                      ? "moon-outline"
                      : "sunny-outline"
                }
                size={16}
              />
              <Text
                style={[
                  styles.selectorValue,
                  { color: theme.colors.text, fontFamily: theme.typography.family.bold }
                ]}
              >
                {t(`settings.themeValue.${selectedTheme}`)}
              </Text>
            </View>
            <Ionicons color={theme.colors.textSecondary} name="chevron-down" size={16} />
          </Pressable>
        </View>

        <View
          style={[
            styles.card,
            {
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border
            }
          ]}
        >
          <Text
            style={[
              styles.sectionTitle,
              { color: theme.colors.textSecondary, fontFamily: theme.typography.family.bold }
            ]}
          >
            {t("settings.language")}
          </Text>
          <Pressable
            onPress={() => setPicker("language")}
            style={[
              styles.selectorRow,
              { backgroundColor: theme.colors.surfaceAlt, borderColor: theme.colors.border }
            ]}
          >
            <View style={styles.selectorValueWrap}>
              {selectedLanguage === "system" ? (
                <Ionicons
                  color={theme.colors.text}
                  name="phone-portrait-outline"
                  size={16}
                />
              ) : (
                <Text style={styles.selectorFlag}>
                  {selectedLanguage === "fr"
                    ? "🇫🇷"
                    : selectedLanguage === "en"
                      ? "🇬🇧"
                      : "🇪🇸"}
                </Text>
              )}
              <Text
                style={[
                  styles.selectorValue,
                  { color: theme.colors.text, fontFamily: theme.typography.family.bold }
                ]}
              >
                {t(`settings.languageValue.${selectedLanguage}`)}
              </Text>
            </View>
            <Ionicons color={theme.colors.textSecondary} name="chevron-down" size={16} />
          </Pressable>
        </View>
      </ScrollView>

      <Modal animationType="fade" onRequestClose={() => setPicker(null)} transparent visible={picker !== null}>
        <Pressable
          onPress={() => setPicker(null)}
          style={[styles.modalBackdrop, { backgroundColor: theme.colors.overlaySoft }]}
        >
          <Pressable
            onPress={() => undefined}
            style={[
              styles.modalCard,
              {
                backgroundColor: theme.colors.overlaySurface,
                borderColor: theme.colors.border
              }
            ]}
          >
            {(picker === "theme" ? themeModes : languageModes).map((mode) => {
              const active = picker === "theme" ? themeMode === mode : languagePref === mode;
              const icon =
                picker === "theme"
                  ? mode === "system"
                    ? "contrast-outline"
                    : mode === "dark"
                      ? "moon-outline"
                      : "sunny-outline"
                  : "phone-portrait-outline";

              const flag =
                picker === "language" && mode !== "system"
                  ? mode === "fr"
                    ? "🇫🇷"
                    : mode === "en"
                      ? "🇬🇧"
                      : "🇪🇸"
                  : null;

              return (
                <Pressable
                  key={mode}
                  onPress={() => {
                    if (picker === "theme") {
                      setThemeMode(mode as (typeof themeModes)[number]);
                    } else {
                      setLanguage(mode as (typeof languageModes)[number]);
                    }
                    setPicker(null);
                  }}
                  style={[
                    styles.modalOption,
                    {
                      backgroundColor: active ? theme.colors.primary : theme.colors.surfaceAlt
                    }
                  ]}
                >
                  <View style={styles.choiceContent}>
                    {flag ? (
                      <Text style={styles.selectorFlag}>{flag}</Text>
                    ) : (
                      <Ionicons
                        color={active ? "#ffffff" : theme.colors.text}
                        name={icon}
                        size={16}
                      />
                    )}
                    <Text
                      style={[
                        styles.choiceLabel,
                        {
                          color: active ? "#ffffff" : theme.colors.text,
                          fontFamily: theme.typography.family.bold
                        }
                      ]}
                    >
                      {picker === "theme"
                        ? t(`settings.themeValue.${mode}`)
                        : t(`settings.languageValue.${mode}`)}
                    </Text>
                  </View>
                </Pressable>
              );
            })}
          </Pressable>
        </Pressable>
      </Modal>

      <AppMenuOverlay
        activeItem="Settings"
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
    fontSize: 32,
    textTransform: "uppercase"
  },
  card: {
    borderRadius: 24,
    borderWidth: 1,
    padding: 18
  },
  sectionTitle: {
    fontSize: 12,
    marginBottom: 14,
    textTransform: "uppercase"
  },
  selectorRow: {
    alignItems: "center",
    flexDirection: "row",
    borderRadius: 16,
    borderWidth: 1,
    justifyContent: "space-between",
    minHeight: 42,
    paddingHorizontal: 14
  },
  selectorValueWrap: {
    alignItems: "center",
    flexDirection: "row",
    gap: 8
  },
  selectorValue: {
    fontSize: 14
  },
  selectorFlag: {
    fontSize: 16
  },
  choiceContent: {
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
    justifyContent: "center"
  },
  choiceLabel: {
    fontSize: 14,
    textAlign: "center"
  },
  modalBackdrop: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    padding: 24
  },
  modalCard: {
    borderRadius: 24,
    borderWidth: 1,
    gap: 10,
    padding: 16,
    width: "100%"
  },
  modalOption: {
    borderRadius: 16,
    minHeight: 44,
    justifyContent: "center",
    paddingHorizontal: 16
  },
  body: {
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 14
  },
  languageLabel: {
    fontSize: 16
  }
});
