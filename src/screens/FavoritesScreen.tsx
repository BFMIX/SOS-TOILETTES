import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Platform,
  useColorScheme,
  Image,
} from "react-native";
import { useStore } from "../store/useStore";
import { Ionicons } from "@expo/vector-icons";
import { Toilet } from "../models/types";

const ACCENT = "#13e5ec";

export default function FavoritesScreen() {
  const { user, toilets, toggleFavorite } = useStore();
  const themeStore = useStore((state) => state.theme);
  const systemColorScheme = useColorScheme();
  const isDark =
    themeStore === "auto"
      ? systemColorScheme === "dark"
      : themeStore === "dark";

  const favoriteToilets = toilets.filter((t) =>
    user?.favorites?.includes(t.id),
  );

  const getStatusColor = (status: string) => {
    if (status === "open") return "#34C759";
    if (status === "out_of_order") return "#FF3B30";
    return "#FF9500";
  };

  const getStatusLabel = (status: string) => {
    if (status === "open") return "Ouvert";
    if (status === "out_of_order") return "Hors service";
    return "Inconnu";
  };

  const renderItem = ({ item }: { item: Toilet }) => (
    <View
      style={[styles.card, { backgroundColor: isDark ? "#1C1C1E" : "#FFFFFF" }]}
    >
      <View style={styles.imageContainer}>
        <Image
          source={require("../../assets/Toilette_generic.png")}
          style={styles.cardImage}
          resizeMode="contain"
        />
        <View
          style={[
            styles.statusDot,
            { backgroundColor: getStatusColor(item.status) },
          ]}
        />
      </View>

      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <Text
            style={[styles.cardTitle, { color: isDark ? "#FFF" : "#1A1A2E" }]}
            numberOfLines={1}
          >
            {item.address}
          </Text>
          <TouchableOpacity
            onPress={() => toggleFavorite(item.id)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="heart" size={22} color="#FF2D55" />
          </TouchableOpacity>
        </View>

        <Text style={styles.cardSubtitle}>
          {item.source === "paris"
            ? "Sanisette"
            : item.source === "ratp"
              ? "Station RATP"
              : "IDF"}{" "}
          • {item.arrondissement ? `Paris ${item.arrondissement}` : "Paris"}
        </Text>

        {/* Tags row */}
        <View style={styles.tagsRow}>
          <View
            style={[
              styles.tag,
              {
                backgroundColor: isDark
                  ? "rgba(19,229,236,0.15)"
                  : "rgba(19,229,236,0.1)",
              },
            ]}
          >
            <Text style={[styles.tagText, { color: ACCENT }]}>
              {item.isPaid ? `${item.price || "0.50"}€` : "Gratuit"}
            </Text>
          </View>

          {item.isPMR && (
            <View
              style={[
                styles.tag,
                {
                  backgroundColor: isDark
                    ? "rgba(88,86,214,0.15)"
                    : "rgba(88,86,214,0.1)",
                },
              ]}
            >
              <Text style={[styles.tagText, { color: "#5856D6" }]}>♿ PMR</Text>
            </View>
          )}

          {item.hasBabyRelay && (
            <View
              style={[
                styles.tag,
                {
                  backgroundColor: isDark
                    ? "rgba(255,149,0,0.15)"
                    : "rgba(255,149,0,0.1)",
                },
              ]}
            >
              <Text style={[styles.tagText, { color: "#FF9500" }]}>
                🍼 Bébé
              </Text>
            </View>
          )}

          <View
            style={[
              styles.tag,
              {
                backgroundColor: isDark
                  ? "rgba(52,199,89,0.15)"
                  : "rgba(52,199,89,0.1)",
              },
            ]}
          >
            <Text
              style={[styles.tagText, { color: getStatusColor(item.status) }]}
            >
              {getStatusLabel(item.status)}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: isDark ? "#102122" : "#f6f8f8" },
      ]}
    >
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: isDark ? "#f1f5f9" : "#0f172a" }]}>
          Favoris
        </Text>
        <Text style={styles.subtitle}>
          {favoriteToilets.length}{" "}
          {favoriteToilets.length > 1 ? "lieux sauvegardés" : "lieu sauvegardé"}
        </Text>
      </View>

      {favoriteToilets.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View
            style={[
              styles.emptyIconBg,
              {
                backgroundColor: isDark
                  ? "rgba(19,229,236,0.1)"
                  : "rgba(19,229,236,0.08)",
              },
            ]}
          >
            <Ionicons name="heart-outline" size={48} color={ACCENT} />
          </View>
          <Text
            style={[styles.emptyText, { color: isDark ? "#FFF" : "#1A1A2E" }]}
          >
            Aucun favori pour l'instant
          </Text>
          <Text style={styles.emptySubtext}>
            Appuyez sur le cœur d'une sanisette pour la retrouver ici
            facilement.
          </Text>
        </View>
      ) : (
        <FlatList
          data={favoriteToilets}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: 24,
    paddingTop: Platform.OS === "ios" ? 16 : 40,
    paddingBottom: 16,
  },
  title: {
    fontSize: 28,
    fontFamily: "Plus Jakarta Sans",
    fontWeight: "700",
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: "Plus Jakarta Sans",
    color: "#64748b",
    marginTop: 4,
  },
  list: {
    paddingHorizontal: 20,
    paddingBottom: 100,
    gap: 16,
  },
  card: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 16,
    borderRadius: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
    gap: 16, // added gap between image and content
  },
  imageContainer: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: "rgba(19, 229, 236, 0.05)", // light primary tint background
    justifyContent: "center",
    alignItems: "center",
  },
  cardImage: {
    width: 44,
    height: 44,
  },
  statusDot: {
    position: "absolute",
    bottom: -2,
    right: -2,
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: "#FFF", // This gets overridden dynamically for dark mode if needed but white is standard for border out badges
  },
  cardContent: {
    flex: 1,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardTitle: {
    fontSize: 16,
    fontFamily: "Plus Jakarta Sans",
    fontWeight: "700",
    flex: 1,
    marginRight: 8,
  },
  cardSubtitle: {
    fontSize: 13,
    fontFamily: "Plus Jakarta Sans",
    color: "#64748b",
    marginTop: 2,
  },
  tagsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginTop: 12,
  },
  tag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 9999,
  },
  tagText: {
    fontSize: 12,
    fontFamily: "Plus Jakarta Sans",
    fontWeight: "700",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  emptyIconBg: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  emptyText: {
    fontSize: 20,
    fontFamily: "Plus Jakarta Sans",
    fontWeight: "700",
    textAlign: "center",
  },
  emptySubtext: {
    fontSize: 14,
    fontFamily: "Plus Jakarta Sans",
    color: "#64748b",
    marginTop: 8,
    textAlign: "center",
    lineHeight: 20,
  },
});
