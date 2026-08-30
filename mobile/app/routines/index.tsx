import AppText from "@/components/AppText";
import AppTextInput from "@/components/AppTextInput";
import {Pressable, View} from "react-native";
import {MaterialCommunityIcons} from "@expo/vector-icons";

export default function CreateRoutine(){
    return (
        <View style={{ flex: 1, backgroundColor: "black"}} className="p-4">
            <AppTextInput placeholder="Routine title"/>
            <Pressable>
                <MaterialCommunityIcons name="plus" color="white" size={20}/>
                <AppText>Add exercise</AppText>
            </Pressable>
        </View>
    )
}
