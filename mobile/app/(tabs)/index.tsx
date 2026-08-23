import {SafeAreaView} from "react-native-safe-area-context";
import {Button, Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import {Stack, useNavigation} from "expo-router";
import {useLayoutEffect} from "react";

export default function HomeScreen() {
    const navigation = useNavigation();

    return (
        <>
            <SafeAreaView style={{ flex: 1, backgroundColor: "black"}}>
                <View className="px-5 py-4">
                    <Text className="text-white text-2xl font-semibold" style={{ letterSpacing: 0.5}}>Home</Text>
                </View>
                <View className="h-px bg-[#131313]"/>
            </SafeAreaView>
        </>
    )
}
