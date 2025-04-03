import { createSlice } from "@reduxjs/toolkit";
import Logo1 from "../../assets/logo9.png";
import Logo2 from "../../assets/logo11.png";
import Logo3 from "../../assets/logo12.png";
import Logo4 from "../../assets/logo13.png";
import Logo5 from "../../assets/logo14.png";
import Logo6 from "../../assets/logo15.png";
import Logo7 from "../../assets/logo16.png";
import Logo8 from "../../assets/logo17.png";
import Logo9 from "../../assets/logo18.png";
import Logo10 from "../../assets/logo19.png";

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
            img: Logo1,
            id: 0
        },
        {
            img: Logo2,
            id:1
        },
        {
            img: Logo3,
            id:2
        },
        {
            img: Logo4,
            id:3
        },
        {
            img: Logo5,
            id:4
        },
        {
            img: Logo6,
            id:5
        },
        {
            img: Logo7,
            id:6
        },
        {
            img: Logo8,
            id:7
        },
        {
            img: Logo9,
            id:8
        },
        {
            img: Logo10,
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
