import { configureStore } from "@reduxjs/toolkit";
import pageReducer from "./Slice/pageSlice";
import brandReducer from "./Slice/pageSlice"; // ❌ This seems incorrect. Fix below.
import arrivalReducer from "./Slice/arrival"; 

export const store = configureStore({
  reducer: {
    page: pageReducer,
    brand: brandReducer,  // Ensure this is the correct reducer (shouldn't reuse pageReducer)
    arrival: arrivalReducer,
  },
});


export type RootState = ReturnType<typeof store.getState>;


export type AppDispatch = typeof store.dispatch;

export default store; 
