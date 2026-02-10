import { useState } from 'react';
import { View, Text, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import TextField from '@/components/TextField';
import PrimaryButton from '@/components/PrimaryButton';
import { apiFetch } from '@/lib/api';
import { useSociety } from '@/lib/society';

export default function SocietyChoice() {
    const router = useRouter();
    const { refreshSocieties } = useSociety(); // ✅ hook at top

    const [code, setCode] = useState('');
    const [loading, setLoading] = useState(false);

    async function joinSociety() {
        const trimmed = code.trim().toUpperCase();

        if (trimmed.length !== 5) {
            Alert.alert('Invalid code', 'Enter the 5-character society code');
            return;
        }

        setLoading(true);
        try {
            await apiFetch('/societies/join', {
                method: 'POST',
                body: JSON.stringify({ code: trimmed }),
            });

            await refreshSocieties(); // ✅ sync context

            Alert.alert('Request sent', 'Waiting for admin approval');
            router.replace('../home/(tabs)/notices');
        } catch (err: any) {
            const message = typeof err?.message === 'string' ? err.message : '';

            if (message.includes('Already requested')) {
                Alert.alert('Already requested', 'You have already requested to join this society');
                router.replace('../home/(tabs)/notices');
                return;
            }

            if (message.includes('Invalid code')) {
                Alert.alert('Invalid code', 'Please check the code and try again');
                return;
            }

            Alert.alert('Error', 'Failed to join society');
        } finally {
            setLoading(false);
        }
    }

    return (
        <View className="flex-1 justify-center bg-white px-6">
            <Text className="mb-2 text-3xl font-bold">Join a Society</Text>
            <Text className="mb-6 text-gray-500">
                Enter the code provided by your society admin
            </Text>

            <TextField
                placeholder="ABCDE"
                autoCapitalize="characters"
                maxLength={5}
                value={code}
                onChangeText={setCode}
            />

            <PrimaryButton title="Join Society" onPress={joinSociety} loading={loading} />

            <Text className="my-6 text-center text-gray-400">— OR —</Text>

            <PrimaryButton
                title="Create a Society"
                variant="outline"
                onPress={() => router.push('../society-disclaimer')}
            />
        </View>
    );
}
