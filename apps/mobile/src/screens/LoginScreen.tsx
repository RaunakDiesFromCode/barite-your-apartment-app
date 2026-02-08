import { View, Text, TextInput, Pressable, ActivityIndicator } from 'react-native';
import { useState } from 'react';
import Screen from '../components/Screen';
import { api } from '../api/client';
import { useNavigation } from '@react-navigation/native';

export default function LoginScreen() {
  const navigation = useNavigation<any>();
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function requestOtp() {
    if (phone.length !== 10) {
      setError('Enter a valid 10-digit phone number');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await api('/auth/request-otp', {
        method: 'POST',
        body: JSON.stringify({ phone }),
      });

      navigation.navigate('VerifyOtp', { phone });
    } catch {
      setError('Failed to send OTP');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Screen>
      <View className="mt-24">
        <Text className="mb-2 text-2xl font-semibold">Welcome</Text>
        <Text className="mb-6 text-gray-500">Enter your phone number to continue</Text>

        <TextInput
          keyboardType="number-pad"
          maxLength={10}
          value={phone}
          onChangeText={setPhone}
          placeholder="Phone number"
          className="mb-4 rounded-lg border border-gray-300 p-3"
        />

        {error && <Text className="mb-3 text-red-500">{error}</Text>}

        <Pressable
          onPress={requestOtp}
          disabled={loading}
          className={`items-center rounded-lg py-3 ${loading ? 'bg-gray-300' : 'bg-black'}`}>
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="font-medium text-white">Send OTP</Text>
          )}
        </Pressable>
      </View>
    </Screen>
  );
}
