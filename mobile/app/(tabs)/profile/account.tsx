import {Pressable, View} from "react-native";
import AppText from "@/components/AppText";
import {router} from "expo-router";
import {MaterialCommunityIcons} from "@expo/vector-icons";

export default function AccountScreen(){
    return (
        <View style={{flex: 1, backgroundColor: "black"}}>
            <Pressable
                className="flex-row px-3 py-4  bg-[#2C2C2E] active:opacity-30 items-center"
                onPress={() => router.push("/profile/update-password")}
            >
                <MaterialCommunityIcons name="lock-outline" color="white" size={30}/>
                <AppText>Update Password</AppText>
            </Pressable>
        </View>
    )
}