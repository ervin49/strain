import { Stack } from "expo-router";
import {createScreenOptions} from "@/components/ScreenOptions";

export default function DashboardLayout(){
    return (
        <Stack>
            <Stack.Screen name="index" options={{
                ...createScreenOptions({
                    title: "Home",
                    small: false,
                    align: "left"
                })
            }}/>
        </Stack>
    )
}