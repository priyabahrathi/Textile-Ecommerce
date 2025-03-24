import { configureStore } from "@reduxjs/toolkit";
import pageReducer from "./Slice/pageSlice";
import brandReducer from "./Slice/pageSlice";

export const store = configureStore({
  reducer: {
    page: pageReducer,
    brand: pageReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
