import {
    ActivityIndicator, FlatList, Image,
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
        <View
            style={{ height: height * 0.7, flex: 1, backgroundColor: 'black'}}>
            <FlatList
                data={workouts}
                refreshControl={
                    <RefreshControl
                        onRefresh={onRefresh}
                        refreshing={isRefreshing}
                    />
                }
                renderItem={({item}) => (
                    <View className="p-4">
                        <View className="flex-row">
                            <Image src={user?.avatarPath ?
                                `http://192.168.1.200:8080/user-images/${user.avatarPath}` :
                                require('@/assets/images/default-profile-picture.png')}
                                   style={{ width: 100, height: 100}}
                            />
                            <View>
                                <AppText>{user?.firstName} {user?.lastName}</AppText>
                                <AppText>{((new Date() - item.date) / 1000).toString()}</AppText>
                            </View>
                        </View>
                        <AppText>{item.routineName}</AppText>
                        <View className="flex-row">
                            <View>
                                <AppText>Time</AppText>
                                <AppText>{item.duration}</AppText>
                            </View>
                            <View>
                                <AppText>Volume</AppText>
                                <AppText>0</AppText>
                            </View>
                        </View>
                        <View className="h-px mt-3 bg-[#2C2C2E]"/>
                    </View>
                )}/>
        </View>
    )
}
