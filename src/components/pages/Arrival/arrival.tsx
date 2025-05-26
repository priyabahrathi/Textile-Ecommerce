import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../Store/store";
import { motion } from "framer-motion";
import { IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonIcon } from "@ionic/react";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import { cart } from "ionicons/icons";
import "./arrival.css";
import { useDispatch } from 'react-redux';
import { fetchProductsFromFirebase } from '../../../Store/Slice/arrival';
import { AppDispatch } from '../../../Store/store';
import Header from "../Header/Header";
const getStars = (rating: number) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (i <= rating) stars.push(<FaStar key={i} color="#FFD700" />);
    else if (i - 0.5 === rating) stars.push(<FaStarHalfAlt key={i} color="#FFD700" />);
    else stars.push(<FaRegStar key={i} color="#FFD700" />);
  }
  return stars;
};

const Arrival: React.FC = () => {
  const Products = useSelector((state: RootState) => state.arrival.Products);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardsPerView, setCardsPerView] = useState(3);
  const [cardWidth, setCardWidth] = useState(300);
  const maxIndex = Math.max(0, Products.length - cardsPerView);
  const minIndex = 0;


  const sliderRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchProductsFromFirebase());
  }, [dispatch]);

  // Update cardsPerView based on screen size
  useEffect(() => {
    const updateCardsPerView = () => {
      const width = window.innerWidth;
      if (width >= 1024) setCardsPerView(3);  // 3 cards for large screens
      else if (width >= 768) setCardsPerView(2);  // 2 cards for medium screens
      else setCardsPerView(1);  // 1 card for small screens
    };

    updateCardsPerView();
    window.addEventListener("resize", updateCardsPerView);
    return () => window.removeEventListener("resize", updateCardsPerView);
  }, []);

  // Update card width based on ref and cards per view
  useEffect(() => {
    const updateCardWidth = () => {
      if (sliderRef.current) {
        const width = sliderRef.current.offsetWidth;
        setCardWidth(width / cardsPerView);
      }
    };

    updateCardWidth();
    window.addEventListener("resize", updateCardWidth);
    return () => window.removeEventListener("resize", updateCardWidth);
  }, [cardsPerView]);

  const nextSlide = () => {
    setCurrentIndex(prev => Math.min(prev + 1, maxIndex));
  };
  const prevSlide = () => {
    setCurrentIndex(prev => Math.max(prev - 1, 0));
  };



  return (
    <>
      <div className="arrival-page">
      
        <div className="arrival-body">
          <h2 className="product-head">New Arrivals</h2>
          <div className="slider-container">
            <button
              className="arrow left"
              onClick={prevSlide}
              disabled={currentIndex === 0}
            >
              ‹
            </button>
            <div className="slider-viewport" ref={sliderRef}>
              {cardWidth > 0 && (
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
                        <img className="card-img" src={product.img} alt={product.name} />
                        <IonCardHeader className="card-head">
                          <IonCardTitle className="card-title">
                            <strong>{product.name}</strong>
                          </IonCardTitle>
                        </IonCardHeader>
                        <IonCardContent className="card-para">
                          <p> &#8377;{product.price}</p>
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
              )}
            </div>
            <button
              className="arrow right"
              onClick={nextSlide}
              disabled={currentIndex === maxIndex}
            >
              ›
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Arrival;
