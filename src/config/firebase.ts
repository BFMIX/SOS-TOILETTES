import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import {
  getAuth,
  signInAnonymously,
  initializeAuth,
  getReactNativePersistence,
} from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

// On utilise les variables d'environnement Expo (préfixées par EXPO_PUBLIC_)
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

const isFirebaseConfigured = firebaseConfig.apiKey !== "YOUR_API_KEY";

const app = isFirebaseConfigured ? initializeApp(firebaseConfig) : null;
export const db = isFirebaseConfigured ? getFirestore(app!) : null;

// Initialisation d'Auth avec persistance pour React Native
export const auth = isFirebaseConfigured
  ? initializeAuth(app!, {
      persistence: getReactNativePersistence(ReactNativeAsyncStorage),
    })
  : null;

// Authentification anonyme sans friction
export const loginAnonymously = async () => {
  if (!isFirebaseConfigured || !auth) {
    console.log("Firebase n'est pas configuré. Mock de l'utilisateur anonyme.");
    return { uid: "mock_user_123" }; // Mock user for UI testing
  }

  try {
    const userCredential = await signInAnonymously(auth);
    return userCredential.user;
  } catch (error) {
    console.error("Erreur d'authentification anonyme Firebase :", error);
    return null;
  }
};
