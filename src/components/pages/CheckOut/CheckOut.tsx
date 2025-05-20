import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../Store/store';
import { incrementQuantity, decrementQuantity, removeFromCart, CartItem } from '../../../Store/Slice/cartSlice';
import './CheckOut.css';
import { IonCol, IonGrid, IonRow } from '@ionic/react';
import { useLocation } from 'react-router-dom';



const CheckOut: React.FC = () => {
  const dispatch = useDispatch();
  const location = useLocation();

  const singleItem = (location.state as { item?: CartItem })?.item;
  const cartItems = useSelector((state: RootState) => state.cart.items);

  const itemsToDisplay: CartItem[] = singleItem ? [{ ...singleItem }] : cartItems;

  const totalPrice = itemsToDisplay.reduce((total, item) => total + item.price * item.quantity, 0);
  const [expandedItem, setExpandedItem] = useState<CartItem | null>(null);

  useEffect(() => {
    if (itemsToDisplay.length > 0 && !expandedItem) {
      setExpandedItem(itemsToDisplay[0]);
    }
  }, [itemsToDisplay, expandedItem]);

  return (
    <div className="cart-page">
      <h2>{singleItem ? 'Product Purchase' : 'Your Cart'}</h2>
      <IonGrid>
        <IonRow>
          <IonCol sizeXl='8' sizeLg='8' sizeMd='12' sizeSm='12' sizeXs='12'>
            <div className='buy-container'>
              {itemsToDisplay.length === 0 ? (
                <p>Your cart is empty.</p>
              ) : (
                <div className="buy-data">
                  {itemsToDisplay.map((item) => (
                    <div
                      className="buy-item"
                      key={item.id + (item.size || '')}
                      onClick={() => setExpandedItem(item)}
                    >
                      <img
                        src={item.img || (item.images && item.images[0]) || '/fallback.jpg'}
                        alt={item.name}
                        className="buy-img"
                      />
                      <div className='buy-name'>{item.name}</div>
                      <p className='buy-name'>Price: ₹{item.price}</p>

                      {!singleItem && (
                        <div className="quantity-controls buy-name">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              dispatch(decrementQuantity({ id: item.id, size: item.size }));
                            }}
                            className='buy-name id-btn'
                          >-</button>
                          <span>{item.quantity}</span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              dispatch(incrementQuantity({ id: item.id, size: item.size }));
                            }}
                            className='buy-name id-btn'
                          >+</button>
                        </div>
                      )}

                      <p className='buy-name'>
                        Subtotal: ₹{(item.price * item.quantity).toFixed(2)}
                      </p>

                      {!singleItem && (
                        <button
                          className="remove-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            dispatch(removeFromCart({ id: item.id, size: item.size }));
                          }}
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </IonCol>

          <IonCol sizeXl='4' sizeLg='4' sizeMd='12' sizeSm='12' sizeXs='12'>
            {expandedItem && (
              <div className="expanded-card">
                <h3>{expandedItem.name}</h3>
                <img
                  src={expandedItem.img || (expandedItem.images && expandedItem.images[0])}
                  alt={expandedItem.name}
                  className="expanded-img"
                />
                <div>
                  <p><strong>Price:</strong> ₹{expandedItem.price}</p>
                  <p><strong>Quantity:</strong> {expandedItem.quantity}</p>
                  <p><strong>Total:</strong> ₹{(expandedItem.price * expandedItem.quantity).toFixed(2)}</p>
                </div>
                <button
                  onClick={() => setExpandedItem(null)}
                  className="close-expanded-btn"
                >
                  Close
                </button>
              </div>
            )}
          </IonCol>
        </IonRow>

        <IonRow>
          <IonCol>
            <div className="card-total">
              <h3 className='total'>Total: ₹{totalPrice.toFixed(2)}</h3>
              <button className="checkout-btn">Proceed to Payment</button>
            </div>
          </IonCol>
        </IonRow>
      </IonGrid>
    </div>
  );
};

export default CheckOut;
