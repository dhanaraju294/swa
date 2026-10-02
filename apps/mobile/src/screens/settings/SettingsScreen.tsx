import { useIsFocused } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Modal, View, Text, StyleSheet, ScrollView, Switch, TouchableOpacity } from 'react-native';

import { Button } from '../../design-system/Button';
import { Card } from '../../design-system/Card';
import { EyebrowLabel } from '../../design-system/EyebrowLabel';
import { WritingLineInput } from '../../design-system/WritingLineInput';
import { colors, spacing } from '../../design-system/tokens';
import { useStreak } from '../../hooks/useAwareness';
import { useExportData } from '../../hooks/useExport';
import { useProfile, useSettings, useDeleteAllData } from '../../hooks/useProfile';
import { useUI } from '../../hooks/useUI';
import { useAppLockContext } from '../../navigation/AppLockContext';
import { requestReminderPermission, syncReflectionReminders } from '../../notifications/reminders';
import {
  DEFAULT_REMINDERS,
  joinTime,
  parseReminders,
  serializeReminders,
  splitTime,
  type ReminderPrefs,
  type ReminderSlot,
} from '../../state/appStore';
import { useAddStreakWidget } from '../../widgets/useAddStreakWidget';

type PasscodeMode = 'create' | 'verify' | null;
type SettingsNotice = { tone: 'success' | 'error'; message: string } | null;

