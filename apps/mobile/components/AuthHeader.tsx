import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function AuthHeader({ title, subtitle }: { title: string; subtitle: string }) {
    return (
        <View className="mb-10">
            <Ionicons name="home-outline" size={42} />
            <Text className="mt-4 text-3xl font-bold">{title}</Text>
            <Text className="mt-2 text-gray-500">{subtitle}</Text>
        </View>
    );
}
