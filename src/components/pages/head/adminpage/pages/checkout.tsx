import React, { useState } from 'react';
import emailjs from 'emailjs-com'; // <-- Add this

type Order = {
    id: number;
    userName: string;
    productName: string;
    quantity: number;
    price: number;
    status: 'Pending' | 'Approved';
    date: string;
    email?: string; // <-- Add email field
    phone?: string; // <-- Add phone field
};

const initialOrders: Order[] = [
    { id: 1, userName: 'Priyabharathi', productName: 'Cotton Shirt', quantity: 2, price: 40, status: 'Pending', date: '2024-06-01', email: 'hamanthkumar789@gmail.com', phone: '6381261991' },
    { id: 2, userName: 'Jane Smith', productName: 'Denim Jeans', quantity: 1, price: 60, status: 'Pending', date: '2024-06-02', email: 'jane@example.com', phone: '0987654321' },
    { id: 3, userName: 'Alice Brown', productName: 'Silk Scarf', quantity: 3, price: 90, status: 'Pending', date: '2024-06-03', email: 'alice@example.com', phone: '1122334455' },
];

const CheckoutAdminPage: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>(initialOrders);

    const handleApprove = (id: number) => {
        const confirm = window.confirm('Are you sure you want to approve this order?');
        if (!confirm) return;

        const order = orders.find(o => o.id === id);
        if (!order) return;

        if (!order.email) {
            alert('No email address found for this user.');
            return;
        }

        // Generate bill/description
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

        // Send email using EmailJS
        emailjs.send(
            'service_to1ovkp', // Replace with your EmailJS service ID
            'template_2ckz6qm', // Replace with your EmailJS template ID
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
            'fr6LuZyY115BIJoVx' // Replace with your EmailJS user ID (public key)
        ).then(
            (result) => {
                alert('Approval email sent!');
            },
            (error) => {
                alert('Failed to send email: ' + error.text);
            }
        );

        setOrders(prev =>
            prev.map(order =>
                order.id === id ? { ...order, status: 'Approved' } : order
            )
        );
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