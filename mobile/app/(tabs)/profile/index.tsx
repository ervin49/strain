import {
    ActivityIndicator,
    FlatList,
    Image,
    Pressable,
    RefreshControl,
    View
} from "react-native";
import {useUser, Workout} from "@/components/UserProvider";
import {router, useLocalSearchParams} from "expo-router";
import {useEffect, useState} from "react";
import AppText from "@/components/AppText";
import Modal from "react-native-modal";
import {useRefresh} from "@/constants/onRefresh";
import {convertMS, displayTime} from "@/constants/time";
import {MaterialCommunityIcons} from "@expo/vector-icons";

export default function ProfileScreen() {
    const {user, loading} = useUser();
    const [isRefreshing, setIsRefreshing] = useState(false);
    const firstName = user?.firstName
    const lastName = user?.lastName
    const avatarPath = user?.avatarPath;
    const onRefresh = useRefresh(setIsRefreshing)
    const {success} = useLocalSearchParams()
    const [workouts, setWorkouts] = useState<Workout[]>([])
    const noOfWorkouts = workouts.length
    const [isPassChangedModalVisible, setIsPassChangedModalVisible] = useState(false);
    const [workoutToDelete, setWorkoutToDelete] = useState<Workout | null>()
    const [isDeleteWorkoutVisible, setIsDeleteWorkoutVisible] = useState(false)

    useEffect(() => {
        if(success !== 'true'){
            return;
        }
        setIsPassChangedModalVisible(true)
        setTimeout(() => {
            setIsPassChangedModalVisible(false)
        },3000)
    },[success])

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


    return (
        <View
            style={{flex: 1, backgroundColor: "black"}}
        >
            <Modal
                useNativeDriver={true}
                isVisible={isPassChangedModalVisible}
                hasBackdrop={false}
                animationIn="fadeInDown"
                animationOut="fadeOutUp"
                style={{
                    justifyContent: 'flex-start'
                }}
                className="mt-15 items-center"
            >
                <View className="bg-[#2C2C2E] p-3 rounded-xl">
                    <AppText>Password changed successfully</AppText>
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
                    <View className="p-2  bg-[#2C2C2E]"/>
                )}
                ListHeaderComponent={() => (
                    <View>
                        <View
                            className="flex-row mt-4"
                        >
                            <Pressable
                                className="active:opacity-30"
                                onPress={() => router.push("/profile/edit")}
                            >
                                <Image source={ avatarPath ?
                                    { uri: `http://192.168.1.200:8080/user-images/${avatarPath}`} :
                                    require('@/assets/images/default-profile-picture.png')
                                }
                                       style={{ width: 80, height: 80}}
                                       className="rounded-full"
                                />
                            </Pressable>
                            <View className="flex-1 mt-2 ms-4 me-3">
                                <AppText>{firstName} {lastName}</AppText>
                                <View className="flex-row mt-1 justify-between">
                                    <View>
                                        <AppText className="text-gray-400 text-sm">Workouts
                                        </AppText>
                                        <AppText className="relative bottom-1">{noOfWorkouts}</AppText>
                                    </View>
                                    <View>
                                        <AppText className="text-gray-400 text-sm">Followers</AppText>
                                        <AppText className="relative bottom-1">0</AppText>
                                    </View>
                                    <View>
                                        <AppText className="text-gray-400 text-sm">Following</AppText>
                                        <AppText className="relative bottom-1">0</AppText>
                                    </View>
                                </View>
                            </View>
                        </View>
                        <AppText className="mt-20 mb-3 text-gray-400 text-lg">Workouts</AppText>
                    </View>
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
                                            {noOfSets} sets {exercise.name}
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