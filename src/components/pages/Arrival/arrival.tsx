import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../../Store/store";
import { fetchProductsFromFirebase } from "../../../Store/Slice/arrival";
import { IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonIcon } from "@ionic/react";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import { cart } from "ionicons/icons";
import "./arrival.css";
import { setSelectedProduct } from "../../../Store/Slice/selectedProductSlice";
import { goBack, setPage } from "../../../Store/Slice/pageSlice";
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
  const dispatch = useDispatch<AppDispatch>();

  const Products = useSelector((state: RootState) => state.arrival.Products);

  // Changed selector to product.Products
  const allProducts = useSelector((state: RootState) => state.product.Products); 
  const [showAll, setShowAll] = useState(false);
  const [showScroll, setShowScroll] = useState(false);
  useEffect(() => {
    dispatch(fetchProductsFromFirebase());
  }, [dispatch]);
  useEffect(() => {
    const handleScroll = () => {
      setShowScroll(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

   const visibleProducts = showAll ? Products : Products.slice(0, 4);

  // Sort products by ID (Firebase key) in descending order to get most recent, then take top 10
  const recentProducts = [...allProducts]
    .sort((a, b) => b.id.localeCompare(a.id)) // Sorts by Firebase ID (timestamp based)
    .slice(0, 10); // Takes the top 10 recent products
  // Visible products will now always be from the 'recentProducts' array.
  // The 'Show More/Less' button will still function, but it will toggle
  // between the first 4 of these 10, and all 10.
  //   const visibleProducts = showAll ? recentProducts : recentProducts.slice(0, 4);
  return (
    <div className="arrival-page">
      <div className="arrival-body">
        <div className="arrival-head" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <button onClick={() => dispatch(goBack())}>Go Back</button>
          <h2 className="product-head">New Arrivals</h2>
        </div>
        <div className="grid-card-list">
          {visibleProducts.map((product, index) => (
            <IonCard key={index} className="arr-product" onClick={() => {
              dispatch(setSelectedProduct(product));
              dispatch(setPage("productDetails")); // Navigate via Redux state
            }}>
              <img className="card-img" src={product.img} alt={product.name} />
               <IonCardHeader  className="card-head">
                <IonCardTitle className="card-title">
                  <strong>{product.name}</strong>
                </IonCardTitle>
              </IonCardHeader>
              <IonCardContent className="card-para">
                <p>&#8377;{product.price}</p>
                <div className="stars">{getStars(product.rating)}</div>
              </IonCardContent>
              <button type="button" className="buy-btn">
                <IonIcon icon={cart} className="card-icon" />
                Buy now
              </button>
            </IonCard>
          ))}
        </div>
        {/* Show More / Show Less Button */}
        {Products.length > 4 && (
          <button className="toggle-btn" onClick={() => setShowAll(!showAll)}>
            {showAll ? "Show Less" : "Show More"}
          </button>
        )}
      </div>
      {/* Scroll to Top Button */}
      {showScroll && (
        <button className="scroll-top" onClick={scrollToTop}>
          ↑ Top
        </button>
      )}
    </div>
  );
};
export default Arrival;
