import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "./Store/store";
import Product from "./components/pages/Product/Product";
import ProductDetail from "./components/pages/Product/productDetails/productDetails";
import Brand from "./components/pages/Brand/Brand";
import Header from "./components/pages/Header/Header";
import Hero from "./components/pages/Hero/Hero";
import Arrival from "./components/pages/Arrival/arrival";
import WishList from "./components/pages/wishlistPage/wishList";
import { IonApp } from "@ionic/react";
// import "./Master.css";
import Footer from "./components/pages/Footer/Footer";
import CheckOut from "./components/pages/CheckOut/CheckOut";
import Payment from "./components/pages/CheckOut/Payment";
import OrderHistory from "./components/pages/OrderHistory/OrderHistory";

const Master: React.FC = () => {
  const currentPage = useSelector((state: RootState) => state.page?.currentPage);
  const selectedProduct = useSelector((state: RootState) => state.selectedProduct.product);

  const renderPageContent = () => {
    switch (currentPage) {
      case "wishlist":
        return <WishList />;
      case "products":
        return <Product />;
      case "productDetails":
        return <ProductDetail />;
      case "arrival":
        return <Arrival />;
      case "checkout":
      case "buy":
        return <CheckOut />;
      case "payment":
        return <Payment />;
      case "history":
        return <OrderHistory />;
      case "home":
      default:
        return (
          <>
            <Hero />
            <Brand />
            <Footer />
          </>
        );
    }
  };

  return (
    <IonApp>
      {/* Show Header on all pages except 'home' */}
      {currentPage !== "home" && <Header />}

      {/* Render main content */}
      {renderPageContent()}
    </IonApp>
  );
};

export default Master;
