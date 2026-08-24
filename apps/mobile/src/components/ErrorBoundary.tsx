import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing } from '../design-system/tokens';
import { Button } from '../design-system/Button';

type Props = { children: React.ReactNode };
type State = { error: Error | null };

// Top-level boundary: a render crash anywhere in the app shows a readable
// screen (with the error) instead of a silent white screen.
export default class ErrorBoundary extends React.Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('[ErrorBoundary]', error, info?.componentStack);
  }

  render() {
    if (this.state.error) {
      return (
        <View style={styles.wrap}>
          <Text style={styles.title}>Something went wrong.</Text>
          <Text style={styles.body}>{this.state.error.message}</Text>
          <Button
            title="Try again"
            onPress={() => this.setState({ error: null })}
            color={colors.gold}
            style={{ marginTop: spacing.xl }}
          />
        </View>
      );
    }
    return this.props.children;
  }
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: colors.cream, justifyContent: 'center', padding: spacing.xxl },
  title: { fontFamily: 'Fraunces', fontSize: 26, fontWeight: '600', color: colors.ink },
  body: { fontFamily: 'Nunito', fontSize: 14, color: colors.inkSoft, marginTop: spacing.md, lineHeight: 20 },
});
