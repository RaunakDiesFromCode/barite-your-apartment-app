import { useEffect, useState } from "react";
import { api } from "../api/client";
import { SocietyMembership } from "../types/api";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation/RootNavigator";
import {
    View,
    Text,
    Pressable,
    ActivityIndicator,
    ScrollView,
} from "react-native";

export default function SocietySelectScreen() {
    const navigation =
        useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    const [societies, setSocieties] = useState<SocietyMembership[] | null>(
        null,
    );

    useEffect(() => {
        api<SocietyMembership[]>("/societies")
            .then(setSocieties)
            .catch((err) => {
                console.error(err);
                setSocieties([]);
            });
    }, []);

    if (!societies) {
        return (
            <View className="flex-1 items-center justify-center">
                <ActivityIndicator />
            </View>
        );
    }

    return (
        <ScrollView className="flex-1 bg-white p-4">
            <Text className="text-2xl font-bold mb-4">Select a Society</Text>

            {societies.map((item) => (
                <Pressable
                    key={item.society.id}
                    className="p-4 mb-3 rounded-lg border border-gray-200"
                    onPress={() =>
                        navigation.navigate("Society", {
                            societyId: item.society.id,
                        })
                    }
                >
                    <Text className="text-lg font-semibold">
                        {item.society.name}
                    </Text>
                    <Text className="text-sm text-gray-500">
                        Role: {item.role}
                    </Text>
                </Pressable>
            ))}
        </ScrollView>
    );
}
