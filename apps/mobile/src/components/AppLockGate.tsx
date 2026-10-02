import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Platform } from 'react-native';

import { Button } from '../design-system/Button';
import { PetalMark } from '../design-system/PetalMark';
import { colors, spacing, radius } from '../design-system/tokens';
import { useAppLockContext } from '../navigation/AppLockContext';

// Best-effort biometric support. The module is present in the bundle but may
// be unavailable at runtime on some platforms (e.g. web preview), so every
// call is guarded.
async function canUseBiometrics(): Promise<boolean> {
  try {
    const LocalAuth = require('expo-local-authentication');
    if (typeof LocalAuth.hasHardwareAsync !== 'function') return false;
    const [hasHardware, isEnrolled] = await Promise.all([LocalAuth.hasHardwareAsync(), LocalAuth.isEnrolledAsync()]);
    return hasHardware && isEnrolled;
  } catch {
    return false;
  }
}

async function authenticateBiometric(): Promise<boolean> {
  try {
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
  const [error, setError] = useState('');
  const [biometric, setBiometric] = useState(false);
  const [authenticating, setAuthenticating] = useState(false);

  useEffect(() => {
    if (locked) {
      canUseBiometrics().then(setBiometric);
    }
  }, [locked]);

  if (!locked) return null;

  const submit = () => {
    if (code.length !== 4) {
      setError('Enter all four digits.');
      return;
    }
    if (verify(code)) {
      setCode('');
      setError('');
      unlock();
    } else {
      setError('Incorrect passcode. Try again.');
      setCode('');
    }
  };

  const handleBiometric = async () => {
    if (authenticating) return;
    setAuthenticating(true);
    setError('');
    try {
      const ok = await authenticateBiometric();
      if (ok) {
        setCode('');
        unlock();
      } else {
        setError('Biometric check was not completed. Enter your passcode instead.');
      }
    } finally {
      setAuthenticating(false);
    }
  };

  return (
    <View style={styles.overlay} pointerEvents="auto" accessibilityViewIsModal>
      <View style={styles.card} accessibilityLabel="App Lock">
        <PetalMark size={56} />
        <Text style={styles.title}>Welcome back</Text>
        <Text style={styles.subtitle}>Enter your passcode to continue.</Text>

        <TextInput
          style={[styles.input, error && styles.inputError]}
          value={code}
          onChangeText={(text) => {
            setError('');
            setCode(text.replace(/[^0-9]/g, '').slice(0, 4));
          }}
          placeholder="••••"
          placeholderTextColor={colors.ghost}
          secureTextEntry
          keyboardType="number-pad"
          maxLength={4}
          autoFocus
          autoCorrect={false}
          textAlign="center"
          accessibilityLabel="Four-digit app lock passcode"
          accessibilityHint="Enter your four-digit passcode to unlock the app"
          onSubmitEditing={submit}
        />

        {error ? (
          <Text style={styles.error} accessibilityRole="alert" accessibilityLiveRegion="polite">
            {error}
          </Text>
        ) : null}

        <Button
          title={authenticating ? 'Checking…' : 'Unlock'}
          onPress={submit}
          color={colors.gold}
          style={styles.button}
          disabled={authenticating}
          loading={authenticating}
          accessibilityLabel="Unlock the app"
        />

        {biometric && (
          <TouchableOpacity
            onPress={handleBiometric}
            style={styles.biometric}
            disabled={authenticating}
            accessibilityRole="button"
            accessibilityLabel="Use Face ID or fingerprint to unlock"
            accessibilityState={{ disabled: authenticating }}
          >
            <Text style={styles.biometricText}>{authenticating ? 'Checking…' : 'Use Face ID / Fingerprint'}</Text>
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
    fontFamily: 'Fraunces_600SemiBold',
    fontSize: 24,
    fontWeight: '600',
    color: colors.ink,
    marginTop: spacing.md,
  },
  subtitle: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 13,
    color: colors.inkSoft,
    marginTop: spacing.xs,
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  input: {
    fontFamily: 'Nunito_400Regular',
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
    borderBottomColor: '#8A3B24',
  },
  error: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 12,
    color: '#8A3B24',
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
    fontFamily: 'Nunito_700Bold',
    fontSize: 13,
    fontWeight: '700',
    color: colors.leafInk,
  },
});
