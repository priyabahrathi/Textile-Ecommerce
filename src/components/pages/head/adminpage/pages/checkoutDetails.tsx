import React, { useEffect, useState } from 'react';
import emailjs from 'emailjs-com';
import { getDatabase, ref, onValue, update } from 'firebase/database';

type Order = {
    id: string;
    userName: string;
    productName: string;
    quantity: number;
    price: number;
    status: 'Pending' | 'Approved';
    date: string;
    email?: string;
    phone?: string;
    productImage?: string; // Base64 image string
};

const CheckoutAdminPage: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);

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
            <h2>Checkout Approvals</h2>
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
            </div>
        </div>
    );
};

export default CheckoutAdminPage;
