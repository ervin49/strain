import {router, Stack} from "expo-router";
import {Pressable, View} from "react-native";
import {MaterialCommunityIcons} from "@expo/vector-icons";
import {GlassView} from "expo-glass-effect/src";
import AppText from "@/components/AppText";
import AppHeader from "@/components/AppHeader";
import { createScreenOptions } from "@/components/ScreenOptions";
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
                                  <View className="gap-5 flex-row px-3">
                                      <GlassView
                                          className="border-0"
                                      >
                                          <Pressable
                                              className="border-0"
                                              onPress={() => router.push("/profile/edit")}
                                          >
                                              <MaterialCommunityIcons name="pencil-outline" size={26} color="white"
                                                                      className="border-0"
                                              />
                                          </Pressable>
                                      </GlassView>
                                      <GlassView>
                                          <Pressable
                                              onPress={() => router.push("/profile/settings")}>
                                              <MaterialCommunityIcons name="cog-outline" size={26} color="white"/>
                                          </Pressable>
                                      </GlassView>
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
                               hitSlop={10}
                               className="h-10 w-10 justify-center items-center">
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
                               hitSlop={10}
                               className="h-10 w-10 justify-center items-center">
                        <MaterialCommunityIcons name="arrow-left" color="white" size={26}/>
                    </Pressable>
                )
            }}/>
        </Stack>
    )
}