import { Stack } from 'expo-router';
import UserProvider from "@/shared/UserProvider";

export default function RootLayout() {
    return (
        <UserProvider>
            <Stack>
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            </Stack>
        </UserProvider>
    );
}