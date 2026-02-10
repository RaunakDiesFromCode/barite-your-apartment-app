import { useState } from 'react';
import { View, Text, TextInput, Pressable, Alert } from 'react-native';
import { apiFetch } from '@/lib/api/client';

export default function JoinSociety() {
    const [code, setCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [done, setDone] = useState(false);
    const [info, setInfo] = useState<string | null>(null);

    async function join() {
        if (!code.trim()) {
            Alert.alert('Error', 'Please enter the society code');
            return;
        }

        setLoading(true);

        try {
            await apiFetch('/societies/join', {
                method: 'POST',
                body: JSON.stringify({
                    code: code.trim().toUpperCase(),
                }),
            });

            setInfo('Waiting for admin approval.');
            setDone(true);
        } catch (err: any) {
            const message = typeof err?.message === 'string' ? err.message : '';

            // Backend integrity case — NOT an error for the user
            if (message.includes('Already requested')) {
                setInfo('You already requested to join this society.');
                setDone(true);
                return;
            }

            if (message.includes('Invalid code')) {
                Alert.alert('Invalid Code', 'Please check the code and try again.');
                return;
            }

            Alert.alert('Error', 'Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    }

    if (done) {
        return (
            <View className="flex-1 justify-center bg-white px-6">
                <Text className="mb-4 text-2xl font-bold">Request Sent ✅</Text>

                <Text className="text-lg text-gray-700">
                    {info ?? 'Waiting for admin approval.'}
                </Text>
            </View>
        );
    }

    return (
        <View className="flex-1 justify-center bg-white px-6">
            <Text className="mb-4 text-2xl font-bold">Join a Society</Text>

            <TextInput
                value={code}
                onChangeText={setCode}
                placeholder="Enter 5-character code"
                autoCapitalize="characters"
                maxLength={5}
                className="mb-4 rounded border p-4 text-center tracking-widest"
            />

            <Pressable onPress={join} disabled={loading} className="rounded bg-black p-4">
                <Text className="text-center text-lg text-white">
                    {loading ? 'Joining...' : 'Join Society'}
                </Text>
            </Pressable>
        </View>
    );
}
