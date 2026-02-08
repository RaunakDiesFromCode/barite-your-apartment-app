import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Pressable, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import NoticesScreen from "../screens/NoticesScreen";
import ComplaintsScreen from "../screens/ComplaintsScreen";
import ProfileScreen from "../screens/ProfileScreen";
import { useSociety } from "../hooks/useSociety";

const Tab = createBottomTabNavigator();

export default function SocietyNavigator() {
    const navigation = useNavigation<any>();
    const { current } = useSociety();

    return (
        <Tab.Navigator
            screenOptions={{
                headerTitle: () => (
                    <Pressable
                        onPress={() => navigation.navigate("SocietySwitch")}
                    >
                        <Text className="font-semibold">
                            {current?.society.name} ▾
                        </Text>
                    </Pressable>
                ),
            }}
        >
            <Tab.Screen name="Notices" component={NoticesScreen} />
            <Tab.Screen name="Complaints" component={ComplaintsScreen} />
            <Tab.Screen name="Profile" component={ProfileScreen} />
        </Tab.Navigator>
    );
}
