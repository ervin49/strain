import {Redirect} from "expo-router";
import {useUser} from "@/shared/UserProvider";
import {View} from "react-native";
import AppText from "@/components/AppText";

export default function Index(){
    const {user, loading} = useUser();
    if(loading){
        return (
            <View className="flex justify-center items-center">
                <AppText>Loading...</AppText>
            </View>
        );
    }

    if(user){
        return <Redirect href="/(tabs)"/>
    }

    return <Redirect href="/(auth)"/>
}