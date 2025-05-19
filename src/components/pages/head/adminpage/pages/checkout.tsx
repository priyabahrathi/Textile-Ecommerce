import React, { useState } from 'react';

type Order = {
    id: number;
    userName: string;
    productName: string;
    quantity: number;
    price: number;
    status: 'Pending' | 'Approved';
};

const initialOrders: Order[] = [
    { id: 1, userName: 'John Doe', productName: 'Cotton Shirt', quantity: 2, price: 40, status: 'Pending' },
    { id: 2, userName: 'Jane Smith', productName: 'Denim Jeans', quantity: 1, price: 60, status: 'Pending' },
    { id: 3, userName: 'Alice Brown', productName: 'Silk Scarf', quantity: 3, price: 90, status: 'Pending' },
];

const CheckoutAdminPage: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>(initialOrders);

    const handleApprove = (id: number) => {
        setOrders(prev =>
            prev.map(order =>
                order.id === id ? { ...order, status: 'Approved' } : order
            )
        );
    };

    return (
        <div style={{ padding: '2rem' }}>
            <h2>Checkout Approvals</h2>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr>
                        <th style={{ border: '1px solid #ccc', padding: '8px' }}>Order ID</th>
                        <th style={{ border: '1px solid #ccc', padding: '8px' }}>User Name</th>
                        <th style={{ border: '1px solid #ccc', padding: '8px' }}>Product Name</th>
                        <th style={{ border: '1px solid #ccc', padding: '8px' }}>Quantity</th>
                        <th style={{ border: '1px solid #ccc', padding: '8px' }}>Price</th>
                        <th style={{ border: '1px solid #ccc', padding: '8px' }}>Status</th>
                        <th style={{ border: '1px solid #ccc', padding: '8px' }}>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map(order => (
                        <tr key={order.id}>
                            <td style={{ border: '1px solid #ccc', padding: '8px' }}>{order.id}</td>
                            <td style={{ border: '1px solid #ccc', padding: '8px' }}>{order.userName}</td>
                            <td style={{ border: '1px solid #ccc', padding: '8px' }}>{order.productName}</td>
                            <td style={{ border: '1px solid #ccc', padding: '8px' }}>{order.quantity}</td>
                            <td style={{ border: '1px solid #ccc', padding: '8px' }}>${order.price}</td>
                            <td style={{ border: '1px solid #ccc', padding: '8px' }}>{order.status}</td>
                            <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                                {order.status === 'Pending' ? (
                                    <button onClick={() => handleApprove(order.id)}>Approve</button>
                                ) : (
                                    <span>Approved</span>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default CheckoutAdminPage;