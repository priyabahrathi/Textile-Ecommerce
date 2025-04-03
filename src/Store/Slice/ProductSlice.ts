import { createSlice } from "@reduxjs/toolkit";

const ProductImg = (imageName: string) => `../../src/assets/${imageName}`;

interface Product {
  id: number;
  name: string;
  price: number;
  category:string,
  img: string;
}

interface DataState {
  Products: Product[];
}

const initialState: DataState = {
    Products: [
        { id: 1, name: 'Black Tee', price: 29.99, category: "Men's", img: ProductImg("Shoe.png") },
        { id: 2, name: 'Watch', price: 199.99, category: 'Accessories', img: ProductImg("Shoe.png") },
        { id: 3, name: 'Blue Tee', price: 19.99, category: "Women's", img: ProductImg("Shoe.png") },
        { id: 4, name: 'Bag', price: 49.99, category: "Women's", img: ProductImg("Shoe.png") },
        { id: 5, name: 'Shoes', price: 89.99, category: "Men's", img: ProductImg("Shoe.png") },
        { id: 6, name: 'Watch', price: 99.99, category: 'Accessories', img: ProductImg("Shoe.png") }
    ],
};

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {},
});

export default productSlice.reducer;
