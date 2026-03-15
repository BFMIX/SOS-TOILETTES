import { BadgeDefinition } from "@/types/models";

export const BADGE_DEFINITIONS: BadgeDefinition[] = [
  {
    id: "le_toiletteur",
    key: "profile.badges.toiletteur",
    descriptionKey: "profile.badges.toiletteurDescription",
    threshold: 3,
    metric: "favorites"
  },
  {
    id: "le_sauveur",
    key: "profile.badges.savior",
    descriptionKey: "profile.badges.saviorDescription",
    threshold: 3,
    metric: "out_of_service_reports"
  },
  {
    id: "monsieur_madame_propre",
    key: "profile.badges.cleanMaster",
    descriptionKey: "profile.badges.cleanMasterDescription",
    threshold: 5,
    metric: "positive_reviews"
  },
  {
    id: "taupe_du_metro",
    key: "profile.badges.metroMole",
    descriptionKey: "profile.badges.metroMoleDescription",
    threshold: 3,
    metric: "ratp_exclusive"
  },
  {
    id: "oiseau_de_nuit",
    key: "profile.badges.nightOwl",
    descriptionKey: "profile.badges.nightOwlDescription",
    threshold: 1,
    metric: "night_actions"
  }
];
