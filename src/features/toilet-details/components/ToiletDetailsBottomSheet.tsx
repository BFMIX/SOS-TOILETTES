import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetScrollView,
  BottomSheetTextInput
} from "@gorhom/bottom-sheet";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Alert,
  Image,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View
} from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { useTranslation } from "react-i18next";

import { useFeedback } from "@/components/feedback/FeedbackProvider";
import { FavoriteButton } from "@/components/common/FavoriteButton";
import { PrimaryButton } from "@/components/common/PrimaryButton";
import { CommunityReviewCard } from "@/features/toilet-details/components/CommunityReviewCard";
import { communityRepository } from "@/repositories/community/communityRepository";
import { useAppTheme } from "@/theme/ThemeProvider";
import { CommunityStatus, ReportType, ToiletPoint } from "@/types/models";

const genericImage = require("../../../../assets/images/Toilette_generic.png");

interface ToiletDetailsBottomSheetProps {
  visible: boolean;
  toilet: ToiletPoint | null;
  status: CommunityStatus;
  favorite: boolean;
  onClose: () => void;
  onToggleFavorite: () => void;
  onDirectionsPress: () => Promise<void>;
  onSubmitReview: (comment: string) => Promise<boolean>;
  onSubmitReport: (type: ReportType) => Promise<boolean>;
}

