import { BlurView } from "expo-blur";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View
} from "react-native";
import { useTranslation } from "react-i18next";

import { useFeedback } from "@/components/feedback/FeedbackProvider";
import { ProfileAvatar } from "@/components/common/ProfileAvatar";
import { PrimaryButton } from "@/components/common/PrimaryButton";
import { AVATAR_PRESETS, DEFAULT_AVATAR_PRESET_ID } from "@/config/avatarPresets";
import { useSessionStore } from "@/core/store/useSessionStore";
import { useAppTheme } from "@/theme/ThemeProvider";

export const OnboardingScreen = () => {
  const theme = useAppTheme();
  const { t } = useTranslation();
  const feedback = useFeedback();
  const completeOnboarding = useSessionStore((state) => state.completeOnboarding);
  const [firstName, setFirstName] = useState("");
  const [avatarPreset, setAvatarPreset] = useState(DEFAULT_AVATAR_PRESET_ID);
  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isDisabled = useMemo(() => firstName.trim().length < 2, [firstName]);

  const handleSubmit = async () => {
    if (isDisabled || isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    try {
      await completeOnboarding({
        pseudo: firstName,
        avatarPreset: avatarUri ? null : avatarPreset,
        avatarUri
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePickPhoto = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      feedback.show({
        title: t("common.permissionsTitle"),
        description: t("common.photoPermission"),
        tone: "warning"
      });
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1],
      mediaTypes: ["images"],
      quality: 0.7
    });

    if (!result.canceled) {
      setAvatarUri(result.assets[0]?.uri ?? null);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.container}
    >
      <Pressable
        onPress={Keyboard.dismiss}
        style={styles.backdrop}
      >
        <BlurView
          experimentalBlurMethod="dimezisBlurView"
          intensity={32}
          style={StyleSheet.absoluteFillObject}
          tint={theme.mode === "dark" ? "dark" : "light"}
        />
        <View
          style={[
            styles.backdropTint,
            {
              backgroundColor: theme.colors.overlayStrong
            }
          ]}
        />
      </Pressable>

      <View
        style={[
          styles.content,
          { paddingHorizontal: theme.spacing.xl, paddingVertical: theme.spacing.xxxl }
        ]}
      >
        <ScrollView
          style={[
            styles.card,
            {
              backgroundColor: theme.colors.surfaceStrong,
              borderColor: theme.colors.border,
              borderRadius: theme.radii.xl,
              padding: theme.spacing.xxl
            },
            theme.shadow.soft
          ]}
          contentContainerStyle={styles.cardContent}
          showsVerticalScrollIndicator={false}
        >
          <Text
            adjustsFontSizeToFit
            minimumFontScale={0.86}
            numberOfLines={1}
            style={[
              styles.title,
              { color: theme.colors.text, fontFamily: theme.typography.family.bold }
            ]}
          >
            {t("onboarding.title")}
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
            {t("onboarding.subtitle")}
          </Text>

          <Text
            style={[
              styles.label,
              { color: theme.colors.text, fontFamily: theme.typography.family.bold }
            ]}
          >
            {t("onboarding.inputLabel")}
          </Text>
          <TextInput
            autoCapitalize="words"
            autoCorrect={false}
            onChangeText={setFirstName}
            placeholder={t("onboarding.inputPlaceholder")}
            placeholderTextColor={theme.colors.textTertiary}
            style={[
              styles.input,
              {
                backgroundColor: theme.colors.surfaceAlt,
                borderColor: theme.colors.border,
                color: theme.colors.text,
                fontFamily: theme.typography.family.medium
              }
            ]}
            textContentType="givenName"
            value={firstName}
          />

          <Text
            style={[
              styles.label,
              { color: theme.colors.text, fontFamily: theme.typography.family.bold }
            ]}
          >
            {t("onboarding.avatarLabel")}
          </Text>

          <View style={styles.selectedAvatarWrap}>
            <ProfileAvatar
              avatarPreset={avatarUri ? null : avatarPreset}
              avatarUri={avatarUri}
              size={88}
            />
            <Pressable
              onPress={() => void handlePickPhoto()}
              style={[
                styles.photoButton,
                {
                  backgroundColor: theme.colors.surfaceAlt,
                  borderColor: theme.colors.border
                }
              ]}
            >
              <Ionicons color={theme.colors.text} name="image-outline" size={18} />
              <Text
                style={[
                  styles.photoButtonLabel,
                  { color: theme.colors.text, fontFamily: theme.typography.family.bold }
                ]}
              >
                {t("onboarding.addPhoto")}
              </Text>
            </Pressable>
          </View>

          <View style={styles.avatarGrid}>
            {AVATAR_PRESETS.map((preset) => {
              const selected = !avatarUri && avatarPreset === preset.id;

              return (
                <Pressable
                  key={preset.id}
                  onPress={() => {
                    setAvatarUri(null);
                    setAvatarPreset(preset.id);
                  }}
                  style={[
                    styles.avatarOption,
                    {
                      backgroundColor: selected
                        ? theme.colors.primaryMuted
                        : theme.colors.surfaceAlt,
                      borderColor: selected ? theme.colors.primary : theme.colors.border
                    }
                  ]}
                >
                  <ProfileAvatar avatarPreset={preset.id} size={64} />
                </Pressable>
              );
            })}
          </View>

          <PrimaryButton
            disabled={isDisabled}
            label={t("onboarding.cta")}
            loading={isSubmitting}
            onPress={handleSubmit}
            style={{ marginTop: theme.spacing.xl }}
          />
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center"
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject
  },
  backdropTint: {
    ...StyleSheet.absoluteFillObject
  },
  content: {
    flex: 1,
    justifyContent: "center"
  },
  card: {
    alignSelf: "center",
    borderWidth: 1,
    maxWidth: 420,
    width: "100%"
  },
  cardContent: {
    gap: 14
  },
  title: {
    fontSize: 24,
    lineHeight: 30,
    textAlign: "center"
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 24,
    marginBottom: 12,
    textAlign: "center"
  },
  label: {
    fontSize: 14
  },
  input: {
    borderRadius: 20,
    borderWidth: 1,
    fontSize: 16,
    minHeight: 52,
    paddingHorizontal: 18
  },
  selectedAvatarWrap: {
    alignItems: "center",
    gap: 14
  },
  photoButton: {
    alignItems: "center",
    borderRadius: 18,
    borderWidth: 1,
    flexDirection: "row",
    gap: 8,
    justifyContent: "center",
    minHeight: 44,
    paddingHorizontal: 16
  },
  photoButtonLabel: {
    fontSize: 14
  },
  avatarGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    justifyContent: "center"
  },
  avatarOption: {
    alignItems: "center",
    borderRadius: 18,
    borderWidth: 1,
    justifyContent: "center",
    padding: 8
  }
});
