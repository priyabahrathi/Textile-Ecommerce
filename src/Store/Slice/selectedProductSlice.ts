import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const selectedProductSlice = createSlice({
  name: 'selectedProduct',
  initialState: { product: null as any },
  reducers: {
    setSelectedProduct: (state, action: PayloadAction<any>) => {
      state.product = action.payload;
    },
    clearSelectedProduct: (state) => {
      state.product = null;
    },
  },
});

export const { setSelectedProduct, clearSelectedProduct } = selectedProductSlice.actions;
export default selectedProductSlice.reducer;