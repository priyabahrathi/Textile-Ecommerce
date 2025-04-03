import { createSlice } from "@reduxjs/toolkit";
import Shoe from "../../assets/shoe.png";

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
        { id: 1, name: 'Black Tee', price: 29.99, category: "Men's", img: Shoe },
        { id: 2, name: 'Watch', price: 199.99, category: 'Accessories', img: Shoe },
        { id: 3, name: 'Blue Tee', price: 19.99, category: "Women's", img: Shoe },
        { id: 4, name: 'Bag', price: 49.99, category: "Women's", img: Shoe },
        { id: 5, name: 'Shoes', price: 89.99, category: "Men's", img: Shoe },
        { id: 6, name: 'Watch', price: 99.99, category: 'Accessories', img: Shoe }
    ],
};

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {},
});

export default productSlice.reducer;
