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
};




const CheckoutAdminPage: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    useEffect(() => {
        const db = getDatabase();
        const ordersRef = ref(db, 'orders');

        return () => {
            // Cleanup listener
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

        // ✅ Update status in Firebase
        const db = getDatabase();
        const orderRef = ref(db, `customerdata/${id}`);
        update(orderRef, { status: 'Approved' })
            .then(() => {
                console.log('Order approved in Firebase');
            })
            .catch((err) => {
                console.error('Failed to update status:', err);
            });
    };


    return (
        <div style={{ padding: '2rem', maxWidth: 900, margin: '0 auto' }}>
            <h2>Checkout Approvals</h2>
            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 700 }}>
                    <thead>
                        <tr>
                            <th style={{ border: '1px solid #ccc', padding: '8px' }}>Order ID</th>
                            <th style={{ border: '1px solid #ccc', padding: '8px' }}>User Name</th>
                            <th style={{ border: '1px solid #ccc', padding: '8px' }}>User Email</th>
                            <th style={{ border: '1px solid #ccc', padding: '8px' }}>Product Name</th>
                            <th style={{ border: '1px solid #ccc', padding: '8px' }}>Quantity</th>
                            <th style={{ border: '1px solid #ccc', padding: '8px' }}>Price</th>
                            <th style={{ border: '1px solid #ccc', padding: '8px' }}>Order Date</th>
                            <th style={{ border: '1px solid #ccc', padding: '8px' }}>Status</th>
                            <th style={{ border: '1px solid #ccc', padding: '8px' }}>Action</th>
                            <th style={{ border: '1px solid #ccc', padding: '8px' }}>WhatsApp</th> {/* New column */}
                        </tr>
                    </thead>
                    <tbody>
                        {orders.length === 0 ? (
                            <tr>
                                <td colSpan={10} style={{ textAlign: 'center', padding: '16px' }}>
                                    No orders found.
                                </td>
                            </tr>
                        ) : (
                            orders.map(order => {
                                const whatsappMessage = encodeURIComponent(
                                    `Order Confirmation

                                    Hello ${order.userName},

                                    Thank you for your order!

                                    Order Details:
                                    Product: ${order.productName}
                                    Quantity: ${order.quantity}
                                    Price: $${order.price}
                                    Order Date: ${order.date}
                                    Total: $${order.price * order.quantity}

                                    Your order has been approved and is being processed.

                                    Thank you for shopping with us!`
                                );
                                const whatsappUrl = `https://wa.me/${order.phone}?text=${whatsappMessage}`;

                                return (
                                    <tr key={order.id}>
                                        <td style={{ border: '1px solid #ccc', padding: '8px' }}>{order.id}</td>
                                        <td style={{ border: '1px solid #ccc', padding: '8px' }}>{order.userName}</td>
                                        <td style={{ border: '1px solid #ccc', padding: '8px' }}>{order.email}</td>
                                        <td style={{ border: '1px solid #ccc', padding: '8px' }}>{order.productName}</td>
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
                                            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                                                Send WhatsApp
                                            </a>
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