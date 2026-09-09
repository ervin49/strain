import {View, Text, ScrollView} from "react-native";
import AppTextInput from "@/components/AppTextInput";
import AppText from "@/components/AppText";
import AppButton from "@/components/AppButton";
import {useState} from "react";

export default function ChangePasswordScreen() {
    const [email, setEmail] = useState("")
    const isValid = email.trim().match(/\S+@\S+\.\S+/)
    return (
        <ScrollView
            className="p-5 flex-1 bg-black"
            keyboardShouldPersistTaps="handled"
        >
            <AppText className="mt-3">Email</AppText>
            <AppTextInput
                value={email}
                onChangeText={setEmail}
            />
            <View className="h-px bg-gray-900"/>
            <AppText className="mt-7 text-gray-500">
                Enter your email above and if an account exists
                we will send you an email with a link to recover your password
            </AppText>
            <AppButton
                disabled={!isValid}
                onPress={() => {}}
                title="Send Password Recovery"
                className="mt-7"
            >
            </AppButton>
        </ScrollView>
    )
}