import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View
} from "react-native";
import { useTranslation } from "react-i18next";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ProfileAvatar } from "@/components/common/ProfileAvatar";
import { DEFAULT_AVATAR_PRESET_ID } from "@/config/avatarPresets";
import { usePreferencesStore } from "@/core/store/usePreferencesStore";
import { useSessionStore } from "@/core/store/useSessionStore";
import { useAppTheme } from "@/theme/ThemeProvider";
import { MainTabParamList } from "@/types/navigation";
import { getSystemLanguage, resolveLanguagePreference } from "@/utils/preferences";

export type AppMenuItem = keyof MainTabParamList | "Settings" | "Credits";

interface AppMenuOverlayProps {
  activeItem: AppMenuItem;
  onClose: () => void;
  onSelect: (item: AppMenuItem) => void;
  visible: boolean;
}

const menuItems: {
  key: AppMenuItem;
  icon: keyof typeof Ionicons.glyphMap;
  label:
    | "menu.items.explorer"
    | "menu.items.favoris"
    | "menu.items.profile"
    | "settings.title"
    | "credits.title";
}[] = [
  { key: "Explorer", icon: "map-outline", label: "menu.items.explorer" },
  { key: "Favoris", icon: "heart-outline", label: "menu.items.favoris" },
  { key: "Profile", icon: "person-outline", label: "menu.items.profile" },
  { key: "Settings", icon: "settings-outline", label: "settings.title" },
  { key: "Credits", icon: "information-circle-outline", label: "credits.title" }
];

