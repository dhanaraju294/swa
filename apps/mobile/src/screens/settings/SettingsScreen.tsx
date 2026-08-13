import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, Switch } from 'react-native';
import { colors, spacing } from '../../design-system/tokens';
import { Card } from '../../design-system/Card';
import { EyebrowLabel } from '../../design-system/EyebrowLabel';
import { Button } from '../../design-system/Button';
import { WritingLineInput } from '../../design-system/WritingLineInput';
import { useProfile, useSettings, useExportData, useDeleteAllData } from '../../hooks/useProfile';
import { useAppLockContext } from '../../navigation/AppLockContext';

type PasscodeMode = 'create' | 'verify' | null;

export default function SettingsScreen() {
  const { data: profile, update: updateProfile } = useProfile();
  const { data: settings, update: updateSettings } = useSettings();
  const { exportData, loading: exporting } = useExportData();
  const { deleteAll, loading: deleting } = useDeleteAllData();
  const { enabled: lockEnabled, hasPasscode, enableAppLock, disableAppLock, verify } =
    useAppLockContext();

  const [displayName, setDisplayName] = useState(profile?.displayName || '');
  // Keep the name field in sync with the persisted profile (async-loaded),
  // e.g. after reopening settings or after onboarding set the name.
  const syncedName = React.useRef<string | null | undefined>(undefined);
  useEffect(() => {
    if (profile && profile.displayName !== syncedName.current) {
      syncedName.current = profile.displayName;
      setDisplayName(profile.displayName ?? '');
    }
  }, [profile]);

  const [passcodeMode, setPasscodeMode] = useState<PasscodeMode>(null);
  const [passcode, setPasscode] = useState('');
  const [passcodeConfirm, setPasscodeConfirm] = useState('');
  const [passcodeError, setPasscodeError] = useState('');

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
      appLockEnabled: lockEnabled,
    });
    Alert.alert('Saved', 'Profile updated.');
  };

  const handleLockToggle = (next: boolean) => {
    if (next) {
      if (hasPasscode) {
        enableAppLock();
      } else {
        setPasscode('');
        setPasscodeConfirm('');
        setPasscodeError('');
        setPasscodeMode('create');
      }
    } else {
      setPasscode('');
      setPasscodeError('');
      setPasscodeMode('verify');
    }
  };

  const submitCreatePasscode = async () => {
    if (passcode.length < 4) {
      setPasscodeError('Passcode must be 4 digits.');
      return;
    }
    if (passcode !== passcodeConfirm) {
      setPasscodeError('Passcodes do not match.');
      return;
    }
    await enableAppLock(passcode);
    setPasscodeMode(null);
    setPasscode('');
    setPasscodeConfirm('');
  };

  const submitVerifyPasscode = async () => {
    if (verify(passcode)) {
      await disableAppLock();
      setPasscodeMode(null);
      setPasscode('');
    } else {
      setPasscodeError('Incorrect passcode.');
    }
  };

  return (
    <>
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
            <Text style={styles.rowDesc}>Require a passcode to open the app</Text>
          </View>
          <Switch
            value={lockEnabled}
            onValueChange={handleLockToggle}
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

    {passcodeMode && (
      <View style={styles.modalOverlay}>
        <View style={styles.modalCard}>
          <EyebrowLabel label={passcodeMode === 'create' ? 'SET APP LOCK' : 'ENTER PASSCODE'} />
          <Text style={styles.modalTitle}>
            {passcodeMode === 'create' ? 'Create a 4-digit passcode' : 'Enter your passcode to turn off App Lock'}
          </Text>

          <Text style={styles.label}>Passcode</Text>
          <WritingLineInput
            value={passcode}
            onChangeText={(t) => {
              setPasscodeError('');
              setPasscode(t.replace(/[^0-9]/g, '').slice(0, 4));
            }}
            placeholder="••••"
            multiline={false}
            secureTextEntry
            keyboardType="number-pad"
          />

          {passcodeMode === 'create' && (
            <>
              <Text style={styles.label}>Confirm Passcode</Text>
              <WritingLineInput
                value={passcodeConfirm}
                onChangeText={(t) => {
                  setPasscodeError('');
                  setPasscodeConfirm(t.replace(/[^0-9]/g, '').slice(0, 4));
                }}
                placeholder="••••"
                multiline={false}
                secureTextEntry
                keyboardType="number-pad"
              />
            </>
          )}

          {passcodeError ? <Text style={styles.modalError}>{passcodeError}</Text> : null}

          <View style={styles.modalButtons}>
            <Button
              title="Cancel"
              variant="ghost"
              onPress={() => {
                setPasscodeMode(null);
                setPasscode('');
                setPasscodeConfirm('');
                setPasscodeError('');
              }}
            />
            <Button
              title={passcodeMode === 'create' ? 'Set Passcode' : 'Confirm'}
              color={colors.sage}
              onPress={passcodeMode === 'create' ? submitCreatePasscode : submitVerifyPasscode}
            />
          </View>
        </View>
      </View>
    )}
    </>
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
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(40, 34, 28, 0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
    zIndex: 50,
  },
  modalCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: spacing.lg,
  },
  modalTitle: {
    fontFamily: 'Nunito',
    fontSize: 13,
    color: colors.inkSoft,
    marginBottom: spacing.md,
    marginTop: spacing.xs,
  },
  modalError: {
    fontFamily: 'Nunito',
    fontSize: 12,
    color: '#D4795F',
    marginTop: spacing.sm,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.sm,
    marginTop: spacing.lg,
  },
});
