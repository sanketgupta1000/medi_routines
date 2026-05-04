import { configureStore } from "@reduxjs/toolkit";
import { routinesReducer, userDefinedMedicinesReducer, userReducer } from "./slices";

const store = configureStore({
    reducer: {
        user: userReducer,
        userDefinedMedicines: userDefinedMedicinesReducer,
        routines: routinesReducer
    }
});

export default store;

// exporting state and dispatch type for intellisense
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;