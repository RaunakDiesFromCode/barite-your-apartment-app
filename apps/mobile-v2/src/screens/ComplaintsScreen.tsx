import { View, Text, ActivityIndicator, ScrollView } from "react-native";
import { useEffect, useState } from "react";
import { api } from "../api/client";
import { Complaint } from "../types/api";
import Screen from "../components/Screen";
import { useSociety } from "../hooks/useSociety";

export default function ComplaintsScreen() {
    const { current } = useSociety();
    const [complaints, setComplaints] = useState<Complaint[] | null>(null);

    useEffect(() => {
        if (!current) return;

        setComplaints(null); // reset on society change

        api<Complaint[]>(`/societies/${current.society.id}/complaints`)
            .then(setComplaints)
            .catch(() => setComplaints([]));
    }, [current]);

    if (!complaints) {
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
                <Text className="text-xl font-semibold mb-3">Complaints</Text>

                {complaints.length === 0 && (
                    <View className="mt-10 items-center">
                        <Text className="text-gray-400 text-sm">
                            No complaints raised yet
                        </Text>
                    </View>
                )}

                {complaints.map((c) => (
                    <View
                        key={c.id}
                        className="mb-3 rounded-xl border border-gray-200 p-4"
                    >
                        <Text className="text-base font-semibold mb-1">
                            {c.title}
                        </Text>

                        <Text className="text-gray-600 mb-2">
                            {c.description}
                        </Text>

                        <View className="flex-row justify-between items-center">
                            <Text className="text-xs text-gray-400">
                                {new Date(c.createdAt).toLocaleDateString()}
                            </Text>

                            <Text className="text-xs font-medium">
                                {c.status}
                            </Text>
                        </View>
                    </View>
                ))}
            </ScrollView>
        </Screen>
    );
}
