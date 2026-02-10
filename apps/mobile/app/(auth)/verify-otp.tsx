import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { View, Text, TextInput, Pressable, Alert } from 'react-native';
import { apiFetch } from '@/lib/api/client';
import { saveToken } from '@/lib/auth/token';

export default function VerifyOtp() {
    const { phone } = useLocalSearchParams<{ phone: string }>();
    const router = useRouter();

    const [otp, setOtp] = useState('');
    const [name, setName] = useState('');
    const [askName, setAskName] = useState(false);
    const [loading, setLoading] = useState(false);

    async function verify() {
        if (!otp.trim()) {
            Alert.alert('Error', 'Please enter OTP');
            return;
        }

        setLoading(true);

        try {
            const res = await apiFetch('/auth/verify-otp', {
                method: 'POST',
                body: JSON.stringify({
                    phone,
                    otp,
                    ...(askName ? { name } : {}),
                }),
            });

            await saveToken(res.token);
            router.replace('/(app)');
        } catch (err: any) {
            const message = typeof err?.message === 'string' ? err.message : '';

            // Backend explicitly tells us name is needed
            if (message.includes('Name required')) {
                setAskName(true);
                return;
            }

            Alert.alert('Error', 'Invalid or expired OTP');
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
                placeholder="6-digit OTP"
                className="mb-4 rounded border p-4"
            />

            {askName && (
                <TextInput
                    value={name}
                    onChangeText={setName}
                    placeholder="Your name"
                    className="mb-4 rounded border p-4"
                />
            )}

            <Pressable onPress={verify} disabled={loading} className="rounded bg-black p-4">
                <Text className="text-center text-lg text-white">
                    {loading ? 'Verifying...' : 'Verify'}
                </Text>
            </Pressable>
        </View>
    );
}
