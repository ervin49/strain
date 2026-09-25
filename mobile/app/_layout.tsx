import {router, Stack} from "expo-router";
import UserProvider, {useUser} from "@/components/UserProvider";
import {Pressable, useWindowDimensions, View} from "react-native";
import {createScreenOptions} from "@/constants/ScreenOptions";
import AppText from "@/components/AppText";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {displayTime} from "@/constants/time";
import {useState} from "react";
import Modal from "react-native-modal";

export function RootLayoutFunction() {
    const {stopTime, setWorkoutInProgress,workoutInProgress, duration} = useUser()
    const {width, height} = useWindowDimensions()
    const [isDiscardWorkoutModalVisible, setIsDiscardWorkoutModalVisible] = useState(false)

    return (
        <View style={{ flex: 1 }}>
            <Stack
                screenOptions={{
                    contentStyle: {
                        backgroundColor: "#000"
                    },
                    headerTintColor: "#000"
                }}
            >
                <Stack.Screen name="index" options={{ headerShown: false }} />
                <Stack.Screen name="(auth)" options={{ headerShown: false }} />
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen name="routines" options={{ headerShown: false }} />
                <Stack.Screen
                    name="log-workout"
                    options={{
                        ...createScreenOptions({
                            title: "Log Workout",
                            align: "center"
                        }),
                        presentation: "fullScreenModal",
                        headerTintColor: "#fff",
                    }}
                />
            </Stack>

            <Modal
                isVisible={isDiscardWorkoutModalVisible}
                useNativeDriver={true}
                className="items-center justify-center"
            >
                <View style={{ height: height * 0.25,
                    width: width * 0.85,
                    backgroundColor: '#161618'
                }}
                      className="p-5 items-center rounded-2xl"
                >
                    <AppText
                        className="mt-2 text-center"
                    >
                        Are you sure you want to discard the workout in progress?
                    </AppText>
                    <Pressable
                        className="bg-[#2C2C2E] w-full mt-5 p-2 rounded-xl items-center"
                        onPress={() => {
                            stopTime()
                            setWorkoutInProgress(null)
                            setIsDiscardWorkoutModalVisible(false)
                        }}
                    >
                        <AppText
                            className="text-red-500"
                        >
                            Discard Workout
                        </AppText>
                    </Pressable>
                    <Pressable
                        className="bg-[#2C2C2E] mt-5 w-full p-2 rounded-xl items-center"
                        onPress={() => setIsDiscardWorkoutModalVisible(false)}
                    >
                        <AppText>
                            Cancel
                        </AppText>
                    </Pressable>
                </View>
            </Modal>
            {workoutInProgress && (
                <View
                    className="absolute bottom-27 w-full justify-center"
                >
                    <Pressable
                        className="active:opacity-70 rounded-full p-2 flex-row w-full justify-between  bg-[#2C2C2E] border"
                        onPress={() => router.push({pathname: '/log-workout'})}
                    >
                        <View className="flex-row">
                            <View className="bg-[#1E1E18] p-2 rounded-full">
                                <MaterialCommunityIcons name="chevron-up" size={32} color="white"/>
                            </View>
                            <View className="ms-5">
                                <AppText>Workout {displayTime(duration)}</AppText>
                                <View>
                                    <AppText numberOfLines={1} className="text-gray-500">
                                        {workoutInProgress.exercises.length > 0 ?
                                            workoutInProgress.exercises[0].name :
                                            'No exercises'}
                                    </AppText>
                                </View>
                            </View>
                        </View>
                        <Pressable
                            className="active:opacity-30 rounded-full bg-[#2C2C2E]  p-2 border"
                            hitSlop={10}
                            onPress={() => setIsDiscardWorkoutModalVisible(true)}
                        >
                            <MaterialCommunityIcons name="trash-can-outline" size={32} color="red"/>
                        </Pressable>
                    </Pressable>

                </View>
            )}
        </View>
    )
}
export default function RootLayout() {
    return (
        <UserProvider>
            <RootLayoutFunction/>
        </UserProvider>
    )
}