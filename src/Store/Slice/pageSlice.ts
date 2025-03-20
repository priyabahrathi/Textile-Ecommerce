import { createSlice } from "@reduxjs/toolkit";

const pageSlice = createSlice({
  name: "page",
  initialState: { currentPage: "product" }, 
  reducers: {
    goToProduct: (state) => {
      state.currentPage = "product";
    },
   
  },
});

export const { goToProduct, } = pageSlice.actions;
export default pageSlice.reducer;
