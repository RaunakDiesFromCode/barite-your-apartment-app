import { View, Text, ActivityIndicator, ScrollView } from "react-native";
import { useEffect, useState } from "react";
import { api } from "../api/client";
import { Notice } from "../types/api";
import Screen from "../components/Screen";
import { useRoute } from "@react-navigation/native";
import { useSociety } from "../hooks/useSociety";
import { Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";

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
                <View className="flex-row items-center justify-between mb-4">
                    <Text className="text-xl font-semibold">Notice Board</Text>
                </View>

                {notices.length === 0 && (
                    <View className="mt-20 items-center">
                        <Text className="text-gray-400 text-sm text-center">
                            No notices yet.
                            {"\n"}Important updates will appear here.
                        </Text>
                    </View>
                )}

                {notices.map((n) => (
                    <View
                        key={n.id}
                        className="mb-4 rounded-xl border border-gray-200 bg-white p-4"
                    >
                        <Text className="text-base font-semibold mb-1">
                            {n.title}
                        </Text>

                        <Text className="text-gray-700 leading-5">
                            {n.content}
                        </Text>

                        <View className="mt-3">
                            <Text className="text-xs text-gray-400">
                                Posted on{" "}
                                {new Date(n.createdAt).toLocaleDateString(
                                    "en-IN",
                                )}
                            </Text>
                        </View>
                    </View>
                ))}
            </ScrollView>
        </Screen>
    );
}
