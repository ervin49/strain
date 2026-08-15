// app/(tabs)/_layout.tsx
import { Tabs } from 'expo-router';
import {createNativeBottomTabNavigator} from "@react-navigation/bottom-tabs/unstable";
import HomeScreen from "@/app/index";

const Tab = createNativeBottomTabNavigator();

function TabLayout() {
    return (
        <Tab.Navigator>
            <Tab.Screen name="index" component={HomeScreen}/>
            <Tab.Screen name="profile" component={HomeScreen}/>
        </Tab.Navigator>
    );
}