import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import React from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View
} from "react-native";
import { useTranslation } from "react-i18next";

import { useFeedback } from "@/components/feedback/FeedbackProvider";
import { ProfileAvatar } from "@/components/common/ProfileAvatar";
import { AVATAR_PRESETS } from "@/config/avatarPresets";
import { useAppTheme } from "@/theme/ThemeProvider";

interface AvatarPickerModalProps {
  currentAvatarPreset?: string | null;
  currentAvatarUri?: string | null;
  onClose: () => void;
  onSelectPreset: (presetId: string) => void;
  onSelectPhoto: (uri: string) => void;
  visible: boolean;
}

export const AvatarPickerModal = ({
  currentAvatarPreset,
  currentAvatarUri,
  onClose,
  onSelectPhoto,
  onSelectPreset,
  visible
}: AvatarPickerModalProps) => {
  const theme = useAppTheme();
  const { t } = useTranslation();
  const feedback = useFeedback();

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
      onSelectPhoto(result.assets[0]?.uri ?? "");
      onClose();
    }
  };

  return (
    <Modal animationType="fade" onRequestClose={onClose} transparent visible={visible}>
      <View style={styles.root}>
        <Pressable
          onPress={onClose}
          style={[styles.scrim, { backgroundColor: theme.colors.overlay }]}
        />
        <View
          style={[
            styles.sheet,
            theme.shadow.soft,
            {
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border
            }
          ]}
        >
          <Text
            style={[
              styles.title,
              { color: theme.colors.text, fontFamily: theme.typography.family.bold }
            ]}
          >
            {t("profile.avatarPickerTitle")}
          </Text>
          <ScrollView
            contentContainerStyle={styles.grid}
            showsVerticalScrollIndicator={false}
          >
            {AVATAR_PRESETS.map((preset) => {
              const active = !currentAvatarUri && currentAvatarPreset === preset.id;

              return (
                <Pressable
                  key={preset.id}
                  onPress={() => {
                    onSelectPreset(preset.id);
                    onClose();
                  }}
                  style={[
                    styles.option,
                    {
                      backgroundColor: active
                        ? theme.colors.primaryMuted
                        : theme.colors.surfaceAlt
                    }
                  ]}
                >
                  <ProfileAvatar avatarPreset={preset.id} size={72} />
                  <Text
                    style={[
                      styles.optionLabel,
                      {
                        color: theme.colors.text,
                        fontFamily: theme.typography.family.bold
                      }
                    ]}
                  >
                    {preset.label}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>

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
            <View style={styles.photoButtonContent}>
              <Ionicons color={theme.colors.text} name="image-outline" size={18} />
              <Text
                style={[
                  styles.photoButtonLabel,
                  { color: theme.colors.text, fontFamily: theme.typography.family.bold }
                ]}
              >
                {t("profile.addPhoto")}
              </Text>
            </View>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: "flex-end"
  },
  scrim: {
    ...StyleSheet.absoluteFillObject
  },
  sheet: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderWidth: 1,
    padding: 20
  },
  title: {
    fontSize: 22,
    marginBottom: 16
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12
  },
  option: {
    alignItems: "center",
    borderRadius: 22,
    paddingHorizontal: 10,
    paddingVertical: 14,
    width: "31%"
  },
  optionLabel: {
    fontSize: 12,
    marginTop: 10
  },
  photoButton: {
    alignItems: "center",
    borderRadius: 22,
    borderWidth: 1,
    marginTop: 18,
    minHeight: 54,
    justifyContent: "center"
  },
  photoButtonContent: {
    alignItems: "center",
    flexDirection: "row",
    gap: 8
  },
  photoButtonLabel: {
    fontSize: 15
  }
});
