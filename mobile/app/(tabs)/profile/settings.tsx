import {SafeAreaView} from "react-native-safe-area-context";
import {Pressable} from "react-native";
import AppText from "@/components/AppText";
import {MaterialCommunityIcons} from "@expo/vector-icons";
import {api} from "@/shared/axios";
import {router} from "expo-router";

export default function SettingsScreen(){
    api.interceptors.request.use(config => {
        console.log(config.method, config.url);
        return config;
    });
    const onLogout = async () => {
        try {
            await api.post("/logout");
        } catch (err){
            console.error(err);
        } finally {
            router.replace("/");
        }
    };
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