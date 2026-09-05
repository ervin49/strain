import AppTextInput from "@/components/AppTextInput";
import {TextInput, View} from "react-native";
import AppText from "@/components/AppText";

export default function AddExercise(){
    return (
        <View
            style={{ flex: 1, backgroundColor: "black" }}
            className="p-4"
        >
            <TextInput
                className="mt-1 bg-[#2C2C2E] p-2.5 justify-center items-center rounded-lg"
                placeholder="Search Exercise"
            >
            </TextInput>
        </View>
    )
}