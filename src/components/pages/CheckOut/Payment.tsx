import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../Store/store';
import './Payment.css';
import { IonGrid, IonRow, IonCol } from '@ionic/react';
import { clearBuy } from '../../../Store/Slice/checkout'; 
import { setPage } from '../../../Store/Slice/pageSlice'; 
import { getDatabase, ref, push } from 'firebase/database';

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
    paymentMethod: 'cod', // cod, upi, card
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
      <h2>Payment</h2>
      <IonGrid>
        <IonRow>
          <IonCol sizeMd="8">
            <form className="payment-form" onSubmit={handlePaymentSubmit}>
              <label>Name:</label>
              <input type="text" name="name" value={form.name} onChange={handleInputChange} required />

              <label>Email:</label>
              <input type="email" name="email" value={form.email} onChange={handleInputChange} required />

              <label>Phone:</label>
              <input type="tel" name="phone" value={form.phone} onChange={handleInputChange} required />

              <label>Address:</label>
              <textarea name="address" value={form.address} onChange={handleInputChange} required />

              <label>Payment Method:</label>
              <select name="paymentMethod" value={form.paymentMethod} onChange={handleInputChange}>
                <option value="cod">Cash on Delivery</option>
                <option value="upi">UPI</option>
                <option value="card">Credit/Debit Card</option>
              </select>

              <button type="submit">Confirm & Pay ₹{totalPrice.toFixed(2)}</button>
            </form>
          </IonCol>

          <IonCol sizeMd="4">
            <div className="summary">
              <h3>Order Summary</h3>
              {itemsToPay.map(item => (
                <div key={item.id}>
                  <p>{item.name} × {item.quantity}</p>
                </div>
              ))}
              <hr />
              <h4>Total: ₹{totalPrice.toFixed(2)}</h4>
            </div>
          </IonCol>
        </IonRow>
      </IonGrid>
    </div>
  );
};

export default Payment;
