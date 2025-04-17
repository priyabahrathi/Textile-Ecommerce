// ProductSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { database } from '../Slice/firebase';
import { ref, onValue } from 'firebase/database';

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  img: string;
}

interface ProductState {
  Products: Product[];
}

const initialState: ProductState = {
  Products: []
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
