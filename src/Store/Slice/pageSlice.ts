import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = {
  products: [] as string[], // ✅ Ensure 'products' is an array
};

const pageSlice = createSlice({
  name: "page",
  initialState,
  reducers: {
    setProducts: (state, action: PayloadAction<string[]>) => {
      state.products = action.payload;
    },
  },
});

export const { setProducts } = pageSlice.actions;
export default pageSlice.reducer;
