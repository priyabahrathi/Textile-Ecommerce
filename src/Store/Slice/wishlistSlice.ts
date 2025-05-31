// src/Store/Slice/wishlistSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  img: string;
  gender: 'male' | 'female' | 'both';
  rating?: number;
  isNew?: boolean;
  stock: number;
  fabricType?: string;
  dressStyle?: string;
  occasion?: string;
  colors?: string[];
  dateAdded?: string; // Add this if you're using it in the wishlist table
  stockStatus?: string; // Add this if you're using it in the wishlist table
}

interface WishlistState {
  items: Product[];
}

const initialState: WishlistState = {
  items: [],
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    toggleWishlist: (state, action: PayloadAction<Product>) => {
      const product = action.payload;
      const existingItem = state.items.find(item => item.id === product.id);

      if (existingItem) {
        state.items = state.items.filter(item => item.id !== product.id);
      } else {
        state.items.push(product);
      }
    },
    removeFromWishlist: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
    },
    // NEW REDUCER: Clears all items from the wishlist
    clearWishlist: (state) => {
      state.items = [];
    },
    
  },
});

export const { toggleWishlist, removeFromWishlist, clearWishlist } = wishlistSlice.actions; // Export the new action
export default wishlistSlice.reducer;