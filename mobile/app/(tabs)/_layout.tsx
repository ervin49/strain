import "../../global.css"
import {Icon, Label, NativeTabs} from 'expo-router/unstable-native-tabs';
import {MaterialCommunityIcons} from "@expo/vector-icons";

export default function RootLayout() {
    return (
        <>
            <NativeTabs>
                <NativeTabs.Trigger name="index">
                    <Label>Home</Label>
                    <Icon sf="house"/>
                </NativeTabs.Trigger>
                <NativeTabs.Trigger name="WorkoutScreen">
                    <Label>Workout</Label>
                    <Icon sf="dumbbell"/>
                </NativeTabs.Trigger>
                <NativeTabs.Trigger name="ProfileScreen">
                    <Label>Profile</Label>
                    <Icon sf="person"/>
                </NativeTabs.Trigger>
            </NativeTabs>
        </>
    );
}