import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  runTransaction,
  setDoc,
  where
} from "firebase/firestore";

import { APP_CONSTANTS, STORAGE_KEYS } from "@/config/app";
import { DEFAULT_AVATAR_PRESET_ID } from "@/config/avatarPresets";
import { getFirebaseFirestore } from "@/services/firebase/client";
import {
  CommunityReview,
  CommunityStatus,
  ReportRecord,
  ReportType,
  ToiletOverride,
  ToiletPoint,
  UserProfile
} from "@/types/models";
import { buildReportBucket } from "@/utils/toilets";
import {
  evaluateBadges,
  getLevelFromXp,
  isNightAction,
  isPositiveReviewComment
} from "@/utils/xp";

const nowIso = () => new Date().toISOString();

const defaultProfile = (uid: string, pseudo = ""): UserProfile => ({
  uid,
  pseudo,
  avatarPreset: DEFAULT_AVATAR_PRESET_ID,
  avatarUri: null,
  xp: 0,
  level: 1,
  badges: [],
  favorites: [],
  reportsCount: 0,
  outOfServiceReportsCount: 0,
  reviewsCount: 0,
  positiveReviewsCount: 0,
  nightActionsCount: 0,
  transitInteractionsCount: 0,
  nonTransitInteractionsCount: 0,
  createdAt: nowIso(),
  updatedAt: nowIso()
});

const normalizeProfile = (profile: Partial<UserProfile>, uid: string, pseudo = ""): UserProfile => ({
  ...defaultProfile(uid, pseudo),
  ...profile,
  uid: profile.uid ?? uid,
  pseudo: profile.pseudo ?? pseudo
});

const loadMockValue = async <T>(key: string, fallback: T) => {
  const rawValue = await AsyncStorage.getItem(key);
  if (!rawValue) {
    return fallback;
  }

  return JSON.parse(rawValue) as T;
};

const saveMockValue = async (key: string, value: unknown) =>
  AsyncStorage.setItem(key, JSON.stringify(value));

const getMockProfile = async (uid: string) => {
  const current = await loadMockValue<UserProfile | null>(
    STORAGE_KEYS.mockProfile,
    null
  );
  if (current?.uid === uid) {
    return normalizeProfile(current, uid);
  }

  const created = defaultProfile(uid);
  await saveMockValue(STORAGE_KEYS.mockProfile, created);
  return created;
};

const getMockReviews = () =>
  loadMockValue<CommunityReview[]>(STORAGE_KEYS.mockReviews, []);
const getMockReports = () =>
  loadMockValue<ReportRecord[]>(STORAGE_KEYS.mockReports, []);
const getMockOverrides = () =>
  loadMockValue<ToiletOverride[]>(STORAGE_KEYS.mockOverrides, []);

const saveMockCollections = async (params: {
  profile?: UserProfile;
  reviews?: CommunityReview[];
  reports?: ReportRecord[];
  overrides?: ToiletOverride[];
}) => {
  const operations: Promise<void>[] = [];

  if (params.profile) {
    operations.push(saveMockValue(STORAGE_KEYS.mockProfile, params.profile));
  }

  if (params.reviews) {
    operations.push(saveMockValue(STORAGE_KEYS.mockReviews, params.reviews));
  }

  if (params.reports) {
    operations.push(saveMockValue(STORAGE_KEYS.mockReports, params.reports));
  }

  if (params.overrides) {
    operations.push(saveMockValue(STORAGE_KEYS.mockOverrides, params.overrides));
  }

  await Promise.all(operations);
};

const applyProfileMetrics = (profile: UserProfile) => ({
  ...profile,
  level: getLevelFromXp(profile.xp),
  badges: evaluateBadges({
    favorites: profile.favorites.length,
    outOfServiceReports: profile.outOfServiceReportsCount,
    positiveReviews: profile.positiveReviewsCount,
    transitInteractions: profile.transitInteractionsCount,
    nonTransitInteractions: profile.nonTransitInteractionsCount,
    nightActions: profile.nightActionsCount
  }),
  updatedAt: nowIso()
});

const applyInteractionFlags = (
  profile: UserProfile,
  params: {
    isNight?: boolean;
    isTransit?: boolean;
  }
) => ({
  ...profile,
  nightActionsCount: profile.nightActionsCount + (params.isNight ? 1 : 0),
  transitInteractionsCount: profile.transitInteractionsCount + (params.isTransit ? 1 : 0),
  nonTransitInteractionsCount:
    profile.nonTransitInteractionsCount + (params.isTransit ? 0 : 1)
});

const buildOverride = (
  toiletId: string,
  recentReports: ReportRecord[]
): ToiletOverride => {
  const negativeReportsCount = recentReports.length;
  let communityStatus: CommunityStatus = "unknown";

  if (negativeReportsCount >= APP_CONSTANTS.negativeReportThreshold) {
    communityStatus = "out_of_service";
  } else if (negativeReportsCount > 0) {
    communityStatus = "reported";
  }

  return {
    toiletId,
    communityStatus,
    negativeReportsCount,
    lastReportAt: recentReports[0]?.createdAt ?? null,
    updatedAt: nowIso()
  };
};

