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

<<<<<<< HEAD

export type RootState = ReturnType<typeof store.getState>;


export type AppDispatch = typeof store.dispatch;

export default store; 
=======
export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export default store;
>>>>>>> b165f74808ecac9a270b6a032e95e97fb197a864
