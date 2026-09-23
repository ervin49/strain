import {ActivityIndicator, FlatList, Image, View} from "react-native";
import {useLocalSearchParams} from "expo-router";
import {useEffect, useState} from "react";
import { api } from "@/constants/axios";
import {Exercise, useUser, Workout} from "@/components/UserProvider";
import AppText from "@/components/AppText";
import {displayTime} from "@/constants/time";

export default function WorkoutDetailsScreen() {
    const {workoutId} = useLocalSearchParams<{workoutId: string}>()
    const {user} = useUser()
    const [workout, setWorkout] = useState<Workout | null>(null)
    const [exercises, setExercises] = useState<Exercise[]>([])

    useEffect(() => {
        const fetchWorkout = async () => {
            try{
                const result = await api.get(`/workouts/${workoutId}`)

                setWorkout(result.data)
                setExercises(result.data.exercises)
            } catch (e) {
                console.log(e);
            }
        }

        fetchWorkout()
    }, [workoutId]);
    if(!workout){
        return(
            <View className="bg-black items-center justify-center" style={{ flex: 1}}>
                <ActivityIndicator size="large" className="relative bottom-20"/>
            </View>
        )
    }
    return (
        <View style={{ flex: 1, backgroundColor: 'black'}}>
            <FlatList
                data={exercises}
                contentContainerClassName="pb-150"
                ListHeaderComponent={() => (
                    <View className="p-5">
                        <View className="flex-row">
                            <Image source={user?.avatarPath ?
                                {uri: `http://192.168.1.200:8080/user-images/${user.avatarPath}`} :
                                require('@/assets/images/default-profile-picture.png')}
                                   style={{ width: 50, height: 50}}
                                   className="rounded-full"
                            />
                            <View className="ms-3">
                                <AppText>{user?.firstName}</AppText>
                                <AppText className="text-sm text-gray-400">{workout.date.toString().split('T')[0]}</AppText>
                            </View>
                        </View>
                        <View>
                            <AppText>{workout.routineName}</AppText>
                            <View className="flex-row gap-10 mt-3">
                                <View>
                                    <AppText className="text-gray-500 text-sm">Time</AppText>
                                    <AppText>{displayTime(workout.duration)}</AppText>
                                </View>
                                <View>
                                    <AppText className="text-gray-500 text-sm">Volume</AppText>
                                    <AppText>{workout.volume ?? '0'} kg</AppText>
                                </View>
                                <View>
                                    <AppText className="text-gray-500 text-sm">Sets</AppText>
                                    <AppText>{workout.sets.length}</AppText>
                                </View>
                            </View>
                        </View>
                        <AppText className="text-gray-500 mt-5">Workout</AppText>
                    </View>
                )}
                renderItem={({item: exercise}) => (
                    <View className="mb-5">
                        <AppText className="text-[#0189F9] ms-5 text-xl">{exercise.name}</AppText>
                        <View
                            className="flex-row gap-5 ps-3 mt-5"
                        >
                            <AppText
                                className="text-sm text-center text-gray-400"
                                style={{ width: 32 }}
                            >
                                SET
                            </AppText>
                            <AppText
                                className="text-sm text-gray-400"
                            >
                                WEIGHT & REPS
                            </AppText>
                        </View>
                        <FlatList
                            data={workout.sets.filter((set) => set.exerciseId === exercise.id)}
                            renderItem={({item: set}) => (
                                <View className={`flex-row gap-5 p-3 ${set.setNumber % 2 === 0 ? 'bg-[#2C2C2E]' : ''}`}>
                                     <AppText
                                         style={{ width: 32 }}
                                         className="text-center"
                                    >{set.setNumber}</AppText>
                                    <AppText>{set.weight ?? '0'} x {set.reps ?? '0'}</AppText>
                                </View>
                            )}
                        />
                    </View>
                )}/>
        </View>
    )
}
