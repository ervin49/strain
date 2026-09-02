import {SafeAreaView} from "react-native-safe-area-context";
import {ActivityIndicator, Pressable, View} from "react-native";
import AppText from "@/components/AppText";
import {MaterialCommunityIcons} from "@expo/vector-icons";
import {api} from "@/constants/axios";
import {router} from "expo-router";
import * as SecureStore from "expo-secure-store"
import {useLayoutEffect, useState} from "react";
import {useUser} from "@/components/UserProvider";

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

    const {user, refreshUser} = useUser();

    useLayoutEffect(() => {
        refreshUser();
    }, []);

    if(loading){
        return (
            <View className="bg-black items-center justify-center" style={{ flex: 1}}>
                <ActivityIndicator size="large" className="relative bottom-20"/>
            </View>
        )
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "black"}}>
            <Pressable className="flex-row gap-5 p-3 border-5 bg-gray-600 active:opacity-30"
                       onPress={onLogout}>
                <MaterialCommunityIcons name="logout" color="white" size={20}/>
                <AppText>Logout</AppText>
            </Pressable>
        </SafeAreaView>
    )
}