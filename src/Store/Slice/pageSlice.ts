import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface PageState {
  currentPage: string;
  products?: string[];
}

const initialState: PageState = {
  currentPage: "",
};

const pageSlice = createSlice({
  name: "page",
  initialState,
  reducers: {
    goToProduct: (state) => {
      state.currentPage = "product";
    },
    goToBrand: (state) => {
      state.currentPage = "brand";
    },
    setProducts: (state, action: PayloadAction<string[]>) => {
      state.products = action.payload;
    },
    setPage: (state, action: PayloadAction<string>) => {
      state.currentPage = action.payload;
    },
  },
});

export const { goToProduct, goToBrand, setProducts, setPage } = pageSlice.actions;
export default pageSlice.reducer;