export default function SettingsScreen() {
  const router = useRouter();
  const isFocused = useIsFocused();
  const { data: profile, update: updateProfile, refresh: refreshProfile } = useProfile();
  const { data: settings, update: updateSettings, refresh: refreshSettings } = useSettings();
  const { exportData, loading: exporting } = useExportData();
  const { deleteAll, loading: deleting } = useDeleteAllData();
  const {
    enabled: lockEnabled,
    hasPasscode,
    enableAppLock,
    disableAppLock,
    resetAppLock,
    verify,
  } = useAppLockContext();

  const [displayName, setDisplayName] = useState(profile?.displayName || '');
  const [reminders, setReminders] = useState<ReminderPrefs>(parseReminders(settings?.reminderTime));
  const [savingReminders, setSavingReminders] = useState(false);
  const [savingName, setSavingName] = useState(false);
  const [reminderError, setReminderError] = useState('');
  const [notice, setNotice] = useState<SettingsNotice>(null);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  // Blossom home-screen widget: offered once, as a popup, the first time the
  // Profile tab opens, and always available from the card below.
  const { data: streak } = useStreak();
  const widget = useAddStreakWidget(streak);
  const widgetPromptSeen = useUI((state) => state.widgetPromptSeen);
  const setWidgetPromptSeen = useUI((state) => state.setWidgetPromptSeen);
  const [uiHydrated, setUiHydrated] = useState(() => useUI.persist.hasHydrated());
  const [widgetPopupVisible, setWidgetPopupVisible] = useState(false);

  useEffect(() => {
    if (useUI.persist.hasHydrated()) {
      setUiHydrated(true);
      return undefined;
    }
    return useUI.persist.onFinishHydration(() => setUiHydrated(true));
  }, []);

  useEffect(() => {
    if (!isFocused || !uiHydrated || !widget.supported || widgetPromptSeen) return;
    setWidgetPopupVisible(true);
    setWidgetPromptSeen(true);
  }, [isFocused, uiHydrated, widget.supported, widgetPromptSeen, setWidgetPromptSeen]);

  const addWidgetFromPopup = async () => {
    setWidgetPopupVisible(false);
    await widget.add();
  };

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
  const [savingPasscode, setSavingPasscode] = useState(false);

  const handleExport = async () => {
    setNotice(null);
    try {
      const result = await exportData();
      const location = result.locations.length
        ? ` Saved to ${result.locations.join(', ')}.`
        : ' A temporary copy is available inside the app.';
      setNotice({
        tone: 'success',
        message: result.downloaded
          ? `Export downloaded to ${result.locations.join(', ') || 'browser downloads'}.`
          : result.shared
            ? `Export prepared. The system share sheet was opened; choose a destination if you want to send a copy.${location}`
            : `Export prepared, but the share sheet was unavailable.${location}`,
      });
    } catch (error) {
      console.warn('Failed to export data:', error);
      setNotice({ tone: 'error', message: 'Export failed. Your saved data has not been changed.' });
    }
  };

  // Confirmation lives in an in-app modal so destructive-action feedback also
  // works on platforms where Alert.alert is unavailable.
  const handleDelete = () => {
    setDeleteError('');
    setConfirmingDelete(true);
  };

  const confirmDelete = async () => {
    setDeleteError('');
    try {
      await deleteAll();
      await resetAppLock();
      setConfirmingDelete(false);
      try {
        await syncReflectionReminders(DEFAULT_REMINDERS);
      } catch (error) {
        console.warn('Could not cancel reminders after deleting local data:', error);
      }
      router.replace('/onboarding');
    } catch (error) {
      console.warn('Failed to delete local app data:', error);
      setDeleteError('Could not complete local deletion. Your setup has not been restarted; please try again.');
    }
  };

  const handleSaveName = async () => {
    if (savingName) return;
    setNotice(null);
    setSavingName(true);
    const nextName = displayName.trim();
    try {
      await updateProfile({
        displayName: nextName,
        appLockEnabled: lockEnabled,
      });
      setNotice({
        tone: 'success',
        message: nextName ? 'Your name is saved on this device.' : 'Your display name has been cleared.',
      });
    } catch (error) {
      console.warn('Could not save display name:', error);
      setNotice({ tone: 'error', message: 'Could not save your name. Please try again.' });
    } finally {
      setSavingName(false);
    }
  };

  const persistReminders = async (next: ReminderPrefs) => {
    const previous = reminders;
    setReminderError('');
    setReminders(next);
    setSavingReminders(true);
    try {
      if (next.morning.enabled || next.evening.enabled) {
        const allowed = await requestReminderPermission();
        if (!allowed) {
          const disabled = {
            morning: { ...next.morning, enabled: false },
            evening: { ...next.evening, enabled: false },
          };
          await updateSettings({
            theme: settings?.theme || 'default',
            reminderTime: serializeReminders(disabled),
            exportFormatPref: settings?.exportFormatPref || 'json',
          });
          setReminders(disabled);
          await syncReflectionReminders(disabled);
          setReminderError(
            'Reminders were saved as off because notifications are unavailable or not permitted. Enable notifications for SWA in device settings, then try again.',
          );
          return;
        }
      }
      await updateSettings({
        theme: settings?.theme || 'default',
        reminderTime: serializeReminders(next),
        exportFormatPref: settings?.exportFormatPref || 'json',
      });
      try {
        await syncReflectionReminders(next);
      } catch (error) {
        console.warn('Could not update the reminder schedule:', error);
        setReminderError(
          'Your preferences were saved, but the reminder schedule could not be updated. Please try changing the reminder again.',
        );
      }
    } catch (error) {
      console.warn('Could not save reminder preferences:', error);
      setReminders(previous);
      setReminderError('Could not save your reminder preferences. Your previous settings have been restored.');
    } finally {
      setSavingReminders(false);
    }
  };

  const handleLockToggle = async (next: boolean) => {
    setNotice(null);
    setPasscodeError('');
    if (next && !hasPasscode) {
      setPasscode('');
      setPasscodeConfirm('');
      setPasscodeMode('create');
      return;
    }
    if (!next && hasPasscode) {
      setPasscode('');
      setPasscodeMode('verify');
      return;
    }

    setSavingPasscode(true);
    try {
      if (next) {
        await enableAppLock();
      } else {
        await disableAppLock();
      }
      setNotice({ tone: 'success', message: next ? 'App Lock is on.' : 'App Lock is off.' });
    } catch (error) {
      console.warn('Could not update App Lock:', error);
      setNotice({ tone: 'error', message: 'Could not update App Lock. Please try again.' });
    } finally {
      setSavingPasscode(false);
    }
  };

  const submitCreatePasscode = async () => {
    if (passcode.length !== 4) {
      setPasscodeError('Enter all 4 digits.');
      return;
    }
    if (passcode !== passcodeConfirm) {
      setPasscodeError('Passcodes do not match.');
      return;
    }
    setSavingPasscode(true);
    try {
      await enableAppLock(passcode);
      setPasscodeMode(null);
      setPasscode('');
      setPasscodeConfirm('');
      setNotice({ tone: 'success', message: 'App Lock is on.' });
    } catch (error) {
      console.warn('Could not enable App Lock:', error);
      setPasscodeError('Could not save App Lock. Please try again.');
    } finally {
      setSavingPasscode(false);
    }
  };

  const submitVerifyPasscode = async () => {
    if (!verify(passcode)) {
      setPasscodeError('Incorrect passcode.');
      return;
    }
    setSavingPasscode(true);
    try {
      await disableAppLock();
      setPasscodeMode(null);
      setPasscode('');
      setNotice({ tone: 'success', message: 'App Lock is off.' });
    } catch (error) {
      console.warn('Could not disable App Lock:', error);
      setPasscodeError('Could not turn off App Lock. Please try again.');
    } finally {
      setSavingPasscode(false);
    }
  };

  return (
    <>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Text style={styles.title}>Settings</Text>
        <Text style={styles.subtitle}>Your space, your rules.</Text>
        {notice ? (
          <Text
            style={[styles.notice, notice.tone === 'error' && styles.noticeError]}
            accessibilityRole={notice.tone === 'error' ? 'alert' : 'text'}
            accessibilityLiveRegion="polite"
          >
            {notice.message}
          </Text>
        ) : null}

        <Card style={styles.card}>
          <EyebrowLabel label="PROFILE" />
          <Text style={styles.label}>Display Name</Text>
          <WritingLineInput
            value={displayName}
            onChangeText={(value) => {
              setDisplayName(value);
              setNotice(null);
            }}
            placeholder="Your name"
            multiline={false}
            accessibilityLabel="Display name"
            maxLength={40}
            returnKeyType="done"
          />
          <Button
            title={savingName ? 'Saving…' : 'Save Name'}
            onPress={handleSaveName}
            variant="secondary"
            color={colors.sage}
            disabled={savingName}
            loading={savingName}
            style={{ marginTop: spacing.md }}
          />
        </Card>

        {widget.supported ? (
          <Card style={styles.card}>
            <EyebrowLabel label="HOME SCREEN WIDGET" />
            <Text style={styles.rowLabel}>Keep Blossom close</Text>
            <Text style={styles.rowDesc}>
              Add your streak and Blossom to your home screen. Blossom changes mood with your streak.
            </Text>
            <Button
              title={widget.requesting ? 'Opening widget picker…' : widget.requested ? 'Widget requested' : 'Add widget'}
              onPress={() => {
                widget.add();
              }}
              variant="secondary"
              color={colors.sage}
              disabled={widget.requesting}
              loading={widget.requesting}
              style={{ marginTop: spacing.md }}
              accessibilityLabel="Add the SWA streak widget to your Android home screen"
              accessibilityHint="Opens the Android widget picker."
            />
          </Card>
        ) : null}

        <Card style={styles.card}>
          <EyebrowLabel label="PRIVACY" />
          <View style={styles.row}>
            <View style={styles.rowInfo}>
              <Text style={styles.rowLabel}>App Lock</Text>
              <Text style={styles.rowDesc}>
                Require a 4-digit passcode when you reopen the app. There is no in-app passcode recovery, so choose one
                you can remember.
              </Text>
            </View>
            <Switch
              value={lockEnabled}
              disabled={savingPasscode}
              onValueChange={handleLockToggle}
              trackColor={{ true: colors.sage, false: '#E0DAD0' }}
              accessibilityLabel="App Lock"
              accessibilityHint="Require your four-digit passcode when reopening the app"
              accessibilityState={{ checked: lockEnabled, disabled: savingPasscode }}
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
          {reminderError ? (
            <Text style={styles.inlineError} accessibilityRole="alert" accessibilityLiveRegion="polite">
              {reminderError}
            </Text>
          ) : null}
        </Card>

        <Card style={styles.card}>
          <EyebrowLabel label="DATA" />
          <Text style={styles.rowDesc}>
            Export a JSON copy of locally stored journal entries, check-ins, progress, settings, your setup profile and
            in-progress drafts. The app-lock passcode is not exported. The file can be shared outside the app; exported
            copies are not removed by local deletion. Selected setup details, including goals and an optional email,
            sync to Supabase when connected.
          </Text>
          <Button
            title={exporting ? 'Exporting...' : 'Export All Data'}
            onPress={handleExport}
            color={colors.gold}
            disabled={exporting}
            loading={exporting}
            style={{ marginTop: spacing.md }}
          />
        </Card>

        <Card style={styles.card}>
          <EyebrowLabel label="DANGER ZONE" />
          <Text style={styles.rowDesc}>
            Permanently delete journal entries, check-ins, progress, settings and in-progress drafts stored by this app
            on this device. Exported files and setup details already synced online are not removed.
          </Text>
          <Button
            title={deleting ? 'Deleting...' : 'Delete Local App Data'}
            onPress={handleDelete}
            color="#D4795F"
            disabled={deleting || confirmingDelete}
            loading={deleting}
            style={{ marginTop: spacing.md }}
          />
        </Card>

        <Card style={styles.card}>
          <EyebrowLabel label="ABOUT" />
          <Text style={styles.aboutTitle}>The Inward Journey</Text>
          <Text style={styles.aboutBody}>
            A self-awareness companion with a morning arrival, one small practice and an evening look-back. Your
            journal, check-ins and progress are stored locally; setup details you choose may sync online when connected.
          </Text>
          <Text style={styles.version}>Version 0.1.0</Text>
        </Card>

        <View style={{ height: 80 }} />
      </ScrollView>

      <Modal
        visible={widgetPopupVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setWidgetPopupVisible(false)}
      >
        <View style={styles.widgetBackdrop}>
          <View style={styles.modalCard} accessibilityViewIsModal accessibilityLabel="Add the Blossom widget">
            <EyebrowLabel label="NEW · HOME SCREEN WIDGET" />
            <Text style={styles.modalTitle}>Keep Blossom close</Text>
            <Text style={styles.modalBody}>
              Add the streak widget to your home screen to see your streak and Blossom's mood at a glance. You can
              always add it later from Profile.
            </Text>
            <View style={styles.modalButtons}>
              <Button title="Not now" variant="ghost" onPress={() => setWidgetPopupVisible(false)} />
              <Button title="Add widget" color={colors.sage} onPress={addWidgetFromPopup} />
            </View>
          </View>
        </View>
      </Modal>

      {confirmingDelete && (
        <View
          style={styles.modalOverlay}
          accessibilityViewIsModal
          accessibilityLabel="Delete local app data confirmation"
        >
          <View style={styles.modalCard}>
            <EyebrowLabel label="DELETE LOCAL DATA" />
            <Text style={styles.modalTitle}>
              This permanently deletes journal entries, check-ins, progress, settings and drafts stored by this app on
              this device. It cannot be undone.
            </Text>
            <Text style={styles.modalBody}>
              Setup details already synced online (including any email you added) and files exported or shared outside
              the app are not removed. This app has no cloud-delete option.
            </Text>

            {deleteError ? (
              <Text style={styles.modalError} accessibilityRole="alert" accessibilityLiveRegion="polite">
                {deleteError}
              </Text>
            ) : null}

            <View style={styles.modalButtons}>
              <Button title="Cancel" variant="ghost" disabled={deleting} onPress={() => setConfirmingDelete(false)} />
              <Button
                title="Delete local data"
                color="#D4795F"
                disabled={deleting}
                loading={deleting}
                onPress={confirmDelete}
              />
            </View>
          </View>
        </View>
      )}

      {passcodeMode && (
        <View style={styles.modalOverlay} accessibilityViewIsModal accessibilityLabel="App Lock passcode">
          <View style={styles.modalCard}>
            <EyebrowLabel label={passcodeMode === 'create' ? 'SET APP LOCK' : 'ENTER PASSCODE'} />
            <Text style={styles.modalTitle}>
              {passcodeMode === 'create' ? 'Create a 4-digit passcode' : 'Enter your passcode to turn off App Lock'}
            </Text>
            {passcodeMode === 'create' ? (
              <Text style={styles.modalBody}>
                Your passcode is kept on this device. There is no in-app recovery if you forget it.
              </Text>
            ) : null}

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
              accessibilityLabel={passcodeMode === 'create' ? 'Create passcode' : 'Current passcode'}
              accessibilityHint="Enter exactly four digits"
              autoCorrect={false}
              editable={!savingPasscode}
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
                  accessibilityLabel="Confirm passcode"
                  accessibilityHint="Re-enter your four-digit passcode"
                  autoCorrect={false}
                  editable={!savingPasscode}
                />
              </>
            )}

            {passcodeError ? (
              <Text style={styles.modalError} accessibilityRole="alert" accessibilityLiveRegion="polite">
                {passcodeError}
              </Text>
            ) : null}

            <View style={styles.modalButtons}>
              <Button
                title="Cancel"
                variant="ghost"
                disabled={savingPasscode}
                onPress={() => {
                  setPasscodeMode(null);
                  setPasscode('');
                  setPasscodeConfirm('');
                  setPasscodeError('');
                }}
              />
              <Button
                title={savingPasscode ? 'Saving...' : passcodeMode === 'create' ? 'Set Passcode' : 'Confirm'}
                color={colors.sage}
                disabled={savingPasscode}
                loading={savingPasscode}
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
          accessibilityLabel={`Enable ${title} reminders`}
          accessibilityState={{ checked: slot.enabled, disabled: Boolean(disabled) }}
        />
      </View>
      <View style={styles.timeRow}>
        <TimeChip
          label={String(hour).padStart(2, '0')}
          hint="hour"
          reminderLabel={title}
          disabled={disabled || !slot.enabled}
          onDec={() => onChange({ ...slot, time: joinTime(hour - 1, minute) })}
          onInc={() => onChange({ ...slot, time: joinTime(hour + 1, minute) })}
        />
        <Text style={styles.timeColon}>:</Text>
        <TimeChip
          label={String(minute).padStart(2, '0')}
          hint="minute"
          reminderLabel={title}
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
  reminderLabel,
  disabled,
  onDec,
  onInc,
}: {
  label: string;
  hint: string;
  reminderLabel: string;
  disabled?: boolean;
  onDec: () => void;
  onInc: () => void;
}) {
  return (
    <View style={[styles.timeChip, disabled && styles.timeChipOff]}>
      <TouchableOpacity
        onPress={onDec}
        disabled={disabled}
        hitSlop={4}
        style={styles.timeBtn}
        accessibilityRole="button"
        accessibilityLabel={`Decrease ${reminderLabel} ${hint}`}
        accessibilityHint={`Current ${hint} is ${label}`}
      >
        <Text style={styles.timeBtnText} accessible={false}>
          −
        </Text>
      </TouchableOpacity>
      <View>
        <Text style={styles.timeValue}>{label}</Text>
        <Text style={styles.timeHint}>{hint}</Text>
      </View>
      <TouchableOpacity
        onPress={onInc}
        disabled={disabled}
        hitSlop={4}
        style={styles.timeBtn}
        accessibilityRole="button"
        accessibilityLabel={`Increase ${reminderLabel} ${hint}`}
        accessibilityHint={`Current ${hint} is ${label}`}
      >
        <Text style={styles.timeBtnText} accessible={false}>
          +
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.cream },
  content: { padding: spacing.lg, paddingBottom: 100 },
  title: {
    fontFamily: 'Fraunces_600SemiBold',
    fontSize: 28,
    fontWeight: '600',
    color: colors.ink,
    marginBottom: spacing.xs,
  },
  subtitle: { fontFamily: 'Nunito_400Regular', fontSize: 14, color: colors.inkSoft, marginBottom: spacing.xl },
  card: { padding: spacing.lg, marginBottom: spacing.lg },
  label: { fontFamily: 'Nunito_700Bold', fontSize: 12, fontWeight: '700', color: colors.ink, marginBottom: spacing.sm },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  rowInfo: { flex: 1, marginRight: spacing.md },
  rowLabel: { fontFamily: 'Nunito_700Bold', fontSize: 14, fontWeight: '700', color: colors.ink },
  rowDesc: { fontFamily: 'Nunito_400Regular', fontSize: 13, color: colors.inkSoft, lineHeight: 19, marginTop: 4 },
  notice: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 13,
    fontWeight: '700',
    color: colors.leafInk,
    lineHeight: 19,
    marginBottom: spacing.md,
  },
  noticeError: { color: '#8A3B24' },
  inlineError: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 13,
    fontWeight: '600',
    color: '#8A3B24',
    lineHeight: 19,
    marginTop: spacing.md,
  },
  reminderBlock: { marginTop: spacing.lg },
  timeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    marginTop: spacing.md,
  },
  timeColon: { fontFamily: 'Fraunces_600SemiBold', fontSize: 24, color: colors.ink, marginBottom: 12 },
  timeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    backgroundColor: '#F4EFE6',
    borderRadius: 16,
    paddingHorizontal: 4,
    paddingVertical: 4,
  },
  timeChipOff: { opacity: 0.55 },
  timeBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeBtnText: { fontFamily: 'Nunito_700Bold', fontSize: 20, fontWeight: '700', color: colors.ink },
  timeValue: {
    fontFamily: 'Fraunces_600SemiBold',
    fontSize: 20,
    fontWeight: '600',
    color: colors.ink,
    textAlign: 'center',
    minWidth: 30,
  },

  timeHint: { fontFamily: 'Nunito_400Regular', fontSize: 10, color: colors.inkSoft, textAlign: 'center' },
  aboutTitle: {
    fontFamily: 'Fraunces_600SemiBold',
    fontSize: 18,
    fontWeight: '600',
    color: colors.ink,
    marginBottom: spacing.sm,
  },
  aboutBody: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 13,
    color: colors.inkSoft,
    lineHeight: 19,
    marginBottom: spacing.sm,
  },
  version: { fontFamily: 'Nunito_400Regular', fontSize: 11, color: colors.ghost, marginTop: spacing.md },
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
  widgetBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(40, 34, 28, 0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  modalCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: spacing.lg,
  },
  modalTitle: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 15,
    fontWeight: '700',
    color: colors.ink,
    lineHeight: 22,
    marginBottom: spacing.sm,
    marginTop: spacing.xs,
  },
  modalBody: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 13,
    color: colors.inkSoft,
    lineHeight: 19,
    marginBottom: spacing.md,
  },
  modalError: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 13,
    fontWeight: '600',
    color: '#8A3B24',
    marginTop: spacing.sm,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.sm,
    marginTop: spacing.lg,
  },
});
