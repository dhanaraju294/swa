import React, { useEffect, useMemo, useRef } from "react";
import { Animated, StyleSheet, View, Platform } from "react-native";
/** Twelve native-driven particles; one shared value, no JS frame loop or unbounded allocation. */
export function FeedbackFX({
  eventId,
  positive,
  reducedMotion,
}: {
  eventId: number;
  positive: boolean;
  reducedMotion: boolean;
}) {
  const progress = useRef(new Animated.Value(1)).current;
  const particles = useMemo(
    () =>
      Array.from({ length: 12 }, (_, i) => ({
        dx: Math.cos((i * Math.PI) / 6) * (38 + (i % 3) * 14),
        dy: Math.sin((i * Math.PI) / 6) * (36 + (i % 3) * 12) - 8,
        color: ["#91AA70", "#CDB08B", "#88AAA8"][i % 3]!,
      })),
    [],
  );
  useEffect(() => {
    if (!eventId || !positive || reducedMotion) return;
    progress.stopAnimation();
    progress.setValue(0);
    const a = Animated.timing(progress, {
      toValue: 1,
      duration: 430,
      useNativeDriver: Platform.OS !== "web",
    });
    a.start();
    return () => a.stop();
  }, [eventId, positive, reducedMotion, progress]);
  if (reducedMotion) return null;
  return (
    <View pointerEvents="none" accessible={false} style={styles.layer}>
      {particles.map((p, i) => (
        <Animated.View
          key={i}
          style={[
            styles.dot,
            {
              backgroundColor: p.color,
              opacity: progress.interpolate({
                inputRange: [0, 0.6, 1],
                outputRange: [1, 0.55, 0],
              }),
              transform: [
                {
                  translateX: progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, p.dx],
                  }),
                },
                {
                  translateY: progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, p.dy],
                  }),
                },
                {
                  scale: progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: [1, 0.5],
                  }),
                },
              ],
            },
          ]}
        />
      ))}
    </View>
  );
}
const styles = StyleSheet.create({
  layer: { position: "absolute", left: "50%", top: "47%", zIndex: 3 },
  dot: { position: "absolute", width: 5, height: 5, borderRadius: 3 },
});
