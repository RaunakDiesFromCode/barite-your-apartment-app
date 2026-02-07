import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useRoute } from "@react-navigation/native";
import NoticesScreen from "../screens/NoticesScreen";
import ComplaintsScreen from "../screens/ComplaintsScreen";
import ProfileScreen from "../screens/ProfileScreen";

const Tab = createBottomTabNavigator();

export default function SocietyNavigator() {
    const route = useRoute<any>();
    const { societyId } = route.params;

    return (
        <Tab.Navigator>
            <Tab.Screen
                name="Notices"
                component={NoticesScreen}
                initialParams={{ societyId }}
            />
            <Tab.Screen
                name="Complaints"
                component={ComplaintsScreen}
                initialParams={{ societyId }}
            />
            <Tab.Screen
                name="Profile"
                component={ProfileScreen}
                initialParams={{ societyId }}
            />
        </Tab.Navigator>
    );
}
