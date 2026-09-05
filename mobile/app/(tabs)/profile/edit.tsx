import {View, Image, Pressable, Keyboard, ScrollView} from "react-native";
import {useUser} from "@/components/UserProvider";
import AppTextInput from "@/components/AppTextInput";
import {useEffect, useRef, useState} from "react";
import DateTimePicker from '@react-native-community/datetimepicker';
import {router, Stack} from "expo-router";
import AppText from "@/components/AppText";
import {Gesture, GestureDetector, GestureHandlerRootView} from "react-native-gesture-handler";

export default function EditProfileScreen(){
    const {user} = useUser();
    const avatarPath = user?.avatarPath

    const [firstName, setFirstName] = useState<string | undefined>("")
    const [lastName, setLastName] = useState<string | undefined>("")
    const [dateOfBirth, setDateOfBirth] = useState<Date>(new Date())
    const [file, setFile] = useState<File | null>(null);
    useEffect(() => {
        if(user){
            setFirstName(user.firstName)
            setLastName(user.lastName)
            setDateOfBirth(new Date(user.dateOfBirth));
            console.log(dateOfBirth);
        }
    },[user])

    const isFirstNameChanged = firstName !== (user?.firstName || "")
    const isLastNameChanged = lastName !== (user?.lastName || "")
    const isDateOfBirthChanged = dateOfBirth.toISOString().slice(0,10) !== user?.dateOfBirth;
    const isFileSelected = file !== null

    const isFormEdited = isFirstNameChanged || isLastNameChanged || isDateOfBirthChanged || isFileSelected

    const onSubmit = () => {
        console.log('first name changed' + isFirstNameChanged);
        console.log('last name changed' + isLastNameChanged);
        console.log('date changed' + isDateOfBirthChanged);
        console.log('file selected' + isFileSelected);

        const formData = new FormData();
    }

    return (
        <ScrollView
            style={{ backgroundColor: "black", flex: 1 }}
            contentContainerClassName="p-3"
            keyboardShouldPersistTaps="handled"
        >
            <Stack.Screen
                options={{
                    headerRight: () => (
                        <Pressable
                            disabled={!isFormEdited}
                            onPress={onSubmit}
                            hitSlop={10}
                            className={`justify-center items-center 
                            `}
                        >
                            <AppText
                                className={`px-4 text-[#0479DA] text-lg
                                ${isFormEdited ? 'text-[#008CFF]' : 'text-[#EFEFEF]'}
                                `}
                            >
                                Save
                            </AppText>
                        </Pressable>

                    ),
                }}
            />
            <View className="items-center mt-2">
                <Image source={avatarPath ? {uri: `http://192.168.1.200:8080/${avatarPath}`} : require(`@/assets/images/default-profile-picture.png`)}
                       style={{ width: 80, height: 80}}
                />
                <Pressable
                    className="mt-5 active:opacity-30"
                >
                    <AppText
                        className="text-[#008CFF]"
                    >Change Picture</AppText>
                </Pressable>
            </View>
            <AppText
                className="text-[#5C5C5E] mt-5"
            >
                Public profile data
            </AppText>
            <View className="flex-row mt-4">
                <AppText>First Name</AppText>
                <AppTextInput
                    className="ms-5 w-full"
                    placeholder="First name"
                    value={firstName}
                    onChangeText={setFirstName}
                />
            </View>
            <View className="h-px bg-gray-900 mt-5"/>
            <View className="flex-row mt-3">
                <AppText>Last Name</AppText>
                <AppTextInput
                    className="ms-5 w-full"
                    placeholder="Last name"
                    value={lastName}
                    onChangeText={setLastName}
                />
            </View>
            <View className="h-px bg-gray-900 mt-5"/>
            <View className="flex-row mt-3">
                <AppText>Birthday</AppText>
                <DateTimePicker
                    value={dateOfBirth}
                />
            </View>
        </ScrollView>
    )
}