export const ToiletDetailsBottomSheet = ({
  visible,
  toilet,
  status,
  favorite,
  onClose,
  onToggleFavorite,
  onDirectionsPress,
  onSubmitReview,
  onSubmitReport
}: ToiletDetailsBottomSheetProps) => {
  const theme = useAppTheme();
  const { t } = useTranslation();
  const feedback = useFeedback();
  const modalRef = useRef<BottomSheetModal | null>(null);
  const [reviews, setReviews] = useState<
    Awaited<ReturnType<typeof communityRepository.getReviews>>
  >([]);
  const [comment, setComment] = useState("");
  const snapPoints = useMemo(() => ["34%", "84%"], []);
  const trimmedComment = comment.trim();

  useEffect(() => {
    if (visible && toilet) {
      modalRef.current?.present();
      void communityRepository.getReviews(toilet.id).then(setReviews);
      return;
    }

    modalRef.current?.dismiss();
  }, [toilet, visible]);

  useEffect(() => {
    if (!visible) {
      setComment("");
    }
  }, [visible]);

  if (!toilet) {
    return null;
  }

  const statusColor =
    status === "operational"
      ? theme.colors.success
      : status === "out_of_service"
        ? theme.colors.danger
        : theme.colors.warning;

  const detailStats = [
    {
      icon: "business-outline" as const,
      label: t("toiletDetails.type"),
      value: toilet.typeLabel
    },
    {
      icon: "cash-outline" as const,
      label: t("toiletDetails.access"),
      value: toilet.equipment.isFree ? t("common.equipments.free") : t("common.unknown")
    },
    {
      icon: "time-outline" as const,
      label: t("toiletDetails.hours"),
      value: toilet.openingHours || t("common.unknown")
    },
    {
      icon: "accessibility-outline" as const,
      label: "PMR",
      value: toilet.equipment.isAccessible
        ? t("common.equipments.accessible")
        : t("common.unknown")
    }
  ];

  const amenities = [
    toilet.equipment.hasBabyChange
      ? {
          icon: "happy-outline" as const,
          title: t("common.equipments.babyChange"),
          body: t("filters.descriptions.babyChange")
        }
      : null,
    {
      icon: "water-outline" as const,
      title: t("toiletDetails.basicAmenitiesTitle"),
      body: t("toiletDetails.basicAmenitiesBody")
    }
  ].filter(Boolean) as { icon: keyof typeof Ionicons.glyphMap; title: string; body: string }[];

  const refreshReviews = async () => {
    const nextReviews = await communityRepository.getReviews(toilet.id);
    setReviews(nextReviews);
  };

  const handleSubmitReview = async () => {
    if (!trimmedComment) {
      feedback.show({
        title: t("toiletDetails.submitReview"),
        description: t("toiletDetails.submitReviewEmpty"),
        tone: "warning"
      });
      return;
    }

    const success = await onSubmitReview(trimmedComment);
    if (!success) {
      feedback.show({
        title: t("toiletDetails.submitReview"),
        description: t("toiletDetails.submitReviewError"),
        tone: "error"
      });
      return;
    }

    setComment("");
    await refreshReviews();
    feedback.show({
      title: t("toiletDetails.submitReview"),
      description: t("toiletDetails.submitReviewSuccess"),
      tone: "success"
    });
  };

  const submitReportAndNotify = async (type: ReportType) => {
    const success = await onSubmitReport(type);
    feedback.show({
      title: t("toiletDetails.reportTitle"),
      description: success ? t("toiletDetails.reportSubmitted") : t("toiletDetails.reportCooldown"),
      tone: success ? "success" : "warning"
    });
  };

  const handleReportPress = () => {
    Alert.alert(t("toiletDetails.reportTitle"), "", [
      {
        text: t("common.cancel"),
        style: "cancel"
      },
      {
        text: t("toiletDetails.reportDirty"),
        onPress: () => {
          void submitReportAndNotify("dirty");
        }
      },
      {
        text: t("toiletDetails.reportOutOfService"),
        onPress: () => {
          void submitReportAndNotify("out_of_service");
        }
      }
    ]);
  };

  return (
    <BottomSheetModal
      backdropComponent={(props) => (
        <BottomSheetBackdrop
          {...props}
          appearsOnIndex={0}
          disappearsOnIndex={-1}
          opacity={0.45}
          pressBehavior="close"
        />
      )}
      backgroundStyle={{
        backgroundColor: theme.colors.overlaySurface,
        borderColor: theme.colors.border,
        borderWidth: 1
      }}
      enableDynamicSizing={false}
      enablePanDownToClose
      handleIndicatorStyle={{ backgroundColor: theme.colors.textTertiary, width: 54 }}
      index={1}
      onDismiss={onClose}
      ref={modalRef}
      snapPoints={snapPoints}
    >
      <BottomSheetScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
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
            <Ionicons color={theme.colors.text} name="arrow-back" size={20} />
          </Pressable>

          <Text
            style={[
              styles.headerTitle,
              { color: theme.colors.textSecondary, fontFamily: theme.typography.family.bold }
            ]}
          >
            {t("toiletDetails.headerTitle")}
          </Text>

          <FavoriteButton active={favorite} onPress={onToggleFavorite} />
        </View>

        <View style={styles.imageWrap}>
          <Image source={genericImage} style={styles.image} />
        </View>

        <Text
          style={[
            styles.title,
            { color: theme.colors.text, fontFamily: theme.typography.family.bold }
          ]}
        >
          {toilet.name}
        </Text>

        <View style={styles.statusLine}>
          <View style={[styles.statusBadge, { backgroundColor: `${statusColor}1f` }]}>
            <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
            <Text
              style={[
                styles.statusText,
                { color: statusColor, fontFamily: theme.typography.family.bold }
              ]}
            >
              {t(`common.statuses.${status}`)}
            </Text>
          </View>
          <Text
            numberOfLines={1}
            style={[
              styles.locationText,
              { color: theme.colors.textSecondary, fontFamily: theme.typography.family.medium }
            ]}
          >
            {toilet.district || toilet.city}
          </Text>
        </View>

        <View style={[styles.sectionDivider, { backgroundColor: theme.colors.border }]} />

        <View style={styles.statsRow}>
          {detailStats.map((item) => (
            <View key={item.label} style={styles.statItem}>
              <View
                style={[
                  styles.statIconWrap,
                  { backgroundColor: theme.colors.surfaceAlt, borderColor: theme.colors.border }
                ]}
              >
                <Ionicons color={theme.colors.primary} name={item.icon} size={18} />
              </View>
              <Text
                style={[
                  styles.statLabel,
                  { color: theme.colors.textSecondary, fontFamily: theme.typography.family.medium }
                ]}
              >
                {item.label}
              </Text>
              <Text
                numberOfLines={2}
                style={[
                  styles.statValue,
                  { color: theme.colors.text, fontFamily: theme.typography.family.bold }
                ]}
              >
                {item.value}
              </Text>
            </View>
          ))}
        </View>

        <View style={[styles.sectionDivider, { backgroundColor: theme.colors.border }]} />

        <View style={styles.section}>
          <Text
            style={[
              styles.sectionTitle,
              { color: theme.colors.text, fontFamily: theme.typography.family.bold }
            ]}
          >
            {t("toiletDetails.amenitiesTitle")}
          </Text>
          <View style={styles.amenitiesList}>
            {amenities.map((item) => (
              <View key={item.title} style={styles.amenityRow}>
                <View
                  style={[
                    styles.amenityIconWrap,
                    { backgroundColor: theme.colors.surfaceAlt }
                  ]}
                >
                  <Ionicons color={theme.colors.primary} name={item.icon} size={18} />
                </View>
                <View style={styles.amenityTextWrap}>
                  <Text
                    style={[
                      styles.amenityTitle,
                      { color: theme.colors.text, fontFamily: theme.typography.family.bold }
                    ]}
                  >
                    {item.title}
                  </Text>
                  <Text
                    style={[
                      styles.amenityBody,
                      {
                        color: theme.colors.textSecondary,
                        fontFamily: theme.typography.family.medium
                      }
                    ]}
                  >
                    {item.body}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text
            style={[
              styles.sectionTitle,
              { color: theme.colors.text, fontFamily: theme.typography.family.bold }
            ]}
          >
            {t("toiletDetails.locationTitle")}
          </Text>
          <View
            style={[
              styles.locationMapWrap,
              { borderColor: theme.colors.border }
            ]}
          >
            <MapView
              liteMode={Platform.OS === "android"}
              pointerEvents="none"
              provider={Platform.OS === "android" ? PROVIDER_GOOGLE : undefined}
              region={{
                latitude: toilet.coordinates.latitude,
                longitude: toilet.coordinates.longitude,
                latitudeDelta: 0.008,
                longitudeDelta: 0.008
              }}
              scrollEnabled={false}
              style={StyleSheet.absoluteFillObject}
              userInterfaceStyle={theme.mode === "dark" ? "dark" : "light"}
              zoomEnabled={false}
            >
              <Marker coordinate={toilet.coordinates} tracksViewChanges={false} />
            </MapView>
          </View>
        </View>

        <View style={styles.actions}>
          <Pressable
            onPress={handleReportPress}
            style={[
              styles.reportButton,
              {
                backgroundColor: theme.colors.surfaceAlt,
                borderColor: theme.colors.danger
              }
            ]}
          >
            <Ionicons color={theme.colors.danger} name="alert-circle-outline" size={18} />
            <Text
              style={[
                styles.reportButtonLabel,
                { color: theme.colors.danger, fontFamily: theme.typography.family.bold }
              ]}
            >
              {t("toiletDetails.reportTitle")}
            </Text>
          </Pressable>

          <PrimaryButton
            icon="navigate-outline"
            label={t("toiletDetails.directionsCta")}
            onPress={() => {
              void onDirectionsPress();
            }}
            style={styles.primaryAction}
          />
        </View>

        <View style={[styles.sectionDivider, { backgroundColor: theme.colors.border }]} />

        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text
              style={[
                styles.sectionTitle,
                { color: theme.colors.text, fontFamily: theme.typography.family.bold }
              ]}
            >
              {t("toiletDetails.reviewsTitle")}
            </Text>
            <Text
              style={[
                styles.sectionMeta,
                {
                  color: theme.colors.textSecondary,
                  fontFamily: theme.typography.family.medium
                }
              ]}
            >
              {reviews.length} {t("common.comments").toLowerCase()}
            </Text>
          </View>

          <View
            style={[
              styles.commentComposer,
              {
                backgroundColor: theme.colors.surfaceAlt,
                borderColor: theme.colors.border
              }
            ]}
          >
            <BottomSheetTextInput
              onChangeText={setComment}
              placeholder={t("toiletDetails.reviewPlaceholder")}
              placeholderTextColor={theme.colors.textTertiary}
              style={[
                styles.commentInput,
                {
                  color: theme.colors.text,
                  fontFamily: theme.typography.family.medium
                }
              ]}
              value={comment}
            />
            <Pressable
              disabled={!trimmedComment}
              onPress={() => {
                void handleSubmitReview();
              }}
              style={[
                styles.commentSendButton,
                {
                  backgroundColor: trimmedComment
                    ? theme.colors.primary
                    : theme.colors.surface,
                  borderColor: theme.colors.border
                }
              ]}
            >
              <Ionicons
                color={trimmedComment ? "#ffffff" : theme.colors.textTertiary}
                name="arrow-up"
                size={18}
              />
            </Pressable>
          </View>

          <View style={styles.reviewsList}>
            {reviews.length ? (
              reviews.map((review) => (
                <CommunityReviewCard key={review.id} review={review} />
              ))
            ) : (
              <Text
                style={[
                  styles.emptyText,
                  {
                    color: theme.colors.textSecondary,
                    fontFamily: theme.typography.family.medium
                  }
                ]}
              >
                {t("toiletDetails.noReviews")}
              </Text>
            )}
          </View>
        </View>
      </BottomSheetScrollView>
    </BottomSheetModal>
  );
};

const styles = StyleSheet.create({
  content: {
    paddingBottom: 34,
    paddingHorizontal: 22,
    paddingTop: 8
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 14
  },
  headerTitle: {
    fontSize: 16,
    letterSpacing: 0.8,
    textTransform: "uppercase"
  },
  headerButton: {
    alignItems: "center",
    borderRadius: 18,
    borderWidth: 1,
    height: 40,
    justifyContent: "center",
    width: 40
  },
  imageWrap: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
    minHeight: 196
  },
  image: {
    height: 196,
    resizeMode: "contain",
    width: "100%"
  },
  title: {
    fontSize: 22,
    lineHeight: 30,
    marginBottom: 10
  },
  statusLine: {
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
    marginBottom: 18
  },
  statusBadge: {
    alignItems: "center",
    borderRadius: 999,
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 10,
    paddingVertical: 6
  },
  statusDot: {
    borderRadius: 4,
    height: 8,
    width: 8
  },
  statusText: {
    fontSize: 12
  },
  locationText: {
    flex: 1,
    fontSize: 14
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 22
  },
  statItem: {
    alignItems: "center",
    flex: 1,
    paddingHorizontal: 4
  },
  statIconWrap: {
    alignItems: "center",
    borderRadius: 16,
    borderWidth: 1,
    height: 42,
    justifyContent: "center",
    marginBottom: 8,
    width: 42
  },
  statLabel: {
    fontSize: 11,
    marginBottom: 4
  },
  statValue: {
    fontSize: 14,
    lineHeight: 18,
    textAlign: "center"
  },
  section: {
    marginBottom: 22
  },
  sectionDivider: {
    height: 1,
    marginBottom: 18,
    opacity: 0.8
  },
  sectionHeaderRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 2
  },
  sectionMeta: {
    fontSize: 14
  },
  amenitiesList: {
    gap: 16,
    marginTop: 10
  },
  amenityRow: {
    flexDirection: "row",
    gap: 12
  },
  amenityIconWrap: {
    alignItems: "center",
    borderRadius: 16,
    height: 42,
    justifyContent: "center",
    width: 42
  },
  amenityTextWrap: {
    flex: 1,
    justifyContent: "center"
  },
  amenityTitle: {
    fontSize: 16,
    marginBottom: 2
  },
  amenityBody: {
    fontSize: 13,
    lineHeight: 18
  },
  commentComposer: {
    alignItems: "center",
    borderRadius: 24,
    borderWidth: 1,
    flexDirection: "row",
    minHeight: 58,
    paddingHorizontal: 14
  },
  commentInput: {
    flex: 1,
    fontSize: 14,
    paddingVertical: 12
  },
  commentSendButton: {
    alignItems: "center",
    borderRadius: 16,
    borderWidth: 1,
    height: 36,
    justifyContent: "center",
    width: 36
  },
  reviewsList: {
    gap: 12,
    marginTop: 14
  },
  emptyText: {
    fontSize: 14,
    lineHeight: 20
  },
  locationMapWrap: {
    borderRadius: 28,
    borderWidth: 1,
    height: 180,
    overflow: "hidden"
  },
  actions: {
    flexDirection: "row",
    gap: 12
  },
  reportButton: {
    alignItems: "center",
    borderRadius: 24,
    borderWidth: 1,
    flex: 1,
    flexDirection: "row",
    gap: 10,
    justifyContent: "center",
    minHeight: 56,
    paddingHorizontal: 18
  },
  reportButtonLabel: {
    fontSize: 15
  },
  primaryAction: {
    flex: 1,
    marginTop: 0
  }
});
