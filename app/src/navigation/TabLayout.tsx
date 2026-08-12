import React from 'react';
import { Tabs } from 'expo-router';
import { colors } from '../design-system/tokens';
import { PetalMark } from '../design-system/PetalMark';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.gold,
        tabBarInactiveTintColor: colors.inkSoft,
        tabBarStyle: {
          backgroundColor: colors.cream,
          borderTopColor: colors.cardBorder,
          height: 88,
          paddingBottom: 28,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontFamily: 'Nunito',
          fontSize: 10,
          fontWeight: '700',
        },
        headerStyle: {
          backgroundColor: colors.cream,
        },
        headerTitleStyle: {
          fontFamily: 'Fraunces',
          fontSize: 18,
          fontWeight: '600',
          color: colors.ink,
        },
        headerShadowVisible: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="on-the-spot"
        options={{
          title: 'Check-In',
          headerTitle: 'Quick Check-In',
        }}
      />
      <Tabs.Screen
        name="journal"
        options={{
          title: 'Journal',
          headerTitle: 'Journal',
        }}
      />
      <Tabs.Screen
        name="insights"
        options={{
          title: 'Insights',
          headerTitle: 'Your Insights',
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          headerTitle: 'Settings',
        }}
      />
    </Tabs>
  );
}
