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
      {/* Status indicator */}
      <View
        style={[
          styles.statusDot,
          { backgroundColor: getStatusColor(item.status) },
        ]}
      />

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
        { backgroundColor: isDark ? "#000" : "#F5F5FA" },
      ]}
    >
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: isDark ? "#FFF" : "#1A1A2E" }]}>
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
    fontSize: 32,
    fontWeight: "800",
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    color: "#8E8E93",
    marginTop: 4,
  },
  list: {
    paddingHorizontal: 20,
    paddingBottom: 100,
    gap: 12,
  },
  card: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 16,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginTop: 6,
    marginRight: 12,
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
    fontWeight: "700",
    flex: 1,
    marginRight: 8,
  },
  cardSubtitle: {
    fontSize: 13,
    color: "#8E8E93",
    marginTop: 2,
  },
  tagsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginTop: 10,
  },
  tag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  tagText: {
    fontSize: 12,
    fontWeight: "600",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  emptyIconBg: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
  },
  emptySubtext: {
    fontSize: 14,
    color: "#8E8E93",
    marginTop: 8,
    textAlign: "center",
    lineHeight: 20,
  },
});
