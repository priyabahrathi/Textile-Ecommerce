import React, { useEffect, useState } from 'react';
import emailjs from 'emailjs-com';
import { getDatabase, ref, onValue, update } from 'firebase/database';
import './checkoutDetails.css';
import { IonIcon, IonItemSliding } from '@ionic/react';
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

    productName: string | string[]; // Can be a single name or an array of names
    quantity: number;
    price: number;
    status: 'Pending' | 'Approved' | 'Cancelled';
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

    useEffect(() => {
        const db = getDatabase();
        const ordersRef = ref(db, 'orders'); // Make sure 'orders' node includes base64 image

        const unsubscribe = onValue(ordersRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const loadedOrders: Order[] = Object.entries(data).map(([id, value]: [string, any]) => ({
                    id,
                    ...value,
                }));
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

    return (
        <div style={{ padding: '2rem', maxWidth: 1100, margin: '0 auto' }}>
            <div className='admin-container'>
                <div className="admin-tabs">
                    <button className={activeTab === 'approved' ? 'admin-tab active' : 'admin-tab'} onClick={() => setActiveTab('approved')}>Approved</button>
                    <button className={activeTab === 'unapproved' ? 'admin-tab active' : 'admin-tab'} onClick={() => setActiveTab('unapproved')}>Unapproved</button>
                    <button className={activeTab === 'cancelled' ? 'admin-tab active' : 'admin-tab'} onClick={() => setActiveTab('cancelled')}>Cancelled</button>
                </div>
                <div className="admin-tab-content">
                    {activeTab === 'approved' && (
                        <div className='admin-approved'>
                            <h3 className='admin-head'>Approved Orders</h3>
                            {orders.length === 0 ? (
                                <p>No approved orders found.</p>
                            ) : (
                                <ul className='order-list'>
                                    {orders.filter(order => order.status === 'Approved').map(order => (
                                        <li key={order.id} className='order-item'>
                                            <div className='order-product'>
                                                <div className='customer-data' key={order.id}>
                                                    <h4 className='customer-name'>{order.userName}</h4>
                                                    {order.address && <p className='customer-address'>{order.address}</p>}
                                                    {order.email && <a href={`mailto:${order.email}`} className='customer-email'>
                                                        {order.email}
                                                    </a>
                                                    }
                                                    {order.phone && <p className='customer-phone'><IonIcon icon={call} />{order.phone}</p>}
                                                </div>
                                                {/* <img
                                                    src={order.productImage ? `data:image/jpeg;base64,${order.productImage}` : ''}
                                                    alt={Array.isArray(order.productName) ? order.productName.join(', ') : order.productName}
                                                    className='product-image'/> */}
                                                <div className='order-product-details'>
                                                    <ul className='order-product-name'>
                                                        <table>
                                                            <thead>
                                                                <th>Product</th>
                                                                <th>Size</th>
                                                                <th>Quantity</th>
                                                                <th>Price</th>
                                                            </thead>
                                                            {order.items && order.items.map((item: any, index: number) => (
                                                                <div className='each-product-data'>
                                                                    <tbody>
                                                                        <tr className='row'>
                                                                            <td key={index}>{item.name}</td>
                                                                            <td key={index}>{item.size ? ` (${item.size})` : ''}</td>
                                                                            <td key={index}>{item.quantity}</td>
                                                                            <td key={index}>₹{item.price}</td>
                                                                        </tr>
                                                                    </tbody>
                                                                </div>
                                                            ))}

                                                        </table>
                                                    </ul>
                                                    {/* <div className='order-info'>
                                                        <p>Quantity: {order.quantity}</p>
                                                        <p>Price: ${order.price}</p>
                                                        <p>Date: {order.date}</p>
                                                    </div> */}
                                                </div>


                                            </div>
                                        </li>
                                    ))}
                                </ul>

                            )}

                        </div>
                    )}
                    {activeTab === 'unapproved' && (
                        <div className='admin-unapproved'>
                            <h3 className='admin-head'>Unapproved Orders</h3>
                            {orders.length === 0 ? (
                                <p>No unapproved orders found.</p>
                            ) : (
                                <ul className='order-list'>
                                    {orders.filter(order => order.status === 'Pending').map(order => (
                                        <li key={order.id} className='order-item'>
                                            <div className='order-product'>
                                                {/* <img src={order.productImage ? `data:image/jpeg;base64,${order.productImage}` : ''} className='product-image' /> */}

                                                <div className='customer-data' key={order.id}>
                                                    <h4>{order.userName}</h4>
                                                    {order.address && <p className='customer-address'>{order.address}</p>}
                                                    {order.email && <a href={`mailto:${order.email}`} className='customer-email'>
                                                        {order.email}
                                                    </a>
                                                    }
                                                    {order.phone && <p className='customer-phone'><IonIcon icon={call} />{order.phone}</p>}

                                                </div>
                                                <div className='order-product-details'>
                                                    <ul className='order-product-name'>
                                                        {order.items && order.items.map((item: any, index: number) => (
                                                            <li key={index}>{item.name}{item.size ? ` (${item.size})` : ''}</li>
                                                        ))}
                                                    </ul>
                                                    <div className='order-info'>
                                                        <p>Quantity: {order.quantity}</p>
                                                        <p>Price: ${order.price}</p>
                                                        <p>Date: {order.date}</p>
                                                    </div>
                                                </div>
                                                <button onClick={() => handleApprove(order.id)} className='approve-btn'>Approve</button>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}

                        </div>
                    )}
                    {activeTab === 'cancelled' && (
                        <div className='admin-cancelled'>
                            <h3 className='admin-head'>Cancelled Orders</h3>
                            {orders.length === 0 ? (
                                <p>No cancelled orders found.</p>
                            ) : (
                                <ul className='order-list'>
                                    {orders.filter(order => order.status === 'Cancelled').map(order => (
                                        <li key={order.id} className='order-item'>
                                            <div className='order-product'>
                                                {/* <img src={order.productImage ? `data:image/jpeg;base64,${order.productImage}` : ''} className='product-image' /> */}
                                                <div className='customer-data' key={order.id}>
                                                    <h4>{order.userName}</h4>
                                                    {order.address && <p className='customer-address'>{order.address}</p>}
                                                    {order.email && <a href={`mailto:${order.email}`} className='customer-email'>
                                                        {order.email}
                                                    </a>
                                                    }
                                                    {order.phone && <p className='customer-phone'><IonIcon icon={call} />{order.phone}</p>}
                                                </div>
                                                <div className='order-product-details'>
                                                    <ul className='order-product-name'>
                                                        {order.items && order.items.map((item: any, index: number) => (
                                                            <li key={index}>{item.name}{item.size ? ` (${item.size})` : ''}</li>
                                                        ))}
                                                    </ul>
                                                    <div>
                                                        <h4>{order.productName}</h4>
                                                        <p>Quantity: {order.quantity}</p>
                                                        <p>Price: ${order.price}</p>
                                                        <p>Date: {order.date}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
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
