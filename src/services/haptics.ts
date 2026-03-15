import * as Haptics from "expo-haptics";

export type HapticPreset =
  | "selection"
  | "impactLight"
  | "impactMedium"
  | "success"
  | "warning"
  | "error";

export const triggerHaptic = async (preset: HapticPreset) => {
  try {
    if (preset === "selection") {
      await Haptics.selectionAsync();
      return;
    }

    if (preset === "impactLight") {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      return;
    }

    if (preset === "impactMedium") {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      return;
    }

    await Haptics.notificationAsync(
      preset === "success"
        ? Haptics.NotificationFeedbackType.Success
        : preset === "warning"
          ? Haptics.NotificationFeedbackType.Warning
          : Haptics.NotificationFeedbackType.Error
    );
  } catch {
    // Native haptics are non-critical and should never block the UI.
  }
};
