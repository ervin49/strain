import {router, Stack} from "expo-router";
import UserProvider from "@/components/UserProvider";
import { View } from "react-native";

export default function RootLayout() {
    return (
        <View style={{ flex: 1, backgroundColor: "#000000" }}>
            <UserProvider>
                <Stack screenOptions={{ contentStyle: {
                        backgroundColor: "black"
                    },
                }}
                >
                    <Stack.Screen name="index"  options={{headerShown: false}}/>
                    <Stack.Screen name="(auth)" options={{headerShown: false}}/>
                    <Stack.Screen name="(tabs)" options={{headerShown: false}} />
                    <Stack.Screen name="routines" options={{headerShown: false}}/>
                </Stack>
            </UserProvider>
        </View>
    )
}