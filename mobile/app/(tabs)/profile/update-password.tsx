import {ScrollView, View } from "react-native";
import AppText from "@/components/AppText";
import AppTextInput from "@/components/AppTextInput";
import AppButton from "@/components/AppButton";
import {router} from "expo-router";
import {api} from "@/constants/axios";
import {useEffect, useState} from "react";
import {MaterialCommunityIcons} from "@expo/vector-icons";

export default function UpdatePasswordScreen(){
    const [errorMessage, setErrorMessage] = useState("")
    const [currentPassword, setCurrentPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const isPassValid = currentPassword.trim() !== '' && newPassword.trim() !== '' && newPassword === confirmPassword

    useEffect(() => {
        if(newPassword !== '' && newPassword.trim().length < 8){
            setErrorMessage("Password must be at least 8 characters long.")
        }
        if(newPassword.trim().length >= 8){
            setErrorMessage("")
        }
    }, [newPassword]);

    const handleSubmit = async () => {
        try {
            const response = await api.post("/change-password",{
                currentPassword, newPassword
            })
            router.dismissTo({
                pathname: "/profile",
                params: { success: "true"}
            })
        } catch (err){
            setErrorMessage(err.response?.data?.message || err.response?.data || "An unexpected error occured.");
            console.log(err)
        }
    }
    return (
        <ScrollView style={{flex: 1, backgroundColor: "black"}}
              contentContainerClassName="py-7 px-5"
                    keyboardShouldPersistTaps="handled"
        >
            <AppText>Current Password</AppText>
            <AppTextInput
                placeholder="Current password"
                className="mt-2"
                value={currentPassword}
                onChangeText={(value) => setCurrentPassword(value)}
                secureTextEntry={true}
            ></AppTextInput>
            <View className="h-px bg-gray-900"/>
            <AppText className="mt-5">New Password</AppText>
            <AppTextInput
                placeholder="New password"
                className="mt-2"
                value={newPassword}
                onChangeText={(value) => setNewPassword(value)}
                secureTextEntry={true}
            ></AppTextInput>
            <View className="h-px bg-gray-900"/>
            <AppText
                className="mt-5"
            >Confirm Password</AppText>
            <AppTextInput
                placeholder="Confirm password"
                className="mt-2"
                value={confirmPassword}
                onChangeText={(value) => setConfirmPassword(value)}
                secureTextEntry={true}
            ></AppTextInput>
            <View className="h-px bg-gray-900"/>
            {errorMessage &&
                <View className="flex-row items-center">
                    <MaterialCommunityIcons
                        name="alert-circle-outline"
                        size={18}
                        className="me-2"
                        color="#f87171"
                    />
                    <AppText className="bg-red-950 text-red-400 rounded">
                        {errorMessage}
                    </AppText>
                </View>
            }
            <AppButton
                onPress={handleSubmit}
                title="Update"
                className="mt-8"
                variant={isPassValid  ? 'primary' : 'secondary'}
                disabled={!isPassValid}
            >
            </AppButton>
        </ScrollView>
    )
}