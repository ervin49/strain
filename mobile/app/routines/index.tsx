import AppText from "@/components/AppText";
import AppTextInput from "@/components/AppTextInput";
import {FlatList, Pressable, Text, View} from "react-native";
import {MaterialCommunityIcons} from "@expo/vector-icons";
import AppButton from "@/components/AppButton";
import {router, Stack, useLocalSearchParams} from "expo-router";
import {useEffect, useState} from "react";
import {api} from "@/constants/axios";
import {Exercise} from "@/app/routines/add-exercise";

export default function CreateRoutine(){
    const {exercisesNames} = useLocalSearchParams<{exercisesNames: string}>();
    const [exercises, setExercises] = useState<Exercise[]>([]);
    const [routineTitle, setRoutineTitle] = useState("")
    const isValid = exercises.length > 0 && routineTitle.trim() !== ''

    const fetchExercises = async () => {
        try {
            const tokens = exercisesNames.split(',')
            const exercisesNamesArr: string[] = []
            tokens.forEach((token) => exercisesNamesArr.push(token))

            const response = await api.post("/exercises-by-names",
                exercisesNamesArr
            )
            setExercises(response.data)
            console.log(JSON.stringify(response.data))
        } catch (e) {
            console.log(e);
        }
    }
    useEffect(() =>{
        console.log()
        if(exercisesNames){
            fetchExercises()
            console.log(exercisesNames);
        }
    },[exercisesNames])

    return (
        <View style={{ flex: 1, backgroundColor: "black"}} className="p-4">
            <Stack.Screen
                options={{
                    headerRight: () => (
                        <Pressable
                            disabled={!isValid}
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
                                ${isValid ? 'text-[#008CFF]' : 'text-[#EFEFEF]'}
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
            <FlatList
                data={exercises}
                ListEmptyComponent={() => (
                    <View
                        className="items-center justify-center mt-35 px-5"
                    >
                        <AppText className="text-center">Get started by adding an exercise to your routine.</AppText>
                    </View>
                )}
                renderItem={({item}) => (
                    <Pressable onPress={() => console.log("")}
                               className={`p-3 mt-1 justify-between flex-row`}
                    >
                        <View>
                            <AppText className="text-white">{item.name}</AppText>
                            <AppText className="mb-1 text-[#8a8a91] mt-1">{item.primaryMuscle.name}</AppText>
                        </View>
                    </Pressable>
                )}
            ></FlatList>
            <AppButton
                className="flex-row mt-8"
                onPress={() => router.push("/routines/add-exercise")}
            >
                <MaterialCommunityIcons name="plus" color="white" size={24}/>
                <AppText
                    className="ms-2"
                >Add exercise</AppText>
            </AppButton>
        </View>
    )
}
