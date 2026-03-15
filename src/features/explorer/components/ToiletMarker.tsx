import React, { memo } from "react";
import { Image, StyleSheet, View } from "react-native";
import { Marker } from "react-native-maps";

const markerImage = require("../../../../assets/images/paris_sanisette.png");

interface ToiletMarkerProps {
  latitude: number;
  longitude: number;
  selected?: boolean;
  size?: number;
  onPress: () => void;
}

const ToiletMarkerComponent = ({
  latitude,
  longitude,
  selected,
  size = 54,
  onPress
}: ToiletMarkerProps) => (
  <Marker
    coordinate={{ latitude, longitude }}
    onPress={onPress}
    tracksViewChanges={false}
  >
    <View style={[styles.markerWrap, selected && styles.selected]}>
      <Image source={markerImage} style={[styles.image, { height: size, width: size }]} />
    </View>
  </Marker>
);

export const ToiletMarker = memo(
  ToiletMarkerComponent,
  (prev, next) =>
    prev.latitude === next.latitude &&
    prev.longitude === next.longitude &&
    prev.selected === next.selected &&
    prev.size === next.size
);

const styles = StyleSheet.create({
  markerWrap: {
    alignItems: "center",
    justifyContent: "center"
  },
  selected: {
    transform: [{ scale: 1.1 }]
  },
  image: {
    height: 60,
    width: 60
  }
});
