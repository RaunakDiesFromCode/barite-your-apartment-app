import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SocietyNavigator from "./SocietyNavigator";
import SocietySelectScreen from "../screens/SocietySelectScreen";
import CreateComplaintScreen from "@/screens/CreateComplaintScreen";
import VerifyOtpScreen from "@/screens/VerifyOtpScreen";
import LoginScreen from "@/screens/LoginScreen";

export type RootStackParamList = {
    Login: undefined;
    VerifyOtp: undefined;
    Main: undefined;
    SocietySwitch: undefined;
    CreateComplaint: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator({
  initialRouteName,
}: {
  initialRouteName: keyof RootStackParamList;
}) {
  return (
    <Stack.Navigator initialRouteName={initialRouteName}>
      <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
      <Stack.Screen name="VerifyOtp" component={VerifyOtpScreen} options={{ headerShown: false }} />

      <Stack.Screen name="Main" component={SocietyNavigator} options={{ headerShown: false }} />

      <Stack.Screen
        name="SocietySwitch"
        component={SocietySelectScreen}
        options={{
          presentation: 'modal',
          title: 'Switch Society',
        }}
      />

      <Stack.Screen
        name="CreateComplaint"
        component={CreateComplaintScreen}
        options={{
          presentation: 'modal',
          title: 'New Complaint',
        }}
      />
    </Stack.Navigator>
  );
}
