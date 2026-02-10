import { useState, useRef, useEffect } from 'react';
import { View, Text, Pressable, FlatList, SafeAreaView, Animated, Dimensions } from 'react-native';
import { Slot, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import { useSociety, Society } from '@/lib/society';

export default function HomeLayout() {
    const router = useRouter();
    const { societies, selectedSociety, loading } = useSociety();
    const screenHeight = Dimensions.get('window').height;
    const translateY = useRef(new Animated.Value(screenHeight)).current;
    const [open, setOpen] = useState(false);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (open) {
            setVisible(true);
            Animated.timing(translateY, {
                toValue: 0,
                duration: 260,
                useNativeDriver: true,
            }).start();
        } else {
            Animated.timing(translateY, {
                toValue: screenHeight,
                duration: 220,
                useNativeDriver: true,
            }).start(({ finished }) => {
                if (finished) {
                    setVisible(false);
                }
            });
        }
    }, [open]);

    return (
        <SafeAreaView className="flex-1 bg-white" style={{ paddingTop: Constants.statusBarHeight }}>
            {/* TOP BAR */}
            <Pressable
                onPress={() => setOpen(true)}
                className="h-14 flex-row items-center justify-center border-b border-gray-200 px-4">
                <Text className="mr-1 text-lg font-semibold" numberOfLines={1}>
                    {loading ? '' : selectedSociety ? selectedSociety.name : 'Select Society'}
                </Text>
                <Ionicons name="chevron-down" size={18} />
            </Pressable>

            {/* MAIN CONTENT */}
            <View className="flex-1">
                <Slot />
            </View>

            {/* BOTTOM SHEET */}
            {visible && (
                <View className="absolute inset-0">
                    {/* BACKDROP */}
                    <Animated.View
                        style={{
                            opacity: translateY.interpolate({
                                inputRange: [0, screenHeight],
                                outputRange: [1, 0],
                            }),
                        }}
                        className="absolute inset-0 bg-black/40"
                        pointerEvents={open ? 'auto' : 'none'}>
                        <Pressable className="flex-1" onPress={() => setOpen(false)} />
                    </Animated.View>

                    {/* SHEET */}
                    <Animated.View
                        style={{ transform: [{ translateY }] }}
                        className="absolute bottom-0 w-full rounded-t-2xl bg-white px-4 pb-8 pt-4">
                        <View className="mb-4 h-1 w-12 self-center rounded-full bg-gray-300" />

                        <Text className="mb-4 text-lg font-bold">Your Societies</Text>

                        <FlatList
                            data={societies}
                            keyExtractor={(item) => item.societyId}
                            ItemSeparatorComponent={() => <View className="h-px bg-gray-200" />}
                            renderItem={({ item }) => {
                                const isSelected = item.societyId === selectedSociety?.societyId;

                                return (
                                    <View className="py-3">
                                        <Text className="text-base font-semibold">{item.name}</Text>
                                        <Text className="text-sm text-gray-500">
                                            {item.status === 'APPROVED'
                                                ? item.role
                                                : 'Pending approval'}
                                        </Text>
                                    </View>
                                );
                            }}
                        />

                        {/* ACTIONS */}
                        <View className="mt-6 gap-3">
                            <Pressable
                                onPress={() => {
                                    setOpen(false);
                                    router.push('../../society-choice');
                                }}
                                className="rounded-xl border border-gray-300 py-3">
                                <Text className="text-center font-semibold">Join a Society</Text>
                            </Pressable>

                            <Pressable
                                onPress={() => {
                                    setOpen(false);
                                    router.push('../../society-disclaimer');
                                }}
                                className="rounded-xl bg-black py-3">
                                <Text className="text-center font-semibold text-white">
                                    Create a Society
                                </Text>
                            </Pressable>
                        </View>
                    </Animated.View>
                </View>
            )}
        </SafeAreaView>
    );
}
