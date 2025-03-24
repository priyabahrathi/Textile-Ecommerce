import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/autoplay";
import "./Brand.css";
const Brand: React.FC = () => {
  const brandList = [
    "./assets/logo1.png",
    "./assets/logo2.png",
    "./assets/logo3.png",
    "./assets/logo4.png",
    "./assets/logo5.png",
    "./assets/logo6.png",
    "./assets/logo7.png",
    "./assets/logo8.png",
    "./assets/logo9.png",
    "./assets/logo10.png"
  ];
  return (


    <div className="pagebrand">
      <div className="page-container">
      <h1 className="page-name">Famous Brand</h1>
      <div className="brand-container">
        <Swiper
          slidesPerView={5}
          spaceBetween={20}
          loop={true}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          modules={[Autoplay]}
        >
          {brandList.map((logo, index) => (
            <SwiperSlide key={index}>
              <img src={logo} alt="" />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      </div>
    </div>


  )

};
export default Brand;