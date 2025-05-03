// ProductSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { database } from '../Slice/firebase';
import { ref, onValue } from 'firebase/database';

interface Product {
  id: string;
  skinTone: any;
  name: string;
  price: number;
  category: string;
  img: string;
  gender: string; // ✅ Add this line
  outfitType?: string; // Optional if you use it elsewhere
}


interface ProductState {
  Products: Product[];
  genderFilter: string; // ✅ Add this line
}


const initialState: ProductState = {
  Products: [],
  genderFilter: '', // ✅ Default empty value
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
