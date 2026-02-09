import { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Redirect } from 'expo-router';
import { getToken } from '@/lib/auth/token';
import { apiFetch } from '@/lib/api/client';

export default function Index() {
    const [state, setState] = useState<'loading' | 'authed' | 'unauthed'>('loading');

    useEffect(() => {
        async function checkAuth() {
            try {
                const token = await getToken();
                if (!token) {
                    setState('unauthed');
                    return;
                }

                await apiFetch('/me');
                setState('authed');
            } catch {
                setState('unauthed');
            }
        }

        checkAuth();
    }, []);

    if (state === 'loading') {
        return (
            <View className="flex-1 items-center justify-center">
                <ActivityIndicator />
            </View>
        );
    }

    if (state === 'authed') {
        return <Redirect href="/(app)" />;
    }

    return <Redirect href="/(auth)/login" />;
}
