import { useEffect, useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { apiFetch } from '@/lib/api/client';

type Society = {
    societyId: string;
    name: string;
    role: 'ADMIN' | 'OWNER';
    status: 'PENDING' | 'APPROVED';
};

export default function MySocieties() {
    const [societies, setSocieties] = useState<Society[]>([]);

    useEffect(() => {
        apiFetch('/societies/mine').then(setSocieties);
    }, []);

    return (
        <View className="flex-1 bg-white px-6 pt-10">
            <Text className="mb-6 text-2xl font-bold">My Societies</Text>

            {societies.map((s) => (
                <View key={s.societyId} className="mb-4 rounded border p-4">
                    <Text className="text-lg font-bold">{s.name}</Text>

                    <Text className="text-gray-600">Role: {s.role}</Text>

                    {s.status === 'PENDING' && (
                        <Text className="mt-1 text-orange-600">Waiting for admin approval</Text>
                    )}

                    {s.status === 'APPROVED' && (
                        <Pressable className="mt-3">
                            <Text className="text-blue-600">Enter Society →</Text>
                        </Pressable>
                    )}
                </View>
            ))}
        </View>
    );
}
