import { Pressable, Text, ActivityIndicator } from 'react-native';

type Props = {
    title: string;
    onPress: () => void;
    disabled?: boolean;
    loading?: boolean;
    variant?: 'primary' | 'outline';
    className?: string;
};

export default function PrimaryButton({
    title,
    onPress,
    disabled = false,
    loading = false,
    variant = 'primary',
    className = '',
}: Props) {
    const isDisabled = disabled || loading;

    const base = 'rounded-xl py-4 items-center justify-center';

    const primaryStyle = isDisabled ? 'bg-gray-300' : 'bg-black';

    const outlineStyle = isDisabled ? 'border border-gray-300' : 'border border-black';

    const textPrimary = 'text-white';
    const textOutline = 'text-black';

    return (
        <Pressable
            onPress={onPress}
            disabled={isDisabled}
            className={`${base} ${variant === 'primary' ? primaryStyle : outlineStyle} ${className}`}>
            {loading ? (
                <ActivityIndicator color={variant === 'primary' ? '#fff' : '#000'} />
            ) : (
                <Text
                    className={`text-lg font-semibold ${
                        variant === 'primary' ? textPrimary : textOutline
                    }`}>
                    {title}
                </Text>
            )}
        </Pressable>
    );
}
