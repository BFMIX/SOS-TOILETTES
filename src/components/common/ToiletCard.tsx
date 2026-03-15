import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

import { FavoriteButton } from "@/components/common/FavoriteButton";
import { Chip } from "@/components/common/Chip";
import { CommunityStatus } from "@/types/models";
import { formatDistance } from "@/utils/distance";
import { useAppTheme } from "@/theme/ThemeProvider";
import { useTranslation } from "react-i18next";

const genericImage = require("../../../assets/images/Toilette_generic.png");

interface ToiletCardProps {
  title: string;
  subtitle: string;
  distanceMeters?: number;
  walkingMinutes?: number;
  status: CommunityStatus;
  favorite: boolean;
  onPress: () => void;
  onToggleFavorite: () => void;
  onDirections?: () => void;
}

export const ToiletCard = ({
  title,
  subtitle,
  distanceMeters,
  walkingMinutes,
  status,
  favorite,
  onPress,
  onToggleFavorite,
  onDirections
}: ToiletCardProps) => {
  const theme = useAppTheme();
  const { t } = useTranslation();

  const statusColor =
    status === "operational"
      ? theme.colors.success
      : status === "out_of_service"
        ? theme.colors.danger
        : theme.colors.warning;

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.card,
        theme.shadow.card,
        {
          backgroundColor: theme.colors.mapCard,
          borderColor: theme.colors.border
        }
      ]}
    >
      <Image source={genericImage} style={styles.image} />
      <View
        style={[
          styles.separator,
          { backgroundColor: theme.colors.border }
        ]}
      />
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.titleWrap}>
            <View style={styles.titleRow}>
              <Text
                numberOfLines={1}
                style={[
                  styles.title,
                  { color: theme.colors.text, fontFamily: theme.typography.family.bold }
                ]}
              >
                {title}
              </Text>
              <View style={styles.statusRow}>
                <View
                  style={[
                    styles.statusDot,
                    {
                      backgroundColor: statusColor
                    }
                  ]}
                />
                <Text
                  style={[
                    styles.statusText,
                    {
                      color: theme.colors.textSecondary,
                      fontFamily: theme.typography.family.bold
                    }
                  ]}
                >
                  {t(`common.statuses.${status}`)}
                </Text>
              </View>
            </View>
            <View style={styles.subtitleRow}>
              <Ionicons
                color={theme.colors.textTertiary}
                name="location-outline"
                size={14}
              />
              <Text
                numberOfLines={1}
                style={[
                  styles.subtitle,
                  {
                    color: theme.colors.textSecondary,
                    fontFamily: theme.typography.family.medium
                  }
                ]}
              >
                {subtitle}
              </Text>
            </View>
          </View>
          <FavoriteButton active={favorite} compact onPress={onToggleFavorite} />
        </View>

        <View style={styles.footer}>
          <View style={styles.metaWrap}>
            {distanceMeters ? (
              <View style={styles.metaRow}>
                <Ionicons
                  color={theme.colors.textTertiary}
                  name="location-outline"
                  size={14}
                />
                <Text
                  style={[
                    styles.metaText,
                    {
                      color: theme.colors.textSecondary,
                      fontFamily: theme.typography.family.medium
                    }
                  ]}
                >
                  {formatDistance(distanceMeters)}
                </Text>
                {walkingMinutes ? (
                  <>
                    <Ionicons
                      color={theme.colors.textTertiary}
                      name="walk-outline"
                      size={14}
                    />
                    <Text
                      style={[
                        styles.metaText,
                        {
                          color: theme.colors.textSecondary,
                          fontFamily: theme.typography.family.medium
                        }
                      ]}
                    >
                      {walkingMinutes} min
                    </Text>
                  </>
                ) : null}
              </View>
            ) : null}
          </View>
          <View style={styles.actionWrap}>
            {onDirections ? (
              <Chip
                compact
                icon={
                  <Ionicons color={theme.colors.primary} name="navigate-outline" size={14} />
                }
                label={t("common.directions")}
                onPress={onDirections}
                selected
              />
            ) : null}
          </View>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 22,
    borderWidth: 1,
    flexDirection: "row",
    gap: 12,
    minHeight: 112,
    overflow: "hidden",
    padding: 11
  },
  image: {
    borderRadius: 18,
    height: 88,
    width: 82
  },
  separator: {
    alignSelf: "stretch",
    borderRadius: 999,
    marginVertical: 6,
    width: 1
  },
  content: {
    flex: 1,
    justifyContent: "space-between"
  },
  header: {
    flexDirection: "row",
    gap: 12,
    justifyContent: "space-between"
  },
  titleWrap: {
    flex: 1,
    gap: 4,
    justifyContent: "center"
  },
  titleRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 8
  },
  title: {
    flex: 1,
    fontSize: 15
  },
  subtitle: {
    fontSize: 12
  },
  subtitleRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 6
  },
  statusRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
    maxWidth: "45%"
  },
  footer: {
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
    minHeight: 28
  },
  metaWrap: {
    flexBasis: "70%",
    flexGrow: 0,
    flexShrink: 1,
    maxWidth: "70%"
  },
  actionWrap: {
    alignItems: "flex-end",
    flexBasis: "30%",
    flexGrow: 0,
    flexShrink: 0,
    minWidth: 88
  },
  metaRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 6
  },
  metaText: {
    fontSize: 12
  },
  statusText: {
    fontSize: 11
  },
  statusDot: {
    borderRadius: 4,
    height: 8,
    width: 8
  }
});
