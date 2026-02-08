import { View, Text, ActivityIndicator, ScrollView } from "react-native";
import { useEffect, useState } from "react";
import { api } from "../api/client";
import { Notice } from "../types/api";
import Screen from "../components/Screen";
import { useRoute } from "@react-navigation/native";
import { useSociety } from "../hooks/useSociety";

export default function NoticesScreen() {
    const route = useRoute<any>();
    const { current } = useSociety();

    const [notices, setNotices] = useState<Notice[] | null>(null);

    useEffect(() => {
        if (!current) return;

        api<Notice[]>(`/societies/${current.society.id}/notices`).then(
            setNotices,
        );
    }, [current]);

    if (!notices) {
        return (
            <Screen>
                <View className="flex-1 items-center justify-center">
                    <ActivityIndicator />
                </View>
            </Screen>
        );
    }

    return (
        <Screen>
            <ScrollView showsVerticalScrollIndicator={false}>
                <Text className="text-xl font-semibold mb-3">Notices</Text>

                {notices.length === 0 && (
                    <View className="mt-10 items-center">
                        <Text className="text-gray-400 text-sm">
                            No notices yet
                        </Text>
                    </View>
                )}

                {notices.map((n) => (
                    <View
                        key={n.id}
                        className="mb-3 rounded-xl border border-gray-200 p-4"
                    >
                        <Text className="text-base font-semibold mb-1">
                            {n.title}
                        </Text>

                        <Text className="text-gray-700 leading-5">
                            {n.content}
                        </Text>

                        <Text className="text-xs text-gray-400 mt-2">
                            {new Date(n.createdAt).toLocaleDateString()}
                        </Text>
                    </View>
                ))}
            </ScrollView>
        </Screen>
    );
}
