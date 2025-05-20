import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../Store/store';
import { increaseQuantity, decreaseQuantity, removeFromCart } from '../../../Store/Slice/checkout';
import './CheckOut.css';
import { IonCol, IonGrid, IonRow } from '@ionic/react';

interface BuyItem {
    id: string;
    name: string;
    price: number;
    img: string;
    quantity: number;
}

const CartPage: React.FC = () => {
    const cartItems = useSelector((state: RootState) => state.buy.items);
    const dispatch = useDispatch();
    const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    const [expandedItem, setExpandedItem] = useState<BuyItem | null>(null);

    useEffect(() => {
        if (cartItems.length > 0 && !expandedItem) {
            setExpandedItem(cartItems[0]);
        }
    }, [cartItems, expandedItem]);



    return (
        <div className="cart-page">
            <h2>Your Cart</h2>
            <IonGrid>
                <IonRow>
                    <IonCol sizeXl='8' sizeLg='8' sizeMd='12' sizeSm='12' sizeXs='12'>
                        <div className='buy-container'>
                            {cartItems.length === 0 ? (
                                <p>Your cart is empty.</p>
                            ) : (
                                <div className="buy-data">
                                    {cartItems.map((item: BuyItem) => (
                                        <div
                                            className="buy-item"
                                            key={item.id}
                                            onClick={() => setExpandedItem(item)}
                                        >
                                            <img src={item.img || '/fallback.jpg'} alt={item.name} className="buy-img" />
                                            <div className='buy-name'>{item.name}</div>
                                            <p className='buy-name'>Price: ₹{item.price}</p>
                                            <div className="quantity-controls buy-name">
                                                <button onClick={(e) => {
                                                    e.stopPropagation();
                                                    dispatch(decreaseQuantity(item.id));
                                                }} className='buy-name id-btn'>-</button>
                                                <span>{item.quantity}</span>
                                                <button onClick={(e) => {
                                                    e.stopPropagation();
                                                    dispatch(increaseQuantity(item.id));
                                                }} className='buy-name id-btn'>+</button>
                                            </div>
                                            <p className='buy-name'>Subtotal: ₹{(item.price * item.quantity).toFixed(2)}</p>
                                            <button
                                                className="remove-btn"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    dispatch(removeFromCart(item.id));
                                                }}
                                            >Remove</button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>


                    </IonCol>
                    <IonCol sizeXl='4' sizeLg='4' sizeMd='12' sizeSm='12' sizeXs='12'>
                        {/* Expanded Product View */}
                        {expandedItem && (
                            <div className="expanded-card">
                                <h3>{expandedItem.name}</h3>
                                <img src={expandedItem.img} alt={expandedItem.name} className="expanded-img" />
                                <div>
                                    <p><strong>Price:</strong> ₹{expandedItem.price}</p>
                                    <p><strong>Quantity:</strong> {expandedItem.quantity}</p>
                                    <p><strong>Total:</strong> ₹{(expandedItem.price * expandedItem.quantity).toFixed(2)}</p>
                                </div>
                                <button onClick={() => setExpandedItem(null)} className="close-expanded-btn">Close</button>
                            </div>
                        )}
                    </IonCol>


                </IonRow>
                <IonRow>
                    <IonCol>
                        <div className="card-total">
                            <h3 className='total'>Total: ₹{totalPrice.toFixed(2)}</h3>
                            <button className="checkout-btn">Proceed to Checkout</button>
                        </div>
                    </IonCol>
                </IonRow>
            </IonGrid>
        </div>
    );
};

export default CartPage;
