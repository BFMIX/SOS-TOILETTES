import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
import {
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View
} from "react-native";
import { useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { SafeAreaView } from "react-native-safe-area-context";

import { IconButton } from "@/components/common/IconButton";
import { ProfileAvatar } from "@/components/common/ProfileAvatar";
import { AppMenuItem, AppMenuOverlay } from "@/components/navigation/AppMenuOverlay";
import { BADGE_DEFINITIONS } from "@/config/badges";
import { BADGE_ICON_MAP, LEVEL_ICON_MAP } from "@/config/gamificationAssets";
import { useAppShellStore } from "@/core/store/useAppShellStore";
import { useSessionStore } from "@/core/store/useSessionStore";
import { AvatarPickerModal } from "@/features/profile/components/AvatarPickerModal";
import { useAppTheme } from "@/theme/ThemeProvider";
import { MainTabParamList, RootStackParamList } from "@/types/navigation";
import { getLevelDefinition, getXpToNextLevel } from "@/utils/xp";

type TabNavigation = BottomTabNavigationProp<MainTabParamList, "Profile">;

export const ProfileScreen = () => {
  const theme = useAppTheme();
  const { t } = useTranslation();
  const navigation = useNavigation<TabNavigation>();
  const [avatarModalVisible, setAvatarModalVisible] = useState(false);
  const [showLevelInfo, setShowLevelInfo] = useState(false);
  const menuOpen = useAppShellStore((state) => state.menuOpen);
  const openMenu = useAppShellStore((state) => state.openMenu);
  const closeMenu = useAppShellStore((state) => state.closeMenu);
  const profile = useSessionStore((state) => state.profile);
  const updateProfileAvatar = useSessionStore((state) => state.updateProfileAvatar);

  const rootNavigation =
    navigation.getParent<NativeStackNavigationProp<RootStackParamList>>();

  const badges = useMemo(
    () =>
      BADGE_DEFINITIONS.map((badge) => ({
        ...badge,
        unlocked: profile?.badges.includes(badge.id) ?? false
      })),
    [profile?.badges]
  );
  const levelDefinition = useMemo(
    () => getLevelDefinition(profile?.xp ?? 0),
    [profile?.xp]
  );

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

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.background }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.topBar}>
          <IconButton icon="menu" onPress={handleOpenMenu} />
        </View>

        <View
          style={[
            styles.heroCard,
            theme.shadow.soft,
            {
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border
            }
          ]}
        >
          <Pressable onPress={() => setAvatarModalVisible(true)} style={styles.avatarTap}>
            <ProfileAvatar
              avatarPreset={profile.avatarPreset}
              avatarUri={profile.avatarUri}
              name={profile.pseudo}
              size={116}
            />
          </Pressable>
          <Text
            numberOfLines={1}
            style={[
              styles.greeting,
              { color: theme.colors.text, fontFamily: theme.typography.family.bold }
            ]}
          >
            {t("profile.greeting", { pseudo: profile.pseudo })}
          </Text>
          <View style={styles.levelInlineRow}>
            <Image source={LEVEL_ICON_MAP[levelDefinition.id]} style={styles.levelIcon} />
            <Text
              style={[
                styles.levelRankLabel,
                { color: theme.colors.textSecondary, fontFamily: theme.typography.family.bold }
              ]}
            >
              {t(`profile.levelRanks.${levelDefinition.id}`)}
            </Text>
            <View
              style={[styles.levelInlineDot, { backgroundColor: theme.colors.textTertiary }]}
            />
            <Text
              style={[
                styles.levelValueLabel,
                { color: theme.colors.primary, fontFamily: theme.typography.family.bold }
              ]}
            >
              {t("profile.level", { level: profile.level })}
            </Text>
          </View>
          <Pressable
            onPress={() => setAvatarModalVisible(true)}
            style={[
              styles.configureButton,
              { backgroundColor: theme.colors.primaryMuted }
            ]}
          >
            <Ionicons color={theme.colors.primary} name="camera-outline" size={18} />
            <Text
              style={[
                styles.configureLabel,
                { color: theme.colors.primary, fontFamily: theme.typography.family.bold }
              ]}
            >
              {t("profile.changeAvatar")}
            </Text>
          </Pressable>

          <View
            style={[
              styles.statsGrid,
              {
                borderTopColor: theme.colors.border
              }
            ]}
          >
            {[
              {
                accent: theme.colors.primary,
                label: t("profile.xp"),
                value: String(profile.xp)
              },
              {
                accent: theme.colors.favorite,
                label: t("profile.favoritesCount"),
                value: String(profile.favorites.length)
              },
              {
                accent: theme.colors.warning,
                label: t("profile.reportsCount"),
                value: String(profile.reportsCount)
              },
              {
                accent: theme.colors.success,
                label: t("profile.reviewsCount"),
                value: String(profile.reviewsCount)
              }
            ].map((item) => (
              <View
                key={item.label}
                style={[
                  styles.statTile,
                  { backgroundColor: theme.colors.surfaceAlt }
                ]}
              >
                <View
                  style={[
                    styles.statAccent,
                    { backgroundColor: item.accent }
                  ]}
                />
                <Text
                  style={[
                    styles.statValue,
                    {
                      color: theme.colors.text,
                      fontFamily: theme.typography.family.bold
                    }
                  ]}
                >
                  {item.value}
                </Text>
                <Text
                  style={[
                    styles.statLabel,
                    {
                      color: theme.colors.textSecondary,
                      fontFamily: theme.typography.family.medium
                    }
                  ]}
                >
                  {item.label}
                </Text>
              </View>
            ))}
          </View>

          <Text
            style={[
              styles.highlightBody,
              {
                color: theme.colors.textSecondary,
                fontFamily: theme.typography.family.medium
              }
            ]}
          >
            {t("profile.nextLevelXp", { xp: getXpToNextLevel(profile.xp) })}
          </Text>
        </View>

        {showLevelInfo ? (
          <Modal
            animationType="slide"
            onRequestClose={() => setShowLevelInfo(false)}
            transparent
            visible={showLevelInfo}
          >
            <SafeAreaView
              style={[
                styles.infoModalRoot,
                {
                  backgroundColor:
                    theme.mode === "dark"
                      ? "rgba(4, 11, 23, 0.95)"
                      : "rgba(248, 250, 252, 0.96)"
                }
              ]}
            >
              <View style={styles.infoModalHeader}>
                <Text
                  style={[
                    styles.infoModalTitle,
                    { color: theme.colors.text, fontFamily: theme.typography.family.bold }
                  ]}
                >
                  {t("profile.levelInfoCta")}
                </Text>
                <Pressable onPress={() => setShowLevelInfo(false)}>
                  <Ionicons color={theme.colors.text} name="close" size={24} />
                </Pressable>
              </View>
              <ScrollView contentContainerStyle={styles.infoModalContent}>
                <Text
                  style={[
                    styles.levelInfoBody,
                    {
                      color: theme.colors.textSecondary,
                      fontFamily: theme.typography.family.medium
                    }
                  ]}
                >
                  {t("profile.levelInfoBody")}
                </Text>

                <View
                  style={[
                    styles.infoSection,
                    { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }
                  ]}
                >
                  <Text
                    style={[
                      styles.infoSectionTitle,
                      { color: theme.colors.text, fontFamily: theme.typography.family.bold }
                    ]}
                  >
                    {t("profile.levelsTitle")}
                  </Text>
                  {(["level1", "level2", "level3", "level4", "level5"] as const).map((levelId) => (
                    <View key={levelId} style={styles.infoRow}>
                      <Image source={LEVEL_ICON_MAP[levelId]} style={styles.infoIconLarge} />
                      <View style={styles.infoTextWrap}>
                        <Text
                          style={[
                            styles.infoRowTitle,
                            { color: theme.colors.text, fontFamily: theme.typography.family.bold }
                          ]}
                        >
                          {t(`profile.levelRanks.${levelId}`)}
                        </Text>
                        <Text
                          style={[
                            styles.infoRowBody,
                            {
                              color: theme.colors.textSecondary,
                              fontFamily: theme.typography.family.medium
                            }
                          ]}
                        >
                          {t(`profile.levelDescriptions.${levelId}`)}
                        </Text>
                      </View>
                    </View>
                  ))}
                </View>

                <View
                  style={[
                    styles.infoSection,
                    { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }
                  ]}
                >
                  <Text
                    style={[
                      styles.infoSectionTitle,
                      { color: theme.colors.text, fontFamily: theme.typography.family.bold }
                    ]}
                  >
                    {t("profile.badgesTitle")}
                  </Text>
                  {badges.map((badge) => (
                    <View key={badge.id} style={styles.infoRow}>
                      <Image source={BADGE_ICON_MAP[badge.id]} style={styles.infoIconLarge} />
                      <View style={styles.infoTextWrap}>
                        <Text
                          style={[
                            styles.infoRowTitle,
                            { color: theme.colors.text, fontFamily: theme.typography.family.bold }
                          ]}
                        >
                          {t(badge.key)}
                        </Text>
                        <Text
                          style={[
                            styles.infoRowBody,
                            {
                              color: theme.colors.textSecondary,
                              fontFamily: theme.typography.family.medium
                            }
                          ]}
                        >
                          {t(badge.descriptionKey)}
                        </Text>
                      </View>
                    </View>
                  ))}
                </View>
              </ScrollView>
            </SafeAreaView>
          </Modal>
        ) : null}

        <View
          style={[
            styles.badgesCard,
            {
              backgroundColor: theme.colors.surface,
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
            {t("profile.badgesTitle")}
          </Text>
          <View style={styles.badgesGrid}>
            {badges.length ? (
              badges.map((badge) => (
                <View
                  key={badge.id}
                  style={[
                    styles.badgeTile,
                    {
                      backgroundColor: theme.colors.surfaceAlt,
                      opacity: badge.unlocked ? 1 : 0.5
                    }
                  ]}
                >
                  <Image source={BADGE_ICON_MAP[badge.id]} style={styles.badgeIconLarge} />
                  <View style={styles.badgeContent}>
                    <View style={styles.badgeTopRow}>
                      <Ionicons
                        color={badge.unlocked ? theme.colors.primary : theme.colors.textTertiary}
                        name={badge.unlocked ? "ribbon" : "lock-closed-outline"}
                        size={18}
                      />
                      <Text
                        style={[
                          styles.badgeState,
                          {
                            color: badge.unlocked
                              ? theme.colors.primary
                              : theme.colors.textTertiary,
                            fontFamily: theme.typography.family.bold
                          }
                        ]}
                      >
                        {badge.unlocked ? t("profile.badgeUnlocked") : t("profile.badgeLocked")}
                      </Text>
                    </View>
                    <Text
                      style={[
                        styles.badgeTitle,
                        {
                          color: theme.colors.text,
                          fontFamily: theme.typography.family.bold
                        }
                      ]}
                    >
                      {t(badge.key)}
                    </Text>
                    <Text
                      style={[
                        styles.badgeDescription,
                        {
                          color: theme.colors.textSecondary,
                          fontFamily: theme.typography.family.medium
                        }
                      ]}
                    >
                      {t(badge.descriptionKey)}
                    </Text>
                  </View>
                </View>
              ))
            ) : (
              <Text
                style={[
                  styles.badgeDescription,
                  {
                    color: theme.colors.textSecondary,
                    fontFamily: theme.typography.family.medium
                  }
                ]}
              >
                {t("profile.noBadges")}
              </Text>
            )}
          </View>
        </View>
        <Pressable
          onPress={() => setShowLevelInfo(true)}
          style={styles.levelInfoToggle}
        >
          <Text
            style={[
              styles.levelInfoCta,
              {
                color: theme.colors.textSecondary,
                fontFamily: theme.typography.family.bold
              }
            ]}
          >
            {t("profile.levelInfoCta")}
          </Text>
        </Pressable>
      </ScrollView>

      <AvatarPickerModal
        currentAvatarPreset={profile.avatarPreset}
        currentAvatarUri={profile.avatarUri}
        onClose={() => setAvatarModalVisible(false)}
        onSelectPhoto={(uri) => {
          void updateProfileAvatar({ avatarPreset: null, avatarUri: uri });
        }}
        onSelectPreset={(avatarPreset) => {
          void updateProfileAvatar({ avatarPreset, avatarUri: null });
        }}
        visible={avatarModalVisible}
      />

      <AppMenuOverlay
        activeItem="Profile"
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
  heroCard: {
    alignItems: "center",
    borderRadius: 26,
    borderWidth: 1,
    paddingHorizontal: 20,
    paddingVertical: 22
  },
  avatarTap: {
    marginBottom: 18
  },
  greeting: {
    fontSize: 26,
    marginBottom: 2
  },
  configureButton: {
    alignItems: "center",
    borderRadius: 22,
    flexDirection: "row",
    gap: 8,
    minHeight: 40,
    justifyContent: "center",
    paddingHorizontal: 20
  },
  configureLabel: {
    fontSize: 14
  },
  levelInlineRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 6,
    marginBottom: 16,
    marginTop: 2
  },
  levelIcon: {
    borderRadius: 8,
    height: 26,
    width: 26
  },
  levelRankLabel: {
    fontSize: 14
  },
  levelInlineDot: {
    borderRadius: 999,
    height: 4,
    width: 4
  },
  levelValueLabel: {
    fontSize: 13
  },
  statsGrid: {
    borderTopWidth: 1,
    flexDirection: "row",
    gap: 8,
    justifyContent: "space-between",
    marginTop: 18,
    paddingTop: 16,
    width: "100%"
  },
  statTile: {
    alignItems: "center",
    borderRadius: 14,
    minHeight: 78,
    paddingHorizontal: 6,
    paddingVertical: 9,
    width: "23.5%"
  },
  statAccent: {
    borderRadius: 999,
    height: 8,
    marginBottom: 10,
    width: 8
  },
  statValue: {
    fontSize: 16,
    marginBottom: 3
  },
  statLabel: {
    fontSize: 10,
    textAlign: "center"
  },
  highlightBody: {
    fontSize: 14,
    lineHeight: 22,
    marginTop: 20
  },
  levelInfoToggle: {
    alignItems: "center",
    marginTop: 6
  },
  levelInfoCta: {
    fontSize: 13
  },
  levelInfoBody: {
    fontSize: 13,
    lineHeight: 20,
    textAlign: "center"
  },
  badgesCard: {
    borderRadius: 24,
    borderWidth: 1,
    padding: 18
  },
  sectionTitle: {
    fontSize: 20,
    marginBottom: 14
  },
  badgesGrid: {
    gap: 12
  },
  badgeTile: {
    borderRadius: 20,
    flexDirection: "row",
    gap: 14,
    padding: 14
  },
  badgeTopRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
    marginBottom: 8
  },
  badgeIconLarge: {
    borderRadius: 16,
    height: 72,
    width: 72
  },
  badgeContent: {
    flex: 1,
    justifyContent: "center"
  },
  badgeState: {
    fontSize: 11,
    textTransform: "uppercase"
  },
  badgeTitle: {
    fontSize: 15,
    marginBottom: 4
  },
  badgeDescription: {
    fontSize: 13,
    lineHeight: 20
  },
  infoModalRoot: {
    flex: 1
  },
  infoModalHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 18
  },
  infoModalTitle: {
    fontSize: 20
  },
  infoModalContent: {
    gap: 18,
    paddingBottom: 42,
    paddingHorizontal: 20
  },
  infoSection: {
    borderRadius: 24,
    borderWidth: 1,
    gap: 14,
    padding: 18
  },
  infoSectionTitle: {
    fontSize: 18
  },
  infoRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 14
  },
  infoIconLarge: {
    borderRadius: 16,
    height: 68,
    width: 68
  },
  infoTextWrap: {
    flex: 1,
    gap: 4
  },
  infoRowTitle: {
    fontSize: 15
  },
  infoRowBody: {
    fontSize: 13,
    lineHeight: 20
  }
});
