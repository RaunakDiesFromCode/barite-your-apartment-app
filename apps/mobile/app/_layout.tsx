import '../global.css';
import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { getToken } from '@/lib/auth';
import { apiFetch } from '@/lib/api';
import { SocietyProvider } from '@/lib/society';

type StartRoute = 'index' | 'society-choice' | 'home';

export default function RootLayout() {
    const [ready, setReady] = useState(false);
    const [startRoute, setStartRoute] = useState<StartRoute>('index');

    useEffect(() => {
        async function bootstrap() {
            try {
                const token = await getToken();

                if (!token) {
                    setStartRoute('index');
                    return;
                }

                await apiFetch('/me');

                const societies = await apiFetch('/societies/mine');

                if (societies.length === 0) {
                    setStartRoute('society-choice');
                } else {
                    setStartRoute('home');
                }
            } catch {
                setStartRoute('index');
            } finally {
                setReady(true);
            }
        }

        bootstrap();
    }, []);

    if (!ready) {
        return (
            <View className="flex-1 items-center justify-center bg-white">
                <ActivityIndicator />
            </View>
        );
    }

    return (
        <SocietyProvider>
            <Stack initialRouteName={startRoute} screenOptions={{ headerShown: false }}>
                <Stack.Screen name="index" />
                <Stack.Screen name="society-choice" />
                <Stack.Screen name="society-disclaimer" />
                <Stack.Screen name="create-society" />
                <Stack.Screen name="home" />
            </Stack>
        </SocietyProvider>
    );

}
