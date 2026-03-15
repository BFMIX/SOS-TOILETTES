import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  getReactNativePersistence,
  initializeAuth
} from "@firebase/auth/dist/rn/index.js";
import { FirebaseApp, getApp, getApps, initializeApp } from "firebase/app";
import { Auth, getAuth } from "firebase/auth";
import { Firestore, getFirestore } from "firebase/firestore";

import { firebaseConfig, isFirebaseConfigured } from "@/config/firebase";

let appInstance: FirebaseApp | null = null;
let authInstance: Auth | null = null;
let firestoreInstance: Firestore | null = null;

const getFirebaseApp = () => {
  if (!isFirebaseConfigured()) {
    return null;
  }

  if (appInstance) {
    return appInstance;
  }

  appInstance = getApps().length ? getApp() : initializeApp(firebaseConfig);
  return appInstance;
};

export const getFirebaseAuth = () => {
  if (authInstance) {
    return authInstance;
  }

  const app = getFirebaseApp();
  if (!app) {
    return null;
  }

  try {
    authInstance = initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage)
    });
  } catch {
    authInstance = getAuth(app);
  }

  return authInstance;
};

export const getFirebaseFirestore = () => {
  if (firestoreInstance) {
    return firestoreInstance;
  }

  const app = getFirebaseApp();
  if (!app) {
    return null;
  }

  firestoreInstance = getFirestore(app);
  return firestoreInstance;
};
