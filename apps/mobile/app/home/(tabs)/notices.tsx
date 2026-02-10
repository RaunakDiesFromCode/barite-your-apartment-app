import { View, Text } from 'react-native';
import { useSociety } from '@/lib/society';
import NotApproved from '@/components/NotApproved';

export default function Notices() {
    const { selectedSociety } = useSociety();

    if (!selectedSociety || selectedSociety.status !== 'APPROVED') {
        return <NotApproved />;
    }

    return (
        <View className="flex-1 items-center justify-center bg-white">
            <Text>Notices (coming soon)</Text>
        </View>
    );
}
