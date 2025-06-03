// arrival.tsx
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../../Store/store";
import { fetchProductsFromFirebase } from "../../../Store/Slice/ProductSlice"; // Changed import to productSlice
import { IonCard, IonIcon } from "@ionic/react";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import { arrowBackOutline, heart, star } from "ionicons/icons";
import "./arrival.css";
import { setSelectedProduct } from "../../../Store/Slice/selectedProductSlice";
import { goBack, setPage } from "../../../Store/Slice/pageSlice";
import { toggleWishlist } from "../../../Store/Slice/wishlistSlice";
const getStars = (rating: number) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (i <= rating) stars.push(<FaStar key={i} />);
    else if (i - 0.5 === rating) stars.push(<FaStarHalfAlt key={i} />);
    else stars.push(<FaRegStar key={i} />);
  }
  return stars;
};
const Arrival: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
<<<<<<< HEAD

  const Products = useSelector((state: RootState) => state.arrival.Products);

  // Changed selector to product.Products
  const allProducts = useSelector((state: RootState) => state.product.Products); 
=======
  // Changed selector to product.Products
  const allProducts = useSelector((state: RootState) => state.product.Products);

>>>>>>> origin/tryon
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

<<<<<<< HEAD
   const visibleProducts = showAll ? Products : Products.slice(0, 4);

=======
>>>>>>> origin/tryon
  // Sort products by ID (Firebase key) in descending order to get most recent, then take top 10
  const recentProducts = [...allProducts]
    .sort((a, b) => b.id.localeCompare(a.id)) // Sorts by Firebase ID (timestamp based)
    .slice(0, 10); // Takes the top 10 recent products
<<<<<<< HEAD
  // Visible products will now always be from the 'recentProducts' array.
  // The 'Show More/Less' button will still function, but it will toggle
  // between the first 4 of these 10, and all 10.
  //   const visibleProducts = showAll ? recentProducts : recentProducts.slice(0, 4);
=======

  // Visible products will now always be from the 'recentProducts' array.
  // The 'Show More/Less' button will still function, but it will toggle
  // between the first 4 of these 10, and all 10.

  const visibleProducts = showAll ? recentProducts : recentProducts.slice(0, 4);
  const wishlist = useSelector((state: RootState) => state.wishlist.items);
  const isInWishlist = (productId: string) => {
    return wishlist.some(item => item.id === productId);
  };
    const getStarRating = (rating: number = 4) => {
      return [...Array(5)].map((_, i) => (
        <IonIcon
          key={i}
          icon={star}
          className="rating-icon"
          style={{ color: i < rating ? "gold" : "#ccc", fontSize: '1.2rem' }}
        />
      ));
    };

>>>>>>> origin/tryon
  return (
    <div className="arrival-page">
      <div className="arrival-body">
        <div className="arrival-head">
          <button onClick={() => dispatch(goBack())} className="go-back-btn">
            <IonIcon icon={arrowBackOutline} /> Go Back
          </button>
          <h2 className="product-head">New Arrivals</h2>
        </div>

        <div className="grid-card-list">
          {visibleProducts.map((product, index) => (
<<<<<<< HEAD
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
=======
            <IonCard
              key={index}
              className="arr-product"
              onClick={() => {
                dispatch(setSelectedProduct(product));
                dispatch(setPage("productDetails")); // Navigate via Redux state
              }}
            >
              <div className="product-img">
                <div className="bg-style">
                  <img className="card-img" src={product.img} alt={product.name} />
                </div>
              </div>
              <div className="product-content">
                <div className="arr-price">
                  <span>&#8377;{product.price}</span>
                </div>
                <div className="product-name">
                  <div className="brand-name">{product.name}</div>
                  <div className="product-title">{product.name}</div>
                  <div className="product-category">{product.category}</div>
                  <div className="product-description">{product.description}</div>
                </div>
                <div className="action-btn">
                  <div className="ratings">
                    {/* Ensure product.rating exists, otherwise default to 0 */}
                    <div className="p-stars">
                      {getStarRating(product.rating)}
                    </div>
                    <span>(reviews)</span> {/* Removed product.reviews reference */}
                  </div>
                  <div className="wishlist">
                    <button
                      className={`wishlist-btn ${isInWishlist(product.id) ? 'active' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        dispatch(toggleWishlist(product));
                      }}
                    >
                      <IonIcon icon={heart} />
                    </button>
                  </div>
                </div>
              </div>
>>>>>>> origin/tryon
            </IonCard>
          ))}
        </div>
        {/* Show More / Show Less Button */}
        {recentProducts.length > 4 && ( // Condition based on the recent products
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
<<<<<<< HEAD
export default Arrival;
=======

export default Arrival;
>>>>>>> origin/tryon
