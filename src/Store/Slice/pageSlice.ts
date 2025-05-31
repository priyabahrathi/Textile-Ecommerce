import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface PageState {
  currentPage: string;
  products?: string[];
  previousPage: string | null;
}

const initialState: PageState = {
  currentPage: "",
  previousPage: null,
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
      goBack(state) {
      const temp = state.currentPage;
      state.currentPage = state.previousPage || "home";
      state.previousPage = temp;
    },
  },
});

export const { goToProduct, goToBrand, setProducts, setPage, goBack } = pageSlice.actions;
export default pageSlice.reducer;
