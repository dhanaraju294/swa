import React, { useEffect, useMemo, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { colors, spacing, shadow } from '../../design-system/tokens';
import { PetalMark } from '../../design-system/PetalMark';
import { kindOfDay, partsCompleteCount } from '../../journey/calendar';
import type { JourneyCatalog, PartStatus } from '../../journey/types';

type Props = {
  catalog: JourneyCatalog;
  unlockedDay: number;
  completedDays: number[];
  statusByDay: Record<number, PartStatus>;
  onPressDay: (day: number) => void;
};

const { width: SCREEN_W } = Dimensions.get('window');
const MAP_PAD = 28;
const NODE = 64;
const ROW_H = 112;

function sideFor(indexInUnit: number): 'left' | 'center' | 'right' {
  const pattern: Array<'left' | 'center' | 'right'> = [
    'center',
    'right',
    'left',
    'center',
    'right',
    'left',
    'center',
  ];
  return pattern[indexInUnit % pattern.length];
}

function xFor(side: 'left' | 'center' | 'right', width: number) {
  if (side === 'left') return MAP_PAD + 18;
  if (side === 'right') return width - MAP_PAD - NODE - 18;
  return (width - NODE) / 2;
}

export function PathMap({ catalog, unlockedDay, completedDays, statusByDay, onPressDay }: Props) {
  const pulse = useRef(new Animated.Value(1)).current;
  const width = SCREEN_W - spacing.lg * 2;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1.08, duration: 900, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1, duration: 900, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [pulse]);

  const layout = useMemo(() => {
    const nodes: Array<{
      day: number;
      x: number;
      y: number;
      cx: number;
      cy: number;
      unitId: string;
    }> = [];
    let y = 24;
    catalog.units.forEach((unit) => {
      y += 78;
      unit.days.forEach((day, i) => {
        const side = sideFor(i);
        const x = xFor(side, width);
        nodes.push({
          day,
          x,
          y,
          cx: x + NODE / 2,
          cy: y + NODE / 2,
          unitId: unit.id,
        });
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
    rest.forEach((node, i) => {
      const prev = i === 0 ? first : rest[i - 1];
      const midY = (prev.cy + node.cy) / 2;
      d += ` C ${prev.cx} ${midY}, ${node.cx} ${midY}, ${node.cx} ${node.cy}`;
    });
    return d;
  }, [layout.nodes]);

  return (
    <View style={[styles.map, { height: layout.height }]}>
      <Svg width={width} height={layout.height} style={StyleSheet.absoluteFill}>
        <Path
          d={pathD}
          stroke="#DCD3C0"
          strokeWidth={10}
          fill="none"
          strokeLinecap="round"
        />
        <Path
          d={pathD}
          stroke="#A3BD96"
          strokeWidth={4}
          fill="none"
          strokeLinecap="round"
          strokeDasharray="2 10"
        />
      </Svg>

      {catalog.units.map((unit) => {
        const first = layout.nodes.find((n) => n.unitId === unit.id);
        if (!first) return null;
        const unitDone = unit.days.every((d) => completedDays.includes(d));
        const unitCurrent = unit.days.includes(unlockedDay);
        return (
          <View
            key={unit.id}
            style={[
              styles.unitBanner,
              { top: first.y - 70, backgroundColor: unit.tint, borderColor: unit.color },
            ]}
          >
            <Text style={styles.unitEyebrow}>{unitDone ? 'COMPLETE' : unitCurrent ? 'THIS WEEK' : 'UNIT'}</Text>
            <Text style={styles.unitTitle}>{unit.title}</Text>
            <Text style={styles.unitSub}>{unit.subtitle}</Text>
          </View>
        );
      })}

      {layout.nodes.map((node) => {
        const done = completedDays.includes(node.day);
        const current = node.day === unlockedDay;
        const locked = node.day > unlockedDay;
        const status = statusByDay[node.day];
        const kind = kindOfDay(node.day, unlockedDay, completedDays, status);
        // How many of the day's three parts have been submitted — the node
        // reflects every submission, not just a fully-completed day, so the
        // map visibly updates as soon as a part is saved.
        const partsDone = partsCompleteCount(status);
        const partial = !done && partsDone > 0;
        const missed = kind === 'missed';
        const incomplete = kind === 'incomplete';
        const catalogDay = catalog.days.find((d) => d.day === node.day);
        const fill = done
          ? '#DCE9D4'
          : current
            ? partial
              ? '#EFB93F'
              : '#F6C453'
            : incomplete
              ? '#F4A896'
              : missed
                ? '#F6E4DC'
                : '#EFE8DC';
        const ring = current
          ? partial
            ? '#D99A22'
            : '#E8B23C'
          : done
            ? colors.leaf
            : missed || incomplete
              ? colors.peach
              : '#D8CFC0';

        const inner = (
          <View style={[styles.node, { left: node.x, top: node.y }]}>
            <View style={[styles.nodeDisc, { backgroundColor: fill, borderColor: ring }]}>
              {done ? (
                <Text style={styles.nodeCheck}>✓</Text>
              ) : (
                <Text style={[styles.nodeNum, current && styles.nodeNumCurrent, locked && styles.nodeNumLocked, missed && styles.nodeNumMissed]}>
                  {node.day}
                </Text>
              )}
              {!done && partsDone > 0 && (
                <View style={styles.progressBadge}>
                  <Text style={styles.progressBadgeText}>{partsDone}/3</Text>
                </View>
              )}
              {missed && (
                <View style={styles.missedBadge}>
                  <Text style={styles.missedBadgeText}>–</Text>
                </View>
              )}
            </View>
            <Text style={[styles.nodeLabel, locked && styles.nodeLabelLocked, missed && styles.nodeLabelMissed]} numberOfLines={2}>
              {missed
                ? 'Not done'
                : catalogDay?.exerciseTitle || catalogDay?.theme || `Day ${node.day}`}
            </Text>
            {current && (
              <View style={styles.character}>
                <PetalMark size={28} />
              </View>
            )}
          </View>
        );

        if (locked) {
          return <View key={node.day}>{inner}</View>;
        }

        return (
          <TouchableOpacity
            key={node.day}
            activeOpacity={0.85}
            onPress={() => onPressDay(node.day)}
          >
            {current ? (
              <Animated.View style={{ transform: [{ scale: pulse }] }}>{inner}</Animated.View>
            ) : (
              inner
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  map: {
    width: '100%',
    position: 'relative',
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
    fontFamily: 'Nunito',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 2.4,
    color: colors.inkSoft,
  },
  unitTitle: {
    fontFamily: 'Fraunces',
    fontSize: 20,
    fontWeight: '600',
    color: colors.ink,
  },
  unitSub: {
    fontFamily: 'Nunito',
    fontSize: 12,
    color: colors.inkSoft,
    marginTop: 1,
  },
  node: {
    position: 'absolute',
    width: NODE + 36,
    alignItems: 'center',
  },
  nodeDisc: {
    width: NODE,
    height: NODE,
    borderRadius: NODE / 2,
    borderWidth: 4,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow.soft,
  },
  nodeNum: {
    fontFamily: 'Fraunces',
    fontSize: 20,
    fontWeight: '700',
    color: colors.ink,
  },
  nodeNumCurrent: {
    color: '#5A4318',
  },
  nodeCheck: {
    fontFamily: 'Nunito',
    fontSize: 24,
    fontWeight: '800',
    color: '#3E5A42',
  },
  nodeNumLocked: {
    color: '#B9B2A8',
  },
  nodeNumMissed: {
    color: '#9A6A58',
  },
  nodeLabel: {
    marginTop: 6,
    fontFamily: 'Nunito',
    fontSize: 11,
    fontWeight: '700',
    color: colors.ink,
    textAlign: 'center',
    width: NODE + 40,
  },
  nodeLabelLocked: {
    color: colors.ghost,
  },
  nodeLabelMissed: {
    color: '#9A6A58',
  },
  missedBadge: {
    position: 'absolute',
    right: -8,
    top: -4,
    backgroundColor: colors.peach,
    borderRadius: 8,
    width: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  missedBadgeText: {
    fontFamily: 'Nunito',
    fontSize: 11,
    fontWeight: '800',
    color: colors.ink,
    lineHeight: 13,
  },
  progressBadge: {
    position: 'absolute',
    right: -10,
    bottom: 4,
    backgroundColor: colors.ink,
    borderRadius: 9,
    paddingHorizontal: 6,
    paddingVertical: 2,
    ...shadow.soft,
  },
  progressBadgeText: {
    fontFamily: 'Nunito',
    fontSize: 10,
    fontWeight: '800',
    color: colors.white,
  },
  character: {
    position: 'absolute',
    right: -18,
    top: -6,
  },
});
