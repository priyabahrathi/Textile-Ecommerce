import { createSlice } from "@reduxjs/toolkit";

const productimg = (imageName: string) => {
  return new URL(`../../assets/images/${imageName}`, import.meta.url).href;
};
interface Product {
  id: number;
  title: string;
  price: string;
  image: any;
  rating:number;
}
interface DataState {
  Products: Product[];
}
const initialState: DataState = {
  Products: [
    { id: 1, title: "shoes", price: "350", image:  productimg("3.png"),rating: 4.5 },
    { id: 2, title: "T-Shirt", price: "250", image: productimg("4.png"),rating: 3.5 },
    { id: 3, title: "Hoodie", price: "120", image: productimg("5.png"),rating: 5 },
    { id: 1, title: "T-shirt", price: "350", image:  productimg("6.png"),rating: 4.5 },
    { id: 2, title: "Hoodie", price: "250", image: productimg("5.png"),rating: 3.5 },
    { id: 3, title: "T-shirt", price: "120", image: productimg("4.png"),rating: 5 },
    { id: 1, title: "shoes", price: "350", image:  productimg("3.png"),rating: 4.5 },
    { id: 2, title: "T-shirt", price: "250", image: productimg("4.png"),rating: 3.5 },
    { id: 3, title: "Hoodie", price: "120", image: productimg("5.png"),rating: 5 },
    { id: 1, title: "T-shirt", price: "350", image:  productimg("6.png"),rating: 4.5 },
    { id: 2, title: "Hoodie", price: "250", image: productimg("5.png"),rating: 3.5 },
    { id: 3, title: "shoes", price: "120", image: productimg("3.png"),rating: 5 },
  ],
};
const arrivalSlice = createSlice({
  name: "arrival",
  initialState,
  reducers: {},
});

export default arrivalSlice.reducer;
