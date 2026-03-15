import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { STORAGE_KEYS } from "@/config/app";
import { DEFAULT_AVATAR_PRESET_ID } from "@/config/avatarPresets";
import { isFirebaseConfigured } from "@/config/firebase";
import { communityRepository } from "@/repositories/community/communityRepository";
import { ensureAnonymousSession } from "@/services/firebase/authService";
import {
  CommunityStatus,
  ReportType,
  ToiletOverride,
  ToiletPoint,
  UserProfile
} from "@/types/models";

interface SessionState {
  status: "idle" | "loading" | "ready" | "error";
  authMode: "firebase" | "mock";
  profile: UserProfile | null;
  overrides: Record<string, ToiletOverride>;
  error?: string | null;
  bootstrap: () => Promise<void>;
  completeOnboarding: (payload: {
    pseudo: string;
    avatarPreset?: string | null;
    avatarUri?: string | null;
  }) => Promise<void>;
  updateProfileAvatar: (payload: {
    avatarPreset?: string | null;
    avatarUri?: string | null;
  }) => Promise<void>;
  toggleFavorite: (toiletId: string) => Promise<UserProfile | null>;
  addReview: (toilet: ToiletPoint, comment: string) => Promise<boolean>;
  submitReport: (toilet: ToiletPoint, type: ReportType) => Promise<boolean>;
  recordDirections: () => Promise<void>;
  refreshOverrides: () => Promise<void>;
  getCommunityStatus: (toiletId: string, fallback?: CommunityStatus) => CommunityStatus;
}

const overridesToRecord = (items: ToiletOverride[]) =>
  Object.fromEntries(items.map((item) => [item.toiletId, item]));

const applyOptimisticName = (
  profile: UserProfile | null,
  uid: string,
  pseudo: string
): UserProfile => ({
  uid,
  pseudo,
  avatarPreset: profile?.avatarPreset ?? DEFAULT_AVATAR_PRESET_ID,
  avatarUri: profile?.avatarUri ?? null,
  xp: profile?.xp ?? 0,
  level: profile?.level ?? 1,
  badges: profile?.badges ?? [],
  favorites: profile?.favorites ?? [],
  reportsCount: profile?.reportsCount ?? 0,
  outOfServiceReportsCount: profile?.outOfServiceReportsCount ?? 0,
  reviewsCount: profile?.reviewsCount ?? 0,
  positiveReviewsCount: profile?.positiveReviewsCount ?? 0,
  nightActionsCount: profile?.nightActionsCount ?? 0,
  transitInteractionsCount: profile?.transitInteractionsCount ?? 0,
  nonTransitInteractionsCount: profile?.nonTransitInteractionsCount ?? 0,
  createdAt: profile?.createdAt ?? new Date().toISOString(),
  updatedAt: new Date().toISOString()
});

export const useSessionStore = create<SessionState>()(
  persist(
    (set, get) => ({
      status: "idle",
      authMode: isFirebaseConfigured() ? "firebase" : "mock",
      profile: null,
      overrides: {},
      error: null,
      bootstrap: async () => {
        set({ status: "loading", error: null });
        try {
          const session = await ensureAnonymousSession();
          const [profile, overrides] = await Promise.all([
            communityRepository.getOrCreateProfile(session.uid),
            communityRepository.listOverrides()
          ]);

          set({
            status: "ready",
            profile,
            authMode: session.mode,
            overrides: overridesToRecord(overrides)
          });
        } catch (error) {
          set({
            status: "error",
            error: error instanceof Error ? error.message : "Unknown bootstrap error"
          });
        }
      },
      completeOnboarding: async ({ pseudo, avatarPreset, avatarUri }) => {
        const session = await ensureAnonymousSession();
        const trimmedName = pseudo.trim();
        const optimisticProfile = {
          ...applyOptimisticName(get().profile, session.uid, trimmedName),
          avatarPreset:
            avatarUri && !avatarPreset
              ? null
              : avatarPreset ?? get().profile?.avatarPreset ?? DEFAULT_AVATAR_PRESET_ID,
          avatarUri: avatarUri ?? null
        };

        set({
          status: "ready",
          profile: optimisticProfile,
          authMode: session.mode,
          error: null
        });

        try {
          const baseProfile = await communityRepository.updatePseudo(session.uid, trimmedName);
          const profile =
            avatarPreset !== undefined || avatarUri !== undefined
              ? await communityRepository.updateProfileAvatar(session.uid, {
                  avatarPreset: avatarUri && !avatarPreset ? null : avatarPreset,
                  avatarUri: avatarUri ?? null
                })
              : baseProfile;
          const overrides = await communityRepository.listOverrides();

          set({
            status: "ready",
            profile,
            authMode: session.mode,
            overrides: overridesToRecord(overrides),
            error: null
          });
        } catch (error) {
          set({
            status: "ready",
            profile: optimisticProfile,
            authMode: session.mode,
            error: error instanceof Error ? error.message : "Unable to sync profile"
          });
        }
      },
      updateProfileAvatar: async (payload) => {
        const profile = get().profile;
        if (!profile) {
          return;
        }

        const optimisticProfile = {
          ...profile,
          ...payload,
          updatedAt: new Date().toISOString()
        };
        set({ profile: optimisticProfile });

        try {
          const updated = await communityRepository.updateProfileAvatar(profile.uid, payload);
          set({ profile: updated, error: null });
        } catch (error) {
          set({
            profile,
            error: error instanceof Error ? error.message : "Unable to update avatar"
          });
        }
      },
      toggleFavorite: async (toiletId) => {
        const profile = get().profile;
        if (!profile) {
          return null;
        }

        try {
          const updated = await communityRepository.toggleFavorite(profile.uid, toiletId);
          set({ profile: updated, error: null });
          return updated;
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "Unable to update favorite"
          });
          return profile;
        }
      },
      addReview: async (toilet, comment) => {
        const profile = get().profile;
        if (!profile || !comment.trim()) {
          return false;
        }

        try {
          const result = await communityRepository.addReview(
            profile.uid,
            profile.pseudo,
            toilet,
            comment.trim()
          );
          set({ profile: result.profile, error: null });
          return true;
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "Unable to publish review"
          });
          return false;
        }
      },
      submitReport: async (toilet, type) => {
        const profile = get().profile;
        if (!profile) {
          return false;
        }

        try {
          const result = await communityRepository.submitReport(profile.uid, toilet, type);
          set({
            profile: result.profile,
            overrides: overridesToRecord(result.overrides),
            error: null
          });
          return result.accepted;
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "Unable to send report"
          });
          return false;
        }
      },
      recordDirections: async () => {
        const profile = get().profile;
        if (!profile) {
          return;
        }

        try {
          const updated = await communityRepository.recordDirectionsTap(profile.uid);
          set({ profile: updated, error: null });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "Unable to save directions tap"
          });
        }
      },
      refreshOverrides: async () => {
        try {
          const overrides = await communityRepository.listOverrides();
          set({ overrides: overridesToRecord(overrides), error: null });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "Unable to refresh overrides"
          });
        }
      },
      getCommunityStatus: (toiletId, fallback = "unknown") =>
        get().overrides[toiletId]?.communityStatus ?? fallback
    }),
    {
      name: STORAGE_KEYS.sessionCache,
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        authMode: state.authMode,
        profile: state.profile,
        overrides: state.overrides
      })
    }
  )
);
