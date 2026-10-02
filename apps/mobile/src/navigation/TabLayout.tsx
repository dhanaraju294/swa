import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs } from 'expo-router';
import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors } from '../design-system/tokens';

const ACTIVE_COLOR = colors.leafInk;
const INACTIVE_COLOR = colors.inkSoft;

type TabName = 'home' | 'heart' | 'book' | 'stats-chart' | 'person';
type TabIconName =
  | 'home'
  | 'home-outline'
  | 'heart'
  | 'heart-outline'
  | 'book'
  | 'book-outline'
  | 'stats-chart'
  | 'stats-chart-outline'
  | 'person'
  | 'person-outline';

const OUTLINE: Record<TabName, TabIconName> = {
  home: 'home-outline',
  heart: 'heart-outline',
  book: 'book-outline',
  'stats-chart': 'stats-chart-outline',
  person: 'person-outline',
};

function tabIcon(name: TabName) {
  return ({ focused }: { focused: boolean }) => (
    <Ionicons
      name={focused ? name : OUTLINE[name]}
      size={22}
      color={focused ? ACTIVE_COLOR : INACTIVE_COLOR}
      accessible={false}
    />
  );
}

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const bottomInset = Math.max(insets.bottom, 6);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: ACTIVE_COLOR,
        tabBarInactiveTintColor: INACTIVE_COLOR,
        tabBarStyle: {
          backgroundColor: '#FAF7F2',
          borderTopWidth: 1,
          borderTopColor: colors.writingLine,
          height: 58 + bottomInset,
          paddingBottom: bottomInset,
          paddingTop: 6,
        },
        tabBarLabelStyle: {
          fontFamily: 'Nunito_700Bold',
          fontSize: 12,
          fontWeight: '700',
        },
        tabBarHideOnKeyboard: true,
        headerShown: false,
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Today', tabBarIcon: tabIcon('home') }} />
      <Tabs.Screen
        name="on-the-spot"
        options={{ title: 'Check-In', tabBarIcon: tabIcon('heart'), tabBarAccessibilityLabel: 'Check-In' }}
      />
      <Tabs.Screen name="journal" options={{ title: 'My Path', tabBarIcon: tabIcon('book') }} />
      <Tabs.Screen name="insights" options={{ title: 'Insights', tabBarIcon: tabIcon('stats-chart') }} />
      <Tabs.Screen
        name="settings"
        options={{ title: 'You', tabBarIcon: tabIcon('person'), tabBarAccessibilityLabel: 'Settings' }}
      />
    </Tabs>
  );
}
