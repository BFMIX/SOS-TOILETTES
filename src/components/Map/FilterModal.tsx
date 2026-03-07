import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Dimensions,
} from "react-native";
import Modal from "react-native-modal";
import { Ionicons } from "@expo/vector-icons";
import { useStore } from "../../store/useStore";

interface Props {
  isVisible: boolean;
  onClose: () => void;
  activeFilters: string[];
  onToggleFilter: (id: string) => void;
  isDark: boolean;
}

export default function FilterModal({
  isVisible,
  onClose,
  activeFilters,
  onToggleFilter,
  isDark,
}: Props) {
  const filters = [
    { id: "pmr", label: "Accès PMR", icon: "body" },
    { id: "free", label: "Gratuit", icon: "cash-outline" },
    { id: "open", label: "Ouvert Actuellement", icon: "time-outline" },
    { id: "baby", label: "Relais Bébé", icon: "baby-outline" },
  ];

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onClose}
      onSwipeComplete={onClose}
      swipeDirection="down"
      style={styles.modal}
      propagateSwipe={true}
    >
      <View
        style={[
          styles.container,
          { backgroundColor: isDark ? "#0f172a" : "#FFF" },
        ]}
      >
        <View style={styles.dragIndicator} />
        <View style={styles.header}>
          <Text
            style={[styles.title, { color: isDark ? "#f1f5f9" : "#0f172a" }]}
          >
            Filtres
          </Text>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <Ionicons
              name="close"
              size={24}
              color={isDark ? "#94a3b8" : "#64748b"}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.filterList}>
          {filters.map((filter) => {
            const isActive = activeFilters.includes(filter.id);
            return (
              <TouchableOpacity
                key={filter.id}
                onPress={() => onToggleFilter(filter.id)}
                style={[
                  styles.filterRow,
                  { borderBottomColor: isDark ? "#334155" : "#f1f5f9" },
                ]}
              >
                <View style={styles.filterLeft}>
                  <Ionicons
                    name={filter.icon as any}
                    size={22}
                    color={
                      isActive ? "#13e5ec" : isDark ? "#94a3b8" : "#64748b"
                    }
                  />
                  <Text
                    style={[
                      styles.filterLabel,
                      { color: isDark ? "#f1f5f9" : "#0f172a" },
                    ]}
                  >
                    {filter.label}
                  </Text>
                </View>
                <View
                  style={[styles.checkbox, isActive && styles.checkboxActive]}
                >
                  {isActive && (
                    <Ionicons name="checkmark" size={16} color="#000" />
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
        <TouchableOpacity style={styles.applyBtn} onPress={onClose}>
          <Text style={styles.applyText}>Afficher les résultats</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modal: {
    justifyContent: "flex-end",
    margin: 0,
  },
  container: {
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: Platform.OS === "ios" ? 40 : 20,
    minHeight: Dimensions.get("window").height * 0.5,
  },
  dragIndicator: {
    width: 48,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#cbd5e1",
    alignSelf: "center",
    marginBottom: 20,
    marginTop: 4,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 30,
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    fontFamily: "Plus Jakarta Sans",
  },
  closeBtn: {
    padding: 4,
  },
  filterList: {
    flex: 1,
  },
  filterRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  filterLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  filterLabel: {
    fontSize: 16,
    fontFamily: "Plus Jakarta Sans",
    fontWeight: "600",
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#cbd5e1",
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxActive: {
    backgroundColor: "#13e5ec",
    borderColor: "#13e5ec",
  },
  applyBtn: {
    backgroundColor: "#13e5ec",
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
    marginTop: 20,
    shadowColor: "#13e5ec",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 4,
  },
  applyText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "800",
    fontFamily: "Plus Jakarta Sans",
  },
});
