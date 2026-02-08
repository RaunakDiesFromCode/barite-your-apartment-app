import { NavigationContainer } from "@react-navigation/native";
import RootNavigator from "./src/navigation/RootNavigator";
import { SocietyProvider } from "./src/hooks/useSociety";

export default function App() {
    return (
        <NavigationContainer>
            <SocietyProvider>
                <RootNavigator />
            </SocietyProvider>
        </NavigationContainer>
    );
}
