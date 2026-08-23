import {router, Stack} from "expo-router";
import {Pressable, Text} from "react-native";
import {MaterialCommunityIcons} from "@expo/vector-icons";

export default function AuthLayout(){
    return (
        <Stack>
            <Stack.Screen name="index" options={{ headerShown: false}}/>
            <Stack.Screen name="register" options={{
                headerShown: true,
                headerTitle: 'Sign up',
                headerTintColor: "lightgray",
                headerStyle: {
                    backgroundColor: "black"
                },
                headerBackButtonDisplayMode: "minimal",
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
            <Stack.Screen name="login" options={{
                headerShown: true,
                headerTitle: 'Login',
                headerTintColor: "lightgray",
                headerStyle: {
                    backgroundColor: "black"
                },
                headerBackButtonDisplayMode: "minimal",
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