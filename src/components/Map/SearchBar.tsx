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
import FilterModal from "./FilterModal";
import { Toilet } from "../../models/types";
import { useStore } from "../../store/useStore";

interface SearchBarProps {
  onSearch: (text: string) => void;
  onFilterChange: (filters: any) => void;
  isDark: boolean;
  onLocationSelect: (location: {
    latitude: number;
    longitude: number;
    address: string;
  }) => void;
}

export default function SearchBar({
  onSearch,
  onFilterChange,
  isDark,
  onLocationSelect,
}: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [isFilterModalVisible, setFilterModalVisible] = useState(false);
  const [apiSuggestions, setApiSuggestions] = useState<any[]>([]);

  const searchAddress = async (text: string) => {
    setQuery(text);
    onSearch(text);

    if (text.length > 2) {
      try {
        // Paris coordinates hint
        const response = await fetch(
          `https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(text)}&lat=48.8566&lon=2.3522&limit=5`,
        );
        const data = await response.json();
        setApiSuggestions(data.features || []);
      } catch (error) {
        console.error("Error fetching addresses:", error);
      }
    } else {
      setApiSuggestions([]);
    }
  };

  const toggleFilter = (id: string) => {
    const newFilters = activeFilters.includes(id)
      ? activeFilters.filter((f) => f !== id)
      : [...activeFilters, id];
    setActiveFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.topRow}>
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
            onChangeText={searchAddress}
          />
          {query.length > 0 && (
            <TouchableOpacity
              onPress={() => {
                setQuery("");
                onSearch("");
                setApiSuggestions([]);
              }}
            >
              <Ionicons name="close-circle" size={20} color="#8E8E93" />
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity
          style={[
            styles.filterBtn,
            { backgroundColor: isDark ? "#1C1C1E" : "#FFF" },
          ]}
          onPress={() => setFilterModalVisible(true)}
        >
          <Ionicons
            name="options-outline"
            size={22}
            color={isDark ? "#FFF" : "#000"}
          />
        </TouchableOpacity>
      </View>

      {/* Autocomplete Dropdown */}
      {apiSuggestions.length > 0 && (
        <View
          style={[
            styles.autocompleteContainer,
            { backgroundColor: isDark ? "#1C1C1E" : "#FFF" },
          ]}
        >
          {apiSuggestions.map((feature, index) => {
            const addressLabel = feature.properties.label;
            const [lon, lat] = feature.geometry.coordinates;

            return (
              <TouchableOpacity
                key={feature.properties.id || index.toString()}
                style={[
                  styles.suggestionItem,
                  index < apiSuggestions.length - 1 && {
                    borderBottomColor: isDark ? "#333" : "#F0F0F0",
                    borderBottomWidth: 1,
                  },
                ]}
                onPress={() => {
                  setQuery("");
                  onSearch("");
                  setApiSuggestions([]);
                  onLocationSelect({
                    latitude: lat,
                    longitude: lon,
                    address: addressLabel,
                  });
                }}
              >
                <Ionicons name="location-outline" size={16} color="#8E8E93" />
                <Text
                  style={[
                    styles.suggestionText,
                    { color: isDark ? "#FFF" : "#000" },
                  ]}
                  numberOfLines={1}
                >
                  {addressLabel}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      )}

      <FilterModal
        isVisible={isFilterModalVisible}
        onClose={() => setFilterModalVisible(false)}
        activeFilters={activeFilters}
        onToggleFilter={toggleFilter}
        isDark={isDark}
      />
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
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  container: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    height: 56,
    borderRadius: 9999, // Stitch pill shape
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
  },
  filterBtn: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
  },
  searchIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontFamily: "Plus Jakarta Sans",
  },
  autocompleteContainer: {
    marginTop: 8,
    borderRadius: 16,
    paddingVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
  },
  suggestionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 10,
  },
  suggestionText: {
    fontFamily: "Plus Jakarta Sans",
    fontSize: 14,
    flex: 1,
  },
});
