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
        </Stack>
    )
}
