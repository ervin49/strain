import {router, Stack} from "expo-router";
import UserProvider from "@/components/UserProvider";
import {Pressable, Text, View} from "react-native";
import {createScreenOptions} from "@/constants/ScreenOptions";
import {MaterialCommunityIcons} from "@expo/vector-icons";

export default function RootLayout() {
    return (
            <UserProvider>
                <Stack screenOptions={{ contentStyle: {
                        backgroundColor: "#000"
                    },
                    headerTintColor: '#000'
                }}
                >
                    <Stack.Screen name="index"  options={{headerShown: false}}/>
                    <Stack.Screen name="(auth)" options={{headerShown: false}}/>
                    <Stack.Screen name="(tabs)" options={{headerShown: false}} />
                    <Stack.Screen name="routines" options={{headerShown: false}}/>
                    <Stack.Screen name="log-workout" options={{
                        ...createScreenOptions({
                            title: 'Log Workout',
                            align: 'left'
                        }),
                        presentation: 'fullScreenModal',
                        headerTintColor: '#fff',
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
                                <MaterialCommunityIcons name="chevron-down" size={28}/>
                            </Pressable>
                        )
                    }}/>
                </Stack>
            </UserProvider>
    )
}