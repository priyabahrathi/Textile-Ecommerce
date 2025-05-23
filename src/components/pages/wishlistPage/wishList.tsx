import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../Store/store";
import { IonIcon, IonButton } from "@ionic/react";
import { heart, cart } from "ionicons/icons"; // Removed 'star' as it's not in the table view
import { removeFromWishlist } from "../../../Store/Slice/wishlistSlice";
import { addToCart } from "../../../Store/Slice/cartSlice";
import { setSelectedProduct, clearSelectedProduct } from "../../../Store/Slice/selectedProductSlice";
import { setPage } from "../../../Store/Slice/pageSlice";
import "./wishList.css";
import Header from "../Header/Header";

const WishList: React.FC = () => {
  const wishlist = useSelector((state: RootState) => state.wishlist.items);
  const dispatch = useDispatch();

  // The getStarRating function is no longer needed for the table view
  // const getStarRating = (rating: number = 4) => {
  //   return [...Array(5)].map((_, i) => (
  //     <IonIcon
  //       key={i}
  //       icon={star}
  //       style={{ color: i < rating ? "gold" : "#ccc", fontSize: "1.1rem" }}
  //     />
  //   ));
  // };

  return (
    <>
      <Header />
      <div className="wishlist-container">
        <h2 style={{ textAlign: "left", marginBottom: "1rem" }}>Wishlist</h2> {/* Adjusted heading style */}
        <p style={{ textAlign: "left", marginBottom: "2rem", color: "#666" }}>Home / Wishlist</p> {/* Added breadcrumb */}

        {wishlist.length === 0 ? (
          <div className="empty-wishlist">
            <IonIcon icon={heart} size="large" color="medium" />
            <p>Your wishlist is empty.</p>
            <p>Start adding your favorite products to save them here!</p>
            <IonButton color="primary" onClick={() => dispatch(setPage("products"))}>
              Browse Products
            </IonButton>
          </div>
        ) : (
          <div className="wishlist-table-wrapper"> {/* Add a wrapper for table styling */}
            <table>
              <thead>
                <tr>
                  <th></th> {/* For the 'x' icon */}
                  <th>Product</th>
                  <th>Price</th>
                  <th>Date Added</th>
                  <th>Stock Status</th>
                  <th></th> {/* For the 'Add to Cart' button */}
                </tr>
              </thead>
              <tbody>
                {wishlist.map((product) => (
                  <tr key={product.id}>
                    <td>
                      <IonIcon
                        icon={heart} // Changed to heart as per image for removal
                        className="remove-from-wishlist-icon"
                        onClick={() => dispatch(removeFromWishlist(product.id))}
                      />
                    </td>
                    <td className="product-info-cell">
                      <img
                        src={product.img}
                        alt={product.name}
                        className="wishlist-table-img"
                      />
                      <div className="product-details-text">
                        <h3 className="product-name-table">{product.name}</h3>
                        {/* If you have product categories, you can add them here as per image */}
                        {/* <p className="product-category-table">{product.category}</p> */}
                      </div>
                    </td>
                    <td>₹{product.price.toFixed(2)}</td>
                    <td>{product.dateAdded || 'DD Month YYYY'}</td> {/* You might need to add dateAdded to your product interface */}
                    <td className="stock-status-cell">
                      <span className={product.stockStatus === 'Instock' ? 'in-stock' : 'out-of-stock'}>
                        {product.stockStatus || 'Instock'}
                      </span>
                    </td>
                    <td>
                      <IonButton
                        fill="solid"
                        color="primary"
                        onClick={() => dispatch(addToCart(product))}
                        aria-label="Add to cart"
                        className="add-to-cart-table-btn"
                      >
                        Add to Cart
                      </IonButton>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Wishlist Link and Buttons (below the table) */}
            <div className="wishlist-bottom-actions">
              <div className="wishlist-link-share">
                <label htmlFor="wishlist-link">Wishlist link:</label>
                <input type="text" id="wishlist-link" value="https://www.example.com" readOnly />
                <IonButton fill="outline" className="copy-link-btn">Copy Link</IonButton>
              </div>
              <div className="action-buttons-right">
                <IonButton fill="outline" color="danger" className="clear-wishlist-btn">Clear Wishlist</IonButton>
                <IonButton fill="solid" color="primary" className="add-all-to-cart-btn">Add All To Cart</IonButton>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default WishList;