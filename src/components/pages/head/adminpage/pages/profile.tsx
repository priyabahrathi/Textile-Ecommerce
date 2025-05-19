import React, { useEffect, useState } from 'react';
import { database } from '../../../../../Store/Slice/firebase';
import { ref, get, child } from 'firebase/database';
import "./profile.css";

// Utility to get the logged-in user's ID
function getCurrentUserId() {
    return localStorage.getItem('adminUserId');
}

const ProfilePage: React.FC = () => {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const userId = getCurrentUserId();
        if (!userId) {
            setLoading(false);
            return;
        }
        const dbRef = ref(database);
        get(child(dbRef, `users/${userId}`)).then(snapshot => {
            if (snapshot.exists()) {
                setUser(snapshot.val());
            }
            setLoading(false);
        });
    }, []);

    if (loading) {
        return <div style={{ textAlign: 'center', marginTop: 40 }}>Loading...</div>;
    }

    if (!user) {
        return <div style={{ textAlign: 'center', marginTop: 40, color: 'red' }}>User not found.</div>;
    }

    // Example stats (replace with real data fetching if needed)
    const stats = {
        totalProducts: user.totalProducts || 24,
        totalSales: user.totalSales || 120,
        totalRevenue: user.totalRevenue || 54000,
        joinDate: user.joinDate || "2024-01-15",
        lastLogin: user.lastLogin || "2025-05-18 10:32 AM"
    };

    return (
        <div className="profile-container">
            {/* Banner */}
            <div className="profile-banner">
                <img
                    src={user.profilePic || 'https://i.pravatar.cc/150?img=3'}
                    alt="Avatar"
                    className="profile-avatar"
                />
                <div className="profile-info">
                    <h2 className="profile-name">{user.fullName}</h2>
                    <div className="profile-role">{user.role || 'Administrator'}</div>
                    <div className="profile-contact">
                        <span className="profile-email">
                            <strong>Email:</strong> {user.email}
                        </span>
                        <span className="profile-phone">
                            <strong>Phone:</strong> {user.phone}
                        </span>
                    </div>
                    <div className="profile-dates">
                        <span className="profile-join-date">
                            <strong>Joined:</strong> {stats.joinDate}
                        </span>
                        <span className="profile-last-login">
                            <strong>Last Login:</strong> {stats.lastLogin}
                        </span>
                    </div>
                </div>
            </div>
            {/* Stats */}
            <div className="profile-stats">
                <div className="profile-stat-card profile-stat-products">
                    <div className="stat-value">{stats.totalProducts}</div>
                    <div>Products</div>
                </div>
                <div className="profile-stat-card profile-stat-sales">
                    <div className="stat-value">{stats.totalSales}</div>
                    <div>Total Sales</div>
                </div>
                <div className="profile-stat-card profile-stat-revenue">
                    <div className="stat-value">₹{stats.totalRevenue.toLocaleString()}</div>
                    <div>Revenue</div>
                </div>
            </div>
            {/* My Account Section */}
            <div className="profile-section">
                <h3>My Account</h3>
                <div className="profile-details">
                    <div className="profile-detail-block">
                        <h4>User ID</h4>
                        <div className="profile-detail-value">{user.userId}</div>
                    </div>
                    <div className="profile-detail-block">
                        <h4>Role</h4>
                        <div className="profile-detail-value">{user.role || 'Administrator'}</div>
                    </div>
                    <div className="profile-detail-block">
                        <h4>Full Name</h4>
                        <div className="profile-detail-value">{user.fullName}</div>
                    </div>
                </div>
            </div>
            {/* Contact Information Section */}
            <div className="profile-section">
                <h3>Contact Information</h3>
                <div className="profile-details">
                    <div className="profile-detail-block">
                        <h4>Email</h4>
                        <div className="profile-detail-value">{user.email}</div>
                    </div>
                    <div className="profile-detail-block">
                        <h4>Phone</h4>
                        <div className="profile-detail-value">{user.phone}</div>
                    </div>
                </div>
            </div>
            {/* About Me Section */}
            <div className="profile-section">
                <h3>About Me</h3>
                <div className="profile-details">
                    <div className="profile-detail-block" style={{ flex: 2 }}>
                        <div className="profile-detail-value" style={{ minHeight: 60 }}>
                            {user.aboutMe || "No description provided. You can add your bio or business info here."}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;

