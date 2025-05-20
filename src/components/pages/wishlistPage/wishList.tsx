import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../Store/store";
import { IonIcon, IonButton } from "@ionic/react";
import { heart, cart } from "ionicons/icons";
import { removeFromWishlist } from "../../../Store/Slice/wishlistSlice";
import "./wishList.css";
import Header from "../Header/Header";

const WishList: React.FC = () => {
  const wishlist = useSelector((state: RootState) => state.wishlist.items);
  const dispatch = useDispatch();

  return (
    <>
      <Header />
      <div className="wishlist-container">
        <h2>My Wishlist</h2>
        {wishlist.length === 0 ? (
          <div className="empty-wishlist">
            <IonIcon icon={heart} size="large" color="medium" />
            <p>Your wishlist is empty.</p>
            <p>Start adding your favorite products to save them here!</p>
          </div>
        ) : (
          <div className="wishlist-grid">
            {wishlist.map((product) => (
              <div className="wishlist-card" key={product.id}>
                <img
                  src={product.img}
                  alt={product.name}
                  className="wishlist-img"
                />
                <div className="wishlist-info">
                  <h3 className="product-name">{product.name}</h3>
                  <p className="product-price">₹{product.price.toFixed(2)}</p>
                  <div className="wishlist-actions">
                    <IonButton
                      fill="clear"
                      color="danger"
                      onClick={() => dispatch(removeFromWishlist(product.id))}
                      aria-label="Remove from wishlist"
                    >
                      <IonIcon icon={heart} />
                    </IonButton>
                    <IonButton fill="solid" color="primary" aria-label="Add to cart">
                      <IonIcon icon={cart} slot="start" />
                      Add to Cart
                    </IonButton>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default WishList;
