import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "./Store/store";
import Product from "./components/pages/Product/Product";
import ProductDetail from "./components/pages/Product/productDetails/productDetails"; // <-- Import this
import Brand from "./components/pages/Brand/Brand";
import Header from "./components/pages/Header";
import Hero from "./components/pages/Hero";
import Arrival from "./components/pages/arrival";
import WishList from "./components/pages/wishlistPage/wishList";

import Sample from "./components/pages/head/sample";
import { IonApp, IonPage } from "@ionic/react";
import "./Master.css"
import Footer from "./components/pages/Footer/Footer";


const Master: React.FC = () => {
  const currentPage = useSelector((state: RootState) => state.page?.currentPage);
  const selectedProduct = useSelector((state: RootState) => state.selectedProduct.product); // <-- Add this

  return (
    <>
    <IonApp>
      {/* <Header /> */}
      {currentPage === "wishlist" ? (
        <WishList />
      ) : selectedProduct ? ( // <-- Show ProductDetail if a product is selected
        <ProductDetail />
      ) : (
        <>
          <Hero />
          <Arrival />
          <Product />
          <Brand />
          <Footer />
        </>
      )}
          </IonApp>
    </>
  );
};

export default Master;