export const AppMenuOverlay = ({
  activeItem,
  onClose,
  onSelect,
  visible
}: AppMenuOverlayProps) => {
  const theme = useAppTheme();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const profile = useSessionStore((state) => state.profile);
  const languagePref = usePreferencesStore((state) => state.language);
  const toggleLanguage = usePreferencesStore((state) => state.toggleLanguage);
  const resolvedLanguage = resolveLanguagePreference(languagePref);
  const [mounted, setMounted] = useState(visible);
  const panelTranslate = useRef(new Animated.Value(-420)).current;
  const scrimOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      setMounted(true);
      Animated.parallel([
        Animated.timing(panelTranslate, {
          duration: 240,
          toValue: 0,
          useNativeDriver: true
        }),
        Animated.timing(scrimOpacity, {
          duration: 220,
          toValue: 1,
          useNativeDriver: true
        })
      ]).start();
      return;
    }

    if (!mounted) {
      return;
    }

    Animated.parallel([
        Animated.timing(panelTranslate, {
          duration: 210,
          toValue: -420,
          useNativeDriver: true
        }),
      Animated.timing(scrimOpacity, {
        duration: 180,
        toValue: 0,
        useNativeDriver: true
      })
    ]).start(({ finished }) => {
      if (finished) {
        setMounted(false);
      }
    });
  }, [mounted, panelTranslate, scrimOpacity, visible]);

  const greeting = useMemo(() => {
    if (!profile?.pseudo) {
      return t("menu.greetingFallback");
    }

    return t("menu.greeting", { pseudo: profile.pseudo });
  }, [profile?.pseudo, t]);

  if (!mounted) {
    return null;
  }

  return (
    <Modal animationType="none" onRequestClose={onClose} transparent visible={mounted}>
      <View style={styles.root}>
        <Animated.View style={[styles.scrim, { opacity: scrimOpacity }]}>
          <Pressable
            onPress={onClose}
            style={[StyleSheet.absoluteFillObject, { backgroundColor: theme.colors.overlayMedium }]}
          />
        </Animated.View>

        <Animated.View
          style={[
            styles.panel,
            theme.shadow.soft,
            {
              borderColor: theme.colors.border,
              paddingBottom: Math.max(insets.bottom, 20) + 10,
              paddingTop: insets.top + 10,
              transform: [{ translateX: panelTranslate }]
            }
          ]}
        >
          <BlurView
            intensity={theme.mode === "dark" ? 72 : 54}
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
          <View style={styles.header}>
            <Pressable
              onPress={() => toggleLanguage(getSystemLanguage())}
              style={[
                styles.headerButton,
                {
                  backgroundColor: theme.colors.surfaceAlt,
                  borderColor: theme.colors.border
                }
              ]}
            >
              <Text style={styles.flag}>
                {resolvedLanguage === "fr"
                  ? "🇫🇷"
                  : resolvedLanguage === "es"
                    ? "🇪🇸"
                    : "🇬🇧"}
              </Text>
            </Pressable>

            <Pressable
              onPress={onClose}
              style={[
                styles.headerButton,
                {
                  backgroundColor: theme.colors.surfaceAlt,
                  borderColor: theme.colors.border
                }
              ]}
            >
              <Ionicons color={theme.colors.text} name="close" size={24} />
            </Pressable>
          </View>

          <Pressable
            onPress={() => onSelect("Profile")}
            style={[
              styles.profileBlock,
              {
                borderColor: theme.colors.border
              }
            ]}
          >
            <ProfileAvatar
              avatarPreset={profile?.avatarPreset ?? DEFAULT_AVATAR_PRESET_ID}
              avatarUri={profile?.avatarUri ?? null}
              name={profile?.pseudo ?? "SOS"}
              size={108}
            />
            <Text
              numberOfLines={1}
              style={[
                styles.greeting,
                { color: theme.colors.text, fontFamily: theme.typography.family.bold }
              ]}
            >
              {greeting}
            </Text>
          </Pressable>

          <View style={styles.menuList}>
            {menuItems.map((item) => {
              const isActive = item.key === activeItem;
              const label = t(item.label);

              return (
                <Pressable
                  key={item.key}
                  onPress={() => onSelect(item.key)}
                  style={[
                    styles.menuItem,
                    {
                      backgroundColor: isActive
                        ? theme.colors.primaryMuted
                        : theme.colors.surfaceAlt
                    }
                  ]}
                >
                  <View style={styles.menuLeft}>
                    <View
                      style={[
                        styles.iconWrap,
                        {
                          backgroundColor: isActive
                            ? theme.colors.background
                            : theme.colors.backgroundMuted
                        }
                      ]}
                    >
                      <Ionicons
                        color={isActive ? theme.colors.primary : theme.colors.text}
                        name={item.icon}
                        size={20}
                      />
                    </View>
                    <Text
                      style={[
                        styles.menuLabel,
                        {
                          color: theme.colors.text,
                          fontFamily: theme.typography.family.bold
                        }
                      ]}
                    >
                      {label}
                    </Text>
                  </View>
                  <Ionicons
                    color={theme.colors.textTertiary}
                    name="chevron-forward"
                    size={18}
                  />
                </Pressable>
              );
            })}
          </View>

          <Text
            style={[
              styles.footer,
              {
                color: theme.colors.textTertiary,
                fontFamily: theme.typography.family.medium
              }
            ]}
          >
            {t("settings.madeBy")}
          </Text>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    flexDirection: "row"
  },
  scrim: {
    ...StyleSheet.absoluteFillObject
  },
  panel: {
    borderBottomRightRadius: 32,
    borderTopRightRadius: 32,
    borderRightWidth: 1,
    maxWidth: 420,
    overflow: "hidden",
    paddingHorizontal: 14,
    width: "75%"
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 14
  },
  headerButton: {
    alignItems: "center",
    borderRadius: 22,
    borderWidth: 1,
    height: 48,
    justifyContent: "center",
    width: 48
  },
  flag: {
    fontSize: 24
  },
  profileBlock: {
    alignItems: "center",
    marginBottom: 20,
    paddingBottom: 8
  },
  greeting: {
    fontSize: 18,
    marginTop: 14,
    textAlign: "center"
  },
  menuList: {
    gap: 10
  },
  menuItem: {
    alignItems: "center",
    borderRadius: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    minHeight: 58,
    paddingHorizontal: 12
  },
  menuLeft: {
    alignItems: "center",
    flexDirection: "row",
    gap: 14
  },
  iconWrap: {
    alignItems: "center",
    borderRadius: 12,
    height: 36,
    justifyContent: "center",
    width: 36
  },
  menuLabel: {
    fontSize: 15,
    textTransform: "uppercase"
  },
  footer: {
    fontSize: 11,
    marginTop: 16,
    textAlign: "center",
    textTransform: "uppercase"
  }
});
