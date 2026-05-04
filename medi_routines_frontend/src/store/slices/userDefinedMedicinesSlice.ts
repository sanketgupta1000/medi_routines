import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { UserDefinedMedicine } from "../../services/userDefinedMedicineService";

// type of state for user defined medicines
interface UserDefinedMedicinesState
{
    userDefinedMedicines: UserDefinedMedicine[]
};

// actual initial state value
const initialState: UserDefinedMedicinesState =
{
    userDefinedMedicines: []
};

export const userDefinedMedicineSlice = createSlice(
    {
        name: "userDefinedMedicine",
        initialState,
        reducers: {

            // to set the user defined medicines
            // can be used right after getting the user defined medicines
            setUserDefinedMedicines: (state, action: PayloadAction<{userDefinedMedicines: UserDefinedMedicine[]}>)=>
            {
                state.userDefinedMedicines = action.payload.userDefinedMedicines;
            },
            
            // add user defined medicine
            // can be used right after a successful creation of a new medicine
            addUserDefinedMedicine: (state, action: PayloadAction<{userDefinedMedicine: UserDefinedMedicine}>)=>
            {
                state.userDefinedMedicines.push(action.payload.userDefinedMedicine);
            },

            // remove user defined medicine
            // can be used right after a successful deletion of a medicine
            removeUserDefinedMedicine: (state, action: PayloadAction<{userDefinedMedicineId: string}>)=>
            {
                state.userDefinedMedicines = state.userDefinedMedicines.filter(m => m.id !== action.payload.userDefinedMedicineId);
            }

        }
    }
);

export default userDefinedMedicineSlice.reducer;
export const {setUserDefinedMedicines, addUserDefinedMedicine, removeUserDefinedMedicine} = userDefinedMedicineSlice.actions;
export type {UserDefinedMedicinesState};