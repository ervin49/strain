import AppTextInput from "@/components/AppTextInput";
import {FlatList, Pressable, TextInput, View, Text, Vibration} from "react-native";
import AppText from "@/components/AppText";
import {useEffect, useMemo, useState} from "react";
import {api} from "@/constants/axios";
import AppButton from "@/components/AppButton";
import {MaterialCommunityIcons} from "@expo/vector-icons";
import ExpoHaptics from "expo-haptics/src/ExpoHaptics";
import * as Haptics from "expo-haptics"
import lunr from "lunr"

interface Muscle {
    id: string;
    name: string;
}
interface Exercise {
    id: string;
    name: string;
    equipment: string;
    primaryMuscle: Muscle;
    secondaryMuscles: Muscle[];
}
export default function AddExercise(){
    const [exercises, setExercises] = useState<Exercise[]>([]);
    const [exerciseQuery, setExerciseQuery] = useState("")
    const fetchExercises = async () => {
        try {
            const response = await api.get("/exercises")
            setExercises(response.data);
            console.log(response.data);
        } catch (err){
            console.log(err)
        }
    };

    useEffect( () => {
        fetchExercises()
    },[]);

    const myListEmpty = () => {
        return (
            <View style={{ alignItems: "center" }}>
                <AppText>No data found</AppText>
            </View>
        );
    };

    const [selectedExercises, setSelectedExercises] = useState<string[]>([]);
    const selectExercise = (exerciseName: string) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
        if(!selectedExercises.includes(exerciseName)){
            setSelectedExercises([...selectedExercises,exerciseName]);
        } else {
            setSelectedExercises(
                selectedExercises.filter(exercise => exercise !== exerciseName)
            )
        }
    }

    const exercisesIndex = useMemo(() => {
        if(exercises.length === 0) return null;

        return lunr(function() {
            this.ref("id")
            this.field("name", {boost: 5})
            this.field("equipment", {boost: 3})
            this.field("primaryMuscle", {boost: 1})

            exercises.forEach((exercise) => {
                this.add({
                    id: exercise.id,
                    name: exercise.name,
                    equipment: exercise.equipment,
                    primaryMuscle: exercise.primaryMuscle.name
                })
            });
        })
    },[exercises])

    const filteredExercises = useMemo(() => {
        const trimmed = exerciseQuery.trim();
        if(!trimmed || !exercisesIndex){
            return exercises;
        }

        try{
            const query = trimmed.split(/\s+/)
                .map((term) => `*${term}*`)
                .join(' ')

            const results = exercisesIndex.search(query)
            const matchedIds = new Set(results.map((r) => r.ref))

            return exercises.filter((ex) => matchedIds.has(ex.id))
        } catch {
            return exercises
        }
    },[exercisesIndex, exerciseQuery, exercises])

    return (
        <View
            style={{ flex: 1, backgroundColor: "black" }}
            className="py-4"
        >
            <View className="px-4">
                <TextInput
                    className="mt-1 bg-[#2C2C2E] p-2.5 text-white justify-center items-center rounded-lg"
                    placeholder={`Search Exercise`}
                    value={exerciseQuery}
                    onChangeText={(value) => setExerciseQuery(value)}
                />
                <View className="flex-row justify-between mt-4 gap-5 w-full">
                    <Pressable className="bg-[#2C2C2E] flex-1 py-2 rounded-xl active:opacity-30">
                        <AppText className="text-center">All Equipment</AppText>
                    </Pressable>
                    <Pressable className="bg-[#2C2C2E] flex-1 py-2 rounded-xl active:opacity-30">
                        <AppText className="text-center">All Muscles</AppText>
                    </Pressable>
                </View>
            </View>
            <FlatList
                data={filteredExercises}
                keyExtractor={(exercise) => exercise.id}
                ItemSeparatorComponent={() => <View className="h-px bg-gray-900"/>}
                ListEmptyComponent={myListEmpty}
                ListHeaderComponent={() =>
                    <View className="py-3 mt-3 px-4">
                        <AppText className="text-[#8a8a91]">All exercises</AppText>
                    </View>
                }
                renderItem={({item}) => {
                    const isSelected = selectedExercises.includes(item.name)
                    return (
                        <Pressable onPress={() => selectExercise(item.name)}
                                   className={`p-3 mt-1 justify-between flex-row
                               ${isSelected ? 'bg-[#5567e4]/20' : ''}`}
                        >
                            <View>
                                <AppText className="text-white">{item.name}</AppText>
                                <AppText className="mb-1 text-[#8a8a91] mt-1">{item.primaryMuscle.name}</AppText>
                            </View>
                            {isSelected &&
                                <View className="bg-[#0189F9] w-[26] h-[26] rounded-full justify-center items-center">
                                    <MaterialCommunityIcons name="check" color="white" size={18}/>
                                </View>
                            }
                        </Pressable>
                    )
                }}
            />
            {selectedExercises.length > 0 &&
                <View className="px-5 mb-15 absolute bottom-0 w-full">
                    <Pressable
                        onPress={() => console.log("apasat")}
                        className="w-full bg-[#0189F9] p-2 rounded-lg justify-center items-center"
                    >
                        <AppText>
                            Add {selectedExercises.length} {selectedExercises.length > 1 ?
                            'exercises' : 'exercise'}
                        </AppText>
                    </Pressable>
                </View>
            }
        </View>
    )
}