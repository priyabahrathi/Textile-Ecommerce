import React, { useState, useEffect } from 'react';
import {
    PieChart,
    Pie,
    Cell,
    Tooltip as RechartsTooltip,
    Legend as RechartsLegend,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    ResponsiveContainer,
}from 'recharts';
import { getDatabase, ref, onValue } from 'firebase/database';
<<<<<<< HEAD
import './Dashboard.css'; // Import the stylesheet
=======
import './Dashboard.css';

>>>>>>> origin/tryon
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
    status: 'Pending' | 'Approved' | 'Cancelled';
    date: string; // Assuming 'YYYY-MM-DD' or 'YYYY/MM/DD' format for easy comparison
    email?: string;
    phone?: string;
    productImage?: string;
    size?: string;
    address?: string;
};

interface Product {
    id: string;
    name: string;
    image: string;
    price: number;
    status: string; // e.g., "Available", "Out of Stock"
    category: string;
    gender: string;
    outfitName: string;
    outfitType: string;
    skinTone: string;
    description: string;
    brand: string;
}

const salesData = [
    { month: 'Jan', sales: 4000 },
    { month: 'Feb', sales: 3000 },
    { month: 'Mar', sales: 5000 },
    { month: 'Apr', sales: 4780 },
    { month: 'May', sales: 5890 },
    { month: 'Jun', sales: 4390 },
    { month: 'Jul', sales: 4490 },
];

