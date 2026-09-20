import {router, Stack} from "expo-router";
import AppHeader from "@/components/AppHeader";
import {createScreenOptions} from "@/constants/ScreenOptions";
import AppText from "@/components/AppText";
import {Pressable} from "react-native";
import {MaterialCommunityIcons} from "@expo/vector-icons";

export default function WorkoutLayout(){
    return (
        <Stack>
            <Stack.Screen name="index" options={{
                ...createScreenOptions({
                    title: "Workout",
                    align: "left",
                    small: false
                })
            }}/>
            <Stack.Screen name="log" options={{
                ...createScreenOptions({
                    title: "Log Workout",
                    align: "left",
                }),
                headerLeft: () => (
                    <Pressable
                        onPress={() => {
                            if(router.canGoBack()) {
                                router.back()
                            } else {
                                router.replace("/")
                            }
                        }}
                        hitSlop={10}
                        className="h-10 px-3 justify-center items-center">
                        <MaterialCommunityIcons name="chevron-down" size={28}/>
                    </Pressable>
                )
            }}/>
        </Stack>
    )
}
