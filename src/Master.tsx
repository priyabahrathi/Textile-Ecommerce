import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "./Store/store";
import Product from "./components/pages/Product/Product";
import ProductDetail from "./components/pages/Product/productDetails/productDetails"; // <-- Import this
import Brand from "./components/pages/Brand/Brand";
import Header from "./components/pages/Header/Header";
import Hero from "./components/pages/Hero/Hero";
import Arrival from "./components/pages/Arrival/arrival";
import WishList from "./components/pages/wishlistPage/wishList";

import Sample from "./components/pages/head/sample";
import { IonApp, IonPage } from "@ionic/react";
import "./Master.css"
import Footer from "./components/pages/Footer/Footer";
import CheckOut from "./components/pages/CheckOut/CheckOut";


const Master: React.FC = () => {
  const currentPage = useSelector((state: RootState) => state.page?.currentPage);
  const selectedProduct = useSelector((state: RootState) => state.selectedProduct.product);

  return (
    <>
    <IonApp>
      {/* <Header /> */}
      {currentPage === "wishlist" ? (
        <WishList />
      ) : currentPage === "products" ? (
        <Product />
      ) : currentPage === "productDetails" ? (
        <ProductDetail />
      ) : currentPage === "arrival" ? (
        <Arrival />
      ) :
      currentPage === "buy" ? (
        <CheckOut />
      ) :
      (
        <>
          <Hero />
          {/* <Arrival /> */}
          <Brand />
          <Footer />
        </>
      )}
          </IonApp>
    </>
  );
};

export default Master;
