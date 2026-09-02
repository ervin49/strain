import {View, Text, Pressable, Image} from "react-native";
import AppText from "@/components/AppText";
import {MaterialCommunityIcons} from "@expo/vector-icons";
import {useUser} from "@/components/UserProvider";
import {router} from "expo-router";

export default function WorkoutScreen(){
    const {user} = useUser();
    let routines = [];
    if(user){
        routines = user.routines;
    }
    const noOfRoutines = routines.length

    return (
        <View
            style={{flex: 1, backgroundColor: "black"}}
            className="px-4 py-2"
        >
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
            {noOfRoutines !== 0 &&
                <View>
                    <Text
                        className="text-gray-500 text-lg mt-4"
                    >
                        My Routines({noOfRoutines})</Text>
                    <View className="flex-row items-center justify-center mt-5">
                        <AppText className="text-center text-xl"></AppText>
                    </View>
                </View>
            }
        </View>
    )
}