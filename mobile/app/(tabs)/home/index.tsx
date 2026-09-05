import {SafeAreaView} from "react-native-safe-area-context";
import {ActivityIndicator, Button, Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import {Stack, useNavigation} from "expo-router";
import {useLayoutEffect} from "react";
import Header from "@/components/AppHeader";
import {createScreenOptions} from "@/components/ScreenOptions";
import {useUser} from "@/components/UserProvider";
import AppText from "@/components/AppText";

export default function HomeScreen() {
    const {loading, user} = useUser();
    let workouts = [];
    if(user){
        workouts = user.workouts;
    }
    const noOfWorkouts = workouts.length;

    if(loading){
        return(
            <View className="bg-black items-center justify-center" style={{ flex: 1}}>
                <ActivityIndicator size="large" className="relative bottom-20"/>
            </View>
        )
    }

    return (
        <>
            <View
                style={{ flex: 1, backgroundColor: "black"}}
                className="px-4 py-2"
            >
                {noOfWorkouts === 0 &&
                    <View className="flex-row items-center justify-center mt-5">
                        <AppText className="text-center text-xl">You don't have any workout! Add a workout now.</AppText>
                    </View>
                }
            </View>
        </>
    )
}
