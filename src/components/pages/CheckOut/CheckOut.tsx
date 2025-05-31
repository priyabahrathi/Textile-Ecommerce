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
import { goBack, setPage } from "../../../Store/Slice/pageSlice";
import { cart, closeCircle } from 'ionicons/icons';

const CheckOut: React.FC = () => {
  const dispatch = useDispatch();

  const cartItems = useSelector((state: RootState) => state.cart.items);
  const buyItems = useSelector((state: RootState) => state.buy.items);

  const isBuyNow = buyItems.length > 0;
  const itemsToDisplay = isBuyNow ? buyItems : cartItems;
  const totalItems = itemsToDisplay.reduce((total, item) => total + item.quantity, 0);

  const totalPrice = itemsToDisplay.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const [expandedItem, setExpandedItem] = useState<CartItem | null>(null);
  // const subTotal=(item.price * item.quantity).toFixed(2);
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
    <div className="c-cart-page">
      <div className='cart-header'>
        <button
          className="back-btn"
          onClick={() => dispatch(goBack())}
        >
          ← Back
        </button>

        <h2 className='checkout-head'>{isBuyNow ? 'Product Purchase' : 'Your Cart'}</h2>
        
      </div>


      <IonGrid>
        <IonRow>
          <IonCol>
            <div className="buy-container">
              {itemsToDisplay.length === 0 ? (
                <p>Your cart is empty.</p>
              ) : (
                <div className='card-content'>
                  <IonGrid>
                  <IonRow>
                    {itemsToDisplay.map((item) => (
                      <IonCol
                      className='check-card-container'
                        size="6"
                        sizeMd="4"
                        sizeLg="3"
                        sizeXl='3'
                        key={item.id + ('size' in item && item.size ? item.size : '')}
                      >
                        <div
                          className="buy-card"
                          onClick={() => setExpandedItem(item)}
                        >
                          <div className='buy-data'>
                            <img
                              src={item.img || '/fallback.jpg'}
                              alt={item.name}
                              className="buy-img"
                              style={{width:'100px'}}
                            />
                            <div className="buy-card-details">
                              <div className='buy-price'>₹{item.price}</div>
                              <div className='buy-name'>{item.name}</div>
                              <div className='ratings'>★★★★☆ (4.2)</div>
                                {'size' in item && item.size && <div className='buy-size'>Size: {item.size}</div>}
                              <div></div>
                              <div className="quantity-controls">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDecrement(item);
                                  }}
                                  className="id-btn"
                                  disabled={item.quantity === 1}
                                >
                                  -
                                </button>
                                <span className="quantity">{item.quantity}</span>
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
                              {/* <div className='description'>Lorem ipsum dolor sit amet consectetur adipisicing elit. ratione, rem aliquam iste?</div> */}
                            </div>
                          </div>
                          <button
                            className="remove-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemove(item);
                            }}
                          >
                            <IonIcon icon={closeCircle} />
                          </button>


                          <p className='subtotal'>Sub-Total: ₹{(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                      </IonCol>
                    ))}
                  </IonRow>
                </IonGrid>
                </div>

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



        </IonRow>
        <IonRow>
          <IonCol>
            <div className="card-total">
              <h3 className='total'>Total No of Products : {totalItems} </h3>
              <h3 className="total">Total : ₹{totalPrice.toFixed(2)}</h3>
              <button className="checkout-btn" onClick={() => dispatch(setPage('payment'))}>
                {isBuyNow ? 'Proceed to Payment' : 'Proceed to Checkout'}
              </button>
            </div>

          </IonCol>
        </IonRow>

       
      </IonGrid>
    </div>
  );
};

export default CheckOut;
