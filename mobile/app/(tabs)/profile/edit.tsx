import {
    View,
    Image,
    Pressable,
    ScrollView,
    useWindowDimensions
} from "react-native";
import {useUser} from "@/components/UserProvider";
import * as ImagePicker from "expo-image-picker"
import AppTextInput from "@/components/AppTextInput";
import {useEffect, useState} from "react";
import {router, Stack} from "expo-router";
import AppText from "@/components/AppText";
import {api} from "@/constants/axios";
import Modal from "react-native-modal"
import {MaterialCommunityIcons} from "@expo/vector-icons";
import RNDateTimePicker from "@react-native-community/datetimepicker";

export default function EditProfileScreen(){
    const {user, refreshUser} = useUser();
    const avatarPath = user?.avatarPath
    const {height, width} = useWindowDimensions();

    const [firstName, setFirstName] = useState<string | undefined>("")
    const [lastName, setLastName] = useState<string | undefined>("")
    const [dateOfBirth, setDateOfBirth] = useState<Date>(new Date())
    const [file, setFile] = useState<File | null>(null);
    const [isPictureModalVisible, setIsPictureModalVisible] = useState(false);
    const [isConfirmationModalVisible, setIsConfirmationModalVisible] = useState(false);

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
    const isDateOfBirthChanged = user?.dateOfBirth === null ? false : dateOfBirth.toISOString().slice(0, 10) !== user?.dateOfBirth

    const isFormEdited = isFirstNameChanged || isLastNameChanged || isDateOfBirthChanged

    const onSubmit = async () => {
        console.log('first name changed' + isFirstNameChanged);
        console.log('last name changed' + isLastNameChanged);
        console.log('date changed' + isDateOfBirthChanged);

        const formData = new FormData();
        formData.append("firstName",firstName ?? '');
        formData.append("lastName",lastName ?? '');
        formData.append("dateOfBirth",dateOfBirth.toISOString().slice(0, 10) ?? '');
        const response = await api.post("/update-profile", formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        });

        await refreshUser();
        if(router.canGoBack()){
            router.back();
        } else {
            router.replace("/");
        }
        console.log(response.data)
    }

    const onSelectLibraryPhoto = async () => {
        try{
            const result = await ImagePicker.launchImageLibraryAsync({mediaTypes: 'images'})
            updateProfilePicture(result)
        } catch (err){
            console.log(err);
        }
    }

    async function updateProfilePicture(result){
        if(!result.canceled){
            const formData = new FormData();
            const asset = result.assets[0]
            formData.append("file", {
                uri: asset.uri,
                name: asset.fileName ?? 'profile.jpg',
                type: asset.mimeType ?? 'image/jpeg'
            })
            const response = await api.post("/update-profile", formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });

            await refreshUser();
            console.log(response.data);
        }


    }

    const onTakePhoto = async () => {
        try{
            const permissionResult = await ImagePicker.getCameraPermissionsAsync()

            if(!permissionResult.granted) {
                const cameraPermissionResult =
                    await ImagePicker.requestCameraPermissionsAsync();

                if(!cameraPermissionResult.granted){
                    return;
                }
            }

            const result = await ImagePicker.launchCameraAsync()
            updateProfilePicture(result)
        } catch (err){
            console.log(err);
        }
    }

    const onDeleteProfilePicture = async () => {
        try{
            await api.delete("/profile-picture");
            await refreshUser();
            setIsConfirmationModalVisible(false)
        } catch (err){
            console.log(err);
        }
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
                                className={`text-[#0479DA] text-lg px-4
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
                <Image source={avatarPath ? {uri: `http://192.168.1.200:8080/user-images/${avatarPath}`} : require(`@/assets/images/default-profile-picture.png`)}
                       style={{ width: 80, height: 80}}
                       className="rounded-full"
                />
                <Pressable
                    className="mt-5 active:opacity-30"
                    onPress={() => setIsPictureModalVisible(!isPictureModalVisible)}
                >
                    <AppText
                        className="text-[#008CFF]"
                    >Change Picture</AppText>
                </Pressable>
            </View>
            <Modal
                isVisible={isPictureModalVisible}
                swipeDirection="down"
                animationIn="slideInUp"
                onSwipeComplete={() => setIsPictureModalVisible(false)}
                onBackdropPress={() => setIsPictureModalVisible(false)}
                style={{
                    justifyContent: "flex-end",
                    margin: 0
                }}
            >
                <View className="bg-[#161618] px-5 rounded-4xl pb-15">
                    <View className="w-full items-center">
                        <View style={{width: width * 0.15}}
                              className="items-center bg-gray-500 mt-2 h-1.5 rounded-2xl"
                        />
                    </View>
                    <View className="bg-[#2C2C2E] p-5 rounded-t-2xl mt-7">
                        <Pressable
                            className="flex-row"
                            onPress={onTakePhoto}
                        >
                            <MaterialCommunityIcons name="camera-outline" color="white" size={26}/>
                            <AppText className="ms-3">Take Photo</AppText>
                        </Pressable>
                    </View>
                    <View className="h-px bg-gray-950"/>
                    <View className={`bg-[#2C2C2E] p-5 ${avatarPath ? '' : 'rounded-b-2xl'}`}>
                        <Pressable
                            className={`flex-row`}
                            onPress={onSelectLibraryPhoto}
                        >
                            <MaterialCommunityIcons name="image-outline" color="white" size={26}/>
                            <AppText className="ms-3">Select Library Photo</AppText>
                        </Pressable>
                    </View>
                    {avatarPath &&
                        <>
                            <View className="h-px bg-gray-950"/>
                            <View className="bg-[#2C2C2E] p-5 rounded-b-2xl">
                                <Pressable
                                    className="flex-row"
                                    onPress={() => {
                                        setIsPictureModalVisible(false)
                                        setTimeout(() => {
                                            setIsConfirmationModalVisible(true)
                                        },500)
                                    }}
                                >
                                    <MaterialCommunityIcons name="delete-outline" color="red" size={26}/>
                                    <AppText
                                        className="text-red-700 ms-3"
                                    >Delete Profile Picture</AppText>
                                </Pressable>
                            </View>
                        </>
                    }
                </View>
            </Modal>
            <Modal
                isVisible={isConfirmationModalVisible}
                animationIn="fadeIn"
                className="items-center justify-center"
            >
                <View style={{ height: height * 0.28,
                    width: width * 0.85,
                    backgroundColor: '#161618'
                }}
                      className="p-5 items-center rounded-2xl"
                >
                    <AppText
                        className="font-semibold text-xl"
                    >Delete Profile Picture</AppText>
                    <AppText
                        className="mt-5 text-center"
                    >Are you sure you want to delete your profile picture?</AppText>
                    <Pressable
                        className="bg-[#2C2C2E] w-full mt-5 p-2 rounded-xl items-center"
                        onPress={onDeleteProfilePicture}
                    >
                        <AppText
                            className="text-red-500"
                        >
                            Delete Profile Picture
                        </AppText>
                    </Pressable>
                    <Pressable
                        className="bg-[#2C2C2E] mt-5 w-full p-2 rounded-xl items-center"
                        onPress={() => setIsConfirmationModalVisible(false)}
                    >
                        <AppText>
                            Cancel
                        </AppText>
                    </Pressable>
                </View>
            </Modal>
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
                <View className="ms-5">
                    <RNDateTimePicker
                        value={dateOfBirth}
                        onValueChange={(event, date) => setDateOfBirth(date)}
                    />
                </View>
            </View>
        </ScrollView>
    )
}