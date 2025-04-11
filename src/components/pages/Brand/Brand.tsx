import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/autoplay";
import "./Brand.css";
import { useSelector } from "react-redux";
import { RootState } from "../../../Store/store";
import { easeOut, motion, useAnimation } from "framer-motion";
import { useEffect, useRef } from 'react';
import { useInView } from 'framer-motion';

const MotionCard = ({ children }: { children: React.ReactNode }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: false });
  const controls = useAnimation();
  useEffect(() => {
    if (inView) {
      controls.start({ opacity: 1, y: 0 });
    }
    else {
      controls.start({ opacity: 0, y: -100 })
    }
  }, [inView]);
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: -100 }}
      animate={controls}
      transition={{ duration: 1.2, ease: "easeOut" }}

    >{children}</motion.div>
  )
}

const Brand: React.FC = () => {
  const Brands = useSelector((state: RootState) => state.brand.Brands);
  return (

    <div className="pagebrand">
      <div className="page-container">
        <div className="page-name">Famous Brands</div>
        <div className="brand-container">
          <Swiper
            slidesPerView={5}
            loop={true}
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            modules={[Autoplay]}
            breakpoints={{
              1300: { slidesPerView: 5 },
              700: { slidesPerView: 3 },
              300: { slidesPerView: 1 }

            }}
          >
            {Brands.map((logo, index) => (
              <SwiperSlide key={index} className="logo-slide">
                <img className="logo-img" src={logo.img} alt="" />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </div>


  )

};
export default Brand;