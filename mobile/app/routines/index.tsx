import AppText from "@/components/AppText";
import AppTextInput from "@/components/AppTextInput";
import {Pressable, Text, View} from "react-native";
import {MaterialCommunityIcons} from "@expo/vector-icons";
import AppButton from "@/components/AppButton";
import {router, Stack} from "expo-router";
import {useState} from "react";

export default function CreateRoutine(){
    const [edited, setEdited] = useState(false);
    return (
        <View style={{ flex: 1, backgroundColor: "black"}} className="p-4">
            <Stack.Screen
                options={{
                    headerRight: () => (
                        <Pressable
                            disabled={!edited}
                            onPress={() => {
                                if(router.canGoBack()) {
                                    router.back()
                                } else {
                                    router.replace("/")
                                }
                            }}
                            hitSlop={10}
                            className={`justify-center items-center 
                            `}
                        >
                            <AppText
                                className={`px-4 text-[#0479DA] text-lg
                                ${edited ? 'text-[#008CFF]' : 'text-[#EFEFEF]'}
                                `}
                            >
                                Save
                            </AppText>
                        </Pressable>

                    ),
                }}
            />
            <AppTextInput
                placeholder="Routine title"
                className="text-2xl mt-2"
            />
            <View className="mt-4 h-px bg-gray-900"/>
            <View
                className="items-center justify-center mt-35 px-5"
            >
                <AppText>Get started by adding an exercise to your routine.</AppText>
            </View>
            <AppButton
                className="flex-row mt-8"
                onPress={() => router.push("/routines/add-exercise")}
            >
                <MaterialCommunityIcons name="plus" color="white" size={20}/>
                <AppText
                    className="ms-2"
                >Add exercise</AppText>
            </AppButton>
        </View>
    )
}
