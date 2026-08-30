import {router, Stack} from "expo-router";
import {createScreenOptions} from "@/components/ScreenOptions";
import {Pressable} from "react-native";
import {MaterialCommunityIcons} from "@expo/vector-icons";
import {useUser} from "@/components/UserProvider";

export default function RoutinesLayout(){
    return (
        <Stack>
            <Stack.Screen name="index" options={{
                ...createScreenOptions({
                    title: "Create Routine"
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
                        className="h-10 w-10 justify-center items-center">
                        <MaterialCommunityIcons name="arrow-left" color="white" size={26}/>
                    </Pressable>
                ),
            }}/>
        </Stack>
    )
}