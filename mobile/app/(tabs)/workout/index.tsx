import {View, Text, Pressable, FlatList} from "react-native";
import AppText from "@/components/AppText";
import {MaterialCommunityIcons} from "@expo/vector-icons";
import {Routine, useUser} from "@/components/UserProvider";
import {router} from "expo-router";
import AppButton from "@/components/AppButton";
import DraggableFlatList from "react-native-draggable-flatlist/src/components/DraggableFlatList";
import {useEffect, useState} from "react";
import {GestureHandlerRootView} from "react-native-gesture-handler";
import * as Haptics from "expo-haptics"

export default function WorkoutScreen(){
    const {user} = useUser();
    const [routines, setRoutines] = useState(user?.routines ?? [])
    const noOfRoutines = routines.length

    const onStartRoutine = async () => {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    }

    return (
            <GestureHandlerRootView
                style={{ flex: 1, backgroundColor: "black" }}
                className="p-4"
            >
                <DraggableFlatList
                    data={routines}
                    keyExtractor={(item) => item.id}
                    onDragEnd={({data}) => setRoutines(data)}
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
                    renderItem={({item}) => {
                        const exercises = item.exercises.map((ex,i) =>
                        {
                            let name = ex.name
                            if(i < item.exercises.length - 1){
                                name += ', '
                            }
                            return name
                        })
                        return (
                            <View className="bg-[#2C2C2E] rounded-xl p-4 mt-4">
                                <AppText className="font-bold">{item.name}</AppText>
                                    <AppText className="text-gray-400" numberOfLines={2}>{exercises}</AppText>
                                <AppButton onPress={onStartRoutine}
                                           className="mt-4"
                                           title="Start Routine"
                                />
                            </View>
                        )
                    }}
                />
            </GestureHandlerRootView>
    )
}