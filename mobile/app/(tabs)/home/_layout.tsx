import { Stack } from "expo-router";
import {createScreenOptions} from "@/constants/ScreenOptions";
import {Pressable, View} from "react-native";
import {GlassView} from "expo-glass-effect/src";
import {MaterialCommunityIcons} from "@expo/vector-icons";

export default function DashboardLayout(){
    return (
        <Stack>
            <Stack.Screen name="index" options={{
                ...createScreenOptions({
                    title: "Home",
                    small: false,
                    align: "left"
                }),
                headerRight: () => (
                    <View className="flex-row gap-4 px-2">
                        <Pressable style={{ borderWidth: 0, backgroundColor: "transparent" }}>
                            <MaterialCommunityIcons name="magnify" size={26} color="white"/>
                        </Pressable>
                        <Pressable>
                            <MaterialCommunityIcons name="bell-outline" size={26} color="white"/>
                        </Pressable>
                    </View>
                )
            }}/>
        </Stack>
    )
}