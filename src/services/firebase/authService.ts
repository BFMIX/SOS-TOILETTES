import AsyncStorage from "@react-native-async-storage/async-storage";
import { signInAnonymously } from "firebase/auth";

import { STORAGE_KEYS } from "@/config/app";
import { isFirebaseConfigured } from "@/config/firebase";
import { getFirebaseAuth } from "@/services/firebase/client";

interface AuthSession {
  uid: string;
  mode: "firebase" | "mock";
}

const createMockUid = () =>
  `local_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;

export const ensureAnonymousSession = async (): Promise<AuthSession> => {
  if (!isFirebaseConfigured()) {
    const existingUid = await AsyncStorage.getItem(STORAGE_KEYS.mockAuth);
    if (existingUid) {
      return { uid: existingUid, mode: "mock" };
    }

    const uid = createMockUid();
    await AsyncStorage.setItem(STORAGE_KEYS.mockAuth, uid);
    return { uid, mode: "mock" };
  }

  const auth = getFirebaseAuth();
  if (!auth) {
    throw new Error("Firebase auth is unavailable.");
  }

  if (auth.currentUser) {
    return { uid: auth.currentUser.uid, mode: "firebase" };
  }

  const result = await signInAnonymously(auth);
  return { uid: result.user.uid, mode: "firebase" };
};
