import {View, Text, Pressable} from "react-native";
import AppText from "@/components/AppText";
import AppTextInput from "@/components/AppTextInput";
import AppButton from "@/components/AppButton";
import {Controller, useForm} from "react-hook-form";

export default function LoginScreen() {
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
                <Pressable className="mt-4 mb-7 items-center active:opacity-30">
                    <AppText className="text-[#0189F9]">Forgot Password?</AppText>
                </Pressable>
                <AppButton title={"Login"} onPress={handleSubmit(onSubmit)}/>
            </View>
        </View>
    )
}
