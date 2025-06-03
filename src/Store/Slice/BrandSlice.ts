import { createSlice } from "@reduxjs/toolkit";
const BrandLogo = (imageName: string) => {
    return new URL(`../../../public/assets/Brand/${imageName}`, import.meta.url).href;
  };

interface Brand {
  id: number;
  img: any;
  name?: string; // Optional, in case you want to add brand names later
  link?: string; // Optional, in case you want to add brand links later
}

interface DataState {
  Brands: Brand[];
}

const initialState: DataState = {
    Brands: [
        {
            img: BrandLogo("logo9.png"),
            id: 0,
            name: "Nike Swoosh",
            link: "https://www.nike.com/swoosh"
        },
        {
            img: BrandLogo("logo11.png"),
            id:1,
            name: "Tommy Hilfiger",
            link: "https://usa.tommy.com/en-us/tommy-hilfiger" // Example link
        },
        {
            img: BrandLogo("logo12.png"),
            id:2,
            name: "Adidas",
            link: "https://www.googleadservices.com/pagead/aclk?sa=L&ai=DChcSEwjdr-ejxNSNAxXRIYMDHZ7_JE0YABAGGgJzZg&co=1&gclid=CjwKCAjwl_XBBhAUEiwAWK2hzovxnDyiswBXI6R619jOmclCoNx1Kdmq4aOaiTyU1D2R6az1tWxKxxoCMiIQAvD_BwE&ohost=www.google.com&cid=CAESVuD2tojtM3DsZFkBW8l9ymk8Zvo-v0PbI-PWZo0hQOqgBfUA491-z3RKqvMD2o07YXvxvZAqXZBir6j1enJ6YeP_T6m9FHRP_8EN2IiQqTMnA5LiT5vF&category=acrcp_v1_40&sig=AOD64_0ZaIuw3pRnKOFfJxW3DUhKWDv_QA&q&adurl&ved=2ahUKEwiahuKjxNSNAxVo1DgGHVGTHhoQ0Qx6BAgLEAE"
        },
        {
            img: BrandLogo("logo13.png"),
            id:3,
            name: "Timberland",
            link: "https://www.timberland.com/en-us?srsltid=AfmBOoqZwEoBoqr0h_t30KU62S1Ck5solcMCYv2eMVXd-HzEqkRJCopl"
        },
        
        {
            img: BrandLogo("logo14.png"),
            id:4,
            name: "Gucci",
            link: "https://www.gucci.com/us/en/?srsltid=AfmBOoq4-4V9sszlupnWK6wdNDkfbmZm_8lveYE-wGT5Y1ffXZ8-7SgF"
        }

      ],
};

const brandSlice = createSlice({
  name: "brand",
  initialState,
  reducers: {},
});

export default brandSlice.reducer;
