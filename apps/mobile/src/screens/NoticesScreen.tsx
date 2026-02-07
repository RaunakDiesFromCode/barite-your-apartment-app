import { View, Text, ActivityIndicator, ScrollView } from "react-native";
import { useEffect, useState } from "react";
import { api } from "../api/client";
import { Notice } from "../types/api";
import { useRoute } from "@react-navigation/native";

export default function NoticesScreen() {
    const route = useRoute<any>();
    const { societyId } = route.params;

    const [notices, setNotices] = useState<Notice[] | null>(null);

    useEffect(() => {
        api<Notice[]>(`/societies/${societyId}/notices`)
            .then(setNotices)
            .catch((err) => {
                console.error(err);
                setNotices([]);
            });
    }, [societyId]);

    if (!notices) {
        return (
            <View className="flex-1 items-center justify-center">
                <ActivityIndicator />
            </View>
        );
    }

    return (
        <ScrollView className="flex-1 bg-white p-4">
            <Text className="text-2xl font-bold mb-4">Notices</Text>

            {notices.length === 0 && (
                <Text className="text-gray-500">No notices yet.</Text>
            )}

            {notices.map((notice) => (
                <View
                    key={notice.id}
                    className="mb-4 p-4 rounded-lg border border-gray-200"
                >
                    <Text className="text-lg font-semibold mb-1">
                        {notice.title}
                    </Text>
                    <Text className="text-gray-700 mb-2">{notice.content}</Text>
                    <Text className="text-xs text-gray-400">
                        {new Date(notice.createdAt).toLocaleString()}
                    </Text>
                </View>
            ))}
        </ScrollView>
    );
}
