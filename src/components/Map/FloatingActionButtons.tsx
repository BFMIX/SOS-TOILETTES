import React from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface Props {
  showAll: boolean;
  onToggleShowAll: () => void;
  onLocateUser: () => void;
}

export default function FloatingActionButtons({
  showAll,
  onToggleShowAll,
  onLocateUser,
}: Props) {
  return (
    <View style={styles.container}>
      {/* Boton Centrer sur l'utilisateur */}
      <TouchableOpacity style={styles.iconButton} onPress={onLocateUser}>
        <Ionicons name="location" size={24} color="#1C1C1E" />
      </TouchableOpacity>

      {/* Boton Toggle Proche/Toutes */}
      <TouchableOpacity
        style={[
          styles.toggleButton,
          showAll ? styles.toggleActive : styles.toggleInactive,
        ]}
        onPress={onToggleShowAll}
      >
        <Ionicons
          name={showAll ? "map" : "navigate"}
          size={20}
          color={showAll ? "#FFF" : "#1C1C1E"}
        />
        <Text
          style={[
            styles.toggleText,
            showAll ? styles.textActive : styles.textInactive,
          ]}
        >
          {showAll ? "Toutes les toilettes" : "Autour de moi"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: Platform.OS === "ios" ? 180 : 160,
    right: 20,
    alignItems: "flex-end",
    gap: 15,
  },
  iconButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#FFF",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  toggleButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
    gap: 8,
  },
  toggleActive: {
    backgroundColor: "#000",
  },
  toggleInactive: {
    backgroundColor: "#FFF",
  },
  toggleText: {
    fontWeight: "bold",
    fontSize: 14,
  },
  textActive: {
    color: "#FFF",
  },
  textInactive: {
    color: "#1C1C1E",
  },
});
