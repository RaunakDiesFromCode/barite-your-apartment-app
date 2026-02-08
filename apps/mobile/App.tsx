import './global.css';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { useColorScheme, View, ActivityIndicator } from 'react-native';
import { useEffect, useMemo, useState } from 'react';
import * as SecureStore from 'expo-secure-store';

import 'react-native-gesture-handler';

import RootNavigator from '@/navigation/RootNavigator';
import { SocietyProvider } from '@/hooks/useSociety';

export default function App() {
  const colorScheme = useColorScheme();
  const theme = useMemo(() => (colorScheme === 'dark' ? DarkTheme : DefaultTheme), [colorScheme]);

  const [ready, setReady] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    async function bootstrap() {
      const token = await SecureStore.getItemAsync('token');
      setLoggedIn(!!token);
      setReady(true);
    }

    bootstrap();
  }, []);

  if (!ready) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <NavigationContainer theme={theme}>
      <SocietyProvider>
        <RootNavigator initialRouteName={loggedIn ? 'Main' : 'Login'} />
      </SocietyProvider>
    </NavigationContainer>
  );
}
