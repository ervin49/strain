import { Stack } from "expo-router";
import {createScreenOptions} from "@/constants/ScreenOptions";
import {Pressable, View} from "react-native";
import {MaterialCommunityIcons} from "@expo/vector-icons";

export default function DashboardLayout(){
    return (
        <Stack
            screenOptions={{headerTintColor: "black"}}
        >
            <Stack.Screen name="index" options={{
                ...createScreenOptions({
                    title: "Home",
                    small: false,
                    align: "left"
                }),
                headerRight: () => (
                    <View
                        className="gap-4 px-2 flex-row "
                    >
                        <Pressable
                        >
                            <MaterialCommunityIcons name="magnify" size={26} color="white"/>
                        </Pressable>
                        <Pressable
                        >
                            <MaterialCommunityIcons name="bell-outline" size={26} color="white"/>
                        </Pressable>
                    </View>
                )
            }}/>
        </Stack>
    )
}