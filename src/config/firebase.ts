import { FirebaseOptions } from "firebase/app";

const readEnv = (value: string | undefined) => value?.trim() ?? "";

const env = {
  apiKey: readEnv(process.env.EXPO_PUBLIC_FIREBASE_API_KEY),
  authDomain: readEnv(process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN),
  projectId: readEnv(process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID),
  storageBucket: readEnv(process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET),
  messagingSenderId: readEnv(process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID),
  appId: readEnv(process.env.EXPO_PUBLIC_FIREBASE_APP_ID),
  measurementId: readEnv(process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID)
};

export const firebaseConfig: FirebaseOptions = {
  apiKey: env.apiKey,
  authDomain: env.authDomain,
  projectId: env.projectId,
  storageBucket: env.storageBucket,
  messagingSenderId: env.messagingSenderId,
  appId: env.appId,
  ...(env.measurementId ? { measurementId: env.measurementId } : {})
};

const requiredFirebaseValues = [
  env.apiKey,
  env.authDomain,
  env.projectId,
  env.storageBucket,
  env.messagingSenderId,
  env.appId
];

export const isFirebaseConfigured = () =>
  requiredFirebaseValues.every((value) => value.length > 0 && !value.startsWith("YOUR_"));
