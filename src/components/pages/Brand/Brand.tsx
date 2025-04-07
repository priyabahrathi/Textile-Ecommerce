import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/autoplay";
import "./Brand.css";
import { useSelector } from "react-redux";
import { RootState } from "../../../Store/store";
const Brand: React.FC = () => {
  const Brands = useSelector((state: RootState) => state.brand.Brands);
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
                  1300:{slidesPerView:5},
                  700:{slidesPerView:3},
                  300:{slidesPerView:1}

          }}
        >
          {Brands.map((logo, index) => (
            <SwiperSlide key={index}>
              <img className="logo" src={logo.img} alt="" />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      </div>
    </div>


  )

};
export default Brand;