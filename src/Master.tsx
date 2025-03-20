import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "./Store/store";
import Product from "./components/pages/Product/Product";


const Master: React.FC = () => {
  const currentPage = useSelector((state: RootState) => state.page?.currentPage); // Ensure `page` exists
  console.log("currentpagemaster", currentPage);

  switch (currentPage) {
    
      
    default:
      return <Product />; 
  }
};

export default Master;
