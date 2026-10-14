import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { SproutMascot } from '../../components/SproutMascot';
import Svg, { Path } from 'react-native-svg';

import { colors, spacing, shadow } from '../../design-system/tokens';
import type { JourneyCatalog, PartStatus } from '../../journey/types';

type Props = {
  catalog: JourneyCatalog;
  exerciseDay: number;
  statusByDay: Record<number, PartStatus>;
  onPressDay: (day: number) => void;
};

const NODE = 68;
const HIT_TARGET_WIDTH = NODE + 40;
const HIT_TARGET_HEIGHT = 120;
const ROW_H = 138;

export function PathMap({ catalog, exerciseDay, statusByDay, onPressDay }: Props) {
  const [width, setWidth] = useState(300);
  const focused = useIsFocused();

  const layout = useMemo(() => {
    const nodes: {
      day: number;
      x: number;
      y: number;
      cx: number;
      cy: number;
      unitId: string;
    }[] = [];
    let y = 24;
    catalog.units.forEach((unit) => {
      y += 78;
      unit.days.forEach((day, index) => {
        const amplitude = Math.max(0, Math.min(width * 0.23, (width - HIT_TARGET_WIDTH) / 2 - 12));
        const x = width / 2 + Math.sin(index * Math.PI / 2.2) * amplitude - NODE / 2;
        nodes.push({ day, x, y, cx: x + NODE / 2, cy: y + NODE / 2, unitId: unit.id });
        y += ROW_H;
      });
      y += 28;
    });
    return { nodes, height: y + 40 };
  }, [catalog.units, width]);

  const pathD = useMemo(() => {
    if (layout.nodes.length === 0) return '';
    const [first, ...rest] = layout.nodes;
    let d = `M ${first.cx} ${first.cy}`;
    rest.forEach((node, index) => {
      const previous = index === 0 ? first : rest[index - 1];
      const midY = (previous.cy + node.cy) / 2;
      d += ` C ${previous.cx} ${midY}, ${node.cx} ${midY}, ${node.cx} ${node.cy}`;
    });
    return d;
  }, [layout.nodes]);

  return (
    <View onLayout={event => setWidth(event.nativeEvent.layout.width)} style={[styles.map, { height: layout.height }]}>
      <Svg width={width} height={layout.height} style={StyleSheet.absoluteFill} accessible={false}>
        <Path d={pathD} stroke="#DCD3C0" strokeWidth={10} fill="none" strokeLinecap="round" />
        <Path d={pathD} stroke="#A3BD96" strokeWidth={4} fill="none" strokeLinecap="round" strokeDasharray="2 10" />
      </Svg>

      {catalog.units.map((unit) => {
        const first = layout.nodes.find((node) => node.unitId === unit.id);
        if (!first) return null;
        const unitDone = unit.days.every((day) => Boolean(statusByDay[day]?.exercise));
        const unitCurrent = unit.days.includes(exerciseDay);
        return (
          <View
            key={unit.id}
            style={[styles.unitBanner, { top: first.y - 82, backgroundColor: unit.tint, borderColor: unit.color }]}
          >
            <Text style={styles.unitEyebrow}>{unitDone ? 'COMPLETE' : unitCurrent ? 'IN PROGRESS' : 'UNIT'}</Text>
            <Text style={styles.unitTitle}>{unit.title}</Text>

          </View>
        );
      })}

      {layout.nodes.map((node) => {
        const status = statusByDay[node.day];
        const done = Boolean(status?.exercise);
        const current = node.day === exerciseDay && !done;
        const locked = node.day > exerciseDay && !done;
        const catalogDay = catalog.days.find((entry) => entry.day === node.day);
        const exerciseTitle = catalogDay?.exerciseTitle || catalogDay?.theme || `Day ${node.day} exercise`;
        const fill = done ? '#DCE9D4' : current ? '#F6C453' : '#EFE8DC';
        const ring = current ? '#8B631A' : done ? colors.leafInk : '#D8CFC0';
        const stateLabel = locked
          ? 'Locked until this exercise is reached.'
          : done
            ? 'Exercise complete.'
            : current
              ? 'Current exercise. It stays open until you complete it.'
              : 'Available to review.';
        const label = `Day ${node.day}, ${exerciseTitle}. ${stateLabel}`;

        const content = (
          <View style={styles.nodeContent}>
            {current ? <View style={styles.activeRing} /> : null}
            <View style={[styles.nodeBase, { backgroundColor: current ? '#B78330' : done ? '#77966B' : '#CEC4B3' }]}>
            <View style={[styles.nodeDisc, { backgroundColor: fill, borderColor: ring }]}>
              {done ? (
                <Text style={styles.nodeCheck}>✓</Text>
              ) : (
                <Text style={[styles.nodeNum, current && styles.nodeNumCurrent, locked && styles.nodeNumLocked]}>
                  {node.day}
                </Text>
              )}
            </View>
            </View>
            <Text style={[styles.nodeLabel, locked && styles.nodeLabelLocked]} numberOfLines={2}>
              {exerciseTitle}
            </Text>
            {current ? (
              <View pointerEvents="none" accessibilityElementsHidden importantForAccessibility="no-hide-descendants" style={[styles.character, node.cx > width / 2 ? { right: HIT_TARGET_WIDTH - 6 } : { left: HIT_TARGET_WIDTH - 6 }]}>
                <SproutMascot emotion="idle" size={76} active={focused} muted hapticsEnabled={false} />
              </View>
            ) : null}
          </View>
        );
        const targetStyle = [
          styles.nodeHitTarget,
          { left: node.x - 20, top: node.y, width: HIT_TARGET_WIDTH, height: HIT_TARGET_HEIGHT },
        ];

        return locked ? (
          <View
            key={node.day}
            style={targetStyle}
            accessible
            accessibilityRole="text"
            accessibilityLabel={label}
            accessibilityState={{ disabled: true }}
          >
            {content}
          </View>
        ) : (
          <TouchableOpacity
            key={node.day}
            style={targetStyle}
            activeOpacity={0.8}
            onPress={() => onPressDay(node.day)}
            accessibilityRole="button"
            accessibilityLabel={label}
            accessibilityHint="Opens this exercise."
            accessibilityState={{ selected: current }}
          >
            {content}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  map: {
    position: 'relative',
    alignSelf: 'center',
    width: '100%',
    maxWidth: 600,
  },
  unitBanner: {
    position: 'absolute',
    left: 12,
    right: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 16,
    borderWidth: 1.5,
    ...shadow.soft,
  },
  unitEyebrow: {
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.4,
    color: colors.inkSoft,
  },
  unitTitle: {
    fontFamily: 'Fraunces_600SemiBold',
    fontSize: 20,
    fontWeight: '600',
    color: colors.ink,
  },
  unitSub: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 13,
    color: colors.inkSoft,
    marginTop: 1,
    lineHeight: 18,
  },
  nodeHitTarget: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  nodeContent: {
    width: HIT_TARGET_WIDTH,
    alignItems: 'center',
  },
  activeRing: { position: 'absolute', top: -8, width: NODE + 16, height: NODE + 22, borderRadius: 50, borderWidth: 3, borderColor: '#EDD694', backgroundColor: '#FCF2D5' },
  nodeBase: { width: NODE, height: NODE + 7, borderRadius: NODE / 2, paddingBottom: 7 },
  nodeDisc: {
    width: NODE,
    height: NODE,
    borderRadius: NODE / 2,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow.soft,
  },
  nodeNum: {
    fontFamily: 'Fraunces_700Bold',
    fontSize: 20,
    fontWeight: '700',
    color: colors.ink,
  },
  nodeNumCurrent: {
    color: '#5A4318',
  },
  nodeCheck: {
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 24,
    fontWeight: '800',
    color: '#3E5A42',
  },
  nodeNumLocked: {
    color: colors.ghost,
  },
  nodeLabel: {
    marginTop: 10,
    fontFamily: 'Nunito_700Bold',
    fontSize: 11.5,
    fontWeight: '700',
    color: colors.ink,
    textAlign: 'center',
    lineHeight: 15,
    width: HIT_TARGET_WIDTH,
  },
  nodeLabelLocked: {
    color: colors.ghost,
  },
  character: {
    position: 'absolute',
    top: -8,
  },
  trackMarker: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#A38A58',
    backgroundColor: colors.white,
    paddingHorizontal: 6,
    paddingVertical: 4,
    ...shadow.soft,
  },
  trackMarkerText: {
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 10,
    fontWeight: '800',
    color: colors.ink,
  },
});
