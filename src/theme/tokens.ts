export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  huge: 40
} as const;

export const radii = {
  sm: 12,
  md: 18,
  lg: 24,
  xl: 32,
  round: 999
} as const;

export const typography = {
  family: {
    regular: "PlusJakartaSans_400Regular",
    medium: "PlusJakartaSans_500Medium",
    semiBold: "PlusJakartaSans_600SemiBold",
    bold: "PlusJakartaSans_700Bold"
  },
  size: {
    xs: 12,
    sm: 13,
    md: 15,
    lg: 18,
    xl: 24,
    hero: 30
  }
} as const;

export const lightPalette = {
  background: "#f6f6f8",
  backgroundMuted: "rgba(238, 242, 247, 0.86)",
  surface: "rgba(255, 255, 255, 0.82)",
  surfaceAlt: "rgba(248, 250, 252, 0.74)",
  surfaceStrong: "rgba(255, 255, 255, 0.90)",
  overlaySoft: "rgba(15, 23, 42, 0.18)",
  overlayMedium: "rgba(15, 23, 42, 0.26)",
  overlayStrong: "rgba(15, 23, 42, 0.36)",
  overlaySurface: "rgba(255, 255, 255, 0.94)",
  border: "rgba(229, 231, 235, 0.78)",
  primary: "#135bec",
  primaryMuted: "#eaf1ff",
  text: "#111827",
  textSecondary: "#6b7280",
  textTertiary: "#94a3b8",
  success: "#17b26a",
  warning: "#f59e0b",
  danger: "#ef4444",
  favorite: "#ff4d73",
  overlay: "rgba(15, 23, 42, 0.26)",
  shadow: "rgba(15, 23, 42, 0.10)",
  mapCard: "rgba(255, 255, 255, 0.78)"
} as const;

export const darkPalette = {
  background: "#040B17",
  backgroundMuted: "rgba(10, 19, 36, 0.90)",
  surface: "rgba(16, 26, 47, 0.80)",
  surfaceAlt: "rgba(22, 35, 59, 0.68)",
  surfaceStrong: "rgba(16, 26, 47, 0.88)",
  overlaySoft: "rgba(1, 6, 14, 0.56)",
  overlayMedium: "rgba(1, 6, 14, 0.72)",
  overlayStrong: "rgba(1, 6, 14, 0.84)",
  overlaySurface: "rgba(9, 17, 31, 0.94)",
  border: "rgba(27, 41, 67, 0.78)",
  primary: "#7FD8FF",
  primaryMuted: "#18314D",
  text: "#f8fafc",
  textSecondary: "#9AABBF",
  textTertiary: "#68809F",
  success: "#47D7A2",
  warning: "#FFD45A",
  danger: "#FF7A86",
  favorite: "#ff4d73",
  overlay: "rgba(1, 6, 14, 0.72)",
  shadow: "rgba(1, 6, 14, 0.42)",
  mapCard: "rgba(16, 26, 47, 0.74)"
} as const;
