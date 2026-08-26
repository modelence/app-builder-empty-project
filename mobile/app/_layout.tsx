import '../index';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { Slot, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { AppProvider, useSession } from 'modelence/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useOAuthCallback } from '../lib/oauth';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, refetchOnWindowFocus: false },
  },
});

function Loading() {
  return (
    <View style={styles.loading}>
      <ActivityIndicator color="#6366f1" size="large" />
    </View>
  );
}

function RouteGuard() {
  const { user } = useSession();
  const segments = useSegments();
  const router = useRouter();

  // Redeems an OAuth deep link (cold or warm start) into a session. Mounted
  // here so a link that launches the app is handled before anything renders.
  const { isCompleting } = useOAuthCallback();

  useEffect(() => {
    // Hold still while an OAuth code is being exchanged: the user is briefly
    // signed out but is not "logged out", and bouncing to sign-in mid-exchange
    // would unmount the callback route on web.
    if (isCompleting) return;

    const inAuthGroup = segments[0] === '(auth)';
    // The OAuth callback route sits outside the auth group and must stay
    // mounted for the signed-out half of the exchange.
    const isCallbackRoute = segments[0] === 'auth';
    if (isCallbackRoute) return;

    if (!user && !inAuthGroup) {
      router.replace('/(auth)/sign-in');
    } else if (user && inAuthGroup) {
      router.replace('/(app)/home');
    }
  }, [user, segments, isCompleting]);

  if (isCompleting) return <Loading />;

  return <Slot />;
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <StatusBar style="dark" />
        <AppProvider loadingElement={<Loading />}>
          <QueryClientProvider client={queryClient}>
            <RouteGuard />
          </QueryClientProvider>
        </AppProvider>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f3f4f6' },
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#f3f4f6' },
});
