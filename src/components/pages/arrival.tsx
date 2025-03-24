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

  return (
    <motion.div
      className="body"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: 0.3 }}
    >
      <motion.h2 className="name" variants={fadeUpVariant}>
        New Arrivals
      </motion.h2>

      <IonGrid fixed>
        <IonRow>
          {Products.map((product, index) => (
            <IonCol key={index} size="12" sizeMd="4" sizeLg="4">
              <motion.div variants={fadeUpVariant}>
                <IonCard className="New-arrivals">
                  <motion.img className="card-img"
                    alt="product images"
                    src={product.image}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1, transition: { duration: 1 } }}
                    viewport={{ once: false }}
                  />
                  <IonCardHeader>
                    <IonCardTitle><strong>{product.title}</strong></IonCardTitle>
                  </IonCardHeader>
                  <IonCardContent>
                    <p >{product.price}</p>
                    <div className="stars">{getStars(product.rating)}</div> {/* ✅ Fixed Star Ratings */}
                  </IonCardContent>
                  <motion.button
                    type="button"
                    className="buy-btn"
                    whileTap={{ scale: 0.9 }}
                  ><IonIcon icon={cart} />
                    Buy now
                  </motion.button>
                </IonCard>
              </motion.div>
            </IonCol>
          ))}
        </IonRow>
      </IonGrid>
    </motion.div>
  );
};

export default Arrival;
