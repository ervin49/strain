import {View, Text, Pressable, FlatList} from "react-native";
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

export default function LogWorkoutScreen(){
    const {exercisesNames} = useLocalSearchParams<{exercisesNames: string}>();
    const {routineId} = useLocalSearchParams<{routineId: string}>()
    const [routine, setRoutine] = useState<Routine | null>(null)
    const [exercises, setExercises] = useState<Exercise[]>([])
    const [exerciseSets, setExerciseSets] = useState<ExerciseSet[]>([])
    const {user, refreshUser} = useUser();
    const [userId, setUserId] = useState('')
    const [time, setTime] = useState(0)
    const [volume, setVolume] = useState(0)
    const startTimeRef = useRef(0)
    const intervalRef = useRef<number | null>(null);

    const onDelete = (item: ExerciseSet) => {
        setExerciseSets((prev) => [...prev.filter((set) => set !== item)])
    }

    const startTime = () => {
        startTimeRef.current = Date.now() - time * 1000
        intervalRef.current = setInterval(() => setTime(Math.floor((Date.now() - startTimeRef.current) / 1000)),1000)
    }

    useEffect(() => {
        if(user) {
            setUserId(user.id)
        }
    },[user])

    useEffect(() => {
        let volume = 0;
        exerciseSets.forEach((set) => {volume += Number(set.weight ?? 0) * Number(set.reps ?? 0)})
        setVolume(volume)
    },[exerciseSets])

    useLayoutEffect(() => {
        startTime()
    },[])

    const timeInMinutes = () => {
        if(time < 60){
            return time + 's'
        }
        if(time < 3600) {
            return Math.floor(time / 60) + 'min ' + (time % 60) + 's'
        }

        return Math.floor(time / 3600) + 'h ' + Math.floor((time % 3600) / 60) + 'min ' + Math.floor(time % 60) + 's'
    }

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
                const result = await api.get(`/routines/${routineId}`);
                setRoutine(result.data)
                setExercises(result.data.exercises)
                setExerciseSets(result.data.sets)
            } catch (e) {
                console.log(e);
            }
        }
        fetchRoutine()
    },[routineId])

    const removeExercise = (name: string) => {
        setExercises(exercises.filter((ex) => ex.name !== name))
    }

    const handleFinish = async () => {
        try {
            await api.post("/workouts",{
                'duration': time,
                'date': new Date().toISOString().slice(0,19),
                exercises,
                userId
            })
            await refreshUser()
            router.back()
        }catch (e) {
            console.log(e);
        }
    }
    return (
        <GestureHandlerRootView
            style={{ flex: 1, backgroundColor: 'black'}}
            className="p-4"
        >
            <Stack.Screen
                options={{
                    headerRight: () => (
                        <Pressable
                            className="px-3"
                            onPress={handleFinish}
                        >
                            <Text>Finish</Text>
                        </Pressable>
                    )
                }}
            />
            <View className="flex-row justify-between">
                <View
                    className="justify-center items-center"
                    style={{width: 80}}
                >
                    <Text className="text-gray-400">Duration</Text>
                    <Text className="text-blue-500 text-lg">{timeInMinutes()}</Text>
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
                    <Text className="text-gray-400 text-lg">0</Text>
                </View>
            </View>
            <View className="h-px mt-5 bg-gray-900"/>
            <DraggableFlatList
                data={exercises}
                keyExtractor={(ex) => ex.id}
                showsVerticalScrollIndicator={false}
                onDragEnd={({data}) => setExercises(data)}
                ListFooterComponent={() => (
                    <Pressable
                        className="mt-1 mb-130 flex-row w-full py-2 justify-center items-center active:opacity-80 rounded-xl bg-[#0189F9]"
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
                        >Add exercise</AppText>
                    </Pressable>
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
                                className="mb-4 mt-4"
                            >
                                <View className="flex-row justify-between">
                                    <AppText className="text-blue-500">{item.name}</AppText>
                                    <Pressable onPress={() => removeExercise(item.name)}>
                                        <MaterialCommunityIcons name="trash-can-outline" color="red" size={24}/>
                                    </Pressable>
                                </View>
                                <View className="flex-row justify-between mt-2">
                                    <View style={{ width: 32 }}>
                                        <AppText className="text-sm text-gray-400 ms-1">SET</AppText>
                                    </View>
                                    <AppText className="text-sm flex-1 text-gray-400 text-center">KG</AppText>
                                    <AppText className="text-sm flex-1 text-gray-400 text-center">REPS</AppText>
                                </View>
                                <FlatList
                                    data={exerciseSets.filter((ex)=> ex.exerciseId === item.id)}
                                    keyExtractor={(set) => set.setNumber.toLocaleString()}
                                    renderItem={({item}) => {
                                        return (
                                            <ReanimatedSwipeable
                                                friction={1}
                                                overshootRight={false}
                                                renderRightActions={(_progress, drag) => (
                                                    <DeleteAction drag={drag} item={item}/>
                                                )}
                                            >
                                                <View
                                                    className="flex-row justify-between  mt-3 gap-2"
                                                >
                                                    <View className="bg-[#2C2C2E] rounded-lg justify-center items-center" style={{ width: 32, height: 32}}>
                                                        <AppText>{item.setNumber}</AppText>
                                                    </View>
                                                    <AppTextInput
                                                        placeholder={`${item.weight ?? '-'}`}
                                                        keyboardType="numeric"
                                                        value={item.weight}
                                                        onChangeText={(value) => {item.weight = value}}
                                                        className="border flex-1 rounded-lg text-lg border-[#2C2C2E]"
                                                        textAlign="center"
                                                    />
                                                    <AppTextInput
                                                        placeholder={`${item.reps ?? '-'}`}
                                                        keyboardType="numeric"
                                                        value={item.reps}
                                                        onChangeText={(value) => {item.reps = value}}
                                                        className="flex-1 rounded-lg text-lg border border-[#2C2C2E]"
                                                        textAlign="center"
                                                    />
                                                </View>
                                            </ReanimatedSwipeable>
                                        )}}
                                />
                                <Pressable
                                    onPress={() => setExerciseSets([...exerciseSets, newExerciseSet])}
                                    className="active:opacity-30 py-2 mt-4 bg-[#2C2C2E] flex-row justify-center items-center rounded-xl"
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