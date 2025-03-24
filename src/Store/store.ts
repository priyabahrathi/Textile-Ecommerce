import { configureStore } from "@reduxjs/toolkit";
import pageReducer from "../Store/Slice/pageSlice"; 
import arrivalReducer from "../Store/Slice/arrival"

export const store = configureStore({
  reducer: {
    page: pageReducer, 
    arrival: arrivalReducer,
  },
});

// ✅ RootState represents the **entire Redux state**
export type RootState = ReturnType<typeof store.getState>;

// ✅ AppDispatch is the type for dispatch
export type AppDispatch = typeof store.dispatch;

export default store; // ✅ Default export
