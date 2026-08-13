import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, Switch } from 'react-native';
import { colors, spacing } from '../../design-system/tokens';
import { Card } from '../../design-system/Card';
import { EyebrowLabel } from '../../design-system/EyebrowLabel';
import { Button } from '../../design-system/Button';
import { WritingLineInput } from '../../design-system/WritingLineInput';
import { useProfile, useSettings, useExportData, useDeleteAllData } from '../../hooks/useProfile';

export default function SettingsScreen() {
  const { data: profile, update: updateProfile } = useProfile();
  const { data: settings, update: updateSettings } = useSettings();
  const { exportData, loading: exporting } = useExportData();
  const { deleteAll, loading: deleting } = useDeleteAllData();

  const [displayName, setDisplayName] = useState(profile?.displayName || '');

  const handleExport = async () => {
    try {
      const json = await exportData();
      Alert.alert('Export Ready', 'Your data has been exported. In a real app, this would open the share sheet.', [
        { text: 'OK' },
      ]);
    } catch (e) {
      Alert.alert('Error', 'Export failed.');
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete All Data',
      'This will permanently delete all your reflections, check-ins, and settings. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await deleteAll();
            Alert.alert('Deleted', 'All data has been cleared.');
          },
        },
      ],
    );
  };

  const handleSaveName = async () => {
    await updateProfile({
      displayName: displayName || undefined,
      appLockEnabled: profile?.appLockEnabled || false,
    });
    Alert.alert('Saved', 'Profile updated.');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Settings</Text>
      <Text style={styles.subtitle}>Your space, your rules.</Text>

      {/* Profile */}
      <Card style={styles.card}>
        <EyebrowLabel label="PROFILE" />
        <Text style={styles.label}>Display Name</Text>
        <WritingLineInput
          value={displayName}
          onChangeText={setDisplayName}
          placeholder="Your name"
          multiline={false}
        />
        <Button
          title="Save Name"
          onPress={handleSaveName}
          variant="secondary"
          color={colors.sage}
          style={{ marginTop: spacing.md }}
        />
      </Card>

      {/* App Lock */}
      <Card style={styles.card}>
        <EyebrowLabel label="PRIVACY" />
        <View style={styles.row}>
          <View style={styles.rowInfo}>
            <Text style={styles.rowLabel}>App Lock</Text>
            <Text style={styles.rowDesc}>Require Face ID or passcode to open</Text>
          </View>
          <Switch
            value={profile?.appLockEnabled || false}
            onValueChange={async (v) => {
              await updateProfile({
                displayName: profile?.displayName || undefined,
                appLockEnabled: v,
              });
            }}
            trackColor={{ true: colors.sage, false: '#E0DAD0' }}
          />
        </View>
      </Card>

      {/* Reminder */}
      <Card style={styles.card}>
        <EyebrowLabel label="REMINDERS" />
        <Text style={styles.label}>Daily Reminder Time</Text>
        <Text style={styles.rowDesc}>
          {settings?.reminderTime || 'No reminder set'}
        </Text>
        <Button
          title={settings?.reminderTime ? 'Clear Reminder' : 'Set Reminder (9:00 AM)'}
          onPress={() =>
            updateSettings({
              theme: settings?.theme || 'default',
              reminderTime: settings?.reminderTime ? undefined : '09:00',
              exportFormatPref: settings?.exportFormatPref || 'json',
            })
          }
          variant="secondary"
          color={colors.gold}
          style={{ marginTop: spacing.md }}
        />
      </Card>

      {/* Export */}
      <Card style={styles.card}>
        <EyebrowLabel label="DATA" />
        <Text style={styles.rowDesc}>
          Export all your data as a JSON file. This is the only way data leaves your device.
        </Text>
        <Button
          title={exporting ? 'Exporting...' : 'Export All Data'}
          onPress={handleExport}
          color={colors.gold}
          disabled={exporting}
          style={{ marginTop: spacing.md }}
        />
      </Card>

      {/* Delete */}
      <Card style={styles.card}>
        <EyebrowLabel label="DANGER ZONE" />
        <Text style={styles.rowDesc}>
          Permanently delete all data. This cannot be undone.
        </Text>
        <Button
          title={deleting ? 'Deleting...' : 'Delete All Data'}
          onPress={handleDelete}
          color="#D4795F"
          disabled={deleting}
          style={{ marginTop: spacing.md }}
        />
      </Card>

      {/* About */}
      <Card style={styles.card}>
        <EyebrowLabel label="ABOUT" />
        <Text style={styles.aboutTitle}>The Inward Journey</Text>
        <Text style={styles.aboutBody}>
          A calm, offline self-awareness companion. Everything stays on your device.
          No account, no cloud, no analytics. Your reflections are sacred, private spaces.
        </Text>
        <Text style={styles.aboutBody}>
          This app has no backend server and no network permission. The only way data
          leaves your device is through the explicit export function.
        </Text>
        <Text style={styles.version}>Version 0.1.0</Text>
      </Card>

      <View style={{ height: 80 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.cream },
  content: { padding: spacing.lg, paddingBottom: 100 },
  title: { fontFamily: 'Fraunces', fontSize: 28, fontWeight: '600', color: colors.ink, marginBottom: spacing.xs },
  subtitle: { fontFamily: 'Nunito', fontSize: 14, color: colors.inkSoft, marginBottom: spacing.xl },
  card: { padding: spacing.lg, marginBottom: spacing.lg },
  label: { fontFamily: 'Nunito', fontSize: 12, fontWeight: '700', color: colors.ink, marginBottom: spacing.sm },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  rowInfo: { flex: 1, marginRight: spacing.md },
  rowLabel: { fontFamily: 'Nunito', fontSize: 14, fontWeight: '700', color: colors.ink },
  rowDesc: { fontFamily: 'Nunito', fontSize: 12, color: colors.inkSoft, lineHeight: 17, marginTop: 4 },
  aboutTitle: { fontFamily: 'Fraunces', fontSize: 18, fontWeight: '600', color: colors.ink, marginBottom: spacing.sm },
  aboutBody: { fontFamily: 'Nunito', fontSize: 12, color: colors.inkSoft, lineHeight: 17, marginBottom: spacing.sm },
  version: { fontFamily: 'Nunito', fontSize: 11, color: colors.ghost, marginTop: spacing.md },
});
