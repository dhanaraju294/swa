import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../design-system/tokens';

const ACTIVE_COLOR = colors.leaf; // Sage green — the design's active tab tint
const INACTIVE_COLOR = '#A39E93'; // Muted taupe / cream gray

type TabName = 'home' | 'heart' | 'book' | 'stats-chart' | 'person';
type TabIconName =
  | 'home' | 'home-outline'
  | 'heart' | 'heart-outline'
  | 'book' | 'book-outline'
  | 'stats-chart' | 'stats-chart-outline'
  | 'person' | 'person-outline';

const OUTLINE: Record<TabName, TabIconName> = {
  home: 'home-outline',
  heart: 'heart-outline',
  book: 'book-outline',
  'stats-chart': 'stats-chart-outline',
  person: 'person-outline',
};

function tabIcon(name: TabName) {
  return ({ focused }: { focused: boolean }) => (
    <Ionicons name={focused ? name : OUTLINE[name]} size={22} color={focused ? ACTIVE_COLOR : INACTIVE_COLOR} />
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: ACTIVE_COLOR,
        tabBarInactiveTintColor: INACTIVE_COLOR,
        tabBarStyle: {
          backgroundColor: '#FAF7F2',
          borderTopWidth: 1,
          borderTopColor: '#EFEAE1',
          height: 84,
          paddingBottom: 24,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontFamily: 'Nunito',
          fontSize: 11,
          fontWeight: '700',
        },
        headerShown: false, // every tab draws its own header per the design
      }}
    >
      <Tabs.Screen
        name="index"
        options={{ title: 'Today', tabBarIcon: tabIcon('home') }}
      />
      <Tabs.Screen
        name="on-the-spot"
        options={{ title: 'Check-In', tabBarIcon: tabIcon('heart') }}
      />
      <Tabs.Screen
        name="journal"
        options={{ title: 'My Path', tabBarIcon: tabIcon('book') }}
      />
      <Tabs.Screen
        name="insights"
        options={{ title: 'Insights', tabBarIcon: tabIcon('stats-chart') }}
      />
      <Tabs.Screen
        name="settings"
        options={{ title: 'You', tabBarIcon: tabIcon('person') }}
      />
    </Tabs>
  );
}
