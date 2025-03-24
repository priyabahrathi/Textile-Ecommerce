import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface PageState {
  currentPage: string;
}

const initialState: PageState = {
  currentPage: "product",
};

const pageSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    goToProduct: (state) => {
      state.currentPage = "product";
    },
    goToBrand: (state) => {
      state.currentPage = "brand";
    },

    
  },
});

export const { goToProduct,goToBrand } = pageSlice.actions;
export default pageSlice.reducer;
