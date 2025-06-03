import React, { useEffect, useState } from 'react';
import { getDatabase, ref, get, child } from 'firebase/database';
import { auth } from '../../../Store/Slice/firebase';
import './OrderHistory.css';

const OrderHistory: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      const user = auth.currentUser;
      if (!user) {
        alert('User not logged in');
        setLoading(false);
        return;
      }

      try {
        const dbRef = ref(getDatabase());
        const snapshot = await get(child(dbRef, `customers/${user.uid}/orders`));
        if (snapshot.exists()) {
          const data = snapshot.val();
          const ordersArray = Object.entries(data).map(([id, order]) => ({
            id,
            ...(typeof order === 'object' && order !== null ? order : {}),
          }));
          setOrders(ordersArray.reverse()); // Latest first
        } else {
          setOrders([]);
        }
      } catch (error) {
        console.error('Error fetching order history:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="order-history-page">
      <h2 className="order-history-title">Order History</h2>
      {loading ? (
        <p>Loading orders...</p>
      ) : orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <div className="order-list-table">
  <table>
    <thead>
      <tr>
        <th>Date</th>
        <th>Total (₹)</th>
        <th>Status</th>
        <th>Payment</th>
        <th>Items</th>
      </tr>
    </thead>
    <tbody>
      {orders.map((order) => (
        <tr key={order.id}>
          <td>{order.date}</td>
          <td>{order.price.toFixed(2)}</td>
          <td>{order.status}</td>
          <td>{order.paymentMethod}</td>
          <td>
            <table className="inner-items-table">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Qty</th>
                  <th>Price (₹)</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item: any, idx: number) => (
                  <tr  key={idx} className='history-data'>
                    <td>{item.name} ({item.size})</td>
                    <td>{item.quantity}</td>
                    <td>{(item.price * item.quantity).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>

      )}
    </div>
  );
};

export default OrderHistory;
