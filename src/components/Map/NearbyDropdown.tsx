import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  FlatList,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Toilet } from "../../models/types";

interface Props {
  toilets: Toilet[];
  isDark: boolean;
  onSelectToilet: (toilet: Toilet) => void;
}

export default function NearbyDropdown({
  toilets,
  isDark,
  onSelectToilet,
}: Props) {
  const [expanded, setExpanded] = useState(false);

  // Take only top 5 closest or just first 5 for now
  const nearbyToilets = toilets.slice(0, 5);

  if (nearbyToilets.length === 0) return null;

  return (
    <View
      style={[styles.container, { top: Platform.OS === "ios" ? 140 : 120 }]}
    >
      <TouchableOpacity
        style={[
          styles.headerBtn,
          { backgroundColor: isDark ? "#0f172a" : "#FFF" },
        ]}
        onPress={() => setExpanded(!expanded)}
      >
        <View style={styles.headerLeft}>
          <Ionicons name="location" size={18} color="#13e5ec" />
          <Text
            style={[
              styles.headerText,
              { color: isDark ? "#f1f5f9" : "#0f172a" },
            ]}
          >
            {nearbyToilets.length} Sanisettes à proximité
          </Text>
        </View>
        <Ionicons
          name={expanded ? "chevron-up" : "chevron-down"}
          size={18}
          color={isDark ? "#94a3b8" : "#64748b"}
        />
      </TouchableOpacity>

      {expanded && (
        <View
          style={[
            styles.dropdown,
            { backgroundColor: isDark ? "#0f172a" : "#FFF" },
          ]}
        >
          {nearbyToilets.map((toilet, index) => (
            <TouchableOpacity
              key={toilet.id}
              style={[
                styles.itemRow,
                index < nearbyToilets.length - 1 && {
                  borderBottomWidth: StyleSheet.hairlineWidth,
                  borderBottomColor: isDark ? "#334155" : "#e2e8f0",
                },
              ]}
              onPress={() => {
                setExpanded(false);
                onSelectToilet(toilet);
              }}
            >
              <Image
                source={require("../../../assets/Toilette_generic.png")}
                style={styles.itemImage}
                resizeMode="contain"
              />
              <View style={styles.itemInfo}>
                <Text
                  style={[
                    styles.itemAddress,
                    { color: isDark ? "#f1f5f9" : "#0f172a" },
                  ]}
                  numberOfLines={1}
                >
                  {toilet.address}
                </Text>
                <Text style={styles.itemStatus}>
                  {toilet.status === "open" ? (
                    <Text style={{ color: "#22c55e" }}>En Service</Text>
                  ) : (
                    <Text style={{ color: "#ef4444" }}>Fermé</Text>
                  )}
                  {" • "}
                  {toilet.arrondissement || "Paris"}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 16,
    right: 16,
    zIndex: 15,
  },
  headerBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 9999,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  headerText: {
    fontFamily: "Plus Jakarta Sans",
    fontWeight: "700",
    fontSize: 14,
  },
  dropdown: {
    marginTop: 8,
    borderRadius: 20,
    padding: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 8,
    gap: 12,
  },
  itemImage: {
    width: 36,
    height: 36,
  },
  itemInfo: {
    flex: 1,
  },
  itemAddress: {
    fontFamily: "Plus Jakarta Sans",
    fontWeight: "700",
    fontSize: 14,
    marginBottom: 2,
  },
  itemStatus: {
    fontFamily: "Plus Jakarta Sans",
    fontSize: 12,
    color: "#64748b",
  },
});
