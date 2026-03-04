import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import {
  getAuth,
  signInAnonymously,
  initializeAuth,
  getReactNativePersistence,
} from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

// TODO: Remplacer ces valeurs par celles de votre projet Firebase (Google Cloud Console)
const firebaseConfig = {
  apiKey: "AIzaSyCcqVG4HKsMNx1eqjep2ssyKnNVw5PrvAQ",
  authDomain: "sos-toilettes-366f8.firebaseapp.com",
  projectId: "sos-toilettes-366f8",
  storageBucket: "sos-toilettes-366f8.firebasestorage.app",
  messagingSenderId: "152185885855",
  appId: "1:152185885855:web:3e2e2f06fbbb2dd917feaa",
  measurementId: "G-JWDD07F81C",
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
