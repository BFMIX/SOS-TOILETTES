import { BADGE_DEFINITIONS } from "@/config/badges";
import { BadgeDefinition, LevelDefinition } from "@/types/models";

export const LEVEL_DEFINITIONS: LevelDefinition[] = [
  { id: "level1", level: 1, minXp: 0, maxXp: 50 },
  { id: "level2", level: 2, minXp: 51, maxXp: 150 },
  { id: "level3", level: 3, minXp: 151, maxXp: 300 },
  { id: "level4", level: 4, minXp: 301, maxXp: 600 },
  { id: "level5", level: 5, minXp: 601, maxXp: null }
];

export const getLevelDefinition = (xp: number) =>
  LEVEL_DEFINITIONS.find((item) => {
    if (item.maxXp === null) {
      return xp >= item.minXp;
    }

    return xp >= item.minXp && xp <= item.maxXp;
  }) ?? LEVEL_DEFINITIONS[0];

export const getLevelFromXp = (xp: number) => getLevelDefinition(xp).level;

export const getXpToNextLevel = (xp: number) => {
  const currentLevel = getLevelDefinition(xp);
  if (currentLevel.maxXp === null) {
    return 0;
  }

  return currentLevel.maxXp + 1 - xp;
};

export const isPositiveReviewComment = (comment: string) => {
  const normalized = comment.trim().toLowerCase();
  if (!normalized) {
    return false;
  }

  const positiveKeywords = [
    "propre",
    "fonctionnel",
    "clean",
    "cleaner",
    "super",
    "nickel",
    "pratique",
    "impeccable",
    "parfait",
    "top",
    "good",
    "great",
    "ok"
  ];

  const negativeKeywords = [
    "sale",
    "dirty",
    "cass",
    "broken",
    "hors service",
    "papier",
    "mauvais",
    "bad"
  ];

  return (
    positiveKeywords.some((keyword) => normalized.includes(keyword)) &&
    !negativeKeywords.some((keyword) => normalized.includes(keyword))
  );
};

export const isNightAction = (date = new Date()) => {
  const hour = date.getHours();
  return hour >= 0 && hour < 5;
};

export const evaluateBadges = (params: {
  favorites: number;
  outOfServiceReports: number;
  positiveReviews: number;
  transitInteractions: number;
  nonTransitInteractions: number;
  nightActions: number;
}) =>
  BADGE_DEFINITIONS.filter((badge: BadgeDefinition) => {
    if (badge.metric === "favorites") {
      return params.favorites >= badge.threshold;
    }

    if (badge.metric === "out_of_service_reports") {
      return params.outOfServiceReports >= badge.threshold;
    }

    if (badge.metric === "positive_reviews") {
      return params.positiveReviews >= badge.threshold;
    }

    if (badge.metric === "night_actions") {
      return params.nightActions >= badge.threshold;
    }

    return (
      params.transitInteractions >= badge.threshold &&
      params.nonTransitInteractions === 0
    );
  }).map((badge) => badge.id);
