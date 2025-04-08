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
        { id: 1, name: 'Shirt Men', price:1200, category: "Formals Men", img: productimg("shirt1.png") },
        { id: 2, name: 'Coat Women', price: 1800, category: 'Formals Women', img:productimg("coat.png")  },
        { id: 3, name: 'Hoodie Men', price: 1000, category: "Casuals Men", img:productimg("hoodie.png")  },
        { id: 4, name: 'Shirt Men', price: 800, category: "Ocassions Men", img: productimg("shirt3.png")  },
        { id: 5, name: 'Rain Coat Men', price: 1200, category: "Casuals Men", img: productimg("rain.png")  },
        { id: 6, name: 'Women T-Shirt', price: 700, category: 'Casuals Women', img: productimg("tee2.png")  },
        { id: 7, name: 'Cinched Waist Top', price: 900, category: 'Ocassions Women', img: productimg("top.png") },
        { id: 8, name: 'Blazer Men', price: 2000, category: 'Ocassions Men', img: productimg("blazer3.png") }
    ],
};

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {},
});

export default productSlice.reducer;
