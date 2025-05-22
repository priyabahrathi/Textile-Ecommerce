import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../Store/store';
import {
  incrementQuantity,
  decrementQuantity,
  removeFromCart,
  CartItem,
} from '../../../Store/Slice/cartSlice';
import {
  increaseQuantity,
  decreaseQuantity,
  removeFromCart as removeFromBuy,
} from '../../../Store/Slice/checkout';
import './CheckOut.css';
import { IonCol, IonGrid, IonIcon, IonRow } from '@ionic/react';
import { setPage } from '../../../Store/Slice/pageSlice';
import { closeCircle } from 'ionicons/icons';

const CheckOut: React.FC = () => {
  const dispatch = useDispatch();

  const cartItems = useSelector((state: RootState) => state.cart.items);
  const buyItems = useSelector((state: RootState) => state.buy.items);

  const isBuyNow = buyItems.length > 0;
  const itemsToDisplay = isBuyNow ? buyItems : cartItems;

  const totalPrice = itemsToDisplay.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const [expandedItem, setExpandedItem] = useState<CartItem | null>(null);

  useEffect(() => {
    if (itemsToDisplay.length > 0) {
      setExpandedItem(itemsToDisplay[0]);
    }
  }, [itemsToDisplay]);


  const handleIncrement = (item: CartItem) => {
    isBuyNow
      ? dispatch(increaseQuantity(item.id))
      : dispatch(incrementQuantity({ id: item.id, size: item.size }));
  };

  const handleDecrement = (item: CartItem) => {
    isBuyNow
      ? dispatch(decreaseQuantity(item.id))
      : dispatch(decrementQuantity({ id: item.id, size: item.size }));
  };

  const handleRemove = (item: CartItem) => {
    isBuyNow
      ? dispatch(removeFromBuy(item.id))
      : dispatch(removeFromCart({ id: item.id, size: item.size }));
  };

  return (
    <div className="cart-page">
       <div className='cart-header'>
              <button
        className="back-btn"
        onClick={() => {
          dispatch(setPage("productDetails"));
        }}
      >
        ← Back
      </button>

      <h2 className='checkout-head'>{isBuyNow ? 'Product Purchase' : 'Your Cart'}</h2>
       </div>


      <IonGrid>
        <IonRow>
          <IonCol sizeXl="8" sizeLg="8" sizeMd="12" sizeSm="12" sizeXs="12">
            <div className="buy-container">
              {itemsToDisplay.length === 0 ? (
                <p>Your cart is empty.</p>
              ) : (
                <table className="buy-table">
                  <thead className="buy-table-head">
                    <tr>
                      <th>Image</th>
                      <th>Name</th>
                      <th>Price</th>
                      <th>Quantity</th>
                      <th>Subtotal</th>
                      <th>Remove</th>
                    </tr>
                  </thead>
                  <tbody className='buy-table-body'>
                    {itemsToDisplay.map((item) => (
                      <tr
                        key={item.id + ('size' in item && item.size ? item.size : '')}
                        onClick={() => setExpandedItem(item)}
                      >
                        <td style={{ width: '60px', height: '60px', objectFit: 'cover' }}>
                          <img
                            src={item.img || '/fallback.jpg'}
                            alt={item.name}
                            className="buy-img"
                          />
                        </td>
                        <td>{item.name}</td>
                        <td>₹{item.price}</td>
                        <td style={{ width: '50px' }}>
                          <div className="quantity-controls">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDecrement(item);
                              }}
                              className="id-btn"
                            >
                              -
                            </button>
                            <span style={{ margin: '0 8px' }}>{item.quantity}</span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleIncrement(item);
                              }}
                              className="id-btn"
                            >
                              +
                            </button>
                          </div>
                        </td>
                        <td>₹{(item.price * item.quantity).toFixed(2)}</td>
                        <td>
                          <button
                            className="remove-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemove(item);
                            }}
                          >
                            <IonIcon icon={closeCircle} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

          </IonCol>

          {/* <IonCol sizeXl="4" sizeLg="4" sizeMd="12" sizeSm="12" sizeXs="12">
            {expandedItem !== null && (
              <div className="expanded-card">
                <h3 className='expanded-name'>{expandedItem.name}</h3>
                <img
                  src={
                    expandedItem.img ||
                    (expandedItem.images && expandedItem.images[0])
                  }
                  alt={expandedItem.name}
                  className="expanded-img"
                />
                <div className='expanded-details'>
                  <p>
                    <strong>Price:</strong> ₹{expandedItem.price}
                  </p>
                  <p>
                    <strong>Quantity:</strong> {expandedItem.quantity}
                  </p>
                  <p>
                    <strong>Total:</strong> ₹
                    {(expandedItem.price * expandedItem.quantity).toFixed(2)}
                  </p>
                </div>
                <button
                  onClick={() => setExpandedItem(null)}
                  className="close-expanded-btn"
                >
                  Close
                </button>
              </div>
            )}
          </IonCol> */}

          <IonCol sizeXl='4' sizeLg='4' sizeMd='12' sizeSm='12' sizeXs='12'>
            <div className="card-total">
              <h3 className="total">Total: ₹{totalPrice.toFixed(2)}</h3>
              <button className="checkout-btn" onClick={() => dispatch(setPage('payment'))}>
                {isBuyNow ? 'Proceed to Payment' : 'Proceed to Checkout'}
              </button>
            </div>
          </IonCol>

        </IonRow>

        {/* <IonRow>
          <IonCol>
            <div className="card-total">
              <h3 className="total">Total: ₹{totalPrice.toFixed(2)}</h3>
              <button className="checkout-btn" onClick={() => dispatch(setPage('payment'))}>
                {isBuyNow ? 'Proceed to Payment' : 'Proceed to Checkout'}
              </button>
            </div>
          </IonCol>
        </IonRow> */}
      </IonGrid>
    </div>
  );
};

export default CheckOut;
