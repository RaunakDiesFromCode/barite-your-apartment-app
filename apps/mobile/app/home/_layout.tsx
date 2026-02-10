import { View, Text, Pressable } from 'react-native';
import { Slot, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function HomeLayout() {
    const router = useRouter();

    // TEMP until society context exists
    const societyName = 'My Society';

    return (
        <View className="flex-1 bg-white">
            {/* TOP BAR */}
            <Pressable
                // onPress={() => router.push('/society-choice')}
                className="h-14 flex-row items-center justify-center border-b border-gray-200">
                <Text className="mr-2 text-lg font-semibold">{societyName}</Text>
                <Ionicons name="chevron-down" size={18} />
            </Pressable>

            {/* CHILD ROUTES RENDER HERE */}
            <View className="flex-1">
                <Slot />
            </View>
        </View>
    );
}
