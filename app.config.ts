import { ExpoConfig, ConfigContext } from "expo/config";

const APP_NAME = "SOS TOILETTES";
const BUNDLE_ID = "com.sostoilettes.app";
const PACKAGE_NAME = "com.sostoilettes.app";

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: APP_NAME,
  slug: "sos-toilettes",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/icon.png",
  scheme: "sostoilettes",
  userInterfaceStyle: "automatic",
  newArchEnabled: true,
  assetBundlePatterns: ["**/*"],
  splash: {
    image: "./assets/splash-icon.png",
    resizeMode: "contain",
    backgroundColor: "#f6f6f8"
  },
  ios: {
    bundleIdentifier: BUNDLE_ID,
    supportsTablet: false,
    infoPlist: {
      ITSAppUsesNonExemptEncryption: false,
      NSLocationWhenInUseUsageDescription:
        "SOS TOILETTES utilise votre position pour vous montrer les toilettes proches et recentrer la carte."
    }
  },
  android: {
    package: PACKAGE_NAME,
    adaptiveIcon: {
      foregroundImage: "./assets/android-icon-foreground.png",
      backgroundImage: "./assets/android-icon-background.png",
      monochromeImage: "./assets/android-icon-monochrome.png",
      backgroundColor: "#E6F4FE"
    },
    permissions: ["ACCESS_COARSE_LOCATION", "ACCESS_FINE_LOCATION"],
    config: {
      googleMaps: {
        apiKey:
          process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY ??
          "YOUR_ANDROID_GOOGLE_MAPS_API_KEY"
      }
    }
  },
  plugins: [
    "expo-font",
    "expo-localization",
    [
      "expo-location",
      {
        locationWhenInUsePermission:
          "SOS TOILETTES utilise votre position pour afficher les toilettes autour de vous."
      }
    ],
    [
      "expo-image-picker",
      {
        photosPermission:
          "SOS TOILETTES utilise vos photos pour vous permettre d'ajouter une photo de profil."
      }
    ],
    [
      "expo-build-properties",
      {
        android: {
          compileSdkVersion: 36,
          targetSdkVersion: 36,
          minSdkVersion: 24
        },
        ios: {
          deploymentTarget: "15.1"
        }
      }
    ]
  ],
  extra: {
    firebaseApiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY ?? "",
    firebaseAuthDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN ?? "",
    firebaseProjectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID ?? "",
    firebaseStorageBucket:
      process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET ?? "",
    firebaseMessagingSenderId:
      process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? "",
    firebaseAppId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID ?? "",
    firebaseMeasurementId:
      process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID ?? "",
    mapsAndroidKey:
      process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY ??
      "YOUR_ANDROID_GOOGLE_MAPS_API_KEY"
  }
});
