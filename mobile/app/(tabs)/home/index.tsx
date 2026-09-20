import {
    ActivityIndicator, FlatList,
    RefreshControl,
    ScrollView,
    useWindowDimensions,
    View
} from 'react-native';
import {useUser, Workout} from "@/components/UserProvider";
import AppText from "@/components/AppText";
import {useRefresh} from "@/constants/onRefresh";
import {useEffect, useState} from "react";

export default function HomeScreen() {
    const {loading, user} = useUser();
    const [isRefreshing, setIsRefreshing] = useState(false)
    const {height} = useWindowDimensions()
    const onRefresh = useRefresh(setIsRefreshing)
    const [workouts, setWorkouts] = useState<Workout[]>([])
    const noOfWorkouts = workouts.length;

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
                    <FlatList
                        data={workouts}
                        renderItem={({item}) => (
                            <View>
                                <AppText>
                                    {item.duration}
                                </AppText>
                            </View>
                        )}/>
                </View>
            </ScrollView>
        </>
    )
}
