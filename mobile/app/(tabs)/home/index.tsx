import {
    ActivityIndicator,
    Button,
    Pressable,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    useWindowDimensions,
    View
} from 'react-native';
import {useUser} from "@/components/UserProvider";
import AppText from "@/components/AppText";
import {useRefresh} from "@/constants/onRefresh";
import {useState} from "react";

export default function HomeScreen() {
    const {loading, user} = useUser();
    const [isRefreshing, setIsRefreshing] = useState(false)
    const {height} = useWindowDimensions()
    const onRefresh = useRefresh(setIsRefreshing)
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
            <ScrollView
                style={{ flex: 0, backgroundColor: "black"}}
                contentContainerClassName="px-4 py-2"
                refreshControl={
                    <RefreshControl
                        onRefresh={onRefresh}
                        refreshing={isRefreshing}
                    />
                }
            >
                <View style={{ height: height * 0.7}}>
                    {noOfWorkouts === 0 &&
                        <View className="flex-row items-center justify-center mt-5">
                            <AppText className="text-center text-xl">You don't have any workout! Add a workout now.</AppText>
                        </View>
                    }
                </View>
            </ScrollView>
        </>
    )
}
