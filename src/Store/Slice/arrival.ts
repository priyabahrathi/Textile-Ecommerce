// ProductSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { database } from '../Slice/firebase';
import { ref, onValue } from 'firebase/database';

interface Arrival {
  rating:number;
  id: string;
  name: string;
  price: number;
  category: string;
  img: string;
}

interface ArrivalState {
  Products: Arrival[];
}

const initialState: ArrivalState = {
  Products: []
};

// Async thunk to fetch data
export const fetchProductsFromFirebase = createAsyncThunk(
  'arrival/fetchArrivals',
  async () => {
    return new Promise<Arrival[]>((resolve) => {
      const arrivalRef = ref(database, 'arrival');
      onValue(arrivalRef, (snapshot) => {
        const data = snapshot.val();
        const products: Arrival[] = Object.keys(data).map((key) => ({
          id: key,
          ...data[key]
        }));
        resolve(products);
      });
    });
  }
);

const arrivalSlice = createSlice({
  name: 'arrival',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchProductsFromFirebase.fulfilled, (state, action) => {
      state.Products = action.payload;
    });
  }
});

export default arrivalSlice.reducer;
