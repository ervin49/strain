import {View, Text} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import {Stack} from "expo-router";

export default function WorkoutScreen(){
    return (
        <SafeAreaView style={{flex: 1, backgroundColor: "black"}}>
            <View className="px-5 py-4">
                <Text className="text-white text-2xl font-semibold" style={{ letterSpacing: 0.5}}>Workout</Text>
            </View>
            <View className="h-px bg-[#131313]"/>
        </SafeAreaView>
    )
}