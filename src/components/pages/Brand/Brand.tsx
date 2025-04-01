import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/autoplay";
import "./Brand.css";
const Brand: React.FC = () => {
  const brandList = [
    "./assets/logo9.png",
    "./assets/logo11.png",
    "./assets/logo12.png",
    "./assets/logo13.png",
    "./assets/logo14.png",
    "./assets/logo15.png",
    "./assets/logo16.png",
    "./assets/logo17.png",
    "./assets/logo18.png",
    "./assets/logo19.png"
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
          breakpoints={{
                  1500:{slidesPerView:5},
                  700:{slidesPerView:2},
                  300:{slidesPerView:1}

          }}
        >
          {brandList.map((logo, index) => (
            <SwiperSlide key={index}>
              <img className="logo" src={logo} alt="" />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      </div>
    </div>


  )

};
export default Brand;