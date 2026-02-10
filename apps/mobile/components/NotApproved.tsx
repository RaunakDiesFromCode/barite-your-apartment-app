import { View, Text } from 'react-native';

export default function NotApproved() {
    return (
        <View className="flex-1 items-center justify-center px-6">
            <Text className="mb-2 text-xl font-bold">Waiting for approval</Text>
            <Text className="text-center text-gray-500">
                Your society admin has not approved your request yet.
            </Text>
        </View>
    );
}
