import "../../global.css"
import {Icon, Label, NativeTabs} from 'expo-router/unstable-native-tabs';
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
    );
}