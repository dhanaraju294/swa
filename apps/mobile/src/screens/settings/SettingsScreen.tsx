import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, Switch, TouchableOpacity } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { colors, spacing } from '../../design-system/tokens';
import { Card } from '../../design-system/Card';
import { EyebrowLabel } from '../../design-system/EyebrowLabel';
import { Button } from '../../design-system/Button';
import { WritingLineInput } from '../../design-system/WritingLineInput';
import { useProfile, useSettings, useExportData, useDeleteAllData } from '../../hooks/useProfile';
import { useAppLockContext } from '../../navigation/AppLockContext';
import {
  DEFAULT_REMINDERS,
  joinTime,
  parseReminders,
  serializeReminders,
  splitTime,
  type ReminderPrefs,
  type ReminderSlot,
} from '../../state/appStore';
import { requestReminderPermission, syncReflectionReminders } from '../../notifications/reminders';

type PasscodeMode = 'create' | 'verify' | null;

export default function SettingsScreen() {
  const isFocused = useIsFocused();
  const { data: profile, update: updateProfile, refresh: refreshProfile } = useProfile();
  const { data: settings, update: updateSettings, refresh: refreshSettings } = useSettings();
  const { exportData, loading: exporting } = useExportData();
  const { deleteAll, loading: deleting } = useDeleteAllData();
  const { enabled: lockEnabled, hasPasscode, enableAppLock, disableAppLock, verify } =
    useAppLockContext();

  const [displayName, setDisplayName] = useState(profile?.displayName || '');
  const [reminders, setReminders] = useState<ReminderPrefs>(parseReminders(settings?.reminderTime));
  const [savingReminders, setSavingReminders] = useState(false);

  useEffect(() => {
    if (isFocused) {
      refreshProfile();
      refreshSettings();
    }
  }, [isFocused, refreshProfile, refreshSettings]);

  useEffect(() => {
    setDisplayName(profile?.displayName ?? '');
  }, [profile?.displayName]);

  useEffect(() => {
    setReminders(parseReminders(settings?.reminderTime));
  }, [settings?.reminderTime]);

  const [passcodeMode, setPasscodeMode] = useState<PasscodeMode>(null);
  const [passcode, setPasscode] = useState('');
  const [passcodeConfirm, setPasscodeConfirm] = useState('');
  const [passcodeError, setPasscodeError] = useState('');

  const handleExport = async () => {
    try {
      await exportData();
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
            await syncReflectionReminders(DEFAULT_REMINDERS);
            Alert.alert('Deleted', 'All data has been cleared.');
          },
        },
      ],
    );
  };

  const handleSaveName = async () => {
    try {
      await updateProfile({
        displayName: displayName.trim() || undefined,
        appLockEnabled: lockEnabled,
      });
      Alert.alert('Saved', 'Your name is on this device now.');
    } catch (e) {
      Alert.alert('Could not save', 'Please try again in a moment.');
    }
  };

  const persistReminders = async (next: ReminderPrefs) => {
    setReminders(next);
    setSavingReminders(true);
    try {
      if (next.morning.enabled || next.evening.enabled) {
        const allowed = await requestReminderPermission();
        if (!allowed) {
          Alert.alert(
            'Notifications are off',
            'Allow notifications in system settings so morning and evening reminders can reach you.',
          );
          const disabled = {
            morning: { ...next.morning, enabled: false },
            evening: { ...next.evening, enabled: false },
          };
          setReminders(disabled);
          await updateSettings({
            theme: settings?.theme || 'default',
            reminderTime: serializeReminders(disabled),
            exportFormatPref: settings?.exportFormatPref || 'json',
          });
          await syncReflectionReminders(disabled);
          return;
        }
      }
      await updateSettings({
        theme: settings?.theme || 'default',
        reminderTime: serializeReminders(next),
        exportFormatPref: settings?.exportFormatPref || 'json',
      });
      await syncReflectionReminders(next);
    } catch (e) {
      Alert.alert('Could not save reminders', 'Please try again.');
    } finally {
      setSavingReminders(false);
    }
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

      <Card style={styles.card}>
        <EyebrowLabel label="REMINDERS" />
        <Text style={styles.rowDesc}>
          A daily tap on the shoulder. You choose the times. Nothing is required when it arrives.
        </Text>
        <ReminderRow
          title="Morning reflection"
          subtitle="Arrive before the day runs you"
          slot={reminders.morning}
          disabled={savingReminders}
          onChange={(slot) => persistReminders({ ...reminders, morning: slot })}
        />
        <ReminderRow
          title="Evening reflection"
          subtitle="Look back before sleep"
          slot={reminders.evening}
          disabled={savingReminders}
          onChange={(slot) => persistReminders({ ...reminders, evening: slot })}
        />
      </Card>

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

      <Card style={styles.card}>
        <EyebrowLabel label="ABOUT" />
        <Text style={styles.aboutTitle}>The Inward Journey</Text>
        <Text style={styles.aboutBody}>
          A calm, offline self-awareness companion. Each day is a morning arrival,
          one tiny practice, and an evening look-back. Everything stays on your device.
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

function ReminderRow({
  title,
  subtitle,
  slot,
  disabled,
  onChange,
}: {
  title: string;
  subtitle: string;
  slot: ReminderSlot;
  disabled?: boolean;
  onChange: (slot: ReminderSlot) => void;
}) {
  const { hour, minute } = splitTime(slot.time);
  return (
    <View style={styles.reminderBlock}>
      <View style={styles.row}>
        <View style={styles.rowInfo}>
          <Text style={styles.rowLabel}>{title}</Text>
          <Text style={styles.rowDesc}>{subtitle}</Text>
        </View>
        <Switch
          value={slot.enabled}
          disabled={disabled}
          onValueChange={(enabled) => onChange({ ...slot, enabled })}
          trackColor={{ true: colors.gold, false: '#E0DAD0' }}
        />
      </View>
      <View style={styles.timeRow}>
        <TimeChip
          label={String(hour).padStart(2, '0')}
          hint="hour"
          disabled={disabled || !slot.enabled}
          onDec={() => onChange({ ...slot, time: joinTime(hour - 1, minute) })}
          onInc={() => onChange({ ...slot, time: joinTime(hour + 1, minute) })}
        />
        <Text style={styles.timeColon}>:</Text>
        <TimeChip
          label={String(minute).padStart(2, '0')}
          hint="min"
          disabled={disabled || !slot.enabled}
          onDec={() => onChange({ ...slot, time: joinTime(hour, minute - 5) })}
          onInc={() => onChange({ ...slot, time: joinTime(hour, minute + 5) })}
        />
      </View>
    </View>
  );
}

function TimeChip({
  label,
  hint,
  disabled,
  onDec,
  onInc,
}: {
  label: string;
  hint: string;
  disabled?: boolean;
  onDec: () => void;
  onInc: () => void;
}) {
  return (
    <View style={[styles.timeChip, disabled && styles.timeChipOff]}>
      <TouchableOpacity onPress={onDec} disabled={disabled} hitSlop={8} style={styles.timeBtn}>
        <Text style={styles.timeBtnText}>−</Text>
      </TouchableOpacity>
      <View>
        <Text style={styles.timeValue}>{label}</Text>
        <Text style={styles.timeHint}>{hint}</Text>
      </View>
      <TouchableOpacity onPress={onInc} disabled={disabled} hitSlop={8} style={styles.timeBtn}>
        <Text style={styles.timeBtnText}>+</Text>
      </TouchableOpacity>
    </View>
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
  reminderBlock: { marginTop: spacing.lg },
  timeRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: spacing.md },
  timeColon: { fontFamily: 'Fraunces', fontSize: 24, color: colors.ink, marginBottom: 12 },
  timeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#F4EFE6',
    borderRadius: 16,
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  timeChipOff: { opacity: 0.45 },
  timeBtn: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' },
  timeBtnText: { fontFamily: 'Nunito', fontSize: 20, fontWeight: '700', color: colors.ink },
  timeValue: { fontFamily: 'Fraunces', fontSize: 22, fontWeight: '600', color: colors.ink, textAlign: 'center', minWidth: 36 },
  timeHint: { fontFamily: 'Nunito', fontSize: 10, color: colors.inkSoft, textAlign: 'center' },
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
