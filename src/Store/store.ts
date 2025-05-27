import { configureStore } from "@reduxjs/toolkit";
import pageReducer from "./Slice/pageSlice";
import arrivalReducer from "./Slice/arrival";
import productReducer from "./Slice/ProductSlice";
import brandReducer from "./Slice/BrandSlice";
import suggestionsReducer from "../Store/Slice/suggestions";
import wishlistReducer from './Slice/wishlistSlice';
import selectedProductReducer from './Slice/selectedProductSlice';
import buyReducer from './Slice/checkout';
import cartReducer from "./Slice/cartSlice";

// Define RootState type for type safety (must be defined before usage)
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// --- Wishlist Local Storage Functions ---
const loadWishlistState = () => {
  try {
    const serializedState = localStorage.getItem('wishlist');
    if (serializedState === null) {
      return [];
    }
    return JSON.parse(serializedState);
  } catch (err) {
    console.error("Error loading wishlist from local storage:", err);
    return [];
  }
};

const saveWishlistState = (state: RootState) => {
  try {
    const serializedState = JSON.stringify(state.wishlist.items);
    localStorage.setItem('wishlist', serializedState);
    console.log("Wishlist saved to local storage:", state.wishlist.items);
  } catch (err) {
    console.error("Error saving wishlist to local storage:", err);
  }
};

// --- NEW: Cart Local Storage Functions ---
const loadCartState = () => {
  try {
    const serializedState = localStorage.getItem('cart'); // Use a distinct key for cart
    if (serializedState === null) {
      return []; // Return an empty array if no cart found
    }
    return JSON.parse(serializedState);
  } catch (err) {
    console.error("Error loading cart from local storage:", err);
    return []; // Return empty array on error
  }
};

const saveCartState = (state: RootState) => {
  try {
    // Only save the 'items' array from the cart slice
    const serializedState = JSON.stringify(state.cart.items);
    localStorage.setItem('cart', serializedState); // Use a distinct key for cart
    console.log("Cart saved to local storage:", state.cart.items);
  } catch (err) {
    console.error("Error saving cart to local storage:", err);
  }
};
// --- END NEW Cart Local Storage Functions ---


export const store = configureStore({
  reducer: {
    page: pageReducer,
    arrival: arrivalReducer,
    product: productReducer,
    brand: brandReducer,
    suggestions: suggestionsReducer,
    wishlist: wishlistReducer,
    selectedProduct: selectedProductReducer,
    buy: buyReducer,
    cart: cartReducer, // Your cart reducer
  },
  // Preload the wishlist and NEW cart state from local storage
  preloadedState: {
    wishlist: {
      items: loadWishlistState(),
    },
    cart: { // NEW: Add preloadedState for cart
      items: loadCartState(),
    },
  },
});

// Subscribe to store changes and save both wishlist and cart to local storage
store.subscribe(() => {
  console.log("Redux store state changed.");
  saveWishlistState(store.getState()); // Save wishlist
  saveCartState(store.getState());     // NEW: Save cart
});

export default store;