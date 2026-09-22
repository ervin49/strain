import {
    ActivityIndicator, FlatList, Image,
    RefreshControl,
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

    const displayTime = (time: number) => {
        if(time < 60){
            return time + 's'
        }
        if(time < 3600) {
            return Math.floor(time / 60) + 'min ' + (time % 60) + 's'
        }

        return Math.floor(time / 3600) + 'h ' + Math.floor((time % 3600) / 60) + 'min ' + Math.floor(time % 60) + 's'
    }

    function convertMS(ms: number) {
        let d, h, m, s;
        s = Math.floor(ms / 1000);
        m = Math.floor(s / 60);
        s = s % 60;
        h = Math.floor(m / 60);
        m = m % 60;
        d = Math.floor(h / 24);
        h = h % 24;

        if(d == 0){
            if(h == 0){
                if(m == 0) {
                    return 'a few seconds ago'
                }
                else {
                    return m == 1 ? 'one minute ago' : m + ' minutes ago'
                }
            }
            else {
                return h == 1 ? 'one hour ago' : h + ' hours ago'
            }
        } else {
            return d == 1 ? 'one day ago' : d + ' days ago'
        }
    }

    return (
        <View
            style={{ height: height * 0.7, flex: 1, backgroundColor: 'black'}}
        >
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
                    <View className="p-2 bg-[#2C2C2E]"/>
                )}
                renderItem={({item}) => (
                    <View className="p-4">
                        <View className="flex-row">
                            <Image source={user?.avatarPath ?
                                `http://192.168.1.200:8080/user-images/${user.avatarPath}` :
                                require('@/assets/images/default-profile-picture.png')}
                                   style={{ width: 50, height: 50}}
                                   className="rounded-full"
                            />
                            <View className="ms-5">
                                <AppText>{user?.firstName} {user?.lastName}</AppText>
                                <AppText className="text-gray-500 text-sm">{convertMS(new Date().getTime() - new Date(item.date).getTime())}</AppText>
                            </View>
                        </View>
                        <AppText className="mt-3 font-bold text-lg">{item.routineName}</AppText>
                        <View className="flex-row gap-10 mt-3">
                            <View>
                                <AppText className="text-gray-500 text-sm">Time</AppText>
                                <AppText>{displayTime(item.duration)}</AppText>
                            </View>
                            <View>
                                <AppText className="text-gray-500 text-sm">Volume</AppText>
                                <AppText>{item.volume ?? '0'} kg</AppText>
                            </View>
                        </View>
                        <View className="h-px mt-4 bg-[#2C2C2E]"/>
                        <FlatList
                            data={item.exercises.splice(0,3)}
                            renderItem={({item}) => (
                                <AppText>
                                    {item.name}
                                </AppText>
                            )}
                        />
                        {item.exercises.length > 3 &&
                            <AppText className="text-center">See {item.exercises.length - 3} more {item.exercises.length === 4 ? 'exercise' : 'exercises'}</AppText>
                        }
                    </View>
                )}/>
        </View>
    )
}
