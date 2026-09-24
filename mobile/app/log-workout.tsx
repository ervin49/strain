import {View, Text, Pressable, FlatList, useWindowDimensions, ActivityIndicator} from "react-native";
import {useEffect, useLayoutEffect, useRef, useState} from "react";
import {api} from "@/constants/axios";
import {Exercise, ExerciseSet, Routine, useUser} from "@/components/UserProvider";
import {router, Stack, useLocalSearchParams} from "expo-router";
import DraggableFlatList, {ScaleDecorator} from "react-native-draggable-flatlist";
import * as Haptics from "expo-haptics";
import {MaterialCommunityIcons} from "@expo/vector-icons";
import AppText from "@/components/AppText";
import ReanimatedSwipeable from "react-native-gesture-handler/src/components/ReanimatedSwipeable";
import AppTextInput from "@/components/AppTextInput";
import Reanimated, {SharedValue, useAnimatedStyle} from "react-native-reanimated";
import {GestureHandlerRootView} from "react-native-gesture-handler";
import Modal from "react-native-modal";
import AppButton from "@/components/AppButton";
import {ImpactFeedbackStyle} from "expo-haptics/src/Haptics.types";
import {displayTime} from "@/constants/time";

export default function LogWorkoutScreen(){
    const {exercisesNames} = useLocalSearchParams<{exercisesNames: string}>();
    const {routineId} = useLocalSearchParams<{routineId: string}>()
    const {width, height} = useWindowDimensions()
    const [routine, setRoutine] = useState<Routine | null>(null)
    const isFinishingWorkout = useRef(false)
    const [routineName, setRoutineName] = useState<string>("")
    const [exercises, setExercises] = useState<Exercise[]>([])
    const [exerciseSets, setExerciseSets] = useState<ExerciseSet[]>([])
    const [finishedSets, setFinishedSets] = useState<ExerciseSet[]>([])
    const {refreshUser, setWorkoutInProgress, workoutInProgress, startTime, stopTime, duration} = useUser();
    const [volume, setVolume] = useState(0)
    const [isAddExModalVisible, setIsAddExModalVisible] = useState(false)
    const [isNoSetValuesModalVisible, setIsNoSetValuesModalVisible] = useState(false)
    const [ready, setReady] = useState(false)

    const getSetId = (set: ExerciseSet) => {
        return set.exerciseId + '-' + set.setNumber
    }

    const onDelete = (item: ExerciseSet) => {
        setExerciseSets((prev) => [...prev.filter((set) => set !== item)])
    }

    useEffect(() => {
        if(!ready || isFinishingWorkout.current){
            return
        }

        setWorkoutInProgress({
            routineName,
            duration,
            exercises,
            'sets': exerciseSets,
            finishedSets,
            volume,
        })
    },[ready, routineName, duration, exercises, exerciseSets, finishedSets, volume])
    
    useEffect(() => {
        startTime()
    },[])

    function DeleteAction({
                              drag, item,
                          }: { drag: SharedValue<number>; item: ExerciseSet }) {
        // drag is negative as the row moves left; +80 puts the action back at rest
        const style = useAnimatedStyle(() => ({
            transform: [{ translateX: drag.value + 80 }],
        }));

        return (
            <Reanimated.View style={[style]}>
                <Pressable
                    onPress={() => onDelete(item)}
                    accessibilityLabel="Delete"
                    className="bg-red-600"
                >
                    <Text className="text-white py-4 px-5  text-center">Delete</Text>
                </Pressable>
            </Reanimated.View>
        );
    }

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

            setExercises((prev) => [...prev, ...uniqueExercises]);
        } catch (e) {
            console.log(e);
        }
    }

    useEffect(() => {
        if(exercises) {
            exercises.forEach((ex) => {
                if(exerciseSets.some((set) => set.exerciseId === ex.id)) {
                    return;
                }

                const firstSet: ExerciseSet = {
                    setNumber: 1,
                    weight: undefined,
                    reps: undefined,
                    exerciseId: ex.id
                }

                setExerciseSets(prev => [...prev, firstSet])
            })
        }
    },[exercises])

    useEffect(() =>{
        if(exercisesNames){
            fetchExercises()
        }
    },[exercisesNames])

    useEffect(() => {
        const fetchRoutine = async () => {
            try {
                if (routineId) {
                    const result = await api.get(`/routines/${routineId}`);

                    setRoutine(result.data)
                    setRoutineName(result.data.name)
                    setExercises(result.data.exercises)
                    setExerciseSets(result.data.sets)
                } else if(workoutInProgress) {
                    setExercises(workoutInProgress.exercises)
                    setExerciseSets(workoutInProgress.sets)
                    setFinishedSets(workoutInProgress.finishedSets)
                    setVolume(workoutInProgress.volume)
                    setRoutineName(workoutInProgress.routineName)
                }
                setReady(true)
            } catch (e) {
                console.log(e);
            }
        }
        fetchRoutine()
    },[routineId])

    const removeExercise = (name: string) => {
        setExercises(exercises.filter((ex) => ex.name !== name))
    }

    const handleFinishWorkout = async () => {
        if(exercises.length === 0){
            setIsAddExModalVisible(true)
            return
        }

        if(finishedSets.length === 0){
            setIsNoSetValuesModalVisible(true)
            return
        }

        try {
            await api.post("/workouts",{
                routineName: routineName || 'Quick Workout',
                duration,
                'exercises': exercises.filter((ex) => finishedSets.some((set) => set.exerciseId === ex.id)),
                'sets': finishedSets.map(({id, ...set}) => set),
                volume
            })

            isFinishingWorkout.current = true

            stopTime()
            setWorkoutInProgress(null)

            await refreshUser()
            router.back()
        } catch (e) {
            console.log(e);
        }
    }

    const handleFinishSet = async (item: ExerciseSet) => {
        await Haptics.impactAsync(ImpactFeedbackStyle.Medium);

        setFinishedSets(prev => {
            const id = getSetId(item);

            const next = prev.some(set => getSetId(set) === id)
                ? prev.filter(set => getSetId(set) !== id)
                : [...prev, exerciseSets.find(set => getSetId(set) === id)!];

            const volume = next.reduce(
                (sum, set) =>
                    sum +
                    Number(set.weight ?? 0) * Number(set.reps ?? 0),
                0
            );

            setVolume(volume);

            return next;
        });
    }

    if(routineId && !routine){
        return(
            <View className="bg-black items-center justify-center" style={{ flex: 1}}>
                <ActivityIndicator size="large" className="relative bottom-20"/>
            </View>
        )
    }

    return (
        <GestureHandlerRootView
            style={{ flex: 1, backgroundColor: 'black'}}
        >
            <Stack.Screen
                options={{
                    headerRight: () => (
                        <Pressable
                            className="px-3"
                            onPress={handleFinishWorkout}
                        >
                            <Text>Finish</Text>
                        </Pressable>
                    ),
                    headerLeft: () => (
                        <Pressable
                            onPress={() => {
                                setWorkoutInProgress({
                                    duration,
                                    exercises,
                                    finishedSets,
                                    sets: exerciseSets,
                                    routineName,
                                    volume
                                })

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
                }}
            />
            <Modal
                onBackdropPress={() => setIsAddExModalVisible(false)}
                useNativeDriver={true}
                isVisible={isAddExModalVisible}
                className="items-center justify-center"
            >
                <View style={{
                    height: height * 0.15,
                    width: width * 0.85,
                    backgroundColor: '#161618'
                }}
                      className="p-5 items-center rounded-2xl"
                >
                    <AppText
                        className="mt-2 mb-5 text-center"
                    >Add an exercise</AppText>
                    <AppButton
                        onPress={() => {
                            setIsAddExModalVisible(false)
                        }}
                        title="Ok"
                    >
                    </AppButton>
                </View>
            </Modal>
            <Modal
                onBackdropPress={() => setIsNoSetValuesModalVisible(false)}
                useNativeDriver={true}
                isVisible={isNoSetValuesModalVisible}
                className="items-center justify-center"
            >
                <View style={{
                    height: height * 0.15,
                    width: width * 0.85,
                    backgroundColor: '#161618'
                }}
                      className="p-5 items-center rounded-2xl"
                >
                    <AppText
                        className="mt-2 mb-5 text-center"
                    >Your workout has no set values</AppText>
                    <AppButton
                        onPress={() => {
                            setIsNoSetValuesModalVisible(false)
                        }}
                        title="Ok"
                    >
                    </AppButton>
                </View>
            </Modal>
            <View className="flex-row justify-between mt-3">
                <View
                    className="justify-center items-center"
                    style={{width: 80}}
                >
                    <Text className="text-gray-400">Duration</Text>
                    <Text className="text-blue-500 text-lg">{displayTime(duration)}</Text>
                </View>
                <View
                    className="justify-center items-center"
                    style={{width: 80}}
                >
                    <Text className="text-gray-400">Volume</Text>
                    <Text className="text-gray-400 text-lg">{volume} kg</Text>
                </View>
                <View
                    className="justify-center items-center"
                    style={{width: 80}}
                >
                    <Text className="text-gray-400">Sets</Text>
                    <Text className="text-gray-400 text-lg">{finishedSets.length}</Text>
                </View>
            </View>
            <View className="h-px mt-5 bg-gray-900"/>
            <DraggableFlatList
                data={exercises}
                keyExtractor={(ex) => ex.id}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                ListEmptyComponent={() => (
                    <View
                        className="items-center justify-center mt-35 mb-5 px-5"
                    >
                        <AppText className="text-center text-xl font-semibold">Get started</AppText>
                        <AppText className="text-center text-gray-500">Add an exercise to start your workout</AppText>
                    </View>
                )}
                onDragEnd={({data}) => setExercises(data)}
                ListFooterComponent={() => (
                    <View className="mx-2">
                        <Pressable
                            className="mt-1 mb-130  flex-row w-full py-2 justify-center items-center active:opacity-80 rounded-xl bg-[#0189F9]"
                            onPress={async () => {
                                await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
                                router.push({
                                    pathname: "/routines/add-exercise",
                                    params: {
                                        routineId,
                                        "returnTo": "/log-workout"
                                    }
                                })
                            }}
                        >
                            <MaterialCommunityIcons name="plus" color="white" size={24}/>
                            <AppText
                                className="ms-2"
                            >Add Exercise</AppText>
                        </Pressable>
                    </View>
                )}
                renderItem={({item, drag}) => {
                    const newExerciseSet: ExerciseSet = {
                        setNumber: exerciseSets.filter((ex) => ex.exerciseId === item.id).length + 1,
                        reps: undefined,
                        weight: undefined,
                        exerciseId: item.id
                    }
                    return (
                        <ScaleDecorator>
                            <Pressable
                                onLongPress={drag}
                                className="mb-4 mt-8"
                            >
                                <View className="flex-row justify-between px-3">
                                    <AppText className="text-blue-500 text-xl">{item.name}</AppText>
                                    <Pressable onPress={() => removeExercise(item.name)}>
                                        <MaterialCommunityIcons name="trash-can-outline" color="red" size={24}/>
                                    </Pressable>
                                </View>
                                <View className="flex-row justify-between mt-3 px-2.5">
                                    <View style={{ width: 32 }}>
                                        <AppText className="text-sm text-gray-400 ms-1">SET</AppText>
                                    </View>
                                    <AppText className="text-sm flex-1 text-gray-400 text-center">KG</AppText>
                                    <AppText className="text-sm flex-1 text-gray-400 text-center">REPS</AppText>
                                    <MaterialCommunityIcons
                                        name="check"
                                        color="gray"
                                        size={18}
                                    />
                                </View>
                                <FlatList
                                    data={exerciseSets.filter((ex)=> ex.exerciseId === item.id)}
                                    keyExtractor={(set) => set.setNumber.toLocaleString()}
                                    keyboardShouldPersistTaps="handled"
                                    renderItem={({item}) => {
                                        let isFinished = finishedSets.some((set) => getSetId(set) === getSetId(item))

                                        return (
                                            <ReanimatedSwipeable
                                                friction={1}
                                                overshootRight={false}
                                                renderRightActions={(_progress, drag) => (
                                                    <DeleteAction drag={drag} item={item}/>
                                                )}
                                            >
                                                <View
                                                    className={`  ${isFinished ?  'bg-green-500/15' : 'bg-black'}  flex-row justify-between p-2 gap-2`}
                                                >
                                                    <View className={`bg-[#2C2C2E]  rounded-lg justify-center items-center`}
                                                          style={{ width: 32, height: 32}}>
                                                        <AppText>{item.setNumber}</AppText>
                                                    </View>
                                                    <AppTextInput
                                                        placeholder={`${item.weight ?? '-'}`}
                                                        keyboardType="numeric"
                                                        value={item.weight}
                                                        onChangeText={(value) => {
                                                            setExerciseSets(prev =>
                                                                prev.map(set =>
                                                                    getSetId(set) === getSetId(item) ? {
                                                                        ...set,
                                                                        weight: value
                                                                    } : set
                                                                )
                                                            )
                                                        }}
                                                        className={`${isFinished ? '' : 'border'} flex-1 rounded-lg text-lg border-[#2C2C2E]`}
                                                        textAlign="center"
                                                    />
                                                    <AppTextInput
                                                        placeholder={`${item.reps ?? '-'}`}
                                                        keyboardType="numeric"
                                                        value={item.reps}
                                                        onChangeText={(value) => {
                                                            setExerciseSets(prev =>
                                                                prev.map(set =>
                                                                    getSetId(set) === getSetId(item) ? {
                                                                        ...set,
                                                                        reps: value
                                                                    } : set
                                                                )
                                                            )
                                                        }}
                                                        className={`${isFinished ? '' : 'border'} flex-1 rounded-lg text-lg border-[#2C2C2E]`}
                                                        textAlign="center"
                                                        style={{
                                                            height: 32,
                                                            padding: 0,
                                                            fontSize: 16,
                                                        }}
                                                    />
                                                    <Pressable
                                                        className="bg-[#2C2C2E] items-center justify-center rounded-lg"
                                                        style={{ width: 32, height: 32}}
                                                        onPress={() => handleFinishSet(item)}
                                                    >
                                                        <MaterialCommunityIcons name="check" size={24} color="gray"/>
                                                    </Pressable>
                                                </View>
                                            </ReanimatedSwipeable>
                                        )}}
                                />
                                <View className="mx-2">
                                <Pressable
                                    onPress={() => setExerciseSets([...exerciseSets, newExerciseSet])}
                                    className="active:opacity-30 py-2 mt-4 bg-[#2C2C2E] flex-row justify-center items-center rounded-xl"
                                >
                                    <MaterialCommunityIcons name="plus" size={24} color="white"/>
                                    <AppText className="ms-1">
                                        Add Set
                                    </AppText>
                                </Pressable>
                                </View>
                            </Pressable>
                        </ScaleDecorator>
                    )
                }}/>
        </GestureHandlerRootView>
    )
}