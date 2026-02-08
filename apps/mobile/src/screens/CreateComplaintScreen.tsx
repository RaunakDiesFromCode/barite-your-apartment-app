import { View, Text, TextInput, Pressable, ActivityIndicator } from 'react-native';
import { useEffect, useState } from 'react';
import Screen from '../components/Screen';
import { api } from '../api/client';
import { useNavigation } from '@react-navigation/native';
import { useSociety } from '../hooks/useSociety';

type MyFlatMembership = {
  flat: {
    id: string;
    number: string;
  };
  society: {
    id: string;
  };
};

export default function CreateComplaintScreen() {
  const navigation = useNavigation<any>();

  const { current } = useSociety();

  const [flats, setFlats] = useState<{ id: string; number: string }[]>([]);
  const [flatId, setFlatId] = useState<string | null>(null);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load user flats
  useEffect(() => {
    api<MyFlatMembership[]>('/me/flats')
      .then((data) => {
        // only flats in current society
        const societyFlats = data
          .filter((m) => m.society.id === current?.society.id)
          .map((m) => m.flat);

        setFlats(societyFlats);

        // auto-select ONLY if exactly one
        if (societyFlats.length === 1) {
          setFlatId(societyFlats[0].id);
        }
      })
      .catch(() => {
        setFlats([]);
      });
  }, [current]);

  //   const canSubmit = !!flatId && title.trim().length > 0 && description.trim().length > 0;

  async function submit() {
    if (submitting) return;

    if (!flatId) {
      setError('Please select a flat');
      return;
    }

    if (!title.trim()) {
      setError('Please enter a title');
      return;
    }

    if (!description.trim()) {
      setError('Please enter a description');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      await api(`/flats/${flatId}/complaints`, {
        method: 'POST',
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
        }),
      });

      navigation.goBack();
    } catch {
      setError('Failed to submit complaint. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Screen>
      <View className="mt-4">
        <Text className="mb-4 text-xl font-semibold">Raise a Complaint</Text>

        {flatId && (
          <Text className="mb-2 text-sm text-gray-500">
            Selected flat: {flats.find((f) => f.id === flatId)?.number}
          </Text>
        )}

        {/* Flat selector (only if multiple) */}
        {flats.length > 1 && (
          <View className="mb-4">
            <Text className="mb-1 text-sm font-medium">Select Flat</Text>

            {flats.map((f) => (
              <Pressable
                key={f.id}
                onPress={() => setFlatId(f.id)}
                className={`mb-2 rounded-lg border p-3 ${
                  flatId === f.id ? 'border-black' : 'border-gray-300'
                }`}>
                <Text>{f.number}</Text>
              </Pressable>
            ))}
          </View>
        )}

        {/* Title */}
        <Text className="mb-1 text-sm font-medium">Title</Text>
        <TextInput
          value={title}
          onChangeText={setTitle}
          placeholder="Lift not working"
          className="mb-4 rounded-lg border border-gray-300 p-3"
        />

        {/* Description */}
        <Text className="mb-1 text-sm font-medium">Description</Text>
        <TextInput
          value={description}
          onChangeText={setDescription}
          placeholder="The lift in Tower A has been stuck since morning..."
          multiline
          className="h-32 rounded-lg border border-gray-300 p-3"
        />

        {/* Error */}
        {error && <Text className="mt-2 text-sm text-red-500">{error}</Text>}

        {/* Submit */}
        <Pressable
          onPress={submit}
          disabled={submitting}
          className={`mt-6 items-center rounded-lg py-3 ${
            submitting ? 'bg-gray-300' : 'bg-black'
          }`}>
          {submitting ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="font-medium text-white">Submit Complaint</Text>
          )}
        </Pressable>
      </View>
    </Screen>
  );
}
