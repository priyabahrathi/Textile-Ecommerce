import { createSlice } from "@reduxjs/toolkit";
const BrandLogo = (imageName: string) => {
    return new URL(`../../../assets/Brand/${imageName}`, import.meta.url).href;
  };

interface Brand {
  id: number;
  img: any;
}

interface DataState {
  Brands: Brand[];
}

const initialState: DataState = {
    Brands: [
        {
            img: BrandLogo("logo9.png"),
            id: 0
        },
        {
            img: BrandLogo("logo11.png"),
            id:1
        },
        {
            img: BrandLogo("logo12.png"),
            id:2
        },
        {
            img: BrandLogo("logo13.png"),
            id:3
        },
        {
            img: BrandLogo("logo14.png"),
            id:4
        },
        {
            img: BrandLogo("logo15.png"),
            id:5
        },
        {
            img: BrandLogo("logo16.png"),
            id:6
        },
        {
            img: BrandLogo("logo17.png"),
            id:7
        },
        {
            img: BrandLogo("logo18.png"),
            id:8
        },
        {
            img: BrandLogo("logo19.png"),
            id:9
        }
        
      ],
};

const brandSlice = createSlice({
  name: "brand",
  initialState,
  reducers: {},
});

export default brandSlice.reducer;
