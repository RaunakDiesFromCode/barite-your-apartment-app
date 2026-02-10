import { View, Text, Pressable, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';

export default function SocietyDisclaimer() {
    const router = useRouter();

    return (
        <View className="flex-1 bg-white px-6">
            <ScrollView className="flex-1 pt-10">
                <Text className="mb-4 text-2xl font-bold">Before You Create a Society</Text>

                <Text className="mb-4 text-gray-600">
                    By creating a society on Barite, you confirm that:
                </Text>

                <Text className="mb-2 text-gray-600">
                    • You are authorized to act on behalf of this society
                </Text>
                <Text className="mb-2 text-gray-600">
                    • You will manage member approvals responsibly
                </Text>
                <Text className="mb-2 text-gray-600">
                    • Society data should be accurate and lawful
                </Text>
                <Text className="mb-2 text-gray-600">
                    • Barite is a management tool, not a legal authority
                </Text>

                <Text className="mt-6 text-gray-500">
                    This is a basic disclaimer and may be updated later.
                </Text>
            </ScrollView>

            <Pressable
                onPress={() => router.replace('/create-society')}
                className="mb-6 rounded-xl bg-black py-4">
                <Text className="text-center text-lg font-semibold text-white">I Understand</Text>
            </Pressable>
        </View>
    );
}
