import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "./Store/store";
import Product from "./components/pages/Product/Product";
import ProductDetail from "./components/pages/Product/productDetails/productDetails";
import Brand from "./components/pages/Brand/Brand";
import Header from "./components/pages/Header/Header"; // Ensure this path is correct
import Hero from "./components/pages/Hero/Hero";
import Arrival from "./components/pages/Arrival/arrival";
import WishList from "./components/pages/wishlistPage/wishList";

// Removed Sample as it's not used in the page rendering logic here
// import Sample from "./components/pages/head/sample";
import { IonApp, IonPage } from "@ionic/react";
import "./Master.css"
import Footer from "./components/pages/Footer/Footer";
import CheckOut from "./components/pages/CheckOut/CheckOut";
import Payment from "./components/pages/CheckOut/Payment";


const Master: React.FC = () => {
  const currentPage = useSelector((state: RootState) => state.page?.currentPage);
  const selectedProduct = useSelector((state: RootState) => state.selectedProduct.product); // Used by ProductDetail

  // Function to render the specific page content based on Redux state
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
      case "checkout": // Both "checkout" and "buy" will lead to the CheckOut component
      case "buy":
        return <CheckOut />;
      case "payment":
        return <Payment />;
      case "home": // Explicitly handle a "home" page state
        return (
          <>
            <Hero />
            
            <Brand />
            <Footer/>
          </>
        );
      default:
        // Default view if currentPage is null, undefined, or unrecognized
        // This will act as your main home/landing page
        return (
          <>
            <Hero />
            
            <Brand />
            <Footer/>
          </>
        );
    }
  };

  return (
    <IonApp>
      {/* Header is now always present at the top */}
      <Header />

      {/* Render the content of the current page */}
      {renderPageContent()}

     
    </IonApp>
  );
};

export default Master;