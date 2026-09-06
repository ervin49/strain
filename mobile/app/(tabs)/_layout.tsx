import "../../global.css"
import {NativeTabs} from 'expo-router/unstable-native-tabs';
import {useUser} from "@/components/UserProvider";
import {ActivityIndicator, View} from "react-native";

export default function TabsLayout() {
    const { loading } = useUser();
    if(loading){
        return(
            <View className="bg-black items-center justify-center" style={{ flex: 1}}>
                <ActivityIndicator size="large" className="relative bottom-20"/>
            </View>
        )
    }
    return (
        <NativeTabs>
            <NativeTabs.Trigger name="home">
                <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>
                <NativeTabs.Trigger.Icon sf="house"/>
            </NativeTabs.Trigger>
            <NativeTabs.Trigger name="workout">
                <NativeTabs.Trigger.Label>Workout</NativeTabs.Trigger.Label>
                <NativeTabs.Trigger.Icon sf="dumbbell"/>
            </NativeTabs.Trigger>
            <NativeTabs.Trigger name="profile">
                <NativeTabs.Trigger.Label>Profile</NativeTabs.Trigger.Label>
                <NativeTabs.Trigger.Icon sf="person"/>
            </NativeTabs.Trigger>
        </NativeTabs>
    );
}