import React, { useEffect, useRef, useState } from 'react';
import { AccessibilityInfo, Animated, Easing, StyleSheet, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import type { StreakMood } from '../../journey/streakMood';

type Props = { mood: StreakMood; active?: boolean; reducedMotion?: boolean };

type Look = {
  halo: string;
  plinth: string;
  plinthTop: string;
  stem: string;
  leafLeft: string;
  leafRight: string;
  body: string;
  belly: string;
  cheeks: string;
  face: string;
};

// Same artwork and colours as the Android home-screen widget drawables
// (widget_blossom_*.xml) so the app and the widget always show the same Blossom.
const LOOKS: Record<StreakMood, Look> = {
  sad: {
    halo: '#E8E5DD',
    plinth: '#A3A59C',
    plinthTop: '#B8B8AE',
    stem: '#93978E',
    leafLeft: '#909A8C',
    leafRight: '#9BA395',
    body: '#D4D1C8',
    belly: '#C4BEB2',
    cheeks: '#B3A89B',
    face: '#625D55',
  },
  sprout: {
    halo: '#FFF0BD',
    plinth: '#86A77A',
    plinthTop: '#A9C29A',
    stem: '#88A87D',
    leafLeft: '#6D956D',
    leafRight: '#7FA77A',
    body: '#F8F1DF',
    belly: '#E9DECA',
    cheeks: '#E7B59C',
    face: '#554A40',
  },
  steady: {
    halo: '#FFF0BD',
    plinth: '#729C70',
    plinthTop: '#98B892',
    stem: '#88A87D',
    leafLeft: '#5B895F',
    leafRight: '#6E9E6D',
    body: '#F8F1DF',
    belly: '#E9DECA',
    cheeks: '#E7B59C',
    face: '#554A40',
  },
  blooming: {
    halo: '#FFF0BD',
    plinth: '#4F8F5D',
    plinthTop: '#78AE7C',
    stem: '#88A87D',
    leafLeft: '#3F7E52',
    leafRight: '#5A9C63',
    body: '#F8F1DF',
    belly: '#E9DECA',
    cheeks: '#E7B59C',
    face: '#554A40',
  },
};

const PATHS = {
  halo: 'M17,55a43,43 0,1 0,86 0a43,43 0,1 0,-86 0',
  plinth: 'M22,91c0,-9 13,-16 38,-16s38,7 38,16 -13,15 -38,15 -38,-6 -38,-15z',
  plinthTop: 'M29,87c3,-6 14,-10 31,-10s28,4 31,10c-8,5 -19,7 -31,7s-23,-2 -31,-7z',
  stem: 'M58,34h4v17h-4z',
  leafLeft: 'M59,37c-12,-2 -20,-10 -18,-20 11,-1 20,5 21,16z',
  leafRight: 'M62,32c2,-11 10,-17 21,-15 1,10 -6,18 -18,21z',
  body: 'M60,44c-18,0 -28,9 -30,24 -1,6 -8,14 -7,21 1,11 15,16 37,16s36,-5 37,-16c1,-7 -6,-15 -7,-21 -2,-15 -12,-24 -30,-24z',
  belly: 'M23,86c3,7 16,11 37,11s34,-4 37,-11c-1,8 -14,13 -37,13s-36,-5 -37,-13z',
  cheeksHappy: 'M35,72c2,-3 8,-3 10,0 1,3 -2,5 -5,5s-6,-2 -5,-5zM75,72c2,-3 8,-3 10,0 1,3 -2,5 -5,5s-6,-2 -5,-5z',
  cheeksSad: 'M35,73c2,-2 8,-2 10,1 1,2 -2,4 -5,4s-6,-2 -5,-5zM75,73c2,-2 8,-2 10,1 1,2 -2,4 -5,4s-6,-2 -5,-5z',
  faceHappy:
    'M36,67c0,-1 1,-2 2,-1 2,3 6,3 8,0 1,-1 3,0 2,2 -3,4 -10,4 -12,-1zM72,68c-1,-2 1,-3 2,-2 2,4 7,4 9,1 1,-2 3,-1 2,1 -3,5 -10,5 -13,0zM52,79c3,4 13,4 16,0 1,-2 3,-1 2,1 -4,8 -18,8 -22,0 -1,-2 2,-3 4,-1z',
  faceSad:
    'M36,67c2,-4 8,-4 12,0 1,1 0,3 -2,2 -3,-2 -5,-2 -8,0 -2,1 -3,-1 -2,-2zM72,67c4,-4 10,-4 12,0 1,1 0,3 -2,2 -3,-2 -5,-2 -8,0 -2,1 -3,-1 -2,-2zM50,86c5,-6 15,-6 20,0 1,2 -1,3 -2,2 -4,-4 -12,-4 -16,0 -1,1 -3,0 -2,-2z',
};

const MOODS: StreakMood[] = ['sad', 'sprout', 'steady', 'blooming'];

export function BlossomMascot({ mood, active = true, reducedMotion = false }: Props) {
  const look = LOOKS[MOODS.includes(mood) ? mood : 'sprout'];
  const sad = mood === 'sad';
  const float = useRef(new Animated.Value(0)).current;
  const [systemReducedMotion, setSystemReducedMotion] = useState(false);
  const animate = active && !reducedMotion && !systemReducedMotion;

  useEffect(() => {
    let mounted = true;
    AccessibilityInfo.isReduceMotionEnabled()
      .then((value) => {
        if (mounted) setSystemReducedMotion(value);
      })
      .catch(() => undefined);
    const subscription = AccessibilityInfo.addEventListener('reduceMotionChanged', setSystemReducedMotion);
    return () => {
      mounted = false;
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    if (!animate) {
      float.setValue(0);
      return;
    }
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(float, { toValue: 1, duration: 2600, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(float, { toValue: 0, duration: 2600, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [animate, float]);

  const translateY = float.interpolate({ inputRange: [0, 1], outputRange: [3, -3] });

  return (
    <View
      style={styles.frame}
      accessible
      accessibilityLabel={`Blossom mascot, ${sad ? 'taking a quiet pause' : 'growing with your streak'}`}
    >
      <Animated.View style={[styles.art, { transform: [{ translateY }] }]}>
        <Svg width="100%" height="100%" viewBox="14 8 92 104" preserveAspectRatio="xMidYMid meet">
          <Path d={PATHS.halo} fill={look.halo} />
          <Path d={PATHS.plinth} fill={look.plinth} />
          <Path d={PATHS.plinthTop} fill={look.plinthTop} />
          <Path d={PATHS.stem} fill={look.stem} />
          <Path d={PATHS.leafLeft} fill={look.leafLeft} />
          <Path d={PATHS.leafRight} fill={look.leafRight} />
          <Path d={PATHS.body} fill={look.body} />
          <Path d={PATHS.belly} fill={look.belly} />
          <Path d={sad ? PATHS.cheeksSad : PATHS.cheeksHappy} fill={look.cheeks} />
          <Path d={sad ? PATHS.faceSad : PATHS.faceHappy} fill={look.face} />
        </Svg>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  frame: { flex: 1, width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' },
  art: { width: '100%', height: '100%', paddingVertical: 10 },
});
