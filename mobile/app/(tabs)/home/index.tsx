import {
    ActivityIndicator, FlatList, Image,
    Pressable,
    RefreshControl,
    useWindowDimensions,
    View
} from 'react-native';
import {useUser, Workout} from "@/components/UserProvider";
import AppText from "@/components/AppText";
import {useRefresh} from "@/constants/onRefresh";
import {useEffect, useState} from "react";
import {MaterialCommunityIcons} from "@expo/vector-icons";
import {api} from "@/constants/axios";
import Modal from "react-native-modal";
import {router} from "expo-router";
import {convertMS, displayTime} from "@/constants/time";

export default function HomeScreen() {
    const {loading, user, refreshUser} = useUser();
    const [isRefreshing, setIsRefreshing] = useState(false)
    const {height, width} = useWindowDimensions()
    const onRefresh = useRefresh(setIsRefreshing)
    const [workouts, setWorkouts] = useState<Workout[]>([])
    const [workoutToDelete, setWorkoutToDelete] = useState<Workout | null>()
    const [isDeleteWorkoutVisible, setIsDeleteWorkoutVisible] = useState(false)

    useEffect(() => {
        if(user) {
            setWorkouts(user.workouts)
        }
    },[user])

    if(loading || !user){
        return(
            <View className="bg-black items-center justify-center" style={{ flex: 1}}>
                <ActivityIndicator size="large" className="relative bottom-20"/>
            </View>
        )
    }


    const handleDeleteWorkout = async () => {
        try {
            await api.delete(`/workouts/${workoutToDelete!.id}`)
            await refreshUser()
            setIsDeleteWorkoutVisible(false)
        } catch (e) {
            console.log(e);
        }
    }

    return (
        <View
            style={{ height: height * 0.7, flex: 1, backgroundColor: 'black'}}
        >
            <Modal
                isVisible={isDeleteWorkoutVisible}
                useNativeDriver={true}
                className="items-center justify-center"
            >
                <View style={{ height: height * 0.31,
                    width: width * 0.85,
                    backgroundColor: '#161618'
                }}
                      className="p-5 items-center rounded-2xl"
                >
                    <AppText
                        className="mt-2 font-bold text-center"
                    >Delete this workout?</AppText>
                    <AppText
                        className="mt-2 text-center"
                    >
                        You'll lose the sets, reps, and weights logged for this session.
                        Your routine won't be affected.
                    </AppText>
                    <Pressable
                        className="bg-[#2C2C2E] w-full mt-5 p-2 rounded-xl items-center"
                        onPress={handleDeleteWorkout}
                    >
                        <AppText
                            className="text-red-500"
                        >
                            Delete Workout
                        </AppText>
                    </Pressable>
                    <Pressable
                        className="bg-[#2C2C2E] mt-5 w-full p-2 rounded-xl items-center"
                        onPress={() => {
                            setWorkoutToDelete(null)
                            setIsDeleteWorkoutVisible(false)
                        }}
                    >
                        <AppText>
                            Cancel
                        </AppText>
                    </Pressable>
                </View>
            </Modal>
            <FlatList
                data={[...workouts].reverse()}
                contentContainerClassName="pb-150"
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={() => (
                    <View className="items-center justify-center mt-20">
                        <AppText className="text-center text-xl">You don't have any workout.</AppText>
                        <AppText className="text-xl text-center">Add a workout now</AppText>
                    </View>
                )}
                refreshControl={
                    <RefreshControl
                        onRefresh={onRefresh}
                        refreshing={isRefreshing}
                    />
                }
                ItemSeparatorComponent={() => (
                    <View className="p-2 bg-[#2C2C2E]"/>
                )}
                renderItem={({item: workout}) => (
                    <View className="p-4">
                        <View className="flex-row justify-between">
                            <View className="flex-row">
                                <Image source={user.avatarPath ?
                                    {uri: `http://192.168.1.200:8080/user-images/${user.avatarPath}`} :
                                    require('@/assets/images/default-profile-picture.png')}
                                       style={{ width: 50, height: 50}}
                                       className="rounded-full"
                                />
                                <View className="ms-5">
                                    <AppText>{user.firstName}</AppText>
                                    <AppText className="text-gray-500 text-sm">{convertMS(new Date().getTime() - new Date(workout.date).getTime())}</AppText>
                                </View>
                            </View>
                            <Pressable onPress={() => {
                                setWorkoutToDelete(workout)
                                setIsDeleteWorkoutVisible(true)
                            }}
                            >
                                <MaterialCommunityIcons name="trash-can-outline" color="red" size={26}/>
                            </Pressable>
                        </View>
                        <Pressable
                            onPress={() => router.push({
                                pathname: "/home/workout-details",
                                params: {
                                    'workoutId': workout.id
                                }
                            })}
                            hitSlop={20}
                        >
                        <AppText className="mt-3 font-bold text-lg">{workout.routineName}</AppText>
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
                                <AppText>{workout.sets.length ?? '0'}</AppText>
                            </View>
                        </View>
                        </Pressable>
                        <View className="h-px mt-4 bg-[#2C2C2E]"/>
                        <Pressable
                            onPress={() => router.push({
                                pathname: "/home/workout-details",
                                params: {
                                    'workoutId': workout.id
                                }
                            })}
                            hitSlop={20}
                        >
                        <FlatList
                            data={[...workout.exercises].splice(0,3)}
                            className="p-2"
                            renderItem={({item: exercise}) => {
                                const noOfSets = workout.sets.filter(
                                    (set) => set.exerciseId === exercise.id
                                ).length

                                return (
                                    <AppText>
                                        {noOfSets} {noOfSets === 1 ? 'set' : 'sets'} {exercise.name}
                                    </AppText>
                                )
                            }}
                        />
                        </Pressable>
                        {workout.exercises.length > 3 &&
                            <Pressable
                                onPress={() => router.push({
                                    pathname: "/home/workout-details",
                                    params: {
                                        'workoutId': workout.id
                                    }
                                })}
                                hitSlop={20}
                            >
                                <AppText className="text-center text-base mt-3 text-gray-500">See {workout.exercises.length - 3} more {workout.exercises.length === 4 ? 'exercise' : 'exercises'}</AppText>
                            </Pressable>
                        }
                    </View>
                )}/>
        </View>
    )
}
