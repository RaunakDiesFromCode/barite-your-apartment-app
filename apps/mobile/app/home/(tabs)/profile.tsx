import { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import PrimaryButton from '@/components/PrimaryButton';
import { apiFetch } from '@/lib/api';
import { clearToken } from '@/lib/auth';

type Me = {
    id: string;
    name: string;
    phone: string;
};

export default function Profile() {
    const router = useRouter();
    const [me, setMe] = useState<Me | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadMe() {
            try {
                const data = await apiFetch('/me');
                setMe(data);
            } catch {
                // token is invalid or expired
                await clearToken();
                router.replace('/');
            } finally {
                setLoading(false);
            }
        }

        loadMe();
    }, []);

    async function logout() {
        await clearToken();
        router.replace('/');
    }

    if (loading) {
        return (
            <View className="flex-1 items-center justify-center bg-white">
                <ActivityIndicator />
            </View>
        );
    }

    if (!me) {
        return null;
    }

    return (
        <View className="flex-1 bg-white px-6 pt-10">
            <Text className="mb-8 text-2xl font-bold">Your Profile</Text>

            {/* USER INFO */}
            <View className="mb-6">
                <Text className="text-sm text-gray-500">Name</Text>
                <Text className="text-lg font-semibold">{me.name}</Text>
            </View>

            <View className="mb-10">
                <Text className="text-sm text-gray-500">Phone</Text>
                <Text className="text-lg font-semibold">{me.phone}</Text>
            </View>

            {/* LOGOUT */}
            <PrimaryButton title="Logout" variant="outline" onPress={logout} />
        </View>
    );
}
