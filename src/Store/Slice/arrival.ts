import { createSlice } from "@reduxjs/toolkit";

interface Product {
  id: number;
  title: string;
  price: string;
  image: string;
  rating:number;
}

interface DataState {
  Products: Product[];
}

const initialState: DataState = {
  Products: [
    { id: 1, title: "Hoodie", price: "$350", image: "./assets/images/square3.png",rating: 4.5 },
    { id: 2, title: "Black Cap", price: "$250", image: "./assets/images/square27.png",rating: 3.5 },
    { id: 3, title: "LT Bag", price: "$120", image: "./assets/images/square25.png",rating: 5 },
  ],
};

const arrivalSlice = createSlice({
  name: "arrival",
  initialState,
  reducers: {},
});

export default arrivalSlice.reducer;
