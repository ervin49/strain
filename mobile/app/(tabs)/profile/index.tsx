import {Image, Pressable, Text, View} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import {useUser} from "@/components/UserProvider";
import {MaterialCommunityIcons} from "@expo/vector-icons";
import {router} from "expo-router";
import {useEffect, useLayoutEffect} from "react";
import AppTextInput from "@/components/AppTextInput";
import AppText from "@/components/AppText";

export default function ProfileScreen() {
    const {user} = useUser();
    const firstName = user?.firstName
    const lastName = user?.lastName
    const avatarPath = user?.avatarPath;
    let workouts = [];
    if(user){
        workouts = user.workouts
    }
    const noOfWorkouts = workouts.length
    return (
        <View
            style={{flex: 1, backgroundColor: "black"}}
            className="px-4 py-2"
        >
            <View
                className="flex-row mt-4"
            >
                <Pressable
                    className="active:opacity-30"
                >
                    <Image source={ avatarPath ?
                        { uri: `http://192.168.1.187:8080/${avatarPath}`} :
                        require('@/assets/images/default-profile-picture.png')
                    }
                           style={{ width: 80, height: 80}}
                    />
                </Pressable>
                <View className="flex-1 mt-2 ms-4 me-3">
                    <AppText>{firstName} {lastName}</AppText>
                    <View className="flex-row mt-1 justify-between">
                        <View>
                            <AppText
                                className="text-gray-400 text-sm"
                            >
                                Workouts
                            </AppText>
                            <AppText
                                className="relative bottom-1"
                            >
                                {noOfWorkouts}
                            </AppText>
                        </View>
                        <View
                        >
                            <AppText
                                className="text-gray-400 text-sm"
                            >
                                Followers
                            </AppText>
                            <AppText
                                className="relative bottom-1"
                            >
                                0</AppText>
                        </View>
                        <View
                        >
                            <AppText
                                className="text-gray-400 text-sm"
                            >
                                Following
                            </AppText>
                            <AppText
                                className="relative bottom-1"
                            >0</AppText>
                        </View>
                    </View>
                </View>
            </View>
        </View>
    )
}