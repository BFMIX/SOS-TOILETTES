import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Image, StyleSheet, View } from "react-native";

import { getAvatarPreset } from "@/config/avatarPresets";
import { useAppTheme } from "@/theme/ThemeProvider";

interface ProfileAvatarProps {
  avatarPreset?: string | null;
  avatarUri?: string | null;
  name?: string;
  size?: number;
}

export const ProfileAvatar = ({
  avatarPreset,
  avatarUri,
  size = 92
}: ProfileAvatarProps) => {
  const theme = useAppTheme();
  const preset = getAvatarPreset(avatarPreset);
  const imageSize = Math.max(size - Math.round(size * 0.2), size * 0.76);
  const gradientColors: readonly [string, string] =
    avatarUri || !preset
      ? theme.mode === "dark"
        ? ["#F0D7C9", "#FFF1E6"]
        : ["#D2DCE8", "#F1F5FA"]
      : theme.mode === "dark"
        ? preset.backgroundDark
        : preset.backgroundLight;

  if (avatarUri) {
    return (
      <View
        style={[
          styles.frame,
          {
            borderColor: theme.colors.border,
            borderRadius: size / 2,
            height: size,
            width: size
          }
        ]}
      >
        <LinearGradient
          colors={gradientColors}
          end={{ x: 1, y: 1 }}
          start={{ x: 0, y: 0 }}
          style={[StyleSheet.absoluteFillObject, { borderRadius: size / 2 }]}
        />
        <Image
          source={{ uri: avatarUri }}
          style={[
            styles.image,
            {
              borderColor: theme.colors.border,
              borderRadius: imageSize / 2,
              height: imageSize,
              width: imageSize
            }
          ]}
        />
      </View>
    );
  }

  return (
    <View
      style={[
        styles.frame,
        {
          borderColor: theme.colors.border,
          borderRadius: size / 2,
          height: size,
          width: size
        }
      ]}
    >
      <LinearGradient
        colors={gradientColors}
        end={{ x: 1, y: 1 }}
        start={{ x: 0, y: 0 }}
        style={[StyleSheet.absoluteFillObject, { borderRadius: size / 2 }]}
      />
      <Image
        source={preset.source}
        style={[
          styles.image,
          {
            borderColor: theme.colors.border,
            borderRadius: imageSize / 2,
            height: imageSize,
            width: imageSize
          }
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  frame: {
    alignItems: "center",
    borderWidth: 1,
    justifyContent: "center",
    overflow: "hidden"
  },
  image: {
    borderWidth: 1
  }
});
