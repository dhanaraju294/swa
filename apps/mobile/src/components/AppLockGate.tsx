import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import { colors, spacing, radius } from '../design-system/tokens';
import { PetalMark } from '../design-system/PetalMark';
import { Button } from '../design-system/Button';
import { useAppLockContext } from '../navigation/AppLockContext';

// Best-effort biometric support. The module is present in the bundle but may
// be unavailable at runtime on some platforms (e.g. web preview), so every
// call is guarded.
async function canUseBiometrics(): Promise<boolean> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const LocalAuth = require('expo-local-authentication');
    if (typeof LocalAuth.hasHardwareAsync !== 'function') return false;
    const [hasHardware, isEnrolled] = await Promise.all([
      LocalAuth.hasHardwareAsync(),
      LocalAuth.isEnrolledAsync(),
    ]);
    return hasHardware && isEnrolled;
  } catch {
    return false;
  }
}

async function authenticateBiometric(): Promise<boolean> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const LocalAuth = require('expo-local-authentication');
    const result = await LocalAuth.authenticateAsync({
      promptMessage: 'Unlock The Inward Journey',
      fallbackLabel: 'Use passcode',
    });
    return result.success;
  } catch {
    return false;
  }
}

export default function AppLockGate() {
  const { locked, unlock, verify } = useAppLockContext();
  const [code, setCode] = useState('');
  const [error, setError] = useState(false);
  const [biometric, setBiometric] = useState(false);

  useEffect(() => {
    if (locked) {
      canUseBiometrics().then(setBiometric);
    }
  }, [locked]);

  if (!locked) return null;

  const submit = () => {
    if (verify(code)) {
      setCode('');
      setError(false);
      unlock();
    } else {
      setError(true);
      setCode('');
    }
  };

  const handleBiometric = async () => {
    const ok = await authenticateBiometric();
    if (ok) {
      setCode('');
      setError(false);
      unlock();
    } else {
      setError(true);
    }
  };

  return (
    <View style={styles.overlay} pointerEvents="auto">
      <View style={styles.card}>
        <PetalMark size={56} />
        <Text style={styles.title}>Welcome back</Text>
        <Text style={styles.subtitle}>Enter your passcode to continue.</Text>

        <TextInput
          style={[styles.input, error && styles.inputError]}
          value={code}
          onChangeText={(t) => {
            setError(false);
            setCode(t.replace(/[^0-9]/g, '').slice(0, 4));
          }}
          placeholder="••••"
          placeholderTextColor={colors.ghost}
          secureTextEntry
          keyboardType="number-pad"
          maxLength={4}
          autoFocus
          textAlign="center"
          onSubmitEditing={submit}
        />

        {error && <Text style={styles.error}>Incorrect passcode. Try again.</Text>}

        <Button title="Unlock" onPress={submit} color={colors.gold} style={styles.button} />

        {biometric && (
          <TouchableOpacity onPress={handleBiometric} style={styles.biometric}>
            <Text style={styles.biometricText}>Use Face ID / Fingerprint</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.cream,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
    zIndex: 100,
  },
  card: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: '#FFFFFF',
    borderRadius: radius.lg,
    padding: spacing.xl,
    alignItems: 'center',
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 20, shadowOffset: { width: 0, height: 8 } },
      android: { elevation: 6 },
    }),
  },
  title: {
    fontFamily: 'Fraunces',
    fontSize: 24,
    fontWeight: '600',
    color: colors.ink,
    marginTop: spacing.md,
  },
  subtitle: {
    fontFamily: 'Nunito',
    fontSize: 13,
    color: colors.inkSoft,
    marginTop: spacing.xs,
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  input: {
    fontFamily: 'Nunito',
    fontSize: 28,
    letterSpacing: 12,
    color: colors.ink,
    borderBottomWidth: 2,
    borderBottomColor: colors.writingLine,
    paddingVertical: spacing.md,
    width: '80%',
    textAlign: 'center',
  },
  inputError: {
    borderBottomColor: '#D4795F',
  },
  error: {
    fontFamily: 'Nunito',
    fontSize: 12,
    color: '#D4795F',
    marginTop: spacing.sm,
  },
  button: {
    marginTop: spacing.lg,
    width: '100%',
  },
  biometric: {
    marginTop: spacing.md,
    padding: spacing.sm,
  },
  biometricText: {
    fontFamily: 'Nunito',
    fontSize: 13,
    fontWeight: '700',
    color: colors.sage,
  },
});
