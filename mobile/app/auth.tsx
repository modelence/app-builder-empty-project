/**
 * OAuth callback route.
 *
 * On a native build the deep link is handled by the `Linking` listener in
 * `useOAuthCallback` and this screen is never mounted. It exists for Expo Web,
 * where the redirect is a real page load at `/auth` — without this route Expo
 * Router shows "Unmatched Route" even though sign-in succeeded and the code is
 * sitting in the URL.
 *
 * The redemption itself still runs in `useOAuthCallback` (mounted in the root
 * layout), which reads `window.location.href` on web through the same
 * `getInitialURL` path. This screen only has to render while that happens.
 */
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

export default function AuthCallbackScreen() {
  return (
    <View style={styles.container}>
      <ActivityIndicator color="#6366f1" size="large" />
      <Text style={styles.text}>Signing you in…</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    backgroundColor: '#f3f4f6',
  },
  text: { fontSize: 15, color: '#6b7280' },
});
