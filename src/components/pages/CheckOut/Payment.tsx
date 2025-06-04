import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../Store/store';
import './Payment.css';
import { IonGrid, IonRow, IonCol, IonIcon } from '@ionic/react';
import { clearBuy } from '../../../Store/Slice/checkout';
import { goBack, setPage } from "../../../Store/Slice/pageSlice";
import { getDatabase, ref, push, set, get, child } from 'firebase/database';
import { cart } from 'ionicons/icons';
import { auth, googleProvider, database } from '../../../Store/Slice/firebase';
import { signInWithPopup } from "firebase/auth";
import { onAuthStateChanged } from "firebase/auth";

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

  const [user, setUser] = useState<any>(null);
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    paymentMethod: '',
  });

  // Google Sign-In Handler
  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      setUser(user);

      // Check if user exists in DB
      const dbRef = ref(database);
      const snapshot = await get(child(dbRef, `customers/${user.uid}`));
      if (snapshot.exists()) {
        // User exists, load ALL data (name, email, phone, address)
        const data = snapshot.val();
        setForm((prev) => ({
          ...prev,
          name: data.name || user.displayName || "",
          email: data.email || user.email || "",
          phone: data.phone || "",
          address: data.address || "",
        }));
      } else {
        // New user, save to DB (only name/email/photoURL/uid for now)
        await set(ref(database, `customers/${user.uid}`), {
          name: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          uid: user.uid,
        });
        setForm((prev) => ({
          ...prev,
          name: user.displayName || "",
          email: user.email || "",
          phone: "",
          address: "",
        }));
      }
      setStep(2); // Move to payment form
    } catch (error) {
      alert("Google Sign-In failed.");
      console.error(error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const order = {
      userName: form.name,
      items: itemsToPay.map(item => ({
        id: item.id,
        name: item.name,
        size: item.size,
        quantity: item.quantity,
        price: item.price,
      })),
      quantity: itemsToPay.reduce((sum, item) => sum + item.quantity, 0),
      price: itemsToPay.reduce((sum, item) => sum + item.price * item.quantity, 0),
      status: 'Pending',
      date: new Date().toISOString().split('T')[0],
      email: form.email,
      phone: form.phone,
      address: form.address,
      paymentMethod: form.paymentMethod,
      userId: user?.uid || null,
    };
    try {

      // Save order under global orders
      await push(ref(database, 'orders'), order);

      // Save order only under this user's orders
      if (user?.uid) {
        await push(ref(database, `customers/${user.uid}/orders`), order);
      }



      alert('Payment submitted and order stored successfully!');
      dispatch(clearBuy());
      dispatch(setPage('products'));
    } catch (error) {
      console.error('Firebase error:', error);
      alert('Something went wrong while submitting the order.');
    }
  };

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        // Fetch customer data from DB
        const dbRef = ref(database);
        const snapshot = await get(child(dbRef, `customers/${firebaseUser.uid}`));
        if (snapshot.exists()) {
          const data = snapshot.val();
          setForm((prev) => ({
            ...prev,
            name: data.name || firebaseUser.displayName || "",
            email: data.email || firebaseUser.email || "",
            phone: data.phone || "",
            address: data.address || "",
          }));
        } else {
          // New user, save to DB
          await set(ref(database, `customers/${firebaseUser.uid}`), {
            name: firebaseUser.displayName,
            email: firebaseUser.email,
            photoURL: firebaseUser.photoURL,
            uid: firebaseUser.uid,
          });
          setForm((prev) => ({
            ...prev,
            name: firebaseUser.displayName || "",
            email: firebaseUser.email || "",
            phone: "",
            address: "",
          }));
        }
        setStep(2); // Go to payment form
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="payment-page">
      {/* Step Indicator */}
      <div className="step-header">
        <div className={`step-section ${step === 1 ? 'active' : ''}`}>
          <span className="step-number">1</span> Order Summary
        </div>
        <div className={`step-section ${step === 2 ? 'active' : ''}`}>
          <span className="step-number">2</span> Payment
        </div>
      </div>

      <div className='cart-header'>
        <button
          className="back-btn"
          onClick={() => dispatch(goBack())}
        >
          ←Back
        </button>
      </div>

      {/* Step Content */}
      <div className='payment-page-card'>
        <IonGrid>
          <IonRow>
            {/* Step 1: Order Summary */}
            {step === 1 && (
              <IonCol size="12" className="summary-section">
                <div className="summary">
                  <h3 className='summary-head'>Order Summary</h3>
                  {itemsToPay.map(item => (
                    <div className='item-list' key={item.id}>
                      <p>{item.name} ({item.size}) x {item.quantity}</p>
                      <div>{(item.price * item.quantity).toFixed(2)}</div>
                    </div>
                  ))}
                  <hr />
                  <h4 className='pay-total'>Total: ₹{totalPrice.toFixed(2)}</h4>
                  {user ? (
                    <button className='pay-btn' onClick={() => setStep(2)}>
                      Continue
                    </button>
                  ) : (
                    <button className='pay-btn' onClick={handleGoogleSignIn}>
                      Continue with Google
                    </button>
                  )}
                </div>
              </IonCol>
            )}

            {/* Step 2: Payment Form */}
            {step === 2 && (
              <>
                <IonCol size="12" sizeMd="6">
                  <form className="payment-form" onSubmit={handlePaymentSubmit}>
                    <div className='name-phone'>
                      <div className='break'>
                        <label>Name</label>
                        <input type="text" className='field-style' name="name" value={form.name} onChange={handleInputChange} required />
                      </div>
                      <div className='break'>
                        <label>Phone</label>
                        <input type="tel" className='field-style' name="phone" value={form.phone} onChange={handleInputChange} required />
                      </div>
                    </div>
                    <div className='break'>
                      <label>Email</label>
                      <input type="email" className='field-style' name="email" value={form.email} onChange={handleInputChange} required />
                    </div>
                    <div className='break'>
                      <label>Address</label>
                      <textarea className='field-style' name="address" value={form.address} onChange={handleInputChange} required />
                    </div>
                    <div className='break'>
                      <label>Payment Method</label>
                      <select name="paymentMethod" className='field-style' value={form.paymentMethod} onChange={handleInputChange} required>
                        <option value="" disabled hidden>Select a payment method</option>
                        <option value="cod">Cash on Delivery</option>
                        <option value="upi">UPI</option>
                        <option value="card">Credit/Debit Card</option>
                      </select>
                    </div>
                    <div className="step-buttons">
                      <button type="button" className='pay-btn' onClick={() => setStep(1)}>← Back</button>
                      <button type="submit" className='pay-btn'>Confirm & Pay ₹{totalPrice.toFixed(2)}</button>
                    </div>
                  </form>
                </IonCol>

                <IonCol size="12" sizeMd="6" className='offer-container'>
                  <h1 className='offer-head'>Payment Offers</h1>
                  <div className='offer-content'>
                    <div className='offer'>
                      <h2>Online Payment</h2>
                      <p>5% Discount</p>
                    </div>
                    <div className='offer'>
                      <h2>Credit/Debit Cards</h2>
                      <p>10% Discount</p>
                    </div>
                    <div className='offer'>
                      <h2>Membership</h2>
                      <p>Upto 50% Offer & Exciting Gifts</p>
                    </div>
                  </div>
                </IonCol>
              </>
            )}
          </IonRow>
        </IonGrid>
      </div>
    </div>
  );
};
export default Payment;
