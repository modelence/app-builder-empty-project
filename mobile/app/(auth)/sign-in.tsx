import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from '../../components/ui';
import { useOAuthSignIn } from '../../lib/oauth';

/**
 * Sign-in screen.
 *
 * The OAuth buttons require a modelence dev build (see mobile/OAUTH.md) and a
 * server-side `auth.mobile.redirectUrls` allowlist entry for this build target.
 * Add password/email fields here alongside them as needed.
 */
export default function SignInScreen() {
  const [error, setError] = useState<string | null>(null);
  const { signIn, pendingProvider } = useOAuthSignIn({ onError: setError });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign In</Text>
      <Text style={styles.subtitle}>Continue with your account.</Text>

      <View style={styles.actions}>
        <Button
          variant="outline"
          onPress={() => signIn('google')}
          loading={pendingProvider === 'google'}
          disabled={pendingProvider !== null}
        >
          Continue with Google
        </Button>

        <Button
          variant="outline"
          onPress={() => signIn('github')}
          loading={pendingProvider === 'github'}
          disabled={pendingProvider !== null}
        >
          Continue with GitHub
        </Button>
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    backgroundColor: '#f3f4f6',
  },
  title: { fontSize: 28, fontWeight: '700', color: '#111827' },
  subtitle: { marginTop: 8, fontSize: 15, color: '#6b7280' },
  actions: { marginTop: 32, width: '100%', maxWidth: 320, gap: 12 },
  error: { marginTop: 16, fontSize: 14, color: '#dc2626', textAlign: 'center' },
});
