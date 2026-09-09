import AppText from "@/components/AppText";
import AppTextInput from "@/components/AppTextInput";
import {FlatList, Pressable, Text, useWindowDimensions, View} from "react-native";
import {MaterialCommunityIcons} from "@expo/vector-icons";
import {router, Stack, useLocalSearchParams, useNavigation} from "expo-router";
import {useEffect, useState} from "react";
import {api} from "@/constants/axios";
import {Exercise} from "@/app/routines/add-exercise";
import Modal from "react-native-modal";
import * as Haptics from "expo-haptics"

export default function CreateRoutine(){
    const {exercisesNames} = useLocalSearchParams<{exercisesNames: string}>();
    const [exercises, setExercises] = useState<Exercise[]>([]);
    const [routineTitle, setRoutineTitle] = useState("")
    const [isDiscardModalVisible, setIsDiscardModalVisible] = useState(false)
    const isValid = exercises.length > 0 && routineTitle.trim() !== ''
    const {width, height} = useWindowDimensions()

    const fetchExercises = async () => {
        try {
            const tokens = exercisesNames.split(',')
            const exercisesNamesArr: string[] = []
            tokens.forEach((token) => exercisesNamesArr.push(token))

            const response = await api.post("/exercises-by-names",
                exercisesNamesArr
            )

            const newExercises: Exercise[] = response.data;

            const uniqueExercises = newExercises.filter(
                newEx => !exercises.some(ex => ex.name === newEx.name)
            );

            setExercises([...exercises, ...uniqueExercises]);
            console.log(JSON.stringify(response.data))
        } catch (e) {
            console.log(e);
        }
    }
    useEffect(() =>{
        if(exercisesNames){
            fetchExercises()
        }
    },[exercisesNames])

    const navigation = useNavigation();

    useEffect(() => {
        let parent = navigation.getParent()
        while(parent) {
            parent.setOptions({ gestureEnabled: false });
            parent = parent.getParent()
        }

        return () => {
            let parent = navigation.getParent()
            while(parent) {
                parent.setOptions({ gestureEnabled: true });
                parent = parent.getParent()
            }
        };
    }, [navigation]);

    const removeExercise = (exerciseName: string) => {
        setExercises(exercises.filter(exercise => exercise.name !== exerciseName))
    }

    return (
        <View style={{ flex: 1, backgroundColor: "black"}} className="p-4">
            <Stack.Screen
                options={{
                    headerLeft: () => (
                        <Pressable
                            onPress={() => {
                                if(exercises.length > 0) {
                                    setIsDiscardModalVisible(true)
                                } else {
                                    if (router.canGoBack()) {
                                        router.back()
                                    } else {
                                        router.replace("/")
                                    }
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
            <Modal
                isVisible={isDiscardModalVisible}
                className="items-center justify-center"
            >
                <View style={{ height: height * 0.24,
                    width: width * 0.85,
                    backgroundColor: '#161618'
                }}
                      className="p-5 items-center rounded-2xl"
                >
                    <AppText
                        className="mt-2 text-center"
                    >Are you sure you want to discard the routine?</AppText>
                    <Pressable
                        className="bg-[#2C2C2E] w-full mt-5 p-2 rounded-xl items-center"
                        onPress={() => {
                            if(router.canGoBack())
                                router.back()
                            else router.replace("/")
                        }}
                    >
                        <AppText
                            className="text-red-500"
                        >
                            Discard routine
                        </AppText>
                    </Pressable>
                    <Pressable
                        className="bg-[#2C2C2E] mt-5 w-full p-2 rounded-xl items-center"
                        onPress={() => setIsDiscardModalVisible(false)}
                    >
                        <AppText>
                            Cancel
                        </AppText>
                    </Pressable>
                </View>
            </Modal>
            <AppTextInput
                placeholder="Routine title"
                value={routineTitle}
                onChangeText={(value) => setRoutineTitle(value)}
                className="text-2xl mt-2"
            />
            <View className="mt-4 h-px bg-gray-900"/>
            <FlatList
                data={exercises}
                keyExtractor={(item) => item.id}
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
                        <Pressable onPress={() => removeExercise(item.name)}>
                            <MaterialCommunityIcons name="trash-can-outline" color="red" size={24}/>
                        </Pressable>
                    </Pressable>
                )}
                ListFooterComponent={() => (
                    <Pressable
                        className="mt-8 flex-row w-full py-2 justify-center items-center active:opacity-80 rounded-xl bg-[#0189F9]"
                        onPress={async () => {
                            await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
                            router.push("/routines/add-exercise")
                        }}
                    >
                        <MaterialCommunityIcons name="plus" color="white" size={24}/>
                        <AppText
                            className="ms-2"
                        >Add exercise</AppText>
                    </Pressable>
                )}
            ></FlatList>
        </View>
    )
}
