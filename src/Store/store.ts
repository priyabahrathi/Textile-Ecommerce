import { configureStore } from "@reduxjs/toolkit";
import pageReducer from "./Slice/pageSlice";
import arrivalReducer from "./Slice/arrival"; 
import productReducer from"./Slice/ProductSlice";
import brandReducer from "./Slice/BrandSlice";
export const store = configureStore({
  reducer: {
    page: pageReducer, 
    arrival: arrivalReducer,
    product:productReducer,
    brand:brandReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export default store;
