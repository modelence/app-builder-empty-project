import { StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

export default function App() {
  // SafeAreaProvider reads the device's real safe-area insets (notch, Dynamic
  // Island, home indicator) from the OS on iOS/Android, and from the browser on
  // web. SafeAreaView then pads content away from those areas automatically, so
  // nothing is hidden under the front-camera cutout on any device.
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safe}>
        <StatusBar style="dark" />
        <View style={styles.container}>
          <Text style={styles.title}>Hello, World!</Text>
          <Text style={styles.subtitle}>Welcome to your new Modelence mobile app</Text>

          <View style={styles.card}>
            <Text style={styles.cardText}>
              This is your mobile placeholder -{' '}
              <Text style={styles.code}>mobile/App.tsx</Text>
            </Text>
          </View>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#111827',
  },
  subtitle: {
    marginTop: 12,
    fontSize: 16,
    color: '#4b5563',
  },
  card: {
    marginTop: 32,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  cardText: {
    fontSize: 13,
    color: '#374151',
  },
  code: {
    fontWeight: '700',
    fontFamily: 'Courier',
  },
});
