// will import all actions and reducers from the slices
import { login, logout, setToken } from "./userSlice";
import userReducer from "./userSlice";

import { setRoutines, addRoutine } from "./routineSlices";
import routinesReducer from "./routineSlices";

import { setUserDefinedMedicines, addUserDefinedMedicine } from "./userDefinedMedicinesSlice";
import userDefinedMedicinesReducer from "./userDefinedMedicinesSlice";

// now import all types
import type { UserState } from "./userSlice";
import type { RoutinesState } from "./routineSlices";
import type { UserDefinedMedicinesState } from "./userDefinedMedicinesSlice";

// export all actions and reducers from the slices
export {
    login,
    logout,
    setToken,
    userReducer,
    setRoutines,
    addRoutine,
    routinesReducer,
    setUserDefinedMedicines,
    addUserDefinedMedicine,
    userDefinedMedicinesReducer
};

// export all types
export type {
    UserState,
    RoutinesState,
    UserDefinedMedicinesState
};