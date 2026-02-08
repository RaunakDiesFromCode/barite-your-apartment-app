import { View, Text, TextInput, Pressable, ActivityIndicator } from 'react-native';
import { useState } from 'react';
import Screen from '../components/Screen';
import { api } from '../api/client';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';

export default function VerifyOtpScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const phone = route.params.phone;

  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function verify() {
    if (otp.length !== 6) {
      setError('Enter 6-digit OTP');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await api<{ token: string }>('/auth/verify-otp', {
        method: 'POST',
        body: JSON.stringify({ phone, otp }),
      });

      await SecureStore.setItemAsync('token', res.token);

      navigation.reset({
        index: 0,
        routes: [{ name: 'Main' }],
      });

    } catch {
      setError('Invalid OTP');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Screen>
      <View className="mt-24">
        <Text className="mb-2 text-xl font-semibold">Verify OTP</Text>
        <Text className="mb-6 text-gray-500">OTP sent to {phone}</Text>

        <TextInput
          keyboardType="number-pad"
          maxLength={6}
          value={otp}
          onChangeText={setOtp}
          placeholder="Enter OTP"
          className="mb-4 rounded-lg border border-gray-300 p-3 text-center text-lg"
        />

        {error && <Text className="mb-3 text-red-500">{error}</Text>}

        <Pressable
          onPress={verify}
          disabled={loading}
          className={`items-center rounded-lg py-3 ${loading ? 'bg-gray-300' : 'bg-black'}`}>
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="font-medium text-white">Verify</Text>
          )}
        </Pressable>
      </View>
    </Screen>
  );
}