const pieData = [
    { name: 'Online', value: 6000 },
    { name: 'In-Store', value: 4000 },
    { name: 'Wholesale', value: 2000 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

const statusColors: Record<string, string> = {
    Pending: '#ffc107',
    Completed: '#28a745',
    Cancelled: '#dc3545',
    Approved: '#28a745',
};

const Dashboard: React.FC = () => {
    const [darkMode, setDarkMode] = useState(false);
    const [counters, setCounters] = useState({
        totalSales: 0,
        averageOrderValue: 0, // NEW: Average Order Value
        availableProducts: 0,
        outOfStockProducts: 0, // NEW: Out of Stock Products
        totalProducts: 0,
        totalOrderQuantity: 0,
        pendingOrders: 0,
        completedOrders: 0,
        cancelledOrders: 0,
        newOrdersToday: 0, // NEW: New Orders Today
    });

    const [searchTerm, setSearchTerm] = useState('');
    const [recentOrders, setRecentOrders] = useState<Order[]>([]);
    const [filteredRecentOrders, setFilteredRecentOrders] = useState<Order[]>([]);

    const unreadNotifications = recentOrders.filter(o => o.status === 'Pending').length;

    // Helper to get today's date in YYYY-MM-DD format for comparison
    const getTodayDateString = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    // Fetch real-time data from Firebase
    useEffect(() => {
        const db = getDatabase();

        // Fetch orders
        const ordersRef = ref(db, 'orders');
        const unsubscribeOrders = onValue(ordersRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const loadedOrders: Order[] = Object.entries(data).map(([id, value]: [string, any]) => ({
                    id,
                    ...value,
                    // Ensure date is in YYYY-MM-DD for consistency if not already
                    date: value.date ? value.date.split('T')[0] : new Date().toISOString().split('T')[0],
                }));
                setRecentOrders(
                    loadedOrders.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                );
                setFilteredRecentOrders(
                    loadedOrders.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                );
                

                updateOrderCounters(loadedOrders);
            } else {
                setRecentOrders([]);
                updateOrderCounters([]);
            }
        });

        // Fetch products for available products, total products, and out of stock count
        const productsRef = ref(db, 'products');
        const unsubscribeProducts = onValue(productsRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const loadedProducts: Product[] = Object.values(data);
                const availableCount = loadedProducts.filter(p => p.status === 'Available').length;
                const outOfStockCount = loadedProducts.filter(p => p.status === 'Out of Stock').length; // NEW: Out of Stock Count
                const totalProductsCount = loadedProducts.length;

                setCounters(prev => ({
                    ...prev,
                    availableProducts: availableCount,
                    totalProducts: totalProductsCount,
                    outOfStockProducts: outOfStockCount, // Update out of stock products
                }));
            } else {
                setCounters(prev => ({ ...prev, availableProducts: 0, totalProducts: 0, outOfStockProducts: 0 }));
            }
        });

        return () => {
            unsubscribeOrders();
            unsubscribeProducts();
        };
    }, []);

    // Update counters based on fetched orders
    const updateOrderCounters = (ordersData: Order[]) => {
        let totalSales = 0;
        let pending = 0;
        let completed = 0;
        let cancelled = 0;
        let totalQty = 0;
        let newOrdersTodayCount = 0; // NEW: New orders today

        const todayDate = getTodayDateString(); // Get today's date

        ordersData.forEach(order => {
            if (order.items && order.items.length > 0) {
                const orderTotal = order.items.reduce((sum, item) => {
                    totalQty += item.quantity;
                    return sum + (item.price * item.quantity);
                }, 0);
                if (order.status === 'Approved') {
                    totalSales += orderTotal;
                    completed++;
                }
            } else {
                totalQty += order.quantity || 0;
                if (order.status === 'Approved') {
                    totalSales += (order.price * order.quantity) || 0;
                    completed++;
                }
            }

            if (order.status === 'Pending') {
                pending++;
            } else if (order.status === 'Cancelled') {
                cancelled++;
            }

            // Check if order date matches today for 'New Orders Today'
            if (order.date && order.date.startsWith(todayDate)) {
                newOrdersTodayCount++;
            }
        });

        const averageOrderValue = completed > 0 ? totalSales / completed : 0; // Calculate AOV

        // Simulate animation for counters
        let increments = 0;
        const maxIncrements = 50;
        const interval = setInterval(() => {
            increments++;
            setCounters(prev => ({
                ...prev,
                totalSales: Math.min((increments / maxIncrements) * totalSales, totalSales),
                averageOrderValue: Math.min((increments / maxIncrements) * averageOrderValue, averageOrderValue), // NEW: AOV
                pendingOrders: Math.min((increments / maxIncrements) * pending, pending),
                completedOrders: Math.min((increments / maxIncrements) * completed, completed),
                cancelledOrders: Math.min((increments / maxIncrements) * cancelled, cancelled),
                totalOrderQuantity: Math.min((increments / maxIncrements) * totalQty, totalQty),
                newOrdersToday: Math.min((increments / maxIncrements) * newOrdersTodayCount, newOrdersTodayCount), // NEW: New Orders Today
            }));
            if (increments >= maxIncrements) clearInterval(interval);
        }, 20);
    };

    // Filter orders based on search term
    // Filter orders based on search term and limit to 5 recent orders
    useEffect(() => {
        let filtered = recentOrders;

        if (searchTerm) {
            filtered = recentOrders.filter(
                o =>
                    o.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    o.status.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Take only the most recent 5 (after filtering)
        setFilteredRecentOrders(filtered.slice(0, 5));
    }, [searchTerm, recentOrders]);


    return (
        <div className={`dashboard-wrapper ${darkMode ? 'dark' : ''}`}>
            <div className="dashboard-header">
                <div className='order-title'>Dashboard</div>
                <div className="header-actions">
                    <div className="notification-bell" title="Notifications">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            height="28"
                            viewBox="0 0 24 24"
                            width="28"
                            fill={darkMode ? '#eee' : '#333'}
                        >
                            <path d="M12 22c1.1 0 1.99-.9 1.99-2H10c0 1.1.89 2 2 2zm6-6V11c0-3.07-1.64-5.64-4.5-6.32V4a1.5 1.5 0 00-3 0v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" />
                        </svg>
                        {unreadNotifications > 0 && (
                            <span className="notification-count">
                                {unreadNotifications}
                            </span>
                        )}
                    </div>

                    <button
                        onClick={() => setDarkMode(!darkMode)}
                        className="dark-mode-toggle"
                        aria-label="Toggle dark mode"
                    >
                        {darkMode ? 'Light Mode' : 'Dark Mode'}
                    </button>
                </div>
            </div>

            <div className="sales-overview">
                {[
                    { title: 'Total Sales', value: `$${counters.totalSales.toFixed(2)}` },
                    { title: 'Avg. Order Value', value: `$${counters.averageOrderValue.toFixed(2)}` }, // NEW: AOV
                    { title: 'Total Products', value: counters.totalProducts },
                    { title: 'Available Products', value: counters.availableProducts },
                    { title: 'Out of Stock', value: counters.outOfStockProducts }, // NEW: Out of Stock
                    { title: 'Total Items Sold', value: counters.totalOrderQuantity },
                    { title: 'New Orders Today', value: counters.newOrdersToday }, // NEW: New Orders Today
                    { title: 'Pending Orders', value: counters.pendingOrders.toFixed(0) },
                    { title: 'Completed Orders', value: counters.completedOrders.toFixed(0) },
                    { title: 'Cancelled Orders', value: counters.cancelledOrders.toFixed(0) },
                ].map(({ title, value }, index) => (
                    <div key={index} className="stat-card">
                        <h4>{title}</h4>
                        <p>{value}</p>
                    </div>
                ))}
            </div>

            <div className="chart-section">
                <section className="chart-card">
                    <h3>Monthly Sales</h3>
                    <ResponsiveContainer width="100%" height="90%">
                        <LineChart data={salesData}>
                            <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#444' : '#ccc'} />
                            <XAxis dataKey="month" stroke={darkMode ? '#bbb' : '#666'} />
                            <YAxis stroke={darkMode ? '#bbb' : '#666'} />
                            <RechartsTooltip />
                            <Line
                                type="monotone"
                                dataKey="sales"
                                stroke="#8884d8"
                                strokeWidth={3}
                                activeDot={{ r: 8 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </section>

                <section className="chart-card">
                    <h3>Sales by Channel</h3>
                    <ResponsiveContainer width="100%" height="90%">
                        <PieChart>
                            <Pie
                                data={pieData}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                outerRadius={100}
                                fill="#8884d8"
                                label
                            >
                                {pieData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <RechartsTooltip />
                            <RechartsLegend verticalAlign="bottom" height={36} />
                        </PieChart>
                    </ResponsiveContainer>
                </section>
            </div>

            <section className="recent-orders-section">
                <h3>Recent Orders</h3>

                <input
                    type="search"
                    placeholder="Search by customer or status..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="search-input"
                />

                <table className="orders-table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Order ID</th>
                            <th>Customer</th>
                            <th>Status</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredRecentOrders.slice(0, 5).length === 0 ? (
                            <tr>
                                <td colSpan={4} style={{ textAlign: 'center', color: darkMode ? '#aaa' : '#666' }}>
                                    No matching orders found.
                                </td>
                            </tr>
                        ) : (
                            filteredRecentOrders.slice(0, 5).map(({ id, userName, status, price, quantity, items }) => {
                                const orderTotal = items && items.length > 0
                                    ? items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
                                    : (price * quantity);
                                return (
                                    <tr key={id}>
                                        <td>{new Date().toLocaleDateString()}</td>
                                        <td>{id}</td>
                                        <td>{userName}</td>
                                        <td>
                                            <span
                                                className={`status-badge ${status === 'Approved' ? 'completed' : status.toLowerCase()}`}
                                                style={{ backgroundColor: statusColors[status] }}
                                            >
                                                {status === 'Approved' ? 'Completed' : status}
                                            </span>
                                        </td>
                                        <td>${orderTotal.toFixed(2)}</td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>

                </table>
            </section>
        </div>
    );
};

export default Dashboard;