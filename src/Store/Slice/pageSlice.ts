import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface PageState {
  currentPage: string;
  products?: string[]; // Added 'products' field since it's used in reducers
}

const initialState: PageState = {
  currentPage: "",
};

const pageSlice = createSlice({
  name: "page", // Fixed duplicate 'name' field
  initialState,
  reducers: {
    goToProduct: (state) => {
      state.currentPage = "product";
    },
    goToBrand: (state) => {
      state.currentPage = "brand";
    },
    setProducts: (state, action: PayloadAction<string[]>) => {
      state.products = action.payload; // Keeps 'setProducts' functionality
    },
  },
});

export const { goToProduct, goToBrand, setProducts } = pageSlice.actions;
export default pageSlice.reducer;
