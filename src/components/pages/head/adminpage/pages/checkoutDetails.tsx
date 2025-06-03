import React, { useEffect, useState } from 'react';
import emailjs from 'emailjs-com';
import { getDatabase, ref, onValue, update } from 'firebase/database';
import './checkoutDetails.css';
import { IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonItemSliding, IonLabel, IonModal, IonSegment, IonSegmentButton, IonTitle, IonToolbar } from '@ionic/react';
import { call } from 'ionicons/icons';
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
const CheckoutAdminPage: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [activeTab, setActiveTab] = useState<'approved' | 'unapproved' | 'cancelled'>('approved');
    const [isOpen, setIsOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

    useEffect(() => {
        const db = getDatabase();
        const customersRef = ref(db, 'customers');
        const unsubscribe = onValue(customersRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                // Flatten all orders from all users
                const loadedOrders: Order[] = [];
                Object.entries(data).forEach(([userId, userData]: [string, any]) => {
                    if (userData.orders) {
                        Object.entries(userData.orders).forEach(([orderId, orderData]: [string, any]) => {
                            loadedOrders.push({
                                id: orderId,
                                ...orderData,
                            });
                        });
                    }
                });
                setOrders(loadedOrders);
            } else {
                setOrders([]);
            }
        });
        return () => {
            // Cleanup if needed
        };
    }, []);


    const handleApprove = (id: string) => {
        const confirm = window.confirm('Are you sure you want to approve this order?');
        if (!confirm) return;
        const order = orders.find(o => o.id === id);
        if (!order) return;
        if (!order.email) {
            alert('No email address found for this user.');
            return;
        }
        // Email content
        const bill = `
Order Confirmation
Hello ${order.userName},
Thank you for your order!
Order Details:
Product: ${order.productName}
Quantity: ${order.quantity}
Price: $${order.price}
Order Date: ${order.date}
Total: $${order.price * order.quantity}
Your order has been approved and is being processed.
Thank you for shopping with us!
`;
        // Send email via EmailJS
        emailjs.send(
            'service_to1ovkp',
            'template_2ckz6qm',
            {
                to_email: order.email,
                to_name: order.userName,
                order_id: order.id,
                product_name: order.productName,
                quantity: order.quantity,
                price: order.price,
                order_date: order.date,
                total: order.price * order.quantity,
            },
            'fr6LuZyY115BIJoVx'
        ).then(
            () => {
                alert('Approval email sent!');
            },
            (error) => {
                alert('Failed to send email: ' + error.text);
            }
        );
        // Update status in Firebase
        const db = getDatabase();
        const orderRef = ref(db, `orders/${id}`);
        update(orderRef, { status: 'Approved' })
            .then(() => {
                console.log('Order approved in Firebase');
            })
            .catch((err) => {
                console.error('Failed to update status:', err);
            });
    };


    const handleDelivery = (id: string) => {
        const order = orders.find(o => o.id === id);
        if (!order) return;

        if (!order.email) {
            alert('No email address found for this user.');
            return;
        }

        // Email content
        const bill = `
Delivery Confirmation

Hello ${order.userName},

Thank you for your order!

Your Order was Delivered Successfully!

Order Details:
Product: ${order.productName}
Quantity: ${order.quantity}
Price: $${order.price}
Order Date: ${order.date}
Total: $${order.price * order.quantity}

Thank you for shopping with us!

If Your Order was not delivered yet, Please contact the Customer Care !!!

`;

        // Send email via EmailJS
        emailjs.send(
            'service_to1ovkp',
            'template_2ckz6qm',
            {
                to_email: order.email,
                to_name: order.userName,
                order_id: order.id,
                product_name: order.productName,
                quantity: order.quantity,
                price: order.price,
                order_date: order.date,
                total: order.price * order.quantity,
            },
            'fr6LuZyY115BIJoVx'
        ).then(
            () => {
                alert('Delivery email sent!');
            },
            (error) => {
                alert('Failed to send email: ' + error.text);
            }
        );

        // Update status in Firebase
        const db = getDatabase();
        const orderRef = ref(db, `orders/${id}`);
        update(orderRef, { status: 'delivered' })
            .then(() => {
                console.log('Order delivery in Firebase');
            })
            .catch((err) => {
                console.error('Failed to update status:', err);
            });
    };

    return (
        <div style={{ padding: '2rem', maxWidth: 1100, margin: '0 auto' }}>
            <div className='admin-container'>
                <div className='order-title'>Orders Management</div>
                <IonSegment
                className='segment-container'
                    value={activeTab}
                    onIonChange={(e) => {
                        const value = e.detail.value;
                        if (value === 'approved' || value === 'unapproved' || value === 'cancelled') {
                            setActiveTab(value);
                        }
                    }}
                >
                    <IonSegmentButton className='seg-btn' value="unapproved">
                        <IonLabel className='seg-label'>Pending</IonLabel>
                    </IonSegmentButton>
                    <IonSegmentButton className='seg-btn' value="approved">
                        <IonLabel className='seg-label'>Approved</IonLabel>
                    </IonSegmentButton>
                    <IonSegmentButton className='seg-btn' value="cancelled">
                        <IonLabel className='seg-label'>Delivered</IonLabel>
                    </IonSegmentButton>
                </IonSegment>
                <div className="admin-tab-content">
                    {activeTab === 'approved' && (
                        <div className="admin-approved">
                            <h3 className="admin-head">Approved Orders</h3>
                            {orders.filter(order => order.status === 'Approved').length === 0 ? (
                                <p>No approved orders found.</p>
                            ) : (
                                <div className="table-wrapper">
                                    <table className="orders-table">
                                        <thead className='customer-table-head'>
                                            <tr>
                                                <th>S No</th>
                                                <th>Order Date</th>
                                                <th>Customer Name</th>
                                                <th>Phone</th>
                                                <th>Address</th>
                                                <th>Email</th>
                                                <th>Items</th>
                                                <th>Total Quantity</th>
                                                <th>Total Price</th>
                                                <th>Status</th>
                                                <th>Delivery</th>
                                            </tr>
                                        </thead>
                                        <tbody className='customer-table-body'>
                                            {orders
                                                .filter(order => order.status === 'Approved')
                                                .map((order, index) => (
                                                    <tr key={order.id} className="table-row">
                                                        <td>{index + 1}</td>
                                                        <td>{order.date}</td>
                                                        <td>{order.userName}</td>
                                                        <td>{order.phone}</td>
                                                        <td><div className='customer-address'>{order.address}</div></td>
                                                        <td>
                                                            <a href={`mailto:${order.email}`}>{order.email}</a>
                                                        </td>
                                                        <td>
                                                            <button className="view-btn" onClick={() => setSelectedOrder(order)}>
                                                                View
                                                            </button>
                                                        </td>
                                                        <td>{order.quantity}</td>
                                                        <td>₹{order.price}</td>
                                                        <td className='order-status-approved'>{order.status}</td>
                                                        <td><button className='delivery-btn' onClick={() => handleDelivery(order.id)}>Completed</button></td>
                                                    </tr>
                                                ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}

                            {selectedOrder && (
                                <IonModal isOpen={true} onDidDismiss={() => setSelectedOrder(null)}>
                                    <IonHeader>
                                        <IonToolbar>
                                            <IonTitle className='model-title'>Order Details of {selectedOrder.userName}</IonTitle>
                                            <IonButtons slot="end">
                                                <IonButton className='model-close-btn' onClick={() => setSelectedOrder(null)}>Close</IonButton>
                                            </IonButtons>
                                        </IonToolbar>
                                    </IonHeader>
                                    <IonContent className="ion-padding">
                                        <div className='order-product-details'>
                                            <table className="order-detail-table">
                                                <thead className='order-detail-head'>
                                                    <tr className='order-detail-row'>
                                                        <th>Product</th>
                                                        <th>Size</th>
                                                        <th>Quantity</th>
                                                        <th>Price</th>
                                                        <th>SubTotal</th>
                                                    </tr>
                                                </thead>
                                                <tbody className='order-detail-body'>
                                                    {(selectedOrder.items ?? []).map((item, index) => (
                                                        <tr key={index} className='order-items-detail'>
                                                            <td className='item-name'>{item.name}</td>
                                                            <td className='item-size'>{item.size || '-'}</td>
                                                            <td className='item-quantity'>{item.quantity}</td>
                                                            <td className='item-price'>₹{item.price}</td>
                                                            <td className='item-subtotal'>₹{(item.price * item.quantity).toFixed(2)}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                            <div className="order-info">
                                                <p className='order-total-quantity'>Total Quantity: {selectedOrder.quantity}</p>
                                                <p className='order-total-price'>Total Price: ₹{selectedOrder.price}</p>
                                                <p className='item-order-date'>Order Date: {selectedOrder.date}</p>
                                            </div>
                                        </div>
                                    </IonContent>
                                </IonModal>
                            )}
                        </div>
                    )}
                    {activeTab === 'unapproved' && (
                        <div className='admin-unapproved'>
                            <h3 className='admin-head'>Unapproved Orders</h3>
                            {orders.length === 0 ? (
                                <p>No unapproved orders found.</p>
                            ) : (
                                <div className="table-wrapper">
                                    <table className="orders-table">
                                        <thead>
                                            <tr>
                                                <th>S No</th>
                                                <th>Order Date</th>
                                                <th>Customer Name</th>
                                                <th>Phone</th>
                                                <th>Address</th>
                                                <th>Email</th>
                                                <th>Items</th>
                                                <th>Total Quantity</th>
                                                <th>Total Price</th>
                                                <th>Status</th>
                                                <th>Approve Here</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {orders
                                                .filter(order => order.status === 'Pending')
                                                .map((order, index) => (
                                                    <tr key={order.id} className="table-row">
                                                        <td>{index + 1}</td>
                                                        <td>{order.date}</td>
                                                        <td>{order.userName}</td>
                                                        <td>{order.phone}</td>
                                                        <td><div className='customer-address'>{order.address}</div></td>
                                                        <td>
                                                            <a href={`mailto:${order.email}`}>{order.email}</a>
                                                        </td>
                                                        <td>
                                                            <button className="view-btn" onClick={() => setSelectedOrder(order)}>
                                                                View
                                                            </button>
                                                        </td>
                                                        <td>{order.quantity}</td>
                                                        <td>₹{order.price}</td>
                                                        <td className='order-status-pending'>{order.status}</td>
                                                        <td><button onClick={() => handleApprove(order.id)} className='approve-btn'>Approve</button></td>
                                                    </tr>
                                                ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                            {selectedOrder && (
                                <IonModal isOpen={true} onDidDismiss={() => setSelectedOrder(null)}>
                                    <IonHeader>
                                        <IonToolbar>
                                            <IonTitle className='model-title'>Order Details of {selectedOrder.userName}</IonTitle>
                                            <IonButtons slot="end">
                                                <IonButton className='model-close-btn' onClick={() => setSelectedOrder(null)}>Close</IonButton>
                                            </IonButtons>
                                        </IonToolbar>
                                    </IonHeader>
                                    <IonContent className="ion-padding">
                                        <div className='order-product-details'>
                                            <table className="order-detail-table">
                                                <thead className='order-detail-head'>
                                                    <tr className='order-detail-row'>
                                                        <th>Product</th>
                                                        <th>Size</th>
                                                        <th>Quantity</th>
                                                        <th>Price</th>
                                                        <th>SubTotal</th>
                                                    </tr>
                                                </thead>
                                                <tbody className='order-detail-body'>
                                                    {(selectedOrder.items ?? []).map((item, index) => (
                                                        <tr key={index} className='order-items-detail'>
                                                            <td className='item-name'>{item.name}</td>
                                                            <td className='item-size'>{item.size || '-'}</td>
                                                            <td className='item-quantity'>{item.quantity}</td>
                                                            <td className='item-price'>₹{item.price}</td>
                                                            <td className='item-subtotal'>₹{(item.price * item.quantity).toFixed(2)}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                            <div className="order-info">
                                                <p className='order-total-quantity'>Total Quantity: {selectedOrder.quantity}</p>
                                                <p className='order-total-price'>Total Price: ₹{selectedOrder.price}</p>
                                                <p className='item-order-date'>Order Date: {selectedOrder.date}</p>
                                            </div>
                                        </div>
                                    </IonContent>
                                </IonModal>
                            )}

                        </div>
                    )}
                    {activeTab === 'cancelled' && (
                        <div className='admin-cancelled'>
                            <h3 className='admin-head'>Delivered Orders</h3>
                            {orders.length === 0 ? (
                                <p>No delivered orders found.</p>
                            ) : (
                                <div className="table-wrapper">
                                    <table className="orders-table">
                                        <thead>
                                            <tr>
                                                <th>S No</th>
                                                <th>Order Date</th>
                                                <th>Customer Name</th>
                                                <th>Phone</th>
                                                <th>Address</th>
                                                <th>Email</th>
                                                <th>Items</th>
                                                <th>Total Quantity</th>
                                                <th>Total Price</th>
                                                <th>Status</th>
                                                
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {orders
                                                .filter(order => order.status === 'delivered')
                                                .map((order, index) => (
                                                    <tr key={order.id} className="table-row">
                                                        <td>{index + 1}</td>
                                                        <td>{order.date}</td>
                                                        <td>{order.userName}</td>
                                                        <td>{order.phone}</td>
                                                        <td><div className='customer-address'>{order.address}</div></td>
                                                        <td>
                                                            <a href={`mailto:${order.email}`}>{order.email}</a>
                                                        </td>
                                                        <td>
                                                            <button className="view-btn" onClick={() => setSelectedOrder(order)}>
                                                                View
                                                            </button>
                                                        </td>
                                                        <td>{order.quantity}</td>
                                                        <td>₹{order.price}</td>
                                                        <td className='order-status-approved'>{order.status}</td>
                                                    </tr>
                                                ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
            {/* <h2>Checkout Approvals</h2>
            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 1000 }}>
                    <thead>
                        <tr>
                            <th style={{ border: '1px solid #ccc', padding: '8px' }}>Order ID</th>
                            <th style={{ border: '1px solid #ccc', padding: '8px' }}>User Name</th>
                            <th style={{ border: '1px solid #ccc', padding: '8px' }}>Email</th>
                            <th style={{ border: '1px solid #ccc', padding: '8px' }}>Product Name</th>
                            <th style={{ border: '1px solid #ccc', padding: '8px' }}>Image</th>
                            <th style={{ border: '1px solid #ccc', padding: '8px' }}>Quantity</th>
                            <th style={{ border: '1px solid #ccc', padding: '8px' }}>Price</th>
                            <th style={{ border: '1px solid #ccc', padding: '8px' }}>Order Date</th>
                            <th style={{ border: '1px solid #ccc', padding: '8px' }}>Status</th>
                            <th style={{ border: '1px solid #ccc', padding: '8px' }}>Action</th>
                            <th style={{ border: '1px solid #ccc', padding: '8px' }}>WhatsApp</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.length === 0 ? (
                            <tr>
                                <td colSpan={11} style={{ textAlign: 'center', padding: '16px' }}>
                                    No orders found.
                                </td>
                            </tr>
                        ) : (
                            orders.map(order => {
                                const whatsappMessage = encodeURIComponent(
                                    `Order Confirmation\n\nHello ${order.userName},\n\nThank you for your order!\n\nOrder Details:\nProduct: ${order.productName}\nQuantity: ${order.quantity}\nPrice: $${order.price}\nOrder Date: ${order.date}\nTotal: $${order.price * order.quantity}\n\nYour order has been approved and is being processed.\n\nThank you for shopping with us!`
                                );
                                const whatsappUrl = `https://wa.me/${order.phone}?text=${whatsappMessage}`;

                                return (
                                    <tr key={order.id}>
                                        <td style={{ border: '1px solid #ccc', padding: '8px' }}>{order.id}</td>
                                        <td style={{ border: '1px solid #ccc', padding: '8px' }}>{order.userName}</td>
                                        <td style={{ border: '1px solid #ccc', padding: '8px' }}>{order.email}</td>
                                        <td style={{ border: '1px solid #ccc', padding: '8px' }}>{order.productName}</td>
                                        <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                                            {order.productImage ? (
                                                <img
                                                    src={`data:image/jpeg;base64,${order.productImage}`}
                                                    alt={order.productName}
                                                    style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                                                />
                                            ) : (
                                                <span>No Image</span>
                                            )}
                                        </td>
                                        <td style={{ border: '1px solid #ccc', padding: '8px' }}>{order.quantity}</td>
                                        <td style={{ border: '1px solid #ccc', padding: '8px' }}>${order.price}</td>
                                        <td style={{ border: '1px solid #ccc', padding: '8px' }}>{order.date}</td>
                                        <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                                            <span style={{
                                                color: order.status === 'Approved' ? 'green' : 'orange',
                                                fontWeight: 'bold'
                                            }}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                                            {order.status === 'Pending' ? (
                                                <button onClick={() => handleApprove(order.id)}>Approve</button>
                                            ) : (
                                                <span>Approved</span>
                                            )}
                                        </td>
                                        <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                                            {order.phone ? (
                                                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                                                    Send WhatsApp
                                                </a>
                                            ) : (
                                                <span>N/A</span>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div> */}
        </div>
    );
};
export default CheckoutAdminPage;
