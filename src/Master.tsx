import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "./Store/store";
import Product from "./components/pages/Product/Product";
import Brand from "./components/pages/Brand/Brand";

const Master: React.FC = () => {
  const currentPage = useSelector((state: RootState) => state.page?.currentPage);
  console.log("currentpagemaster", currentPage);

  switch (currentPage) {
    case "brand":
      return <Brand />;

    default:
      return <Product />; 
  }
};

export default Master;
