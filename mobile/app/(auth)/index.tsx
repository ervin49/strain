import {View, Text, Image, Pressable, useWindowDimensions} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import AppButton from "@/components/AppButton";
import {Icon} from "expo-router/unstable-native-tabs";
import {router, useRouter} from "expo-router";

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
                <AppButton title="Sign up with Google"
                           onPress={() => router.push("/register")}
                           variant="secondary"
                >
                    <Icon sf="mail"/>
                </AppButton>
                    <AppButton title="Sign up with Email"
                               onPress={() => router.push("/register")}
                               variant="secondary"
                               className="mt-3">
                        <Icon sf="mail"/>
                    </AppButton>
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