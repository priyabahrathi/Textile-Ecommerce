// profile.tsx
import React, { useEffect, useState } from 'react';
import { database } from '../../../../../Store/Slice/firebase';
import { ref, get, child } from 'firebase/database';
import './profile.css';

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
        }).catch(error => {
            console.error("Error fetching user data:", error);
            setLoading(false);
        });
    }, []);

    if (loading) {
        return <div style={{ textAlign: 'center', marginTop: 40 }}>Loading...</div>;
    }

    if (!user) {
        return <div style={{ textAlign: 'center', marginTop: 40, color: 'red' }}>User data not found.</div>;
    }

    const stats = {
        totalProducts: user.totalProducts || 24,
        totalSales: user.totalSales || 120,
        totalRevenue: user.totalRevenue || 54000,
        joinDate: user.joinDate || "2024-01-15",
        lastLogin: user.lastLogin || "2025-05-18 10:32 AM"
    };

    return (
        <div className="profile-container">
            <div className="profile-banner" style={{ position: "relative" }}>
                <img
                    src={user.profilePic || 'https://i.pravatar.cc/150?img=3'}
                    alt="Avatar"
                    className="profile-avatar"
                />
                <div className="profile-info">
                    <h2 className="profile-name">{user.fullName}</h2>
                    <div className="profile-role">{user.role || 'Administrator'}</div>
                    <div className="profile-contact">
                        <span><strong>Email:</strong> {user.email}</span>
                        <span><strong>Phone:</strong> {user.phone}</span>
                    </div>
                    <div className="profile-dates">
                        <span><strong>Joined:</strong> {stats.joinDate}</span>
                        <span><strong>Last Login:</strong> {stats.lastLogin}</span>
                    </div>
                    <div className='logout'>
                        <button className="logout-button" onClick={() => {
                            localStorage.removeItem('adminUserId');
                            window.location.href = '/admin';
                        }}>
                            Logout
                        </button>
                    </div>
                </div>
            </div>

            <div className="profile-stats">
                <div className="profile-stat-card"><div>{stats.totalProducts}</div><div>Products</div></div>
                <div className="profile-stat-card"><div>{stats.totalSales}</div><div>Total Sales</div></div>
                <div className="profile-stat-card"><div>₹{stats.totalRevenue.toLocaleString()}</div><div>Revenue</div></div>
            </div>

            <div className="profile-section">
                <h3>My Account</h3>
                <div className="profile-details">
                    <div><h4>User ID</h4><div>{user.userId}</div></div>
                    <div><h4>Role</h4><div>{user.role || "Administrator"}</div></div>
                    <div><h4>Full Name</h4><div>{user.fullName}</div></div>
                </div>
            </div>

            <div className="profile-section">
                <h3>Contact Information</h3>
                <div className="profile-details">
                    <div><h4>Email</h4><div>{user.email}</div></div>
                    <div><h4>Phone</h4><div>{user.phone}</div></div>
                </div>
            </div>

            <div className="profile-section">
                <h3>About Me</h3>
                <div><h4>About Me</h4><div>{user.aboutMe || "Not set"}</div></div>
            </div>
        </div>
    );
};

export default ProfilePage;
