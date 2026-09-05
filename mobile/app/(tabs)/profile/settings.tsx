import {ActivityIndicator, Pressable, View, Text} from "react-native";
import AppText from "@/components/AppText";
import {MaterialCommunityIcons} from "@expo/vector-icons";
import {api} from "@/constants/axios";
import {router} from "expo-router";
import * as SecureStore from "expo-secure-store"
import {useState} from "react";

export default function SettingsScreen(){
    const [loading, setLoading] = useState(false);
    const onLogout = async () => {
        setLoading(true);
        try {
            await api.post("/logout");
        } catch (err){
            console.error(err);
        } finally {
            await SecureStore.deleteItemAsync("token");
            setLoading(false);
            router.replace("/");
        }
    };

    if(loading){
        return (
            <View className="bg-black items-center justify-center" style={{ flex: 1}}>
                <ActivityIndicator size="large" className="relative bottom-20"/>
            </View>
        )
    }

    return (
        <View style={{ flex: 1, backgroundColor: "black"}}>
            <View>
                <View className="p-3">
                    <AppText
                        className="text-gray-500 items-center"
                    >
                        Account
                    </AppText>
                </View>
                <Pressable
                    className="flex-row gap-5 px-3 py-4 border-5 bg-[#2C2C2E] active:opacity-30 items-center"
                    onPress={() => router.push("/profile/edit")}
                >
                    <MaterialCommunityIcons name="account" color="white" size={30}/>
                    <AppText>Profile</AppText>
                </Pressable>
                <Pressable
                    className="flex-row gap-5 px-3 py-4 border-5 bg-[#2C2C2E] active:opacity-30 justify-center"
                    onPress={onLogout}
                >
                    <AppText
                        className="text-red-500"
                    >
                        Logout</AppText>
                </Pressable>
            </View>
        </View>
    )
}