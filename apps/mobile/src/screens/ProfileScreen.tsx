import { View, Text } from "react-native";
import Screen from "../components/Screen";

export default function ProfileScreen() {
    return (
        <Screen>
            <View className="mt-6">
                <Text className="text-lg font-semibold">Dev Admin</Text>
                <Text className="text-gray-500">9999999999</Text>

                <View className="mt-6 border-t border-gray-200 pt-4">
                    <Text className="text-sm text-gray-500">Role: Admin</Text>
                </View>
            </View>
        </Screen>
    );
}
