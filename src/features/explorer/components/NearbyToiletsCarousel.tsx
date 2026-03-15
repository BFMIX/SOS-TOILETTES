import React from "react";
import { FlatList, StyleSheet, View } from "react-native";

import { ToiletCard } from "@/components/common/ToiletCard";
import { NearbyToiletCard } from "@/types/models";

interface NearbyToiletsCarouselProps {
  items: NearbyToiletCard[];
  onSelect: (item: NearbyToiletCard) => void;
  onToggleFavorite: (item: NearbyToiletCard) => void;
}

export const NearbyToiletsCarousel = ({
  items,
  onSelect,
  onToggleFavorite
}: NearbyToiletsCarouselProps) => (
  <FlatList
    contentContainerStyle={styles.content}
    data={items}
    horizontal
    keyExtractor={(item) => item.id}
    renderItem={({ item }) => (
      <View style={styles.cardWrap}>
        <ToiletCard
          distanceMeters={item.distanceMeters}
          favorite={item.favorite}
          onPress={() => onSelect(item)}
          onToggleFavorite={() => onToggleFavorite(item)}
          status={item.communityStatus}
          subtitle={item.address}
          title={item.name}
          walkingMinutes={item.walkingMinutes}
        />
      </View>
    )}
    showsHorizontalScrollIndicator={false}
  />
);

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 18
  },
  cardWrap: {
    marginRight: 14,
    width: 286
  }
});
