import {router, Stack} from "expo-router";
import UserProvider from "@/components/UserProvider";

export default function RootLayout() {
    return (
        <UserProvider>
            <Stack screenOptions={{ contentStyle: {
                    backgroundColor: "#000000"
                },
            }}
            >
                <Stack.Screen name="index"  options={{headerShown: false}}/>
                <Stack.Screen name="(auth)" options={{headerShown: false}}/>
                <Stack.Screen name="(tabs)" options={{headerShown: false}}/>
                <Stack.Screen name="routines" options={{headerShown: false}}/>
            </Stack>
        </UserProvider>
    )
}