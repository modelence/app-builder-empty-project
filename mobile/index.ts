import { registerRootComponent } from 'expo';
import Constants from 'expo-constants';
import { Dimensions, PixelRatio } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { configureClient } from 'modelence/client';

import App from './App';

const AUTH_TOKEN_KEY = 'modelence.authToken';

const configuredBaseUrl = Constants.expoConfig?.extra?.modelenceBaseUrl as
  | string
  | undefined;

if (!configuredBaseUrl) {
  throw new Error('Missing "extra.modelenceBaseUrl" in app.json');
}

const baseUrl: string = configuredBaseUrl;

// In-memory cache so the synchronous getAuthToken can serve a value that is
// persisted asynchronously in AsyncStorage.
let authToken: string | undefined;

async function bootstrap() {
  try {
    authToken = (await AsyncStorage.getItem(AUTH_TOKEN_KEY)) ?? undefined;
  } catch (error) {
    console.error('Failed to load auth token from storage', error);
  }

  configureClient({
    baseUrl,
    getAuthToken: () => authToken,
    setAuthToken: (token) => {
      authToken = token ?? undefined;

      const write =
        token == null
          ? AsyncStorage.removeItem(AUTH_TOKEN_KEY)
          : AsyncStorage.setItem(AUTH_TOKEN_KEY, token);

      write.catch((error) => {
        console.error('Failed to persist auth token to storage', error);
      });
    },
    getClientInfo: () => ({
      screenWidth: Dimensions.get('screen').width,
      screenHeight: Dimensions.get('screen').height,
      windowWidth: Dimensions.get('window').width,
      windowHeight: Dimensions.get('window').height,
      pixelRatio: PixelRatio.get(),
      orientation: null,
    }),
  });

  registerRootComponent(App);
}

bootstrap();
