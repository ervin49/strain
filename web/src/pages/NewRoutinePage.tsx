import {type Exercise, useUser} from "../components/UserProvider.tsx";
import {useEffect, useMemo, useState} from "react";
import {api} from "../constants/axios.tsx";
import lunr from "lunr"
import Sidebar from "../components/Sidebar.tsx";

export default function NewRoutinePage(){
    const [exercises, setExercises] = useState<Exercise[]>([])
    const [exerciseQuery, setExerciseQuery] = useState("")
    const [selectedExercises, setSelectedExercises] = useState<string[]>([])
    const {user} = useUser()

    const fetchExercises = async () => {
        try {
            const response = await api.get("/exercises")
            setExercises(response.data);
        } catch (err){
            console.log(err)
        }
    };

    const selectExercise = async (exerciseName: string) => {
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


    useEffect(() => {
        fetchExercises()
    },[]);

    return (
        <div className="container-fluid d-flex min-vh-100 p-0 bg-black">
            <Sidebar/>
            <div style={{width: 200}}>
                {exercises.map((exercise) => (
                    <button>{exercise.name}</button>
                ))}
            </div>
        </div>
    )
}