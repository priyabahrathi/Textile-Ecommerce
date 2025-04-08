import { createSlice } from "@reduxjs/toolkit";

const productimg = (imageName: string) => {
  return new URL(`../../assets/Product/${imageName}`, import.meta.url).href;
};
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
        { id: 1, name: 'Black Tee', price: 29.99, category: "Men's", img: productimg("tee1.png") },
        { id: 2, name: 'Watch', price: 199.99, category: 'Accessories', img:productimg("watch1.png")  },
        { id: 3, name: 'Blue Tee', price: 19.99, category: "Women's", img:productimg("tee2.png")  },
        { id: 4, name: 'Bag', price: 49.99, category: "Women's", img: productimg("bag1.png")  },
        { id: 5, name: 'Shoes', price: 89.99, category: "Men's", img: productimg("shoe2.png")  },
        { id: 6, name: 'Watch', price: 99.99, category: 'Accessories', img: productimg("watch2.png")  }
    ],
};

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {},
});

export default productSlice.reducer;
