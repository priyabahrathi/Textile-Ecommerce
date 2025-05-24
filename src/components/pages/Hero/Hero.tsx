import React, { useState } from "react"; // Import useState
import { useDispatch, useSelector } from "react-redux";
import { setPage, setProducts } from "../../../Store/Slice/pageSlice";
import { RootState } from "../../../Store/store";

import "./Hero.css"
import { IonIcon } from "@ionic/react";
import {  pricetags,chevronForward } from 'ionicons/icons';
import { FaTags } from "react-icons/fa";
import Header from "../Header/Header";

// Import Swiper React components and modules
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Pagination, Navigation } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/pagination';
import 'swiper/css/navigation';


const Hero: React.FC = () => {
  const dispatch = useDispatch();
  const products = useSelector((state: RootState) => state.page.products);

  // Define your slide data including image and text content
  const slideData = [
    {
      image: 'https://images.pexels.com/photos/1036069/pexels-photo-1036069.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      heading: 'Fashion <span class="year">2025</span>',
      paragraph: 'One good outfit can make your confident level high,Have a good day with good deals.'
    },
    {
      image: 'https://images.pexels.com/photos/19090/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      heading: 'New Arrivals <span class="year">Now!</span>',
      paragraph: 'Discover the latest trends and freshest styles. Shop now and elevate your wardrobe.'
    },
    {
      image: 'https://images.pexels.com/photos/1478440/pexels-photo-1478440.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      heading: 'Exclusive <span class="year">Offers</span>',
      paragraph: 'Don\'t miss out on our limited-time discounts. Grab your favorites before they\'re gone!'
    }
  ];

  // State to keep track of the active slide's content
  const [activeSlideContent, setActiveSlideContent] = useState(slideData[0]);

  // Handler for when the Swiper changes slides
  const handleSlideChange = (swiper: any) => {
    setActiveSlideContent(slideData[swiper.realIndex]); // swiper.realIndex is important for loop mode
  };


  return (
    <>
    <div className="hero-section">
      <div className="hero-swiper-container">
        <Swiper
          spaceBetween={30}
          effect={'fade'}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          pagination={{
            clickable: true,
          }}
          navigation={false}
          modules={[Autoplay, EffectFade, Pagination, Navigation]}
          loop={false}
          className="mySwiper"
          onSlideChange={handleSlideChange} // Add this event listener
        >
          {slideData.map((slide, index) => (
            <SwiperSlide key={index} className="hero-swiper-slide" style={{ backgroundImage: `url(${slide.image})` }}></SwiperSlide>
          ))}
        </Swiper>
      </div>

      <section className="ion-padding">
        <Header/>
        <div className="hero">
          <div className="hero-content">
            {/* Dynamically render heading and paragraph using activeSlideContent */}
            <h2 dangerouslySetInnerHTML={{ __html: activeSlideContent.heading }}></h2>
            <p>{activeSlideContent.paragraph}</p>
            <div className="hero-buttons">
              <button className="icon-btn" ><FaTags /></button>
              <div className="arr-btn"><button className="arrival-btn" onClick={() => dispatch(setPage("arrival"))}>New Arrival<IonIcon icon={chevronForward}></IonIcon> </button></div>
            </div>
          </div>
        </div>
      </section>
    </div>
    </>
  );
};

export default Hero;