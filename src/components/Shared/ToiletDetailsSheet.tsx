import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Platform,
  TextInput,
  FlatList,
  KeyboardAvoidingView,
  ActivityIndicator,
  useColorScheme,
  ScrollView,
  Image,
} from "react-native";
import { Toilet } from "../../models/types";
import { Ionicons } from "@expo/vector-icons";
import { db, auth } from "../../config/firebase";
import {
  collection,
  doc,
  setDoc,
  addDoc,
  increment,
  serverTimestamp,
  onSnapshot,
  query,
  orderBy,
  limit,
  where,
} from "firebase/firestore";
import { Alert } from "react-native";
import { useStore } from "../../store/useStore";

interface Props {
  toilet: Toilet;
}

export default function ToiletDetailsSheet({ toilet }: Props) {
  const { user, theme, toggleFavorite } = useStore();
  const systemColorScheme = useColorScheme();
  const isDark =
    theme === "auto" ? systemColorScheme === "dark" : theme === "dark";

  const isFavorite = user?.favorites?.includes(toilet.id) || false;

  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState<any[]>([]);
  const [isLoadingComments, setIsLoadingComments] = useState(true);

  useEffect(() => {
    if (!db || !auth?.currentUser) return;

    const commentsRef = collection(db, "reviews");
    const q = query(
      commentsRef,
      where("toiletId", "==", toilet.id),
      orderBy("createdAt", "desc"),
      limit(20),
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));

      setComments(list);
      setIsLoadingComments(false);
    });

    return () => unsubscribe();
  }, [toilet.id]);

  const handleSendComment = async () => {
    if (!commentText.trim()) return;
    if (!db || !auth?.currentUser) return;

    try {
      const reviewsRef = collection(db, "reviews");
      await addDoc(reviewsRef, {
        toiletId: toilet.id,
        userId: auth.currentUser.uid,
        pseudo: user?.pseudo || "Explorateur",
        comment: commentText.trim(),
        createdAt: serverTimestamp(),
      });

      // Bonus XP for comment (+5)
      const userRef = doc(db, "users", auth.currentUser.uid);
      await setDoc(userRef, { xp: increment(5) }, { merge: true });

      setCommentText("");
    } catch (err) {
      console.error(err);
      Alert.alert("Erreur", "Impossible de publier le commentaire.");
    }
  };

  const openGPS = async () => {
    // Add XP for routing (+1 XP)
    if (db && auth?.currentUser?.uid) {
      try {
        const userRef = doc(db, "users", auth.currentUser.uid);
        await setDoc(userRef, { xp: increment(1) }, { merge: true });
      } catch (e) {
        console.warn("GPS XP error", e);
      }
    }

    const scheme = Platform.OS === "ios" ? "maps:" : "geo:";
    const url =
      scheme +
      `${toilet.location.latitude},${toilet.location.longitude}?q=${toilet.location.latitude},${toilet.location.longitude}`;
    Linking.openURL(url);
  };

  const handleReport = () => {
    if (!db || !auth?.currentUser) {
      Alert.alert(
        "Erreur",
        "Authentification impossible. Firebase n'est pas bien configuré.",
      );
      return;
    }

    Alert.alert(
      "Signaler un problème",
      "Voulez-vous signaler que ces toilettes sont hors-service ou fermées ?",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Oui, signaler",
          style: "destructive",
          onPress: async () => {
            try {
              const toiletRef = doc(db!, "toilets", toilet.id);

              // Increment negative reports on the toilet
              await setDoc(
                toiletRef,
                {
                  negativeReportsCount: increment(1),
                  lastReportAt: serverTimestamp(),
                  lastUpdate: serverTimestamp(),
                },
                { merge: true },
              );

              // Add specific report to root collection
              const reportsRef = collection(db!, "reports");
              await addDoc(reportsRef, {
                toiletId: toilet.id,
                userId: auth!.currentUser!.uid,
                type: "broken",
                createdAt: serverTimestamp(),
              });

              // Increment User XP
              const userRef = doc(db!, "users", auth!.currentUser!.uid);
              await setDoc(
                userRef,
                {
                  xp: increment(10),
                  reportsMade: increment(1),
                },
                { merge: true },
              );

              Alert.alert(
                "Merci !",
                "Signalement enregistré. Vous avez gagné +10 XP !",
              );
            } catch (err) {
              console.error(err);
              Alert.alert(
                "Erreur",
                "Le signalement a échoué. Vérifiez vos règles Firestore.",
              );
            }
          },
        },
      ],
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
      keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 60 }}
      >
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <View style={styles.headerImageContainer}>
              <Image
                source={require("../../../assets/Toilette_generic.png")}
                style={styles.headerImage}
                resizeMode="contain"
              />
            </View>
            <View style={styles.titleRow}>
              <Text style={styles.title} numberOfLines={1}>
                {toilet.address}
              </Text>
              {toilet.status === "open" ? (
                <View
                  style={[
                    styles.statusBadge,
                    { backgroundColor: "rgba(34, 197, 94, 0.1)" },
                  ]}
                >
                  <Text
                    style={{
                      color: "#22c55e",
                      fontWeight: "700",
                      fontSize: 10,
                    }}
                  >
                    En Service
                  </Text>
                </View>
              ) : (
                <View
                  style={[
                    styles.statusBadge,
                    { backgroundColor: "rgba(239, 68, 68, 0.1)" },
                  ]}
                >
                  <Text
                    style={{
                      color: "#ef4444",
                      fontWeight: "700",
                      fontSize: 10,
                    }}
                  >
                    Fermé
                  </Text>
                </View>
              )}
            </View>
            <Text style={styles.subtitle}>
              450m • {toilet.arrondissement || "Paris"}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.favoriteBtn}
            onPress={() => toggleFavorite(toilet.id)}
          >
            <Ionicons
              name={isFavorite ? "heart" : "heart-outline"}
              size={24}
              color={isFavorite ? "#13e5ec" : "#94a3b8"} // Primary cyan vs muted
            />
          </TouchableOpacity>
        </View>

        <View style={styles.badgesRow}>
          <View style={styles.infoPill}>
            <Ionicons name="body" size={14} color="#94a3b8" />
            <Text style={styles.infoPillText}>
              {toilet.isPMR ? "Oui" : "Non"}
            </Text>
          </View>
          <View style={styles.infoPill}>
            <Ionicons name="star" size={14} color="#13e5ec" />
            <Text
              style={[
                styles.infoPillText,
                { color: "#13e5ec", fontWeight: "bold" },
              ]}
            >
              4.2
            </Text>
          </View>
          <View style={styles.infoPill}>
            <Text style={styles.infoPillText}>
              {toilet.isPaid ? `Payant (${toilet.price || "?"}€)` : "Gratuit"}
            </Text>
          </View>
          {toilet.source === "ratp" && (
            <View
              style={[
                styles.infoPill,
                { backgroundColor: "rgba(168, 85, 247, 0.1)" },
              ]}
            >
              <Text
                style={{ color: "#a855f7", fontSize: 10, fontWeight: "bold" }}
              >
                RATP
              </Text>
            </View>
          )}
        </View>

        <View style={styles.features}>
          {toilet.isPMR && <Text style={styles.featureText}>♿ Accès PMR</Text>}
          {toilet.hasBabyRelay && (
            <Text style={styles.featureText}>👶 Relais Bébé</Text>
          )}
          <Text style={styles.featureText}>🕒 {toilet.openingHours}</Text>
        </View>

        {/* Community Comments Section */}
        <View style={styles.commentsContainer}>
          <Text style={styles.commentsTitle}>Avis de la communauté</Text>
          {isLoadingComments ? (
            <ActivityIndicator
              size="small"
              color="#8E8E93"
              style={{ marginVertical: 10 }}
            />
          ) : comments.length > 0 ? (
            <FlatList
              data={comments}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={styles.commentItem}>
                  <Text style={styles.commentUser}>
                    {item.pseudo || "Anonyme"}
                  </Text>
                  <Text style={styles.commentText}>{item.comment}</Text>
                </View>
              )}
              style={styles.commentsList}
              scrollEnabled={false} // List inside scrollable modal might need this or just limit
            />
          ) : (
            <Text style={styles.noComments}>
              Soyez le premier à laisser un avis.
            </Text>
          )}

          <View style={styles.commentInputRow}>
            <TextInput
              style={styles.commentInput}
              placeholder="Ajouter un avis..."
              value={commentText}
              onChangeText={setCommentText}
              maxLength={200}
            />
            <TouchableOpacity
              onPress={handleSendComment}
              disabled={!commentText.trim()}
            >
              <Ionicons
                name="send"
                size={24}
                color={commentText.trim() ? "#007AFF" : "#C7C7CC"}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Call to Action Container */}
        <View style={styles.actionContainer}>
          <TouchableOpacity style={styles.primaryButton} onPress={openGPS}>
            <Ionicons name="navigate" size={20} color="#FFF" />
            <Text style={styles.primaryButtonText}>Itinéraire Rapide</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.reportButton} onPress={handleReport}>
            <Ionicons name="warning-outline" size={20} color="#FF3B30" />
            <Text style={styles.reportButtonText}>
              Signaler un problème (+10 XP)
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  titleContainer: { flex: 1, paddingRight: 10 },
  headerImageContainer: {
    width: "100%",
    height: 120,
    backgroundColor: "rgba(19, 229, 236, 0.05)",
    borderRadius: 16,
    marginBottom: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  headerImage: {
    width: 80,
    height: 80,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    fontFamily: "Plus Jakarta Sans",
    color: "#0f172a",
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 9999,
    marginLeft: 8,
  },
  subtitle: {
    fontSize: 12,
    color: "#64748b",
    fontFamily: "Plus Jakarta Sans",
    marginBottom: 8,
  },
  favoriteBtn: { padding: 8, alignSelf: "center" },
  badgesRow: {
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
    marginBottom: 16,
    flexWrap: "wrap",
  },
  infoPill: { flexDirection: "row", alignItems: "center", gap: 4 },
  infoPillText: {
    fontSize: 11,
    color: "#64748b",
    fontFamily: "Plus Jakarta Sans",
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    backgroundColor: "#F2F2F7",
  },
  badgeText: { fontWeight: "600", color: "#0f172a" },
  features: { marginTop: 10, gap: 8 },
  featureText: {
    fontSize: 14,
    color: "#64748b",
    fontFamily: "Plus Jakarta Sans",
  },
  commentsContainer: {
    marginTop: 25,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9",
  },
  commentsTitle: {
    fontSize: 16,
    fontWeight: "700",
    fontFamily: "Plus Jakarta Sans",
    marginBottom: 15,
    color: "#0f172a",
  },
  commentsList: {
    marginBottom: 15,
  },
  commentItem: {
    marginBottom: 12,
    backgroundColor: "#f6f8f8",
    padding: 12,
    borderRadius: 16,
  },
  commentUser: {
    fontSize: 13,
    fontWeight: "700",
    color: "#13e5ec",
    marginBottom: 4,
    fontFamily: "Plus Jakarta Sans",
  },
  commentText: {
    fontSize: 14,
    color: "#0f172a",
    fontFamily: "Plus Jakarta Sans",
  },
  noComments: {
    color: "#64748b",
    fontSize: 14,
    fontStyle: "italic",
    marginBottom: 15,
  },
  commentInputRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f6f8f8",
    borderRadius: 9999,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  commentInput: {
    flex: 1,
    height: 40,
    fontSize: 14,
    fontFamily: "Plus Jakarta Sans",
    color: "#0f172a",
  },
  actionContainer: { marginTop: 30, gap: 12 },
  primaryButton: {
    backgroundColor: "#13e5ec", // Stitch primary
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    borderRadius: 9999,
    gap: 8,
    shadowColor: "#13e5ec",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 4,
  },
  primaryButtonText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "700",
    fontFamily: "Plus Jakarta Sans",
  },
  reportButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    borderRadius: 9999,
    backgroundColor: "rgba(239, 68, 68, 0.1)", // Light red background
    gap: 8,
  },
  reportButtonText: {
    color: "#ef4444",
    fontSize: 14,
    fontWeight: "700",
    fontFamily: "Plus Jakarta Sans",
  },
});
