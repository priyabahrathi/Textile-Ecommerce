import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setProducts } from "../../Store/Slice/pageSlice"; // ✅ Ensure correct import
import { RootState } from "../../Store/store";
import Header from "./Header";
import "./Hero.css"
import { IonIcon } from "@ionic/react";
import {  pricetags,chevronForward } from 'ionicons/icons';
import { FaTags } from "react-icons/fa";

const Hero: React.FC = () => {
  const dispatch = useDispatch();
  const products = useSelector((state: RootState) => state.page.products);




  return (
    <>
    <div className="hero-section">
    <section className="ion-padding">
      <Header />
      
      <div className="hero-content">
        <h2>Fashion <span className="year">2025</span></h2>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Unde, labore.</p>
        <div className="hero-btn">
        <button className="icon-btn" ><FaTags /></button>
        <div className="arrival-btn"><button>New Arrival<IonIcon icon={chevronForward}></IonIcon> </button></div>
      </div>
      </div>
     
      
   
    </section>
    </div>
    </>
  );
};

export default Hero;
