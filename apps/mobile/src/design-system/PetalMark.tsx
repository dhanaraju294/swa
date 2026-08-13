import React from 'react';
import { View } from 'react-native';
import Svg, { Rect, Defs, LinearGradient, Stop } from 'react-native-svg';

type Props = {
  size?: number;
};

export function PetalMark({ size = 34 }: Props) {
  return (
    <View style={{ width: size, height: size, opacity: 0.9 }}>
      <Svg viewBox="0 0 34 34" width={size} height={size}>
        <Defs>
          <LinearGradient id="petalGold" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor="#F6C453" />
            <Stop offset="100%" stopColor="#F4A896" />
          </LinearGradient>
          <LinearGradient id="petalBlue" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor="#A8D8EA" />
            <Stop offset="100%" stopColor="#D8C8E8" />
          </LinearGradient>
        </Defs>
        <Rect x="3" y="2" width="10" height="30" rx="5" fill="url(#petalGold)" transform="rotate(-8 8 17)" />
        <Rect x="21" y="2" width="10" height="30" rx="5" fill="url(#petalBlue)" transform="rotate(8 26 17)" />
      </Svg>
    </View>
  );
}
