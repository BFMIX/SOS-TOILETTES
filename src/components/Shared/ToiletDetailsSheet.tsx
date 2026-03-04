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

    const commentsRef = collection(
      db,
      "Toilets_Overrides",
      toilet.id,
      "Reports",
    );
    const q = query(commentsRef, orderBy("createdAt", "desc"), limit(20));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs
        .map((d) => ({
          id: d.id,
          ...d.data(),
        }))
        .filter((c) => (c as any).type === "comment"); // Only show comments here

      setComments(list);
      setIsLoadingComments(false);
    });

    return () => unsubscribe();
  }, [toilet.id]);

  const handleSendComment = async () => {
    if (!commentText.trim()) return;
    if (!db || !auth?.currentUser) return;

    try {
      const reportsRef = collection(
        db,
        "Toilets_Overrides",
        toilet.id,
        "Reports",
      );
      await addDoc(reportsRef, {
        userId: auth.currentUser.uid,
        userName: user?.firstName || "Explorateur",
        type: "comment",
        comment: commentText.trim(),
        createdAt: serverTimestamp(),
      });

      // Bonus XP for comment
      const userRef = doc(db, "Users", auth.currentUser.uid);
      await setDoc(userRef, { xp: increment(2) }, { merge: true });

      setCommentText("");
    } catch (err) {
      console.error(err);
      Alert.alert("Erreur", "Impossible de publier le commentaire.");
    }
  };

  const openGPS = () => {
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
              const toiletRef = doc(db!, "Toilets_Overrides", toilet.id);

              // Increment negative reports on the toilet
              await setDoc(
                toiletRef,
                {
                  negativeReportsCount: increment(1),
                  lastUpdate: serverTimestamp(),
                },
                { merge: true },
              );

              // Add specific report
              const reportsRef = collection(
                db!,
                "Toilets_Overrides",
                toilet.id,
                "Reports",
              );
              await addDoc(reportsRef, {
                userId: auth!.currentUser!.uid,
                type: "broken",
                createdAt: serverTimestamp(),
              });

              // Increment User XP
              const userRef = doc(db!, "Users", auth!.currentUser!.uid);
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
            <Text style={styles.title}>{toilet.address}</Text>
            {toilet.arrondissement && (
              <Text style={styles.subtitle}>{toilet.arrondissement}</Text>
            )}
          </View>
          <TouchableOpacity
            style={styles.favoriteBtn}
            onPress={() => toggleFavorite(toilet.id)}
          >
            <Ionicons
              name={isFavorite ? "heart" : "heart-outline"}
              size={28}
              color="#FF3B30"
            />
          </TouchableOpacity>
        </View>

        <View style={styles.badgesRow}>
          {toilet.status === "open" ? (
            <View style={[styles.badge, { backgroundColor: "#E5F9E7" }]}>
              <Text style={{ color: "#34C759", fontWeight: "bold" }}>
                Ouvert
              </Text>
            </View>
          ) : (
            <View style={[styles.badge, { backgroundColor: "#FFEBEB" }]}>
              <Text style={{ color: "#FF3B30", fontWeight: "bold" }}>
                Hors Service
              </Text>
            </View>
          )}
          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              {toilet.isPaid ? `Payant (${toilet.price || "?"}€)` : "Gratuit"}
            </Text>
          </View>
          {toilet.source === "ratp" && (
            <View style={[styles.badge, { backgroundColor: "#F4E8FB" }]}>
              <Text style={{ color: "#AF52DE", fontWeight: "bold" }}>RATP</Text>
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
                    {item.userName || "Anonyme"}
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
  title: { fontSize: 22, fontWeight: "bold", color: "#1C1C1E" },
  subtitle: { fontSize: 14, color: "#8E8E93", marginTop: 4 },
  favoriteBtn: { padding: 8 },
  badgesRow: { flexDirection: "row", marginTop: 15, gap: 10, flexWrap: "wrap" },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    backgroundColor: "#F2F2F7",
  },
  badgeText: { fontWeight: "600", color: "#1C1C1E" },
  features: { marginTop: 20, gap: 8 },
  featureText: { fontSize: 16, color: "#8E8E93" },
  commentsContainer: {
    marginTop: 25,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: "#F2F2F7",
  },
  commentsTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#1C1C1E",
  },
  commentsList: {
    marginBottom: 15,
  },
  commentItem: {
    marginBottom: 12,
    backgroundColor: "#F2F2F7",
    padding: 10,
    borderRadius: 8,
  },
  commentUser: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#007AFF",
    marginBottom: 2,
  },
  commentText: {
    fontSize: 14,
    color: "#1C1C1E",
  },
  noComments: {
    color: "#8E8E93",
    fontSize: 14,
    fontStyle: "italic",
    marginBottom: 15,
  },
  commentInputRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F2F2F7",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  commentInput: {
    flex: 1,
    height: 35,
    fontSize: 15,
    color: "#1C1C1E",
  },
  actionContainer: { marginTop: 30, gap: 15 },
  primaryButton: {
    backgroundColor: "#000",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  primaryButtonText: { color: "#FFF", fontSize: 18, fontWeight: "bold" },
  reportButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E5EA",
    gap: 8,
  },
  reportButtonText: { color: "#1C1C1E", fontSize: 16, fontWeight: "600" },
});
