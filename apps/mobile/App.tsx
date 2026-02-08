import './global.css';
import { DefaultTheme, DarkTheme, NavigationContainer } from '@react-navigation/native';
import { useColorScheme } from 'react-native';
import { useMemo } from 'react';

import 'react-native-gesture-handler';

import RootNavigator from '@/navigation/RootNavigator';
import { SocietyProvider } from '@/hooks/useSociety';

export default function App() {
  const colorScheme = useColorScheme();
  const theme = useMemo(() => (colorScheme === 'dark' ? DarkTheme : DefaultTheme), [colorScheme]);

  return(
    <NavigationContainer>
            <SocietyProvider>
                <RootNavigator />
            </SocietyProvider>
        </NavigationContainer>
  );
}
