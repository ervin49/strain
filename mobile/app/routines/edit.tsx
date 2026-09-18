import {FlatList, Pressable, Text, TextInput, useWindowDimensions, View} from "react-native";
import {router, Stack, useLocalSearchParams} from "expo-router";
import {useEffect, useState} from "react";
import AppText from "@/components/AppText";
import {api} from "@/constants/axios";
import {Exercise, ExerciseSet, Routine, useUser} from "@/components/UserProvider";
import {GestureHandlerRootView} from "react-native-gesture-handler";
import DraggableFlatList from "react-native-draggable-flatlist";
import {ScaleDecorator} from "react-native-draggable-flatlist";
import {MaterialCommunityIcons} from "@expo/vector-icons";
import Modal from "react-native-modal";
import * as Haptics from "expo-haptics";
import AppTextInput from "@/components/AppTextInput";

export default function EditRoutineScreen() {
    const {exercisesNames} = useLocalSearchParams<{exercisesNames: string}>();
    const {routineId} = useLocalSearchParams<{routineId: string}>()
    const [routine, setRoutine] = useState<Routine | null>(null)
    const [routineName, setRoutineName] = useState('')
    const [exerciseSets, setExerciseSets] = useState<ExerciseSet[]>([])
    const [exercises, setExercises] = useState<Exercise[]>([])
    const {width, height} = useWindowDimensions()
    const [isDiscardModalVisible, setIsDiscardModalVisible] = useState(false)
    const isChanged = routineName !== routine?.name || exercises !== routine.exercises
    const {refreshUser} = useUser()


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
        } catch (e) {
            console.log(e);
        }
    }

    useEffect(() =>{
        if(exercisesNames){
            fetchExercises()
        }
    },[exercisesNames])

    useEffect(() => {
        const fetchRoutine = async () => {
            try {
                const result = await api.get(`/routines/${routineId}`);
                setRoutine(result.data)
                setRoutineName(result.data.name)
                setExercises(result.data.exercises)
            } catch (e) {
                console.log(e);
            }
        }
        fetchRoutine()
    },[routineId])

    const removeExercise = (name: string) => {
        setExercises(exercises.filter((ex) => ex.name !== name))
    }

    const onSave = async () => {
        try{
            await api.put(`/routines/${routineId}`,{
                "name": routineName,
                "exercises": exercises
            })
            await refreshUser()
            router.back()
        } catch (e){
            console.log(e);
        }
    }


    return (
        <GestureHandlerRootView
            style={{ flex: 1, backgroundColor: "black" }}
            className="px-4 py-2"
        >
            <Stack.Screen
                options={{
                    headerLeft: () => (
                        <Pressable
                            onPress={() => {
                                if(isChanged) {
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
                            disabled={!isChanged}
                            onPress={onSave}
                            hitSlop={10}
                            className={`justify-center items-center 
                            `}
                        >
                            <AppText
                                className={`px-4 text-[#0479DA] text-lg
                                ${isChanged ? 'text-[#008CFF]' : 'text-[#EFEFEF]'}
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
                    >Are you sure you want to discard all routine changes?</AppText>
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
                            Discard changes
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
            <TextInput
                value={routineName}
                onChangeText={(value) => setRoutineName(value)}
                className="text-2xl font-bold text-white mb-5 h-10"
            />
            <View className="h-px bg-gray-900"/>
            <DraggableFlatList
                data={exercises}
                keyExtractor={(ex) => ex.id}
                onDragEnd={({data}) => setExercises(data)}
                ListFooterComponent={() => (
                    <Pressable
                        className="mt-1 flex-row w-full py-2 justify-center items-center active:opacity-80 rounded-xl bg-[#0189F9]"
                        onPress={async () => {
                            await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
                            router.push({
                                pathname: "/routines/add-exercise",
                                params: {
                                    routineId,
                                    "returnTo": "/routines/edit"
                                }
                            })
                        }}
                    >
                        <MaterialCommunityIcons name="plus" color="white" size={24}/>
                        <AppText
                            className="ms-2"
                        >Add exercise</AppText>
                    </Pressable>
                )}
                renderItem={({item, drag}) => {
                    let id = 0;
                    function getUniqueId(): number {
                        return id++
                    }

                    const newExerciseSet: ExerciseSet = {
                        id: getUniqueId().toLocaleString(),
                        setNumber: getUniqueId(),
                        reps: undefined,
                        weight: undefined,
                        exercise: item
                    }
                    return (
                        <ScaleDecorator>
                            <Pressable
                                onLongPress={drag}
                                className="mb-4"
                            >
                                <View className="flex-row justify-between">
                                    <AppText className="text-blue-500">{item.name}</AppText>
                                    <Pressable onPress={() => removeExercise(item.name)}>
                                        <MaterialCommunityIcons name="trash-can-outline" color="red" size={24}/>
                                    </Pressable>
                                </View>
                                <View className="flex-row justify-between">
                                    <AppText className="text-sm text-gray-400">SET</AppText>
                                    <AppText className="text-sm text-gray-400">KG</AppText>
                                    <AppText className="text-sm text-gray-400">REPS</AppText>
                                </View>
                                <FlatList
                                    data={exerciseSets.filter((ex)=> ex.exercise === item)}
                                    keyExtractor={(set) => set.setNumber.toString()}
                                    renderItem={({item}) => (
                                        <View
                                            className="flex-row justify-between">
                                            <AppText>{item.setNumber}</AppText>
                                            <AppTextInput
                                                placeholder={`${item.weight ?? '-'}`}
                                                keyboardType="numeric"
                                                value={item.weight}
                                                onChangeText={(value) => {item.weight = value}}
                                            />
                                            <AppTextInput
                                                placeholder={`${item.reps ?? '-'}`}
                                                keyboardType="numeric"
                                                value={item.reps}
                                                onChangeText={(value) => {item.reps = value}}
                                            />
                                        </View>
                                    )}
                                />
                                <Pressable
                                    onPress={() => setExerciseSets([...exerciseSets, newExerciseSet])}
                                    className="active:opacity-30 py-2 bg-[#2C2C2E] flex-row justify-center items-center rounded-xl"
                                >
                                    <MaterialCommunityIcons name="plus" size={24} color="white"/>
                                    <AppText className="ms-1">
                                        Add Set
                                    </AppText>
                                </Pressable>
                            </Pressable>
                        </ScaleDecorator>
                    )
                }}/>
        </GestureHandlerRootView>
    )
}