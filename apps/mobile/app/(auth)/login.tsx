import { useState } from 'react';
import { View, Text, TextInput, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { apiFetch } from '@/lib/api/client';

export default function Login() {
    const [phone, setPhone] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    async function requestOtp() {
        setLoading(true);
        try {
            await apiFetch('/auth/request-otp', {
                method: 'POST',
                body: JSON.stringify({ phone }),
            });

            router.push({
                pathname: '/(auth)/verify-otp',
                params: { phone },
            });
        } finally {
            setLoading(false);
        }
    }

    return (
        <View className="flex-1 justify-center bg-white px-6">
            <Text className="mb-4 text-2xl font-bold">Enter your phone number</Text>

            <TextInput
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                className="mb-4 rounded border p-4"
                placeholder="9999999999"
            />

            <Pressable onPress={requestOtp} disabled={loading} className="rounded bg-black p-4">
                <Text className="text-center text-white">
                    {loading ? 'Sending OTP...' : 'Send OTP'}
                </Text>
            </Pressable>
        </View>
    );
}
