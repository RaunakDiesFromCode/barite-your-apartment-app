import { TextInput } from 'react-native';

export default function TextField(props: any) {
    return (
        <TextInput
            {...props}
            className="mb-4 rounded-xl border border-gray-300 px-4 py-4 text-base"
        />
    );
}
