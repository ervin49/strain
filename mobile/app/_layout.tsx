import {router, Stack} from "expo-router";
import UserProvider from "@/components/UserProvider";
import { View } from "react-native";

export default function RootLayout() {
    return (
            <UserProvider>
                <Stack screenOptions={{ contentStyle: {
                        backgroundColor: "#000"
                    },
                    headerTintColor: '#000'
                }}
                >
                    <Stack.Screen name="index"  options={{headerShown: false}}/>
                    <Stack.Screen name="(auth)" options={{headerShown: false}}/>
                    <Stack.Screen name="(tabs)" options={{headerShown: false}} />
                    <Stack.Screen name="routines" options={{headerShown: false}}/>
                </Stack>
            </UserProvider>
    )
}