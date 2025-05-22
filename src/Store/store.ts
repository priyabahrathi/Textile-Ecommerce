import { configureStore } from "@reduxjs/toolkit";
import pageReducer from "./Slice/pageSlice";
import arrivalReducer from "./Slice/arrival"; 
import productReducer from"./Slice/ProductSlice";
import brandReducer from "./Slice/BrandSlice";
import suggestionsReducer from "../Store/Slice/suggestions";
import wishlistReducer from './Slice/wishlistSlice';
import selectedProductReducer from './Slice/selectedProductSlice';
import buyReducer from './Slice/checkout';import cartReducer from "./Slice/cartSlice"; // <-- Add this import

export const store = configureStore({
  reducer: {
    page: pageReducer, 
    arrival: arrivalReducer,
    product: productReducer,
    brand: brandReducer,
    suggestions: suggestionsReducer,
    wishlist: wishlistReducer,
    selectedProduct: selectedProductReducer,
    buy:buyReducer,
    cart: cartReducer, // <-- Add this line
    
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export default store;
