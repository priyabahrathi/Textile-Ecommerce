import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../Store/store';
import './Payment.css';
import { IonGrid, IonRow, IonCol, IonIcon } from '@ionic/react';
import { clearBuy } from '../../../Store/Slice/checkout';
import { setPage } from '../../../Store/Slice/pageSlice';
import { getDatabase, ref, push } from 'firebase/database';
import { cart } from 'ionicons/icons';

const Payment: React.FC = () => {
  const dispatch = useDispatch();
  const buyItems = useSelector((state: RootState) => state.buy.items);
  const cartItems = useSelector((state: RootState) => state.cart.items);

  const isBuyNow = buyItems.length > 0;
  const itemsToPay = isBuyNow ? buyItems : cartItems;

  const totalPrice = itemsToPay.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    paymentMethod: '', // cod, upi, card
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const order = {
      userName: form.name,
      productName: itemsToPay.map(item => item.name).join(', '), // combine if multiple items
      quantity: itemsToPay.reduce((sum, item) => sum + item.quantity, 0),
      price: itemsToPay.reduce((sum, item) => sum + item.price * item.quantity, 0),
      status: 'Pending',
      date: new Date().toISOString().split('T')[0],
      email: form.email,
      phone: form.phone,
    };

    try {
      const db = getDatabase(); // Ensure Firebase is initialized
      await push(ref(db, 'orders'), order); // 'orders' is the collection path in Realtime DB

      alert('Payment submitted and order stored successfully!');
      dispatch(clearBuy());
      dispatch(setPage('products'));
    } catch (error) {
      console.error('Firebase error:', error);
      alert('Something went wrong while submitting the order.');
    }
  };

  return (
    <div className="payment-page">
      <div className='cart-header'>
              <button
                className="back-btn"
                onClick={() => {
                  dispatch(setPage("checkout"));
                }}
              >
                ← Back
              </button>
              <h2 className='checkout-head'>Payment</h2>
              <button className='btn-cart'><IonIcon icon={cart} /></button>
            </div>
      
      <IonGrid>
        <IonRow>
          <IonCol sizeXl='4' sizeLg='4' sizeMd="12" sizeSm="12" sizeXs='12'>
            <div className="summary">
              <h3 className='summary-head'>Order Summary</h3>
              {itemsToPay.map(item => (
                <div className='item-list' key={item.id}>
                  <p>{item.name}</p>
                  <p className='bill-item'>  x {item.quantity}</p>
                </div>
              ))}
              <hr />
              <h4 className='pay-total'>Total: ₹{totalPrice.toFixed(2)}</h4>
            </div>
          </IonCol>
          <IonCol sizeXl='8' sizeLg='8' sizeMd="12" sizeSm="12" sizeXs='12'>
            <form className="payment-form" onSubmit={handlePaymentSubmit}>

              <div className='name-phone'>
                <div className='break'>
                  <label htmlFor="">Name</label>
                  <input type="text" className='form-name' name="name" placeholder='Enter Name' value={form.name} onChange={handleInputChange} required />
                </div>
                <div className='break'>
                  <label htmlFor="">Phone</label>
                  <input type="tel" name="phone" placeholder='Enter Phone Number' value={form.phone} onChange={handleInputChange} required />
                </div>
              </div>
              <div className='break'>
                <label htmlFor="">Email</label>
                <input type="email" name="email" placeholder='Enter Email' value={form.email} onChange={handleInputChange} required />
              </div>




              <div className='break'>
                <label htmlFor="">Address</label>
                <textarea name="address" placeholder='Enter Address' value={form.address} onChange={handleInputChange} required />
              </div>

              <div className='break'>
                <label htmlFor="">Payment Method</label>
                <select name="paymentMethod" className="option" value={form.paymentMethod} onChange={handleInputChange}>
                  <option value="" disabled hidden>
                    Select a payment method
                  </option>
                  <div className='option-list'>
                    <option value="cod">Cash on Delivery</option>
                    <option value="upi">UPI</option>
                    <option value="card">Credit/Debit Card</option>
                  </div>
                </select>
              </div>

              <button className='pay-btn' type="submit">Confirm & Pay ₹{totalPrice.toFixed(2)}</button>
            </form>
          </IonCol>


        </IonRow>
      </IonGrid>
    </div>
  );
};

export default Payment;
