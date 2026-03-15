import { ImageSourcePropType } from "react-native";

import { BadgeDefinition, LevelDefinition } from "@/types/models";

type LevelId = LevelDefinition["id"];
type BadgeId = BadgeDefinition["id"];

export const LEVEL_ICON_MAP: Record<LevelId, ImageSourcePropType> = {
  level1: require("../../assets/images/levels/level_1_timide.png"),
  level2: require("../../assets/images/levels/level_2_explorateur.png"),
  level3: require("../../assets/images/levels/level_3_inspecteur.png"),
  level4: require("../../assets/images/levels/level_4_ange.png"),
  level5: require("../../assets/images/levels/level_5_legende.png")
};

export const BADGE_ICON_MAP: Record<BadgeId, ImageSourcePropType> = {
  le_toiletteur: require("../../assets/images/badges/badge_toiletteur.png"),
  le_sauveur: require("../../assets/images/badges/badge_sauveur.png"),
  monsieur_madame_propre: require("../../assets/images/badges/badge_propre.png"),
  taupe_du_metro: require("../../assets/images/badges/badge_taupe_metro.png"),
  oiseau_de_nuit: require("../../assets/images/badges/badge_oiseau_nuit.png")
};
