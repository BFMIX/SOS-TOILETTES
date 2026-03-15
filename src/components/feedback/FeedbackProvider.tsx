import { Ionicons } from "@expo/vector-icons";
import React, { PropsWithChildren, createContext, useContext, useMemo, useRef, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated from "react-native-reanimated";

import { motionEntering, motionExiting, motionLayout } from "@/motion/presets";
import { triggerHaptic } from "@/services/haptics";
import { useAppTheme } from "@/theme/ThemeProvider";

type FeedbackTone = "success" | "warning" | "error" | "info";

interface FeedbackOptions {
  description?: string;
  durationMs?: number;
  title: string;
  tone?: FeedbackTone;
}

interface FeedbackContextValue {
  show: (options: FeedbackOptions) => void;
}

interface FeedbackMessage extends FeedbackOptions {
  id: number;
  tone: FeedbackTone;
}

const FeedbackContext = createContext<FeedbackContextValue | null>(null);

const TONE_ICON: Record<FeedbackTone, keyof typeof Ionicons.glyphMap> = {
  success: "checkmark-circle",
  warning: "alert-circle",
  error: "close-circle",
  info: "information-circle"
};

export const FeedbackProvider = ({ children }: PropsWithChildren) => {
  const theme = useAppTheme();
  const [message, setMessage] = useState<FeedbackMessage | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearMessage = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setMessage(null);
  };

  const value = useMemo<FeedbackContextValue>(
    () => ({
      show: async ({ durationMs = 2600, tone = "info", ...options }) => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }

        setMessage({
          id: Date.now(),
          tone,
          ...options
        });

        await triggerHaptic(
          tone === "success"
            ? "success"
            : tone === "warning"
              ? "warning"
              : tone === "error"
                ? "error"
                : "selection"
        );

        timeoutRef.current = setTimeout(() => {
          setMessage(null);
          timeoutRef.current = null;
        }, durationMs);
      }
    }),
    []
  );

  const toneColor =
    message?.tone === "success"
      ? theme.colors.success
      : message?.tone === "warning"
        ? theme.colors.warning
        : message?.tone === "error"
          ? theme.colors.danger
          : theme.colors.primary;

  return (
    <FeedbackContext.Provider value={value}>
      {children}
      {message ? (
        <View pointerEvents="box-none" style={styles.portal}>
          <Animated.View
            entering={motionEntering.toast}
            exiting={motionExiting.toast}
            layout={motionLayout.standard}
            style={[
              styles.toast,
              theme.shadow.soft,
              {
                backgroundColor: theme.colors.overlaySurface,
                borderColor: theme.colors.border
              }
            ]}
          >
            <View style={[styles.toastAccent, { backgroundColor: toneColor }]} />
            <Ionicons color={toneColor} name={TONE_ICON[message.tone]} size={20} />
            <View style={styles.toastContent}>
              <Text
                style={[
                  styles.toastTitle,
                  { color: theme.colors.text, fontFamily: theme.typography.family.bold }
                ]}
              >
                {message.title}
              </Text>
              {message.description ? (
                <Text
                  style={[
                    styles.toastDescription,
                    {
                      color: theme.colors.textSecondary,
                      fontFamily: theme.typography.family.medium
                    }
                  ]}
                >
                  {message.description}
                </Text>
              ) : null}
            </View>
            <Pressable hitSlop={8} onPress={clearMessage}>
              <Ionicons color={theme.colors.textTertiary} name="close" size={18} />
            </Pressable>
          </Animated.View>
        </View>
      ) : null}
    </FeedbackContext.Provider>
  );
};

export const useFeedback = () => {
  const context = useContext(FeedbackContext);

  if (!context) {
    throw new Error("useFeedback must be used within FeedbackProvider");
  }

  return context;
};

const styles = StyleSheet.create({
  portal: {
    bottom: 18,
    left: 16,
    pointerEvents: "box-none",
    position: "absolute",
    right: 16
  },
  toast: {
    alignItems: "center",
    borderRadius: 22,
    borderWidth: 1,
    flexDirection: "row",
    gap: 12,
    minHeight: 64,
    overflow: "hidden",
    paddingHorizontal: 14,
    paddingVertical: 12
  },
  toastAccent: {
    alignSelf: "stretch",
    borderRadius: 999,
    width: 4
  },
  toastContent: {
    flex: 1,
    gap: 2
  },
  toastTitle: {
    fontSize: 14
  },
  toastDescription: {
    fontSize: 12,
    lineHeight: 18
  }
});
