import "../../global.css"
import {Icon, Label, NativeTabs} from 'expo-router/unstable-native-tabs';
import {MaterialCommunityIcons} from "@expo/vector-icons";
import UserProvider from "@/components/UserProvider";

export default function RootLayout() {
    return (
        <UserProvider>
            <NativeTabs>
                <NativeTabs.Trigger name="home">
                    <Label>Home</Label>
                    <Icon sf="house"/>
                </NativeTabs.Trigger>
                <NativeTabs.Trigger name="workout">
                    <Label>Workout</Label>
                    <Icon sf="dumbbell"/>
                </NativeTabs.Trigger>
                <NativeTabs.Trigger name="profile">
                    <Label>Profile</Label>
                    <Icon sf="person"/>
                </NativeTabs.Trigger>
            </NativeTabs>
        </UserProvider>
    );
}