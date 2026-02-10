import { useState } from 'react';
import { View, Text, TextInput, Pressable, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { apiFetch } from '@/lib/api';

export default function CreateSociety() {
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    async function submit() {
        if (!name || !address) {
            Alert.alert('Missing info', 'Please fill all fields');
            return;
        }

        setLoading(true);
        try {
            await apiFetch('/societies', {
                method: 'POST',
                body: JSON.stringify({ name, address }),
            });

            router.replace('/home');
        } catch {
            Alert.alert('Error', 'Failed to create society');
        } finally {
            setLoading(false);
        }
    }

    return (
        <View className="flex-1 justify-center bg-white px-6">
            <Text className="mb-2 text-3xl font-bold">Create Society</Text>

            <Text className="mb-6 text-gray-500">You will become the society admin</Text>

            <TextInput
                placeholder="Society Name"
                value={name}
                onChangeText={setName}
                className="mb-4 rounded-xl border border-gray-300 px-4 py-4"
            />

            <TextInput
                placeholder="Address"
                value={address}
                onChangeText={setAddress}
                className="mb-6 rounded-xl border border-gray-300 px-4 py-4"
            />

            <Pressable
                onPress={submit}
                disabled={loading}
                className={`rounded-xl py-4 ${loading ? 'bg-gray-300' : 'bg-black'}`}>
                <Text className="text-center text-lg font-semibold text-white">
                    {loading ? 'Creating...' : 'Create Society'}
                </Text>
            </Pressable>
        </View>
    );
}
