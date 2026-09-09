import {View, Text, Image, Pressable, useWindowDimensions} from "react-native";
import {router} from "expo-router";
import {MaterialCommunityIcons} from "@expo/vector-icons";

export default function Index(){
    const {height, width} = useWindowDimensions();
    return (
        <View style={{ flex: 1 }} className="px-5">
            <Image source={require(`../../assets/images/man-bench-press.jpg`)} style={{
                position: "absolute",
                width: width,
                height: height
            }}/>
            <View style={{ marginTop: "auto", bottom: 35}}>
                <Pressable
                    onPress={() => router.push("/register")}
                    className="w-full bg-white px-3 py-2 flex-row rounded-xl items-center active:opacity-30"
                >
                    <MaterialCommunityIcons name="google" size={22}/>
                    <View
                        className="flex-1"
                    >
                        <Text className="ms-3 text-xl font-medium text-center">Sign up with Google</Text>
                    </View>
                </Pressable>
                <Pressable
                    onPress={() => router.push("/register")}
                    className="w-full bg-white px-3 py-2 mt-4 flex-row rounded-xl items-center active:opacity-30"
                >
                    <MaterialCommunityIcons name="email" size={22}/>
                    <View
                        className="flex-1"
                    >
                        <Text className="ms-3 text-xl font-medium text-center">Sign up with Email</Text>
                    </View>
                </Pressable>
                <Pressable onPress={() => router.push("/login")} className="active:opacity-30">
                    <View className="flex-row justify-center py-5">
                        <Text className="text-white">Already have an account? </Text>
                        <Text className="text-[#0189F9]">Log in</Text>
                    </View>
                </Pressable>
            </View>
        </View>
    )
}