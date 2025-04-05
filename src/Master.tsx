import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "./Store/store";
import Product from "./components/pages/Product/Product";
import Brand from "./components/pages/Brand/Brand";
import Header from "./components/pages/Header";
import Hero from "./components/pages/Hero";
import Arrival from "./components/pages/arrival";
import Footer from "./components/pages/footer";
import Sample from "./components/pages/head/sample";
import { IonApp, IonPage } from "@ionic/react";
import "./Master.css"


const Master: React.FC = () => {
  const currentPage = useSelector((state: RootState) => state.page?.currentPage);
  console.log("currentpagemaster", currentPage);

  return (
    <>
      {/* <IonApp className="appScroll">
        <IonPage id="main-content">
         
        </IonPage>
      </IonApp> */}
      
      <Hero />
          <Arrival />
          <Product />
          <Brand />
          <Footer />
    </>
  );
};

export default Master;
