import {router, Stack} from "expo-router";
import {Pressable, View} from "react-native";
import {MaterialCommunityIcons} from "@expo/vector-icons";
import {GlassView} from "expo-glass-effect/src";
import AppText from "@/components/AppText";
import AppHeader from "@/components/AppHeader";
import { createScreenOptions } from "@/constants/ScreenOptions";
import {useUser} from "@/components/UserProvider";

export default function ProfileLayout(){
    const {user} = useUser();
    const firstName = user?.firstName || "";
    return (
        <Stack>
            <Stack.Screen name="index"
                          options={{
                              ...createScreenOptions({
                                  title: firstName,
                                  align: 'left',
                                  small: false
                              }),
                              headerRight: () => (
                                  <View className="gap-4 flex-row px-2">
                                      <Pressable
                                          onPress={() => router.push("/profile/edit")}
                                      >
                                          <MaterialCommunityIcons name="pencil-outline" size={26} color="white"
                                          />
                                      </Pressable>
                                      <Pressable
                                          onPress={() => router.push("/profile/settings")}>
                                          <MaterialCommunityIcons name="cog-outline" size={26} color="white"/>
                                      </Pressable>
                                  </View>
                              ),
                          }}/>
            <Stack.Screen name="settings" options={{
                ...createScreenOptions({
                    title: "Settings",
                }),
                headerLeft: () => (
                    <Pressable onPress={() => {
                        if(router.canGoBack()) {
                            router.back();
                        } else {
                            router.replace("/profile");
                        }
                    }}
                               hitSlop={10}>
                        <MaterialCommunityIcons name="arrow-left" color="white" size={26}/>
                    </Pressable>
                )
            }}/>
            <Stack.Screen name="edit" options={{
                ...createScreenOptions({
                    title: "Edit Profile"
                }),
                headerLeft: () => (
                    <Pressable onPress={() => {
                        if(router.canGoBack()) {
                            router.back();
                        } else {
                            router.replace("/profile");
                        }
                    }}
                               hitSlop={10}>
                        <MaterialCommunityIcons name="arrow-left" color="white" size={26}/>
                    </Pressable>
                )
            }}/>
            <Stack.Screen name="account" options={{
                ...createScreenOptions({
                    title: "Account Settings"
                }),
                headerLeft: () => (
                    <Pressable onPress={() => {
                        if(router.canGoBack()) {
                            router.back();
                        } else {
                            router.replace("/profile");
                        }
                    }}
                               hitSlop={10}
                               >
                        <MaterialCommunityIcons name="arrow-left" color="white" size={26}/>
                    </Pressable>
                )
            }}/>
            <Stack.Screen name="update-password" options={{
                ...createScreenOptions({
                    title: "Update Password"
                }),
                headerLeft: () => (
                    <Pressable onPress={() => {
                        if(router.canGoBack()) {
                            router.back();
                        } else {
                            router.replace("/profile");
                        }
                    }}
                               hitSlop={10}
                    >
                        <MaterialCommunityIcons name="arrow-left" color="white" size={26}/>
                    </Pressable>
                )
            }}/>
        </Stack>
    )
}