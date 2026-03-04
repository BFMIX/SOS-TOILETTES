import React from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Text,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const AVATARS = [
  { id: "1", icon: "person", color: "#007AFF" },
  { id: "2", icon: "star", color: "#FF9500" },
  { id: "3", icon: "leaf", color: "#34C759" },
  { id: "4", icon: "heart", color: "#FF3B30" },
  { id: "5", icon: "flash", color: "#AF52DE" },
  { id: "6", icon: "planet", color: "#5856D6" },
  { id: "7", icon: "sunny", color: "#FFCC00" },
  { id: "8", icon: "paw", color: "#8E8E93" },
];

interface Props {
  visible: boolean;
  onClose: () => void;
  onSelect: (avatarUrl: string) => void;
}

export default function AvatarPicker({ visible, onClose, onSelect }: Props) {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>Choisir un avatar</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close-circle" size={28} color="#8E8E93" />
            </TouchableOpacity>
          </View>

          <FlatList
            data={AVATARS}
            numColumns={4}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[styles.item, { backgroundColor: item.color + "20" }]}
                onPress={() => onSelect(`ICON:${item.icon}:${item.color}`)}
              >
                <Ionicons
                  name={item.icon as any}
                  size={32}
                  color={item.color}
                />
              </TouchableOpacity>
            )}
            contentContainerStyle={styles.list}
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  content: {
    backgroundColor: "#FFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    minHeight: 300,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  list: {
    alignItems: "center",
  },
  item: {
    width: 60,
    height: 60,
    borderRadius: 30,
    margin: 10,
    justifyContent: "center",
    alignItems: "center",
  },
});
