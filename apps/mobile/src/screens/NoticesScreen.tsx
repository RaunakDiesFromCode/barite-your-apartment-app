import { View, Text, ActivityIndicator, ScrollView, RefreshControl } from 'react-native';
import { useEffect, useState, useCallback } from 'react';
import { api } from '../api/client';
import { Notice } from '../types/api';
import Screen from '../components/Screen';
import { useSociety } from '../hooks/useSociety';

export default function NoticesScreen() {
  const { current } = useSociety();

  const [notices, setNotices] = useState<Notice[] | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchNotices = useCallback(async () => {
    if (!current) return;

    try {
      const data = await api<Notice[]>(`/societies/${current.society.id}/notices`);
      setNotices(data);
    } catch {
      setNotices([]);
    }
  }, [current]);

  // Load only when society changes
  useEffect(() => {
    setNotices(null);
    fetchNotices();
  }, [fetchNotices]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchNotices();
    setRefreshing(false);
  };

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
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        contentContainerStyle={{ paddingBottom: 24 }}>
        {/* Header */}
        <View className="mb-4">
          <Text className="text-xl font-semibold">Notice Board</Text>
          <Text className="mt-1 text-sm text-gray-500">Official updates from the society</Text>
        </View>

        {/* Empty state */}
        {notices.length === 0 && (
          <View className="mt-24 items-center px-6">
            <Text className="text-center text-sm leading-5 text-gray-400">
              No notices yet.
              {'\n'}
              Important updates from the society will appear here.
            </Text>
          </View>
        )}

        {/* Notices */}
        {notices.map((n) => (
          <View key={n.id} className="mb-4 rounded-xl border border-gray-200 bg-white p-4">
            <Text className="mb-1 text-base font-semibold">{n.title}</Text>

            <Text className="leading-5 text-gray-700">{n.content}</Text>

            <Text className="mt-3 text-xs text-gray-400">
              Posted on{' '}
              {new Date(n.createdAt).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })}
            </Text>
          </View>
        ))}
      </ScrollView>
    </Screen>
  );
}
