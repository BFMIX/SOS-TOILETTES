import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { useStore } from "../store/useStore";
import { Ionicons } from "@expo/vector-icons";
import { Toilet } from "../models/types";

export default function FavoritesScreen() {
  const { user, toilets, toggleFavorite } = useStore();
  const isDark = useStore((state) => state.theme) === "dark";

  const favoriteToilets = toilets.filter((t) =>
    user?.favorites?.includes(t.id),
  );

  const renderItem = ({ item }: { item: Toilet }) => (
    <View
      style={[styles.card, { backgroundColor: isDark ? "#1C1C1E" : "#FFF" }]}
    >
      <View style={styles.cardInfo}>
        <Text style={[styles.address, { color: isDark ? "#FFF" : "#000" }]}>
          {item.address}
        </Text>
        <Text style={styles.source}>
          {item.source.toUpperCase()}{" "}
          {item.arrondissement ? `- 750${item.arrondissement}` : ""}
        </Text>
      </View>
      <TouchableOpacity onPress={() => toggleFavorite(item.id)}>
        <Ionicons name="heart" size={24} color="#FF2D55" />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: isDark ? "#000" : "#F2F2F7" },
      ]}
    >
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      <View style={styles.header}>
        <Text style={[styles.title, { color: isDark ? "#FFF" : "#000" }]}>
          Mes Favoris
        </Text>
      </View>

      {favoriteToilets.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="heart-outline" size={80} color="#8E8E93" />
          <Text style={styles.emptyText}>
            Vous n'avez pas encore de favoris.
          </Text>
          <Text style={styles.emptySubtext}>
            Cliquez sur le cœur d'une toilette sur la carte pour l'ajouter ici.
          </Text>
        </View>
      ) : (
        <FlatList
          data={favoriteToilets}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    padding: 20,
    paddingTop: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
  },
  list: {
    paddingHorizontal: 20,
    gap: 12,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardInfo: {
    flex: 1,
  },
  address: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  source: {
    fontSize: 12,
    color: "#8E8E93",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#8E8E93",
    marginTop: 20,
    textAlign: "center",
  },
  emptySubtext: {
    fontSize: 14,
    color: "#8E8E93",
    marginTop: 8,
    textAlign: "center",
  },
});
