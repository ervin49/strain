import {router, Stack } from 'expo-router';
import UserProvider from "@/shared/UserProvider";
import AppButton from "@/components/AppButton";
import {Pressable} from "react-native";
import {MaterialCommunityIcons} from "@expo/vector-icons";

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