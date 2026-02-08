import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SocietyNavigator from "./SocietyNavigator";
import SocietySelectScreen from "../screens/SocietySelectScreen";

export type RootStackParamList = {
    Main: undefined;
    SocietySwitch: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="Main"
                component={SocietyNavigator}
                options={{ headerShown: false }}
            />

            <Stack.Screen
                name="SocietySwitch"
                component={SocietySelectScreen}
                options={{
                    presentation: "modal",
                    title: "Switch Society",
                }}
            />
        </Stack.Navigator>
    );
}
