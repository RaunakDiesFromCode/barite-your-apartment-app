import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { View, Text, TextInput, Pressable } from 'react-native';
import { apiFetch } from '@/lib/api/client';
import { saveToken } from '@/lib/auth/token';

export default function VerifyOtp() {
    const { phone } = useLocalSearchParams<{ phone: string }>();
    const [otp, setOtp] = useState('');
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    async function verify() {
        setLoading(true);
        try {
            const res = await apiFetch('/auth/verify-otp', {
                method: 'POST',
                body: JSON.stringify({ phone, otp, name }),
            });

            await saveToken(res.token);
            router.replace('/(app)');
        } finally {
            setLoading(false);
        }
    }

    return (
        <View className="flex-1 justify-center bg-white px-6">
            <Text className="mb-4 text-2xl font-bold">Enter OTP</Text>

            <TextInput
                value={otp}
                onChangeText={setOtp}
                keyboardType="number-pad"
                className="mb-4 rounded border p-4"
                placeholder="6 digit OTP"
            />

            <TextInput
                value={name}
                onChangeText={setName}
                className="mb-4 rounded border p-4"
                placeholder="Name (first time only)"
            />

            <Pressable onPress={verify} disabled={loading} className="rounded bg-black p-4">
                <Text className="text-center text-white">
                    {loading ? 'Verifying...' : 'Verify'}
                </Text>
            </Pressable>
        </View>
    );
}
