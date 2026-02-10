import { View, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { clearToken } from '@/lib/auth';
import PrimaryButton from '@/components/PrimaryButton';

export default function Home() {
    const router = useRouter();

    async function logout() {
        await clearToken();
        router.replace('/');
    }

    return (
        <View className="flex-1 items-center justify-center bg-white px-6">
            <Text className="mb-6 text-xl font-bold">Logged in 🎉</Text>
            <PrimaryButton onPress={logout} title="Logout" className='px-5'/>
        </View>
    );
}
