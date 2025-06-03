import React, { useEffect, useState } from 'react';
import { getDatabase, ref, get, child } from 'firebase/database';
import { auth } from '../../../Store/Slice/firebase';
import './OrderHistory.css';
import { IonButton, IonButtons, IonContent, IonHeader, IonModal, IonTitle, IonToolbar } from '@ionic/react';
type Order = {
    id: string;
    userName: string;
    items: {
        id: string;
        name: string;
        size?: string;
        price: number;
        quantity: number;
    }[];
    productName: string | string[];
    quantity: number;
    price: number;
    status: 'Pending' | 'Approved' | 'delivered';
    date: string;
    email?: string;
    phone?: string;
    productImage?: string;
    size?: string;
    address?: string;
};
const OrderHistory: React.FC = () => {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [filterStatus, setFilterStatus] = useState<'All' | 'Pending' | 'Approved' | 'delivered'>('All');


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
            <h2 className="history-title">Order History</h2>
            <div className="history-filter-buttons">
                {['All', 'Pending', 'Approved', 'delivered'].map((status) => (
                    <button
                        key={status}
                        className={`filter-btn ${filterStatus === status ? 'active' : ''}`}
                        onClick={() => setFilterStatus(status as any)}
                    >
                        {status}
                    </button>
                ))}
            </div>

            {loading ? (
                <p>Loading orders...</p>
            ) : orders.length === 0 ? (
                <p>No orders found.</p>
            ) : (
                <div className="history-list-table">
                    <table className='history-table'>
                        <thead className='history-table-head'>
                            <tr>
                                <th>Date</th>
                                <th>Total (₹)</th>
                                <th>Status</th>
                                <th>Payment</th>
                                <th>Items</th>
                            </tr>
                        </thead>
                        <tbody className='history-table-body'>
                            {orders
                                .filter(order => filterStatus === 'All' || order.status === filterStatus)
                                .map((order) => (

                                    <tr key={order.id} className='history-table-row'>
                                        <td>{order.date}</td>
                                        <td>{order.price.toFixed(2)}</td>
                                        <td>{order.status}</td>
                                        <td>{order.paymentMethod}</td>
                                        <td>
                                            <button className='history-view-btn' onClick={() => setSelectedOrder(order)}>View</button>
                                            {/* <table className="inner-items-table">
                                            <thead>
                                                <tr>
                                                    <th>Item</th>
                                                    <th>Qty</th>
                                                    <th>Price (₹)</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {order.items.map((item: any, idx: number) => (
                                                    <tr key={idx} className='history-data'>
                                                        <td>{item.name} ({item.size})</td>
                                                        <td>{item.quantity}</td>
                                                        <td>{(item.price * item.quantity).toFixed(2)}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table> */}
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>

                    {selectedOrder && (
                        <IonModal isOpen={true} onDidDismiss={() => setSelectedOrder(null)}>
                            <IonHeader>
                                <IonToolbar>
                                    <IonTitle className='history-model-title'>Order Details of {selectedOrder.userName}</IonTitle>
                                    <IonButtons slot="end">
                                        <IonButton className='history-model-close-btn' onClick={() => setSelectedOrder(null)}>Close</IonButton>
                                    </IonButtons>
                                </IonToolbar>
                            </IonHeader>
                            <IonContent className="ion-padding">
                                <div className='history-product-details'>
                                    <table className="history-detail-table">
                                        <thead className='history-detail-head'>
                                            <tr className='history-detail-row'>
                                                <th>Product</th>
                                                <th>Size</th>
                                                <th>Quantity</th>
                                                <th>Price</th>
                                                <th>SubTotal</th>
                                            </tr>
                                        </thead>
                                        <tbody className='history-detail-body'>
                                            {(selectedOrder.items ?? []).map((item, index) => (
                                                <tr key={index} className='history-items-detail'>
                                                    <td className='history-item-name'>{item.name}</td>
                                                    <td className='history-item-size'>{item.size || '-'}</td>
                                                    <td className='history-item-quantity'>{item.quantity}</td>
                                                    <td className='history-item-price'>₹{item.price}</td>
                                                    <td className='history-item-subtotal'>₹{(item.price * item.quantity).toFixed(2)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    <div className="history-order-info">
                                        <p className='history-total-quantity'>Total Quantity: {selectedOrder.quantity}</p>
                                        <p className='history-total-price'>Total Price: ₹{selectedOrder.price}</p>
                                        <p className='item-history-date'>Order Date: {selectedOrder.date}</p>
                                    </div>
                                </div>
                            </IonContent>
                        </IonModal>
                    )}
                </div>

            )}
        </div>
    );
};

export default OrderHistory;
