import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../Store/store";
import { motion } from "framer-motion"; // ✅ Import Framer Motion
import { IonGrid, IonRow, IonCol, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonIcon } from "@ionic/react";
import "./arrival.css";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa"; // ✅ Import star icons
import {  card, cart,  } from 'ionicons/icons';


// ✅ Correct getStars() function
const getStars = (rating: number) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (i <= rating) {
      stars.push(<FaStar key={i} color="#FFD700" />); // Full star
    } else if (i - 0.5 === rating) {
      stars.push(<FaStarHalfAlt key={i} color="#FFD700" />); // Half star
    } else {
      stars.push(<FaRegStar key={i} color="#FFD700" />); // Empty star
    }
  }
  return stars;
};

// Animation Variants
const fadeUpVariant = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 1 } },
};
const Arrival: React.FC = () => {
  const Products = useSelector((state: RootState) => state.arrival.Products);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardsPerView, setCardsPerView] = useState(3);
  const [cardWidth, setCardWidth] = useState(300);
  const sliderRef = useRef<HTMLDivElement>(null);

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
    setCurrentIndex((prev) => (prev + cardsPerView) % Products.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - cardsPerView + Products.length) % Products.length);
  };

  return (
    <>
    <motion.div
      className="arrival-body"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: 0.3 }}
    >
      <motion.h2 className="name" variants={fadeUpVariant}>
        New Arrivals
      </motion.h2>

      <IonGrid>
        <IonRow>
          {Products.map((product, index) => (
            <IonCol key={index} size='12' sizeMd='4' sizeXl='4'>
              <motion.div variants={fadeUpVariant}>
                <div className="card-body ">
                <IonCard className="product-card ">
                  <motion.img className="card-img"
                    alt="product images"
                    src={product.image}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1, transition: { duration: 1 } }}
                    viewport={{ once: false }}
                  />
                  <IonCardHeader>
                    <IonCardTitle className="product-title"><strong>{product.title}</strong></IonCardTitle>
                  </IonCardHeader>
                  <IonCardContent className="card-para">
                    <p >{product.price}</p>
                    <div className="stars">{getStars(product.rating)}</div> {/* ✅ Fixed Star Ratings */}
                  </IonCardContent>
                  <motion.button
                    type="button"
                    className="buy-btn"
                    whileTap={{ scale: 0.9 }}
                  ><IonIcon icon={cart} className="card-icon" />
                    Buy now
                  </motion.button>
                </IonCard>
                </div>
              </motion.div>
            </IonCol>
          ))}
        </IonRow>
      </IonGrid>
    </motion.div>
    </>
  );
};
export default Arrival;
