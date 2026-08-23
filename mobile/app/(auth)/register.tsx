import {View, Text} from "react-native";
import AppText from "@/components/AppText";
import AppTextInput from "@/components/AppTextInput";
import AppButton from "@/components/AppButton";
import {Controller, useForm} from "react-hook-form";

export default function RegisterScreen() {
    const { control,
        handleSubmit,
        formState: { errors }
    } = useForm();

    const onSubmit = (data) => {
        console.log(data)
        console.log(errors)
    }

    return (
        <View className="flex-1 bg-black">
            <View className="mt-8 px-5">
                <View className="mb-1">
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
                                className="mt-3 mb-1"
                            />
                        )}
                    />
                    {errors.firstName &&
                        <View>
                            <Text>{errors.firstName.message}</Text>
                        </View>}
                    <View className="h-px bg-gray-900"/>
                    <AppText className="mt-5">Last Name</AppText>
                    <Controller
                        control={control}
                        name="lastName"
                        rules={{
                            required: true
                        }}
                        render={({field}) => (
                            <AppTextInput
                                placeholder="Last name"
                                onChangeText={field.onChange}
                                onBlur={field.onBlur}
                                className="mt-3"
                            />
                        )}/>
                </View>
                <View className="h-px bg-gray-900"/>
                <View className="mt-5 mb-1">
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
                            required: true
                        }}
                        render={({field}) => (
                            <AppTextInput
                                textContentType="password"
                                placeholder="Password"
                                onChangeText={field.onChange}
                                onBlur={field.onBlur}
                                className="mt-3"
                                secureTextEntry={true}
                            />
                        )}/>
                </View>
                <View className="h-px bg-gray-900"/>
                <AppText className="mt-5 text-gray-500">By creating an account, you agree to Strain's</AppText>
                <View className="flex-row mb-3">
                    <AppText className="underline text-gray-500">terms & conditions </AppText>
                    <AppText className="text-gray-500">and </AppText>
                    <AppText className="underline text-gray-500">privacy policy.</AppText>
                </View>
                <AppButton title={"Continue"} onPress={handleSubmit(onSubmit)}/>
            </View>
        </View>
    )
}
