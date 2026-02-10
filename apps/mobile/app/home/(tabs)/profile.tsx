import { View, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { clearToken } from '@/lib/auth';
import PrimaryButton from '@/components/PrimaryButton';

export default function Profile() {
    const router = useRouter();

    async function logout() {
        await clearToken();
        router.replace('/');
    }

    return (
        <View className="flex-1 justify-center bg-white px-6">
            <Text className="mb-2 text-2xl font-bold">Your Profile</Text>

            {/* Placeholder user info */}
            <Text className="mb-1 text-gray-600">Name: User</Text>
            <Text className="mb-8 text-gray-600">Phone: **********</Text>

            <PrimaryButton title="Logout" variant="outline" onPress={logout} />
        </View>
    );
}
