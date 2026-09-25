import {type Exercise, type ExerciseSet, useUser} from "../components/UserProvider.tsx";
import {useEffect, useMemo, useState} from "react";
import {api} from "../constants/axios.tsx";
import lunr from "lunr"
import Sidebar from "../components/Sidebar.tsx";
import {ArrowLeft, Plus, PlusCircleIcon, X} from "lucide-react";
import {Link, useNavigate, useNavigation} from "react-router-dom";

export default function NewRoutinePage(){
    const [exercises, setExercises] = useState<Exercise[]>([])
    const [exerciseQuery, setExerciseQuery] = useState("")
    const [selectedExercises, setSelectedExercises] = useState<Exercise[]>([])
    const [routineTitle, setRoutineTitle] = useState<string>("")
    const [exerciseSets, setExerciseSets] = useState<ExerciseSet[]>([])
    const {refreshUser} = useUser()
    const navigate = useNavigate()
    const submittable = selectedExercises.length > 1 && routineTitle.trim() !== ""

    const fetchExercises = async () => {
        try {
            const response = await api.get("/exercises")
            setExercises(response.data);
        } catch (err){
            console.log(err)
        }
    };

    const selectExercise = async (exercise: Exercise) => {
        if(!selectedExercises.includes(exercise)){
            setSelectedExercises([...selectedExercises,exercise]);
        } else {
            setExerciseSets(
                exerciseSets.filter((set) => set.exerciseId !== exercise.id)
            )

            setSelectedExercises(
                selectedExercises.filter(ex => ex !== exercise)
            )
        }
    }

    const removeExerciseSet = (item: ExerciseSet) => {
        setExerciseSets((prev) => prev.filter((set) => set !== item))
    }

    useEffect(() => {
        selectedExercises.forEach((ex) => {
            if(exerciseSets.some((set) => set.exerciseId === ex.id)) {
                return;
            }

            const firstSet: ExerciseSet = {
                setNumber: 1,
                weight: undefined,
                reps: undefined,
                exerciseId: ex.id
            }

            setExerciseSets(prev => [...prev, firstSet])
        })
    },[selectedExercises])

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

    const handleSubmitRoutine = async () => {
        console.log(JSON.stringify({
            name: routineTitle,
            exercises,
            sets: exerciseSets
        }, null, 2))
        try {
            const result = await api.post("/routines", {
                name: routineTitle,
                exercises: selectedExercises
            })

            const routineId = result.data.id

            await api.put(`/routines/${routineId}`, {
                sets: exerciseSets
            })

            await refreshUser()
            navigate("/routines")
        } catch (e) {
            console.log(e);
        }
    }

    return (
        <div className="container-fluid d-flex min-vh-100 p-0 bg-black">
            <Sidebar/>
            <div className="justify-content-center d-flex flex-grow-1 p-4 gap-4">
                <div
                    style={{ width: 726 }}
                >
                    <div className="d-flex justify-content-between">
                        <h4>
                            <Link
                                to="/routines"
                                className="border-0 text-white bg-transparent"
                            >
                                <ArrowLeft className="me-2"/>
                            </Link>
                            Create Routine
                        </h4>
                        <button
                            className={`btn ${submittable ? 'btn-primary' : 'btn-secondary'} rounded-3`}
                            onClick={handleSubmitRoutine}
                            disabled={!submittable}
                        >
                            Save Routine
                        </button>
                    </div>
                    <div className="mt-3">
                        <label htmlFor="routine-title" className="small">Routine Title</label>
                        <input
                            id="routine-title"
                            type="text"
                            value={routineTitle}
                            placeholder="Workout Routine TItle"
                            className="form-control rounded-3 mt-1"
                            onChange={(e) => setRoutineTitle(e.target.value)}
                        />
                    </div>
                    {selectedExercises.length === 0 ? (
                        <div
                            className="card border-0 mt-4 p-4 w-100 rounded-4 d-flex align-items-center justify-content-center"
                            style={{ backgroundColor: "#161618", height: 300 }}
                        >
                            <p className="fw-bold">No Exercises</p>
                            <span className="position-relative text-muted" style={{ bottom: 10 }}>So far, you haven't added any exercises to this routine.</span>
                        </div>
                    ) : (
                        selectedExercises.map((exercise) => {
                            const newExerciseSet: ExerciseSet = {
                                setNumber: exerciseSets.filter((set) => set.exerciseId === exercise.id).length + 1,
                                reps: undefined,
                                weight: undefined,
                                exerciseId: exercise.id
                            }

                            return (
                                <div className="card border-0 rounded-3 mt-4 p-4"
                                     style={{ backgroundColor: "#161618"}}>
                                    <div className="d-flex justify-content-between">
                                <span>
                                    {exercise.name}
                                </span>
                                        <button
                                            className="border-0 bg-transparent"
                                            onClick={() => selectExercise(exercise)}
                                        >
                                            <X/>
                                        </button>
                                    </div>
                                    <div className="mt-3 d-flex justify-content-between">
                                        <span className="text-muted small">SET</span>
                                        <span className="text-muted small">REPS</span>
                                        <span/>
                                    </div>
                                    {exerciseSets.filter((set) => set.exerciseId === exercise.id)
                                        .map((set) => {
                                                return (
                                                    <div className="mt-2 d-flex justify-content-between">
                                                        <div
                                                            className="border items-center d-flex justify-content-center align-items-center rounded"
                                                            style={{ width: 32, height: 32}}
                                                        >
                                                            {set.setNumber}
                                                        </div>
                                                        <input
                                                            placeholder={set.reps}
                                                            className="p-2 bg-transparent border rounded-3"
                                                            style={{ width: "13%" }}
                                                            onChange={(e) =>
                                                                setExerciseSets(prev =>
                                                                    prev.map(s =>
                                                                        s === set
                                                                            ? { ...s, reps: e.target.value }
                                                                            : s
                                                                    )
                                                                )
                                                            }
                                                            value={set.reps}
                                                        />
                                                        <button
                                                            className="border-0 bg-transparent"
                                                            onClick={() => removeExerciseSet(set)}
                                                        >
                                                            <X/>
                                                        </button>
                                                    </div>
                                                )
                                            }
                                        )}
                                    <button
                                        className="btn-secondary w-100 rounded-3 border-0 p-1 mt-4"
                                        onClick={() => setExerciseSets([...exerciseSets, newExerciseSet])}
                                    >
                                        <Plus/>
                                        Add Set
                                    </button>
                                </div>
                            )})
                    )
                    }
                </div>
                <div>
                    <div
                        style={{width: 400, backgroundColor: '#111313'}}
                        className="rounded-4 px-4 pt-4 card border-0 mb-3"
                    >
                        <span className="fw-bold">
                        Summary
                        </span>
                        <div className="mt-2">
                            <p className="text-muted">
                                Exercises
                            </p>
                            <span className="position-relative" style={{ bottom: 15}}>
                            {selectedExercises.length}
                        </span>
                        </div>
                    </div>
                    <div
                        style={{width: 400, backgroundColor: '#111313'}}
                        className="rounded-4 p-4 card border-0"
                    >
                        <span>Library</span>
                        <input
                            type="text"
                            placeholder="Search Exercises"
                            className="mt-2 rounded-3 px-3 py-1"
                            value={exerciseQuery}
                            onChange={(e) => setExerciseQuery(e.target.value)}
                        />
                        <div style={{ height: 1, backgroundColor: "#2C2C2E"}}/>
                        <span className="my-4 text-muted">All Exercises</span>
                        {filteredExercises.map((exercise) => (
                            <button
                                className="btn p-1 d-flex align-items-center"
                                onClick={() => selectExercise(exercise)}
                            >
                                <PlusCircleIcon color="#008CFF"/>
                                <div>
                                    <p>
                                        {exercise.name}
                                    </p>
                                    <span
                                        className="text-muted position-relative" style={{bottom: 10}}
                                    >
                                        {exercise.primaryMuscle.name}
                                    </span>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}