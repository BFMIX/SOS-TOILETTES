import { darkPalette, lightPalette, radii, spacing, typography } from "@/theme/tokens";
import { AppThemeMode } from "@/types/models";

export const createTheme = (mode: AppThemeMode) => {
  const palette = mode === "dark" ? darkPalette : lightPalette;

  return {
    mode,
    colors: palette,
    spacing,
    radii,
    typography,
    shadow: {
      soft: {
        shadowColor: palette.shadow,
        shadowOpacity: mode === "dark" ? 0.32 : 0.12,
        shadowRadius: 18,
        shadowOffset: { width: 0, height: 12 },
        elevation: 8
      },
      card: {
        shadowColor: palette.shadow,
        shadowOpacity: mode === "dark" ? 0.28 : 0.08,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 8 },
        elevation: 5
      }
    }
  } as const;
};

export type AppTheme = ReturnType<typeof createTheme>;
