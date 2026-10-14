import React, { useState, useSyncExternalStore } from 'react';
import { Modal, Platform, StyleSheet, Text, View } from 'react-native';
import { Button } from '../design-system/Button';
import { Card } from '../design-system/Card';
import { colors, spacing } from '../design-system/tokens';
import { backupNow, getBackupStatus, linkBackupFolder, pickBackupFolder, stageDeviceRestore, subscribeBackupStatus, type Snapshot } from '../lib/deviceBackup';

export function DeviceBackupCard() {
  const status = useSyncExternalStore(subscribeBackupStatus, getBackupStatus, getBackupStatus);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [candidate, setCandidate] = useState<{ uri: string; existing: Snapshot } | null>(null);
  if (Platform.OS !== 'android') return null;
  const run = async (work: () => Promise<void>) => {
    setBusy(true); setError('');
    try { await work(); } catch (e) { setError(e instanceof Error ? e.message : 'Backup failed. Please try again.'); }
    finally { setBusy(false); }
  };
  return <Card style={styles.card}>
    <Text style={styles.title}>Keep your journey safe</Text>
    <Text style={styles.body}>Choose a private device folder for automatic backups. After reinstalling, select the same folder to restore. Android cloud backup depends on your device settings and is not guaranteed.</Text>
    <Text style={styles.body}>Backups include personal reflections in readable JSON. Anyone with access to the folder can read them. Your app-lock passcode is not included.</Text>
    <Text style={styles.status}>{status.linked ? 'Device folder linked' : 'Device folder not linked'}{status.lastSaved ? ` · Saved ${new Date(status.lastSaved).toLocaleString()}` : ''}</Text>
    {error || status.error ? <Text style={styles.error} accessibilityRole="alert">{error || status.error}</Text> : null}
    <Button title={busy ? 'Working…' : 'Choose folder / Restore'} disabled={busy} color={colors.leaf} onPress={() => run(async () => {
      const selected = await pickBackupFolder();
      if (!selected) return;
      if (selected.existing) setCandidate({ uri: selected.uri, existing: selected.existing });
      else await linkBackupFolder(selected.uri);
    })} />
    {status.linked ? <Button title="Back up now" disabled={busy} color={colors.gold} style={{ marginTop: spacing.sm }} onPress={() => run(backupNow)} /> : null}
    <Modal visible={Boolean(candidate)} transparent animationType="fade" onRequestClose={() => { if (!busy) setCandidate(null); }}>
      <View style={styles.overlay}><View style={styles.sheet}>
        <Text style={styles.title}>Restore saved progress?</Text>
        <Text style={styles.body}>Backup from {candidate ? new Date(candidate.existing.timestamp).toLocaleString() : ''}. This replaces your current local progress, profile and drafts after you close and reopen SWA. Your app lock will need to be set up again.</Text>
        {error ? <Text style={styles.error} accessibilityRole="alert">{error}</Text> : null}
        <Button title="Restore this backup" disabled={busy} color={colors.leaf} onPress={() => run(async () => {
          if (candidate) await stageDeviceRestore(candidate.existing, candidate.uri);
          setCandidate(null);
        })} />
        <Button title="Keep current data and link this folder" disabled={busy} color={colors.gold} style={{ marginTop: spacing.sm }} onPress={() => run(async () => {
          if (candidate) await linkBackupFolder(candidate.uri, true);
          setCandidate(null);
        })} />
        <Text style={styles.body}>Linking with current data starts replacing the folder's older backup copies.</Text>
        <Button title="Cancel — do not change anything" disabled={busy} color={colors.gold} style={{ marginTop: spacing.sm }} onPress={() => setCandidate(null)} />
      </View></View>
    </Modal>
  </Card>;
}
const styles = StyleSheet.create({
  card: { padding: spacing.lg, marginVertical: spacing.md },
  title: { fontSize: 20, fontFamily: 'Fraunces_600SemiBold', color: colors.ink },
  body: { fontSize: 13, lineHeight: 19, color: colors.inkSoft, marginVertical: spacing.sm },
  status: { fontSize: 12, color: colors.leafInk, marginVertical: spacing.sm },
  error: { color: '#9E3527', marginBottom: spacing.sm, lineHeight: 19 },
  overlay: { flex: 1, backgroundColor: 'rgba(40,30,20,0.45)', justifyContent: 'center', padding: spacing.lg },
  sheet: { backgroundColor: colors.cream, borderRadius: 24, padding: spacing.lg },
});
