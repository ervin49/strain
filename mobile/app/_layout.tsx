import {Stack} from "expo-router";
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
                    className="absolute bottom-30 justify-center items-center w-full gap-3 flex-row"
                >
                    <Pressable
                        className="active:opacity-30 rounded-full flex-row items-center px-4 justify-center bg-[#2C2C2E]"
                        style={{ width: width * 0.7}}
                        onPress={() => console.log("da")}
                    >
                        <View className="bg-gray-700 p-2 rounded-full">
                            <MaterialCommunityIcons name="chevron-up" size={32} color="gray"/>
                        </View>
                        <View>
                            <AppText>Workout {displayTime(duration)}</AppText>
                            <AppText numberOfLines={1}>{workoutInProgress.exercises.map((ex) => ex.name).join(', ')}</AppText>
                        </View>
                    </Pressable>

                    <Pressable
                        className="active:opacity-30 rounded-full bg-[#2C2C2E] p-3"
                        hitSlop={10}
                        onPress={() => setIsDiscardWorkoutModalVisible(true)}
                    >
                        <MaterialCommunityIcons name="trash-can-outline" size={32} color="red"/>
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