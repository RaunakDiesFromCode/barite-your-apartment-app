import { Pressable, Text } from 'react-native';

export default function PrimaryButton({
    title,
    onPress,
    disabled,
}: {
    title: string;
    onPress: () => void;
    disabled?: boolean;
}) {
    return (
        <Pressable
            onPress={onPress}
            disabled={disabled}
            className={`rounded-xl py-4 ${disabled ? 'bg-gray-300' : 'bg-black'}`}>
            <Text className="text-center text-lg font-semibold text-white">{title}</Text>
        </Pressable>
    );
}
