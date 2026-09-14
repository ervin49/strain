import {View, Text, Pressable, useWindowDimensions} from "react-native";
import AppText from "@/components/AppText";
import {MaterialCommunityIcons} from "@expo/vector-icons";
import {useUser} from "@/components/UserProvider";
import {router} from "expo-router";
import AppButton from "@/components/AppButton";
import DraggableFlatList from "react-native-draggable-flatlist/src/components/DraggableFlatList";
import {useEffect, useState} from "react";
import {GestureHandlerRootView} from "react-native-gesture-handler";
import * as Haptics from "expo-haptics"
import {ScaleDecorator} from "react-native-draggable-flatlist";
import Modal from "react-native-modal";
import {api} from "@/constants/axios";

export default function WorkoutScreen(){
    const {user, refreshUser} = useUser();
    const [routines, setRoutines] = useState(user?.routines ?? [])
    const noOfRoutines = routines.length
    const {height, width} = useWindowDimensions()

    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false)
    const [routineToDelete, setRoutineToDelete] = useState<string | null>(null)

    useEffect(() => {
        setRoutines(user?.routines ?? [])
    },[user?.routines])

    const onStartRoutine = async () => {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    }

    const onDeleteRoutine = async () => {
        try {
            await api.delete(`/routines/${routineToDelete}`)

            await refreshUser()

            setIsDeleteModalVisible(false)
            setRoutineToDelete(null)
        }catch (e) {
            console.log(e);
        }
    }

    return (
        <GestureHandlerRootView
            style={{ flex: 1, backgroundColor: "black" }}
            className="p-4"
        >
            <Modal
                isVisible={isDeleteModalVisible}
                animationIn="fadeIn"
                className="items-center justify-center"
            >
                <View style={{ height: height * 0.25,
                    width: width * 0.85,
                    backgroundColor: '#161618'
                }}
                      className="p-5 items-center rounded-2xl"
                >
                    <AppText
                        className="mt-2 text-center"
                    >Are you sure you want to delete this routine?</AppText>
                    <Pressable
                        className="bg-[#2C2C2E] w-full mt-5 p-2 rounded-xl items-center"
                        onPress={onDeleteRoutine}
                    >
                        <AppText
                            className="text-red-500"
                        >
                            Delete Routine
                        </AppText>
                    </Pressable>
                    <Pressable
                        className="bg-[#2C2C2E] mt-5 w-full p-2 rounded-xl items-center"
                        onPress={() => {
                            setIsDeleteModalVisible(false)
                        }}
                    >
                        <AppText>
                            Cancel
                        </AppText>
                    </Pressable>
                </View>
            </Modal>
            <DraggableFlatList
                data={routines}
                keyExtractor={(item) => item.id}
                onDragEnd={({data}) => setRoutines(data)}
                contentContainerClassName="pb-50"
                ListEmptyComponent={() => {}}
                ListHeaderComponent={() => (
                    <View>
                        <Pressable
                            className="p-3  bg-[#161618] rounded-xl flex-row items-center active:opacity-30"
                        >
                            <MaterialCommunityIcons name="plus" color="white" size={26}/>
                            <AppText
                                className="ms-2"
                            >
                                Start Empty Workout</AppText>
                        </Pressable>
                        <AppText
                            className="mt-4 text-xl font-bold"
                        >
                            Routines
                        </AppText>
                        <View className="flex-row gap-3">
                            <Pressable
                                className="mt-4 p-3 bg-[#161618] rounded-xl flex-row items-center flex-1 active:opacity-30"
                                onPress={() => router.push("/routines")}
                            >
                                <MaterialCommunityIcons name="book" color="white" size={26} className="ms-3"/>
                                <AppText
                                    className="ms-2"
                                >
                                    New Routine
                                </AppText>
                            </Pressable>
                            <Pressable
                                className="mt-4 p-3 bg-[#161618] rounded-xl flex-row items-center flex-1 active:opacity-30"
                            >
                                <MaterialCommunityIcons name="magnify" color="white" size={26} className="ms-3"/>
                                <AppText
                                    className="ms-2"
                                >
                                    Explore
                                </AppText>
                            </Pressable>
                        </View>
                        <Text
                            className="text-gray-500 text-lg mt-4"
                        >
                            My Routines ({noOfRoutines})
                        </Text>
                    </View>
                )}
                renderItem={({item, drag}) => {
                    const exercises = item.exercises.map((ex,i) =>
                    {
                        let name = ex.name
                        if(i < item.exercises.length - 1){
                            name += ', '
                        }
                        return name
                    })
                    return (
                        <ScaleDecorator>
                            <Pressable
                                className="bg-[#2C2C2E] rounded-xl p-4 mt-4"
                                onLongPress={drag}
                                onPress={() => router.push({
                                    pathname: "/routines/edit",
                                    params: {
                                        "routineId" : item.id
                                    }
                                })}
                            >
                                <View className="flex-row justify-between">
                                    <AppText className="font-bold">{item.name}</AppText>
                                    <Pressable className="active:opacity-30" onPress={() => {
                                        setRoutineToDelete(item.id)
                                        setIsDeleteModalVisible(true)
                                    }}>
                                        <MaterialCommunityIcons name="trash-can-outline" color="red" size={24}/>
                                    </Pressable>
                                </View>
                                <AppText className="text-gray-400" numberOfLines={2}>{exercises}</AppText>
                                <AppButton onPress={onStartRoutine}
                                           className="mt-4"
                                           title="Start Routine"
                                />
                            </Pressable>
                        </ScaleDecorator>
                    )
                }}
            />
        </GestureHandlerRootView>
    )
}