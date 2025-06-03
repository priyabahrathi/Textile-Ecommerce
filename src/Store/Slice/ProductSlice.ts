// ProductSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { database } from '../Slice/firebase';
import { ref, onValue } from 'firebase/database';

interface Product {
  id: string;
  // Keep skinTone if it's a property in your Firebase product data and relevant for dresses
  // skinTone: any; // Consider making this more specific if possible (e.g., string)
  name: string;
  price: number;
  category: string;
  img: string;
  gender: 'male' | 'female' | 'both'; // Correct type to match Product.tsx
  // outfitType?: string; // Keep this if you use it, or remove if not needed
  description:string;
  // NEW PROPERTIES TO ADD/UPDATE FROM Product.tsx:
  rating?: number;       // Add this if your products have a rating
  isNew?: boolean;       // Add this if your products have an 'isNew' flag
  stock: number;         // Crucial: This was the missing property causing the error
  fabricType?: string;   // Add this for fabric filtering
  dressStyle?: string;   // Add this for dress style filtering
  occasion?: string;     // Add this for occasion filtering
  colors?: string[];     // Add this for color filtering (array of strings)
}

interface ProductState {
  Products: Product[];
  genderFilter: string;
  categoryFilter: string;
  subcategoryFilter: string;
}

const initialState: ProductState = {
  Products: [],
  genderFilter: '',
  categoryFilter: '',
  subcategoryFilter: '',
};

// Async thunk to fetch data
export const fetchProductsFromFirebase = createAsyncThunk(
  'product/fetchProducts',
  async () => {
    return new Promise<Product[]>((resolve) => {
      const productRef = ref(database, 'products');
      onValue(productRef, (snapshot) => {
        const data = snapshot.val();
        const products: Product[] = Object.keys(data).map((key) => ({
          id: key,
          ...data[key]
        }));
        resolve(products);
      });
    });
  }
);

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchProductsFromFirebase.fulfilled, (state, action) => {
      state.Products = action.payload;
    });
  }
});

export default productSlice.reducer;