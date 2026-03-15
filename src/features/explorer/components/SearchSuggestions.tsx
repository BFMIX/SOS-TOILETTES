import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { GeocodingSuggestion } from "@/types/models";
import { useAppTheme } from "@/theme/ThemeProvider";

interface SearchSuggestionsProps {
  suggestions: GeocodingSuggestion[];
  onSelect: (suggestion: GeocodingSuggestion) => void;
}

export const SearchSuggestions = ({
  suggestions,
  onSelect
}: SearchSuggestionsProps) => {
  const theme = useAppTheme();

  if (!suggestions.length) {
    return null;
  }

  return (
    <View
      style={[
        styles.container,
        theme.shadow.soft,
        {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border
        }
      ]}
    >
      {suggestions.map((suggestion) => (
        <Pressable
          key={suggestion.id}
          onPress={() => onSelect(suggestion)}
          style={styles.row}
        >
          <Text
            numberOfLines={1}
            style={[
              styles.label,
              { color: theme.colors.text, fontFamily: theme.typography.family.bold }
            ]}
          >
            {suggestion.label}
          </Text>
          <Text
            numberOfLines={1}
            style={[
              styles.subtitle,
              {
                color: theme.colors.textSecondary,
                fontFamily: theme.typography.family.medium
              }
            ]}
          >
            {suggestion.subtitle}
          </Text>
        </Pressable>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 24,
    borderWidth: 1,
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 10
  },
  row: {
    gap: 2,
    minHeight: 52,
    justifyContent: "center",
    paddingHorizontal: 8
  },
  label: {
    fontSize: 14
  },
  subtitle: {
    fontSize: 12
  }
});
