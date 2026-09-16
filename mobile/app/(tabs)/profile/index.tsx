import {Image, Pressable, RefreshControl, ScrollView, Text, useWindowDimensions, View} from "react-native";
import {useUser} from "@/components/UserProvider";
import {router, useLocalSearchParams} from "expo-router";
import {useEffect, useLayoutEffect, useState} from "react";
import AppText from "@/components/AppText";
import Modal from "react-native-modal";
import * as Haptics from "expo-haptics"
import {ImpactFeedbackStyle} from "expo-haptics/src/Haptics.types";
import {useRefresh} from "@/constants/onRefresh";

export default function ProfileScreen() {
    const {user} = useUser();
    const [isRefreshing, setIsRefreshing] = useState(false);
    const {height} = useWindowDimensions()
    const firstName = user?.firstName
    const lastName = user?.lastName
    const avatarPath = user?.avatarPath;
    const onRefresh = useRefresh(setIsRefreshing)
    const {success} = useLocalSearchParams()
    let workouts = [];
    if(user){
        workouts = user.workouts
    }
    const noOfWorkouts = workouts.length

    const [isPassChangedModalVisible, setIsPassChangedModalVisible] = useState(false);
    useEffect(() => {
        if(success !== 'true'){
            return;
        }
        setIsPassChangedModalVisible(true)
        setTimeout(() => {
            setIsPassChangedModalVisible(false)
        },3000)
    },[success])

    return (
        <ScrollView
            style={{flex: 1, backgroundColor: "black"}}
            contentContainerClassName="px-4 py-2"
            refreshControl={
                <RefreshControl
                    refreshing={isRefreshing}
                    onRefresh={onRefresh}
                />
            }
        >
            <Modal
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
                <View className="flex-1 mt-2 ms-4 me-3" style={{ height: height * 0.7 }}>
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
        </ScrollView>
    )
}