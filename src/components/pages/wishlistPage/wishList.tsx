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
import { clearWishlist } from "../../../Store/Slice/wishlistSlice"; // Import the new action
const WishList: React.FC = () => {
  const wishlist = useSelector((state: RootState) => state.wishlist.items);
  
  const dispatch = useDispatch();
  const addToCartHandler = (product: any) => {
    dispatch(addToCart(product));
    dispatch(setSelectedProduct(product)); // Set the selected product
    alert("Product added to cart");
  };
  const handleClearWishlist = () => {
    dispatch(clearWishlist());
  };

 
  function addAllToCart(wishlist: any): any {
    wishlist.forEach((product: any) => {
      dispatch(addToCart(product));
    });
    dispatch(clearSelectedProduct()); // Clear the selected product
    alert("All products added to cart");
  }



  return (
    <>
      
      <div className="wishlist-container">
        <h3 className="wishlist-title">Your Favourites</h3>
        {wishlist.length === 0 ? (
          <div className="empty-wishlist">
            <IonIcon icon={heart} size="large" color="medium" />
            <p>Your wishlist is empty.</p>
            <p>Start adding your favorite products to save them here!</p>
            <IonButton className="continue-shopping-btn" onClick={() => dispatch(setPage("products"))}>
              Browse Products
            </IonButton>
          </div>
        ) : (
          <div className="wishlist-table-wrapper"> {/* Add a wrapper for table styling */}
            <table>
              <thead>
                <tr>
                  
                  <th>Product</th>
                  <th>Price</th>
                  <th>Date Added</th>
                  <th>Stock Status</th>
                  <th></th>
                  <th></th> 
                </tr>
              </thead>
              <tbody>
                {wishlist.map((product) => (
                  <tr key={product.id}>
                    
                    <td className="product-info-cell">
                      <img
                        src={product.img}
                        alt={product.name}
                        className="wishlist-table-img"
                      />
                      <div className="product-details-text">
                        <h3 className="product-name-table">{product.name}</h3>
                      </div>
                    </td>
                    <td>₹{product.price.toFixed(2)}</td>
                    <td>{product.dateAdded || 'DD Month YYYY'}</td> 
                    <td className="stock-status-cell">
                      <span className={product.stockStatus === 'Instock' ? 'in-stock' : 'out-of-stock'}>
                        {product.stockStatus || 'Instock'}
                      </span>
                    </td>
                    <td>
                      <IonButton className="view-product-btn"
                      onClick={() => {
                        dispatch(setSelectedProduct(product)); // Set the selected product
                        dispatch(setPage("productDetails")); // Navigate to product details page
                      }}
                      fill="clear"
                      >
                        View Product
                      </IonButton>
                    </td>
                    <td>
                     <IonButton fill="clear"
                     className="remove-item-btn"
                      onClick={() => dispatch(removeFromWishlist(product.id))}
                     >
                      Remove Item
                      </IonButton>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Wishlist Link and Buttons (below the table) */}
            <div className="wishlist-bottom-actions">
              <div className="wishlist-link">
                <IonButton
                  fill="clear"
                  onClick={() => dispatch(setPage("products"))}
                  className="continue-shopping-btn"
                >
                  Continue Shopping
                </IonButton>
              </div>
              <div className="action-buttons-right">
                <IonButton
                  fill="outline"
                  color="danger"
                  className="clear-wishlist-btn"
                  onClick={handleClearWishlist} 
                >
                  Clear Wishlist
                </IonButton>
              
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default WishList;