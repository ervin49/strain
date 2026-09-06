import {router, Stack} from "expo-router";
import AppHeader from "@/components/AppHeader";
import {createScreenOptions} from "@/constants/ScreenOptions";

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
