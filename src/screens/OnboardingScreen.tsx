import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  useColorScheme,
  Image,
} from "react-native";
import { useStore } from "../store/useStore";
import { db } from "../config/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";

const ACCENT = "#13e5ec";

export default function OnboardingScreen() {
  const { user, updateProfile, theme } = useStore();
  const [pseudo, setPseudo] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const systemColorScheme = useColorScheme();
  const isDark =
    theme === "auto" ? systemColorScheme === "dark" : theme === "dark";

  const handleStart = async () => {
    if (!pseudo.trim() || !user?.uid) return;
    setIsLoading(true);

    try {
      if (db) {
        const userRef = doc(db, "users", user.uid);

        // Ensure we fetch the latest badges or xp if merging
        await setDoc(
          userRef,
          {
            pseudo: pseudo.trim(),
            createdAt: Date.now(),
          },
          { merge: true },
        );
      }

      updateProfile({ pseudo: pseudo.trim() });
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={[
        styles.container,
        { backgroundColor: isDark ? "#102122" : "#f6f8f8" },
      ]}
    >
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Text style={{ fontSize: 64 }}>🚽</Text>
        </View>

        <Text style={[styles.title, { color: isDark ? "#f1f5f9" : "#0f172a" }]}>
          Bienvenue sur SOS Toilettes
        </Text>
        <Text style={styles.subtitle}>
          Trouvez la sanisette la plus proche et sauvez des vies. Comment
          doit-on vous appeler ?
        </Text>

        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: isDark ? "#0f172a" : "#FFF",
              color: isDark ? "#f1f5f9" : "#0f172a",
              borderColor: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
            },
          ]}
          placeholder="Ton Pseudo..."
          placeholderTextColor="#94a3b8"
          value={pseudo}
          onChangeText={setPseudo}
          maxLength={20}
          autoFocus
        />

        <TouchableOpacity
          style={[styles.button, !pseudo.trim() && { opacity: 0.5 }]}
          onPress={handleStart}
          disabled={!pseudo.trim() || isLoading}
        >
          <Text style={styles.buttonText}>
            {isLoading ? "Chargement..." : "Commencer l'exploration"}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    padding: 30,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(19, 229, 236, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontFamily: "Plus Jakarta Sans",
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: "Plus Jakarta Sans",
    color: "#64748b",
    textAlign: "center",
    marginBottom: 40,
    lineHeight: 24,
  },
  input: {
    height: 60,
    borderRadius: 16,
    paddingHorizontal: 20,
    fontSize: 18,
    fontFamily: "Plus Jakarta Sans",
    fontWeight: "600",
    borderWidth: 1,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  button: {
    backgroundColor: ACCENT,
    height: 60,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: ACCENT,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 4,
  },
  buttonText: {
    color: "#000",
    fontSize: 18,
    fontFamily: "Plus Jakarta Sans",
    fontWeight: "800",
  },
});
