import '../global.css';
import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { getToken } from '@/lib/auth';
import { apiFetch } from '@/lib/api';

export default function RootLayout() {
    const [ready, setReady] = useState(false);
    const [loggedIn, setLoggedIn] = useState(false);

    useEffect(() => {
        async function bootstrap() {
            try {
                const token = await getToken();
                if (!token) {
                    setReady(true);
                    return;
                }

                // validate token
                await apiFetch('/me');
                setLoggedIn(true);
            } catch {
                // token invalid / expired
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
        <Stack screenOptions={{ headerShown: false }}>
            {loggedIn ? <Stack.Screen name="home" /> : <Stack.Screen name="index" />}
        </Stack>
    );
}
