import React, { useRef, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../Store/store";
import { motion } from "framer-motion";
import {
  IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonIcon,
} from "@ionic/react";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import { cart } from 'ionicons/icons';
import "./sample.css";
const getStars = (rating: number) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (i <= rating) {
      stars.push(<FaStar key={i} color="#FFD700" />);
    } else if (i - 0.5 === rating) {
      stars.push(<FaStarHalfAlt key={i} color="#FFD700" />);
    } else {
      stars.push(<FaRegStar key={i} color="#FFD700" />);
    }
  }
  return stars;
};
const Sample: React.FC = () => {
  const Products = useSelector((state: RootState) => state.arrival.Products);
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [cardWidth, setCardWidth] = useState(0);
  const [currentScroll, setCurrentScroll] = useState(0);
  const calculateCardWidth = () => {
    const card = trackRef.current?.querySelector(".carousel-card-wrapper") as HTMLElement;
    const style = window.getComputedStyle(trackRef.current as HTMLElement);
    const gap = parseFloat(style.columnGap || "20");
    if (card) setCardWidth(card.offsetWidth + gap);
  };
  const scrollTo = (pos: number) => {
    if (containerRef.current) {
      containerRef.current.scrollTo({ left: pos, behavior: "smooth" });
      setCurrentScroll(pos);
    }
  };
  const handleNext = () => {
    if (containerRef.current && trackRef.current) {
      const maxScroll = trackRef.current.scrollWidth - containerRef.current.offsetWidth;
      const newPos = Math.min(currentScroll + cardWidth, maxScroll);
      scrollTo(newPos);
    }
  };
  const handlePrev = () => {
    if (containerRef.current) {
      const newPos = Math.max(currentScroll - cardWidth, 0);
      scrollTo(newPos);
    }
  };
  useEffect(() => {
    calculateCardWidth();
    window.addEventListener("resize", calculateCardWidth);
    const interval = setInterval(() => {
      handleNext();
    }, 3000); // every 3 seconds
      return () => {
      window.removeEventListener("resize", calculateCardWidth);
      clearInterval(interval);
    };
  }, [cardWidth, currentScroll]); 
  return (
    <div className="arrival-body">
      <h2 className="name">New Arrivals</h2>
      <div className="carousel-wrapper">
        <button className="arrow left" onClick={handlePrev}>←</button>
        <div className="card-carousel-container" ref={containerRef}>
          <div className="carousel-track" ref={trackRef}>
            {Products.map((product, index) => (
              <div className="carousel-card-wrapper" key={index}>
                <IonCard className="product-card">
                  <motion.img
                    className="card-img"
                    alt="product"
                    src={product.image}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1, transition: { duration: 1 } }}
                    viewport={{ once: false }}
                  />
                  <IonCardHeader>
                    <IonCardTitle className="product-title"><strong>{product.title}</strong></IonCardTitle>
                  </IonCardHeader>
                  <IonCardContent className="card-para">
                    <p style={{ color: "#6A0DAD", fontWeight: "bold" }}>${product.price}</p>
                    <div className="stars">{getStars(product.rating)}</div>
                  </IonCardContent>
                  <motion.button type="button" className="buy-btn" whileTap={{ scale: 0.9 }}>
                    <IonIcon icon={cart} className="card-icon" /> Buy now
                  </motion.button>
                </IonCard>
              </div>
            ))}
          </div>
        </div>

        <button className="arrow right" onClick={handleNext}>→</button>
      </div>
    </div>
  );
};
export default Sample;
