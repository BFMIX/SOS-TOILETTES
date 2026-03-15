declare module "@firebase/auth/dist/rn/index.js" {
  import type { FirebaseApp } from "firebase/app";
  import type { Auth, Persistence } from "firebase/auth";

  export function getReactNativePersistence(storage: unknown): Persistence;
  export function initializeAuth(
    app: FirebaseApp,
    deps?: { persistence?: Persistence }
  ): Auth;
}
