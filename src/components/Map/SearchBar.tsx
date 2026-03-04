import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Text,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface SearchBarProps {
  onSearch: (text: string) => void;
  onFilterChange: (filters: any) => void;
  isDark: boolean;
}

export default function SearchBar({
  onSearch,
  onFilterChange,
  isDark,
}: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const filters = [
    { id: "pmr", label: "PMR", icon: "body" },
    { id: "free", label: "Gratuit", icon: "cash-outline" },
    { id: "open", label: "Ouvert", icon: "time-outline" },
    { id: "baby", label: "Bébé", icon: "baby-outline" },
  ];

  const toggleFilter = (id: string) => {
    const newFilters = activeFilters.includes(id)
      ? activeFilters.filter((f) => f !== id)
      : [...activeFilters, id];
    setActiveFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <View style={styles.wrapper}>
      <View
        style={[
          styles.container,
          { backgroundColor: isDark ? "#1C1C1E" : "#FFF" },
        ]}
      >
        <Ionicons
          name="search"
          size={20}
          color="#8E8E93"
          style={styles.searchIcon}
        />
        <TextInput
          style={[styles.input, { color: isDark ? "#FFF" : "#000" }]}
          placeholder="Rechercher une adresse..."
          placeholderTextColor="#8E8E93"
          value={query}
          onChangeText={(text) => {
            setQuery(text);
            onSearch(text);
          }}
        />
        {query.length > 0 && (
          <TouchableOpacity
            onPress={() => {
              setQuery("");
              onSearch("");
            }}
          >
            <Ionicons name="close-circle" size={20} color="#8E8E93" />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterScroll}
        contentContainerStyle={styles.filterContent}
      >
        {filters.map((filter) => {
          const isActive = activeFilters.includes(filter.id);
          return (
            <TouchableOpacity
              key={filter.id}
              onPress={() => toggleFilter(filter.id)}
              style={[
                styles.filterChip,
                { backgroundColor: isDark ? "#1C1C1E" : "#FFF" },
                isActive && styles.filterChipActive,
              ]}
            >
              <Ionicons
                name={filter.icon as any}
                size={14}
                color={isActive ? "#FFF" : "#007AFF"}
              />
              <Text
                style={[
                  styles.filterText,
                  { color: isDark ? "#FFF" : "#1C1C1E" },
                  isActive && { color: "#FFF" },
                ]}
              >
                {filter.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    top: Platform.OS === "ios" ? 60 : 40,
    left: 15,
    right: 15,
    zIndex: 10,
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    height: 50,
    borderRadius: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  searchIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontWeight: "500",
  },
  filterScroll: {
    marginTop: 10,
  },
  filterContent: {
    paddingRight: 15,
  },
  filterChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    gap: 5,
  },
  filterChipActive: {
    backgroundColor: "#007AFF",
  },
  filterText: {
    fontSize: 13,
    fontWeight: "600",
  },
});
