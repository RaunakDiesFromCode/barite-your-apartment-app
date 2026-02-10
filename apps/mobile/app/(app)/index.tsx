import { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Redirect } from 'expo-router';
import { apiFetch } from '@/lib/api/client';
import { getToken } from '@/lib/auth/token';

type State = 'loading' | 'unauthenticated' | 'no-society' | 'has-society';

export default function Index() {
    const [state, setState] = useState<State>('loading');

    useEffect(() => {
        async function bootstrap() {
            try {
                const token = await getToken();
                if (!token) {
                    setState('unauthenticated');
                    return;
                }

                await apiFetch('/me');

                const societies = await apiFetch('/societies/mine');

                if (societies.length === 0) {
                    setState('no-society');
                } else {
                    setState('has-society');
                }
            } catch {
                setState('unauthenticated');
            }
        }

        bootstrap();
    }, []);

    if (state === 'loading') {
        return (
            <View className="flex-1 items-center justify-center">
                <ActivityIndicator />
            </View>
        );
    }

    if (state === 'unauthenticated') {
        return <Redirect href="/(auth)/login" />;
    }

    if (state === 'no-society') {
        return <Redirect href="/(app)" />;
    }

    return <Redirect href="/(app)/societies" />;
}
