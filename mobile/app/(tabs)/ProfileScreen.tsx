import {Text, View} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import {useUser} from "@/shared/UserProvider";

export default function ProfileScreen() {
    const {user} = useUser();
    const firstName = user.firstName || ""

    return (
        <SafeAreaView style={{flex: 1, backgroundColor: "black"}}>
            <View className="px-5 py-4">
                <Text className="text-white text-2xl font-semibold" style={{ letterSpacing: 0.5}}>{firstName}</Text>
            </View>
            <View className="h-px bg-[#131313]"/>
        </SafeAreaView>
    )
}