// src/Store/Slice/suggestionSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ref, get } from 'firebase/database';
import { database } from '../Slice/firebase'; // Adjust if needed

export interface Product {
  id: string;
  name: string;
  img: string;
  price: string;
}

export const fetchSuggestedProducts = createAsyncThunk('suggestions/fetch', async () => {
  const dbRef = ref(database, 'suggestions'); // 'suggestions' is the path in Realtime DB
  const snapshot = await get(dbRef);

  if (!snapshot.exists()) {
    return [];
  }

  const data = snapshot.val();
  const products: Product[] = Object.entries(data).map(([key, value]: any) => ({
    id: key,
    ...value
  }));

  return products;
});

const suggestionSlice = createSlice({
  name: 'suggestions',
  initialState: {
    suggestions: [] as Product[],
    loading: false,
    error: null as string | null,
  },
  reducers: {},
  extraReducers: builder => {
    builder
      
      .addCase(fetchSuggestedProducts.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSuggestedProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.suggestions = action.payload;
      })
      .addCase(fetchSuggestedProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Error fetching suggestions';
      });
  },
});

export default suggestionSlice.reducer;


