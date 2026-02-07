import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SocietySelectScreen from "../screens/SocietySelectScreen";
import SocietyNavigator from "./SocietyNavigator";

export type RootStackParamList = {
    SocietySelect: undefined;
    Society: { societyId: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen
                name="SocietySelect"
                component={SocietySelectScreen}
            />
            <Stack.Screen name="Society" component={SocietyNavigator} />
        </Stack.Navigator>
    );
}
