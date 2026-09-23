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

    if(loading){
        return(
            <View className="bg-black items-center justify-center" style={{ flex: 1}}>
                <ActivityIndicator size="large" className="relative bottom-20"/>
            </View>
        )
    }

    const displayTime = (time: number) => {
        if(time < 60){
            return time + 's'
        }
        if(time < 3600) {
            return Math.floor(time / 60) + 'min ' + (time % 60) + 's'
        }

        return Math.floor(time / 3600) + 'h ' + Math.floor((time % 3600) / 60) + 'min ' + Math.floor(time % 60) + 's'
    }

    function convertMS(ms: number) {
        let d, h, m, s;
        s = Math.floor(ms / 1000);
        m = Math.floor(s / 60);
        h = Math.floor(m / 60);
        m = m % 60;
        d = Math.floor(h / 24);
        h = h % 24;

        if(d == 0){
            if(h == 0){
                if(m == 0) {
                    return 'a few seconds ago'
                }
                else {
                    return m == 1 ? 'one minute ago' : m + ' minutes ago'
                }
            }
            else {
                return h == 1 ? 'one hour ago' : h + ' hours ago'
            }
        } else {
            return d == 1 ? 'one day ago' : d + ' days ago'
        }
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
                                <Image source={user?.avatarPath ?
                                    `http://192.168.1.200:8080/user-images/${user.avatarPath}` :
                                    require('@/assets/images/default-profile-picture.png')}
                                       style={{ width: 50, height: 50}}
                                       className="rounded-full"
                                />
                                <View className="ms-5">
                                    <AppText>{user?.firstName} {user?.lastName}</AppText>
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
                        </View>
                        <View className="h-px mt-4 bg-[#2C2C2E]"/>
                        <FlatList
                            data={[...workout.exercises].splice(0,3)}
                            className="p-2"
                            renderItem={({item: exercise}) => {
                                const noOfSets = workout.sets.filter(
                                    (set) => set.exerciseId === exercise.id
                                ).length

                                return (
                                    <AppText>
                                        {noOfSets} sets {exercise.name}
                                    </AppText>
                                )
                            }}
                        />
                        {workout.exercises.length > 3 &&
                            <Pressable
                                onPress={() => console.log("da ma daaaaaaaa")}
                                hitSlop={20}
                            >
                                <AppText className="text-center text-sm mt-3 text-gray-400">See {workout.exercises.length - 3} more {workout.exercises.length === 4 ? 'exercise' : 'exercises'}</AppText>
                            </Pressable>
                        }
                    </View>
                )}/>
        </View>
    )
}
