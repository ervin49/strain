import {View, Pressable, ActivityIndicator} from "react-native";
import AppText from "@/components/AppText";
import AppTextInput from "@/components/AppTextInput";
import AppButton from "@/components/AppButton";
import {Controller, useForm} from "react-hook-form";
import {api} from "@/constants/axios";
import {useState} from "react";
import {router} from "expo-router";
import * as SecureStore from "expo-secure-store";

export default function LoginScreen() {
    const { control,
        handleSubmit,
        formState: { isValid }
    } = useForm();

    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false);
    const onSubmit = async (data: any) => {
        setLoading(true);
        try {
            const response = await api.post("/login", data);
            console.log(response.data);
            await SecureStore.setItemAsync("token",JSON.stringify(response.data));
            router.replace("/home");
        } catch (err) {
            setError("Invalid email or password");
            console.log(err);
        } finally {
            setLoading(false);
        }
    }

    if(loading){
        return(
            <View className="bg-black items-center justify-center" style={{ flex: 1}}>
                <ActivityIndicator size="large" className="relative bottom-20"/>
            </View>
        )
    }

    return (
        <View className="flex-1 bg-black">
            <View className="mt-8 px-5">
                <View className="mb-1">
                    <AppText>Email</AppText>
                    <Controller
                        control={control}
                        name="email"
                        rules={{
                            required: true,
                            pattern: {
                                value: /\S+@\S+\.\S+/,
                                message: "Email is not valid."
                            }
                        }}
                        render={({field}) => (
                            <AppTextInput
                                placeholder="Email"
                                onChangeText={field.onChange}
                                onBlur={field.onBlur}
                                className="mt-3"
                                value={field.value}
                                keyboardType="email-address"
                            />
                        )}/>
                </View>
                <View className="h-px bg-gray-900"/>
                <View className="mt-5 mb-1">
                    <AppText>Password</AppText>
                    <Controller
                        control={control}
                        name="password"
                        rules={{
                            required: true,
                            minLength: 5
                        }}
                        render={({field}) => (
                            <AppTextInput
                                textContentType="password"
                                placeholder="Password"
                                onChangeText={field.onChange}
                                onBlur={field.onBlur}
                                className="mt-3"
                                secureTextEntry={true}
                                value={field.value}
                            />
                        )}/>
                </View>
                <View className="h-px bg-gray-900"/>
                <Pressable className="mt-4 mb-7 items-center active:opacity-30">
                    <AppText className="text-[#0189F9]">Forgot Password?</AppText>
                </Pressable>
                {error &&
                    <AppText className="text-red-600 mb-3 ms-3">{error}</AppText>
                }
                <AppButton
                    title={"Login"}
                    onPress={handleSubmit(onSubmit)}
                    disabled={!isValid}
                />
            </View>
        </View>
    )
}
