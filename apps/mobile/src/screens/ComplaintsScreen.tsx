import { View, Text, ActivityIndicator, ScrollView, Pressable, RefreshControl } from 'react-native';
import { useState, useCallback, useRef } from 'react';
import { api } from '../api/client';
import { Complaint } from '../types/api';
import Screen from '../components/Screen';
import { useSociety } from '../hooks/useSociety';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

export default function ComplaintsScreen() {
  const navigation = useNavigation<any>();
  const { current } = useSociety();

  const [complaints, setComplaints] = useState<Complaint[] | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const lastSocietyId = useRef<string | null>(null);

  const fetchComplaints = useCallback(async () => {
    if (!current) return;

    try {
      const data = await api<Complaint[]>(`/societies/${current.society.id}/complaints`);
      setComplaints(data);
    } catch {
      setComplaints([]);
    }
  }, [current]);

  // Reload ONLY when society actually changes
  useFocusEffect(
    useCallback(() => {
      if (!current) return;

      // if first load or society changed, show loader
      if (lastSocietyId.current !== current.society.id) {
        setComplaints(null);
        lastSocietyId.current = current.society.id;
      }

      fetchComplaints();
    }, [current, fetchComplaints])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchComplaints();
    setRefreshing(false);
  };

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
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        contentContainerStyle={{ paddingBottom: 24 }}>
        {/* Header */}
        <View className="mb-4 flex-row items-center justify-between">
          <View>
            <Text className="text-xl font-semibold">Complaints</Text>
            <Text className="mt-1 text-sm text-gray-500">Track issues raised in your society</Text>
          </View>

          <Pressable
            onPress={() => navigation.navigate('CreateComplaint')}
            className="rounded-lg border border-gray-300 px-3 py-2">
            <Text className="text-sm font-medium">+ Raise</Text>
          </Pressable>
        </View>

        {/* Empty state */}
        {complaints.length === 0 && (
          <View className="mt-24 items-center px-6">
            <Text className="text-center text-sm leading-5 text-gray-400">
              No complaints raised yet.
              {'\n'}
              Tap “Raise” to report an issue.
            </Text>
          </View>
        )}

        {/* Complaints list */}
        {complaints.map((c) => (
          <View key={c.id} className="mb-3 rounded-xl border border-gray-200 bg-white p-4">
            <Text className="mb-1 text-base font-semibold">{c.title}</Text>

            <Text className="mb-2 text-gray-600">{c.description}</Text>

            <View className="flex-row items-center justify-between">
              <Text className="text-xs text-gray-400">
                {new Date(c.createdAt).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}
              </Text>

              <Text className="text-xs font-medium">{c.status}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </Screen>
  );
}
