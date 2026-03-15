import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";

import { CommunityReview } from "@/types/models";
import { formatRelativeMinutes } from "@/utils/date";
import { useAppTheme } from "@/theme/ThemeProvider";

interface CommunityReviewCardProps {
  review: CommunityReview;
}

export const CommunityReviewCard = ({ review }: CommunityReviewCardProps) => {
  const theme = useAppTheme();
  const { i18n } = useTranslation();

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor:
            theme.mode === "dark" ? theme.colors.surfaceAlt : theme.colors.backgroundMuted,
          borderColor: theme.colors.border
        }
      ]}
    >
      <View style={styles.header}>
        <Text
          style={[
            styles.name,
            { color: theme.colors.text, fontFamily: theme.typography.family.bold }
          ]}
        >
          {review.pseudo}
        </Text>
        <Text
          style={[
            styles.date,
            {
              color: theme.colors.textTertiary,
              fontFamily: theme.typography.family.medium
            }
          ]}
        >
          {formatRelativeMinutes(review.createdAt, i18n.language)}
        </Text>
      </View>
      <Text
        style={[
          styles.body,
          {
            color: theme.colors.textSecondary,
            fontFamily: theme.typography.family.medium
          }
        ]}
      >
        “{review.comment}”
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    borderWidth: 1,
    gap: 6,
    padding: 13
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  name: {
    fontSize: 14
  },
  date: {
    fontSize: 11
  },
  body: {
    fontSize: 14,
    lineHeight: 22
  }
});
