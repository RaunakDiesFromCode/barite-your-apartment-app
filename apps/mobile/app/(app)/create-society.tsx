import { useState } from 'react';
import { View, Text, TextInput, Pressable, Alert } from 'react-native';
import { apiFetch } from '@/lib/api/client';
import { useRouter } from 'expo-router';

export default function CreateSociety() {
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [joinCode, setJoinCode] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const canSubmit = name.trim().length > 0 && address.trim().length > 0;

    async function create() {
        if (!canSubmit) {
            Alert.alert('Missing info', 'Please enter name and address');
            return;
        }

        setLoading(true);
        try {
            const res = await apiFetch('/societies', {
                method: 'POST',
                body: JSON.stringify({ name, address }),
            });

            setJoinCode(res.joinCode);
        } catch {
            Alert.alert('Error', 'Failed to create society');
        } finally {
            setLoading(false);
        }
    }

    if (joinCode) {
        return (
            <View className="flex-1 justify-center bg-white px-6">
                <Text className="mb-2 text-center text-2xl font-bold">Society Created 🎉</Text>

                <Text className="mb-6 text-center text-gray-600">
                    Share this code with members to let them join
                </Text>

                <View className="mb-8 rounded border border-black py-6">
                    <Text className="text-center text-4xl font-bold tracking-widest">
                        {joinCode}
                    </Text>
                </View>

                <Pressable
                    onPress={() => router.replace('/(app)')}
                    className="rounded bg-black p-4">
                    <Text className="text-center text-lg text-white">Done</Text>
                </Pressable>
            </View>
        );
    }

    return (
        <View className="flex-1 justify-center bg-white px-6">
            <Text className="mb-2 text-2xl font-bold">Create Society</Text>

            <Text className="mb-6 text-gray-600">You’ll become the admin of this society</Text>

            <TextInput
                value={name}
                onChangeText={setName}
                placeholder="Society name"
                className="mb-4 rounded border p-4"
            />

            <TextInput
                value={address}
                onChangeText={setAddress}
                placeholder="Address"
                className="mb-6 h-24 rounded border p-4"
                multiline
            />

            <Pressable
                onPress={create}
                disabled={!canSubmit || loading}
                className={`rounded p-4 ${canSubmit ? 'bg-black' : 'bg-gray-300'}`}>
                <Text className="text-center text-lg text-white">
                    {loading ? 'Creating...' : 'Create Society'}
                </Text>
            </Pressable>
        </View>
    );
}
