import {ActivityIndicator, Text, View} from "react-native";
import AppText from "@/components/AppText";
import AppTextInput from "@/components/AppTextInput";
import AppButton from "@/components/AppButton";
import {Controller, useForm} from "react-hook-form";
import {api} from "@/constants/axios";
import {MaterialCommunityIcons} from "@expo/vector-icons";
import * as SecureStore from "expo-secure-store"
import {useState} from "react";
import {AxiosError} from "axios";

type RegisterFormValues = {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
};

export default function RegisterScreen() {
    const { control,
        handleSubmit,
        formState: { errors, isValid }
    } = useForm<RegisterFormValues>({
        mode: 'onChange'
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>("");

    const onSubmit = async (data: any) => {
        setLoading(true);
        try{
            const response = await api.post("/register",data);
            await SecureStore.setItemAsync("token",JSON.stringify(response.data));
            console.log(response.data);
        } catch (err: any){
            console.log(err);
            setError(err.data);
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
                    {error &&
                        <View className="bg-red-800">
                            <Text className="text-red-400">{error}</Text>
                        </View>
                    }
                    <AppText>First Name</AppText>
                    <Controller
                        control={control}
                        name="firstName"
                        rules={{
                            required: "First name is required"
                        }}
                        render={({field}) => (
                            <AppTextInput
                                placeholder="First name"
                                onChangeText={field.onChange}
                                onBlur={field.onBlur}
                                value={field.value}
                                className="mt-3 mb-1"
                            />
                        )}
                    />
                    <View className="h-px bg-gray-900"/>
                    {errors.firstName &&
                        <View className="flex-row items-center">
                            <MaterialCommunityIcons
                                name="alert-circle-outline"
                                size={18}
                                className="me-2"
                                color="#f87171"
                            />
                            <AppText className="bg-red-950 text-red-400 rounded">
                                {errors.firstName.message}
                            </AppText>
                        </View>
                    }
                    <AppText className="mt-5">Last Name</AppText>
                    <Controller
                        control={control}
                        name="lastName"
                        rules={{
                            required: "Last name is required"
                        }}
                        render={({field}) => (
                            <AppTextInput
                                placeholder="Last name"
                                onChangeText={field.onChange}
                                onBlur={field.onBlur}
                                value={field.value}
                                className="mt-3"
                            />
                        )}/>
                </View>
                <View className="h-px bg-gray-900"/>
                {errors.lastName &&
                    <View className="flex-row items-center">
                        <MaterialCommunityIcons
                            name="alert-circle-outline"
                            size={18}
                            className="me-2"
                            color="#f87171"
                        />
                        <AppText className="bg-red-950 text-red-400 rounded">
                            {errors.lastName.message}
                        </AppText>
                    </View>
                }
                <View className="mt-5 mb-1">
                    <AppText>Email</AppText>
                    <Controller
                        control={control}
                        name="email"
                        rules={{
                            required: "Email is required",
                            pattern: {
                                value: /\S+@\S+\.\S+/,
                                message: "Email is not valid"
                            }
                        }}
                        render={({field}) => (
                            <AppTextInput
                                placeholder="Email"
                                onChangeText={field.onChange}
                                onBlur={field.onBlur}
                                value={field.value}
                                className="mt-3"
                                keyboardType="email-address"
                            />
                        )}/>
                    <View className="h-px bg-gray-900"/>
                    {errors.email &&
                        <View className="flex-row items-center">
                            <MaterialCommunityIcons name="alert-circle-outline"
                                                    size={18}
                                                    className="me-2"
                                                    color="#f87171"
                            />
                            <AppText className="bg-red-950 text-red-400 rounded">
                                {errors.email.message}
                            </AppText>
                        </View>
                    }
                </View>
                <View className="mt-5 mb-1">
                    <AppText>Password</AppText>
                    <Controller
                        control={control}
                        name="password"
                        rules={{
                            required: "Password is required",
                            minLength: {
                                value: 8,
                                message: "Password must be at least 8 characters long."
                            },
                            validate: {
                                hasUppercase: (val: string) => /[A-Z]/.test(val) ||
                                    "Password must have at least one uppercase letter",
                                hasSpecialChar: (val: string) => /[^A-Za-z0-9 ]/.test(val) ||
                                    "Password must have at least one special character",
                            }
                        }}
                        render={({field}) => (
                            <AppTextInput
                                textContentType="password"
                                placeholder="Password"
                                onChangeText={field.onChange}
                                onBlur={field.onBlur}
                                value={field.value}
                                className="mt-3"
                                secureTextEntry={true}
                            />
                        )}/>
                </View>
                <View className="h-px bg-gray-900"/>
                {errors.password &&
                    <View className="flex-row items-center me-10">
                        <MaterialCommunityIcons
                            name="alert-circle-outline"
                            size={18}
                            className="me-2"
                            color="#f87171"
                        />
                        <AppText className="bg-red-950 text-red-400 rounded ">
                            {errors.password.message}
                        </AppText>
                    </View>
                }
                <AppText className="mt-5 text-gray-500 text-base">By creating an account, you agree to Strain's</AppText>
                <View className="flex-row mb-3">
                    <AppText className="underline text-gray-500 text-base">terms & conditions </AppText>
                    <AppText className="text-gray-500 text-base">and </AppText>
                    <AppText className="underline text-gray-500 text-base">privacy policy.</AppText>
                </View>
                <AppButton
                    title={"Continue"}
                    onPress={handleSubmit(onSubmit)}
                    disabled={!isValid}
                />
            </View>
        </View>
    )
}
