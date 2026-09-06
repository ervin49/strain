import {router, Stack} from "expo-router";
import {createScreenOptions} from "@/constants/ScreenOptions";
import {Pressable, Text} from "react-native";
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
                        className="justify-center items-center">
                        <Text
                            className="px-4 text-[#0479DA] text-lg"
                        >
                            Cancel
                        </Text>
                    </Pressable>
                ),
            }}/>
            <Stack.Screen name="add-exercise" options={{
                ...createScreenOptions({
                    title: 'Add Exercise'
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
                        className="justify-center items-center">
                        <Text
                            className="px-4 text-[#0479DA] text-lg"
                        >
                            Cancel
                        </Text>
                    </Pressable>
                )
            }}/>
        </Stack>
    )
}