const reportIdFor = (uid: string, toiletId: string, type: ReportType) =>
  `${toiletId}_${uid}_${type}_${buildReportBucket()}`;

export const communityRepository = {
  async getOrCreateProfile(uid: string, pseudo = "") {
    const db = getFirebaseFirestore();
    if (!db) {
      const profile = await getMockProfile(uid);
      if (pseudo && !profile.pseudo) {
        const updated = applyProfileMetrics({ ...profile, pseudo });
        await saveMockCollections({ profile: updated });
        return updated;
      }

      return profile;
    }

    const userRef = doc(db, "users", uid);
    const snapshot = await getDoc(userRef);
    if (snapshot.exists()) {
      return normalizeProfile(snapshot.data() as UserProfile, uid, pseudo);
    }

    const profile = defaultProfile(uid, pseudo);
    await setDoc(userRef, profile);
    return profile;
  },

  async updatePseudo(uid: string, pseudo: string) {
    const db = getFirebaseFirestore();
    if (!db) {
      const current = await getMockProfile(uid);
      const updated = applyProfileMetrics({ ...current, pseudo });
      await saveMockCollections({ profile: updated });
      return updated;
    }

    const userRef = doc(db, "users", uid);
    const current = await this.getOrCreateProfile(uid, pseudo);
    const updated = applyProfileMetrics({ ...current, pseudo });
    await setDoc(userRef, updated);
    return updated;
  },

  async updateProfileAvatar(
    uid: string,
    payload: { avatarPreset?: string | null; avatarUri?: string | null }
  ) {
    const db = getFirebaseFirestore();
    if (!db) {
      const current = await getMockProfile(uid);
      const updated = applyProfileMetrics({ ...current, ...payload });
      await saveMockCollections({ profile: updated });
      return updated;
    }

    const userRef = doc(db, "users", uid);
    const current = await this.getOrCreateProfile(uid);
    const updated = applyProfileMetrics({ ...current, ...payload });
    await setDoc(userRef, updated);
    return updated;
  },

  async listOverrides() {
    const db = getFirebaseFirestore();
    if (!db) {
      return getMockOverrides();
    }

    const snapshots = await getDocs(collection(db, "toilet_overrides"));
    return snapshots.docs.map((item) => item.data() as ToiletOverride);
  },

  async getReviews(toiletId: string) {
    const db = getFirebaseFirestore();
    if (!db) {
      const reviews = await getMockReviews();
      return reviews
        .filter((review) => review.toiletId === toiletId)
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    }

    const reviewsQuery = query(collection(db, "reviews"), where("toiletId", "==", toiletId));
    const snapshots = await getDocs(reviewsQuery);
    return snapshots.docs
      .map((item) => item.data() as CommunityReview)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  },

  async toggleFavorite(uid: string, toiletId: string) {
    const db = getFirebaseFirestore();
    if (!db) {
      const profile = await getMockProfile(uid);
      const favorites = profile.favorites.includes(toiletId)
        ? profile.favorites.filter((current) => current !== toiletId)
        : [...profile.favorites, toiletId];
      const updated = applyProfileMetrics({ ...profile, favorites });
      await saveMockCollections({ profile: updated });
      return updated;
    }

    const userRef = doc(db, "users", uid);
    const updated = await runTransaction(db, async (transaction) => {
      const snapshot = await transaction.get(userRef);
      const current = snapshot.exists()
        ? normalizeProfile(snapshot.data() as UserProfile, uid)
        : defaultProfile(uid);
      const favorites = current.favorites.includes(toiletId)
        ? current.favorites.filter((currentId) => currentId !== toiletId)
        : [...current.favorites, toiletId];
      const nextProfile = applyProfileMetrics({ ...current, favorites });
      transaction.set(userRef, nextProfile);
      return nextProfile;
    });

    return updated;
  },

  async recordDirectionsTap(uid: string) {
    const db = getFirebaseFirestore();
    if (!db) {
      const profile = await getMockProfile(uid);
      const updated = applyProfileMetrics({ ...profile, xp: profile.xp + 1 });
      await saveMockCollections({ profile: updated });
      return updated;
    }

    const userRef = doc(db, "users", uid);
    return runTransaction(db, async (transaction) => {
      const snapshot = await transaction.get(userRef);
      const current = snapshot.exists()
        ? normalizeProfile(snapshot.data() as UserProfile, uid)
        : defaultProfile(uid);
      const updated = applyProfileMetrics({ ...current, xp: current.xp + 1 });
      transaction.set(userRef, updated);
      return updated;
    });
  },

  async addReview(uid: string, pseudo: string, toilet: ToiletPoint, comment: string) {
    const review: CommunityReview = {
      id: `${toilet.id}_${uid}_${Date.now().toString(36)}`,
      toiletId: toilet.id,
      userId: uid,
      pseudo,
      comment,
      createdAt: nowIso()
    };
    const isPositive = isPositiveReviewComment(comment);
    const isNight = isNightAction();
    const isTransit = toilet.networkTag === "ratp";

    const db = getFirebaseFirestore();
    if (!db) {
      const profile = await getMockProfile(uid);
      const reviews = await getMockReviews();
      const updatedProfile = applyProfileMetrics(
        applyInteractionFlags(
          {
            ...profile,
            xp: profile.xp + 5,
            reviewsCount: profile.reviewsCount + 1,
            positiveReviewsCount: profile.positiveReviewsCount + (isPositive ? 1 : 0)
          },
          { isNight, isTransit }
        )
      );
      await saveMockCollections({
        profile: updatedProfile,
        reviews: [review, ...reviews]
      });
      return { profile: updatedProfile, review };
    }

    const userRef = doc(db, "users", uid);
    const reviewRef = doc(db, "reviews", review.id);
    const profile = await runTransaction(db, async (transaction) => {
      const snapshot = await transaction.get(userRef);
      const current = snapshot.exists()
        ? normalizeProfile(snapshot.data() as UserProfile, uid, pseudo)
        : defaultProfile(uid, pseudo);
      const updatedProfile = applyProfileMetrics(
        applyInteractionFlags(
          {
            ...current,
            xp: current.xp + 5,
            reviewsCount: current.reviewsCount + 1,
            positiveReviewsCount: current.positiveReviewsCount + (isPositive ? 1 : 0)
          },
          { isNight, isTransit }
        )
      );
      transaction.set(userRef, updatedProfile);
      transaction.set(reviewRef, review);
      return updatedProfile;
    });

    return { profile, review };
  },

  async submitReport(uid: string, toilet: ToiletPoint, type: ReportType) {
    const reportId = reportIdFor(uid, toilet.id, type);
    const report: ReportRecord = {
      id: reportId,
      toiletId: toilet.id,
      userId: uid,
      type,
      createdAt: nowIso()
    };
    const windowStart = new Date(
      Date.now() - APP_CONSTANTS.negativeReportWindowHours * 60 * 60 * 1000
    ).toISOString();
    const isNight = isNightAction();
    const isTransit = toilet.networkTag === "ratp";
    const db = getFirebaseFirestore();

    if (!db) {
      const [profile, reports, overrides] = await Promise.all([
        getMockProfile(uid),
        getMockReports(),
        getMockOverrides()
      ]);

      if (reports.some((current) => current.id === report.id)) {
        return {
          accepted: false,
          profile,
          overrides
        };
      }

      const nextReports = [report, ...reports];
      const recentReports = nextReports
        .filter(
          (current) =>
            current.toiletId === toilet.id && current.createdAt >= windowStart
        )
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
      const nextOverride = buildOverride(toilet.id, recentReports);
      const nextOverrides = [
        nextOverride,
        ...overrides.filter((item) => item.toiletId !== toilet.id)
      ];
      const updatedProfile = applyProfileMetrics(
        applyInteractionFlags(
          {
            ...profile,
            xp: profile.xp + 10,
            reportsCount: profile.reportsCount + 1,
            outOfServiceReportsCount:
              profile.outOfServiceReportsCount + (type === "out_of_service" ? 1 : 0)
          },
          { isNight, isTransit }
        )
      );

      await saveMockCollections({
        profile: updatedProfile,
        reports: nextReports,
        overrides: nextOverrides
      });

      return {
        accepted: true,
        profile: updatedProfile,
        overrides: nextOverrides
      };
    }

    const reportRef = doc(db, "reports", report.id);
    const overrideRef = doc(db, "toilet_overrides", toilet.id);
    const userRef = doc(db, "users", uid);

    const existingReport = await getDoc(reportRef);
    if (existingReport.exists()) {
      return {
        accepted: false,
        profile: await this.getOrCreateProfile(uid),
        overrides: await this.listOverrides()
      };
    }

    const recentReportsQuery = query(collection(db, "reports"), where("toiletId", "==", toilet.id));
    const recentReportsSnapshot = await getDocs(recentReportsQuery);
    const recentReports = [
      report,
      ...recentReportsSnapshot.docs
        .map((item) => item.data() as ReportRecord)
        .filter((item) => item.createdAt >= windowStart)
    ].sort((a, b) => b.createdAt.localeCompare(a.createdAt));

    const profile = await runTransaction(db, async (transaction) => {
      const profileSnapshot = await transaction.get(userRef);
      const current = profileSnapshot.exists()
        ? normalizeProfile(profileSnapshot.data() as UserProfile, uid)
        : defaultProfile(uid);
      const updatedProfile = applyProfileMetrics(
        applyInteractionFlags(
          {
            ...current,
            xp: current.xp + 10,
            reportsCount: current.reportsCount + 1,
            outOfServiceReportsCount:
              current.outOfServiceReportsCount + (type === "out_of_service" ? 1 : 0)
          },
          { isNight, isTransit }
        )
      );
      transaction.set(userRef, updatedProfile);
      transaction.set(reportRef, report);
      transaction.set(overrideRef, buildOverride(toilet.id, recentReports));
      return updatedProfile;
    });

    return {
      accepted: true,
      profile,
      overrides: await this.listOverrides()
    };
  }
};
