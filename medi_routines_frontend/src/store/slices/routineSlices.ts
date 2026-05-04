import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Routine } from "../../services/routineService";
import type { Taken } from "../../services/takenService";

// type of state for the routines
interface RoutinesState
{
    routines: Routine[];
}

// the actual initial state value
const initialState: RoutinesState =
{
    routines: [],
};

export const routinesSlice = createSlice(
    {
        name: 'routine',
        initialState,
        reducers:{

            // to allow setting of routines
            // can be used right after getting the user's routines
            setRoutines: (state, action: PayloadAction<{routines: Routine[]}>)=>
            {
                state.routines = action.payload.routines;
            },

            // to add a routine
            // can be used after a successful creation of a new routine
            addRoutine: (state, action: PayloadAction<{routine: Routine}>)=>
            {
                state.routines.push(action.payload.routine);
            },

            removeRoutine: (state, action: PayloadAction<{routineId: string}>)=>
            {
                state.routines = state.routines.filter((routine)=>
                {
                    return routine.id !== action.payload.routineId;
                });
            },

            // to add taken medicines
            addTakenMedicines: (state, action: PayloadAction<{routineId: String, takenMedicines: Taken[]}>)=>
            {

                state.routines = state.routines.map((routine)=>
                {
                    if(routine.id===action.payload.routineId)
                    {
                        const newTaken: Taken[] = routine.takenMedicines;
                        action.payload.takenMedicines.forEach((t)=>newTaken.push(t));
                        // create a new routine
                        const updatedRoutine: Routine = {
                            id: routine.id,
                            medicines: routine.medicines,
                            name: routine.name,
                            takenMedicines: newTaken
                        }
                        return updatedRoutine;
                    }
                    else    return routine;
                })

            }
        }
    }
)

export default routinesSlice.reducer;
export const {setRoutines, addRoutine, removeRoutine, addTakenMedicines} = routinesSlice.actions;
export type {RoutinesState};