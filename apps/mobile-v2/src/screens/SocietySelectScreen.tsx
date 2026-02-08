import { View, Text, Pressable, ActivityIndicator } from "react-native";
import { useEffect, useState } from "react";
import { api } from "../api/client";
import { SocietyMembership } from "../types/api";
import { useNavigation } from "@react-navigation/native";
import { useSociety } from "../hooks/useSociety";

export default function SocietySelectScreen() {
    const navigation = useNavigation<any>();
    const { setCurrentById } = useSociety();

    const [societies, setSocieties] = useState<SocietyMembership[] | null>(
        null,
    );

    useEffect(() => {
        api<SocietyMembership[]>("/societies")
            .then(setSocieties)
            .catch(() => setSocieties([]));
    }, []);

    if (!societies) {
        return (
            <View className="flex-1 items-center justify-center">
                <ActivityIndicator />
            </View>
        );
    }

    return (
        <Pressable
            className="flex-1 justify-end bg-black/40"
            onPress={() => navigation.goBack()}
        >
            <View className="bg-white rounded-t-2xl p-4">
                <Text className="text-lg font-semibold mb-3">
                    Switch Society
                </Text>

                {societies.map((item) => (
                    <Pressable
                        key={item.society.id}
                        className="py-3 border-b border-gray-200"
                        onPress={() => {
                            setCurrentById(item.society.id);
                            navigation.goBack();
                        }}
                    >
                        <Text className="text-base font-medium">
                            {item.society.name}
                        </Text>
                        <Text className="text-xs text-gray-500">
                            Role: {item.role}
                        </Text>
                    </Pressable>
                ))}
            </View>
        </Pressable>
    );
}
