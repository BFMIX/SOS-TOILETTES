import { ImageSourcePropType } from "react-native";

export interface AvatarPreset {
  id: string;
  label: string;
  source: ImageSourcePropType;
  backgroundLight: [string, string];
  backgroundDark: [string, string];
}

export const AVATAR_PRESETS: AvatarPreset[] = [
  {
    id: "avatar_capitaine_splash",
    label: "Capitaine Splash",
    source: require("../../assets/images/avatars/avatar_capitaine_splash.png"),
    backgroundLight: ["#C9D8F2", "#E9EFFA"],
    backgroundDark: ["#F2D6C2", "#F8E7D7"]
  },
  {
    id: "avatar_pigeon_parisien",
    label: "Pigeon Parisien",
    source: require("../../assets/images/avatars/avatar_pigeon_parisien.png"),
    backgroundLight: ["#D7DBE8", "#EEF1F8"],
    backgroundDark: ["#F5E3BA", "#FBF0D9"]
  },
  {
    id: "avatar_raton_inspecteur",
    label: "Raton Inspecteur",
    source: require("../../assets/images/avatars/avatar_raton_inspecteur.png"),
    backgroundLight: ["#D9CFE5", "#EFE7F6"],
    backgroundDark: ["#DCEBCB", "#EEF6E2"]
  },
  {
    id: "avatar_grenouille_fraiche",
    label: "Grenouille Fraiche",
    source: require("../../assets/images/avatars/avatar_grenouille_fraiche.png"),
    backgroundLight: ["#CDE6DE", "#EAF5F0"],
    backgroundDark: ["#F3D5E1", "#FAE8F0"]
  },
  {
    id: "avatar_chat_gardien",
    label: "Chat Gardien",
    source: require("../../assets/images/avatars/avatar_chat_gardien.png"),
    backgroundLight: ["#DCCFCB", "#F1E8E5"],
    backgroundDark: ["#D4E6F7", "#EBF4FB"]
  },
  {
    id: "avatar_robot_sanisette",
    label: "Robot Sanisette",
    source: require("../../assets/images/avatars/avatar_robot_sanisette.png"),
    backgroundLight: ["#CFDDEA", "#EDF3F8"],
    backgroundDark: ["#F0D5C6", "#F8E7DC"]
  }
];

export const DEFAULT_AVATAR_PRESET_ID =
  AVATAR_PRESETS[0]?.id ?? "avatar_capitaine_splash";

export const getAvatarPreset = (presetId?: string | null) =>
  AVATAR_PRESETS.find((preset) => preset.id === presetId) ?? AVATAR_PRESETS[0];
