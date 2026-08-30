import {Redirect, router, Stack} from "expo-router";
import {ActivityIndicator, View} from "react-native";
import {useEffect, useState} from "react";
import * as SecureStore from "expo-secure-store";

export default function Index(){
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function checkAuth() {
            const token = await SecureStore.getItemAsync("token");

            if(token){
                router.replace("/(tabs)/dashboard");
            } else {
                router.replace("/(auth)");
            }

            setLoading(false);
        }

        checkAuth();
    })

    if(loading){
        return(
            <View className="bg-black items-center justify-center" style={{ flex: 1}}>
                <ActivityIndicator size="large" className="relative bottom-20"/>
            </View>
        )
    }

    return null;
}