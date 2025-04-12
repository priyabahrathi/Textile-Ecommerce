import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../Store/store";
import { motion } from "framer-motion";
import { IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonIcon } from "@ionic/react";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import { cart } from "ionicons/icons";
import "./sample.css";

const getStars = (rating: number) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (i <= rating) stars.push(<FaStar key={i} color="#FFD700" />);
    else if (i - 0.5 === rating) stars.push(<FaStarHalfAlt key={i} color="#FFD700" />);
    else stars.push(<FaRegStar key={i} color="#FFD700" />);
  }
  return stars;
};

const Sample: React.FC = () => {
  const Products = useSelector((state: RootState) => state.arrival.Products);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardsPerView, setCardsPerView] = useState(3);
  const sliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateCardsPerView = () => {
      const width = window.innerWidth;
      if (width >= 1024) setCardsPerView(3);
      else if (width >= 768) setCardsPerView(2);
      else setCardsPerView(1);
    };

    updateCardsPerView();
    window.addEventListener("resize", updateCardsPerView);
    return () => window.removeEventListener("resize", updateCardsPerView);
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + cardsPerView) % Products.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - cardsPerView + Products.length) % Products.length);
  };

  const cardWidth = sliderRef.current
    ? sliderRef.current.offsetWidth / cardsPerView
    : 300;

  return (
    <div className="arrival-body">
      <h2 className="name">New Arrivals</h2>
      <div className="slider-container">
        <button className="arrow left" onClick={prevSlide}>‹</button>
        <div className="slider-viewport" ref={sliderRef}>
          <motion.div
            className="slider-track"
            style={{
              width: `${Products.length * cardWidth}px`,
              transform: `translateX(-${currentIndex * cardWidth}px)`,
            }}
            transition={{ type: "spring", stiffness: 100 }}
          >
            {Products.map((product, index) => (
              <div
                key={index}
                className="slider-card"
                style={{ width: `${cardWidth}px` }}
              >
                <IonCard className="arr-product">
                  <img className="card-img" src={product.image} alt={product.title} />
                  <IonCardHeader>
                    <IonCardTitle className="product-title">
                      <strong>{product.title}</strong>
                    </IonCardTitle>
                  </IonCardHeader>
                  <IonCardContent className="card-para">
                    <p>{product.price}</p>
                    <div className="stars">{getStars(product.rating)}</div>
                  </IonCardContent>
                  <button type="button" className="buy-btn">
                    <IonIcon icon={cart} className="card-icon" />
                    Buy now
                  </button>
                </IonCard>
              </div>
            ))}
          </motion.div>
        </div>
        <button className="arrow right" onClick={nextSlide}>›</button>
      </div>
    </div>
  );
};

export default Sample;
