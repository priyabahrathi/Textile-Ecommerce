// profile.tsx
import React, { useEffect, useState } from 'react';
import { database } from '../../../../../Store/Slice/firebase';
import { ref, get, child } from 'firebase/database';
import './profile.css';

function getCurrentUserId() {
    return localStorage.getItem('adminUserId');
}

// Define a more comprehensive User interface to match the desired details
interface UserProfile {
    userId: string;
    fullName: string;
    email: string;
    phone: string; // Made non-optional, will default to 'N/A'
    profilePic: string; // Made non-optional, will default to a placeholder
    role: string; // Made non-optional, will default to 'Administrator'
    aboutMe: string; // Made non-optional, will default
    gender: string; // Added and made non-optional
    dateOfBirth: string; // Added and made non-optional
    location: string; // Added and made non-optional
    totalProducts: number; // Removed '?' - now guaranteed to be a number
    totalSales: number; // Removed '?' - now guaranteed to be a number
    totalRevenue: number; // Removed '?' - now guaranteed to be a number
    joinDate: string;
    lastLogin: string;
}

const ProfilePage: React.FC = () => {
    const [user, setUser] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const userId = getCurrentUserId();
        if (!userId) {
            setLoading(false);
            // In a real app, you might redirect to login or show a "not logged in" message
            return;
        }

        const dbRef = ref(database);
        get(child(dbRef, `users/${userId}`)).then(snapshot => {
            if (snapshot.exists()) {
                // Merge fetched data with default/expected structure
                const userData = snapshot.val();
                setUser({
                    userId: userId, // Ensure userId is always present
                    fullName: userData.fullName || "Admin User",
                    email: userData.email || "admin@example.com",
                    profilePic: userData.profilePic || 'https://i.pravatar.cc/150?img=3',
                    role: userData.role || 'Administrator',
                    phone: userData.phone || 'N/A',
                    aboutMe: userData.aboutMe || "Dedicated administrator overseeing operations.",
                    gender: userData.gender || "Not specified", // Default
                    dateOfBirth: userData.dateOfBirth || "Not set", // Default
                    location: userData.location || "Not set", // Default
                    totalProducts: userData.totalProducts || 24, // Default
                    totalSales: userData.totalSales || 120, // Default
                    totalRevenue: userData.totalRevenue || 54000, // Default
                    joinDate: userData.joinDate || "2024-01-15", // Default
                    lastLogin: userData.lastLogin || "2025-05-18 10:32 AM" // Default
                });
            } else {
                console.warn("No user data found for ID:", userId);
                setUser(null); // Explicitly set to null if no data
            }
            setLoading(false);
        }).catch(error => {
            console.error("Error fetching user data:", error);
            setLoading(false);
            setUser(null); // Set to null on error
        });
    }, []);

    if (loading) {
        return <div className="profile-loading">Loading profile data...</div>;
    }

    if (!user) {
        return <div className="profile-error">User data not found or failed to load. Please ensure you are logged in.</div>;
    }

    // Destructure user for easier access, now guaranteed to be non-optional numbers
    const {
        fullName, email, phone, profilePic, role, aboutMe,
        gender, dateOfBirth, location,
        totalProducts, totalSales, totalRevenue, joinDate, lastLogin,
        userId // User ID is always present
    } = user;


    return (
        <div className="profile-container">
            <div className="profile-banner">
                <img
                    src={profilePic}
                    alt="Avatar"
                    className="profile-avatar"
                />
                <div className="profile-info">
                    <h2 className="profile-name">{fullName}</h2>
                    <div className="profile-role">{role}</div>
                    <div className="profile-contact-info"> {/* Changed class name */}
                        <span><strong>Email:</strong> {email}</span>
                        <span><strong>Phone:</strong> {phone}</span>
                    </div>
                    <div className="profile-dates-info"> {/* Changed class name */}
                        <span><strong>Joined:</strong> {joinDate}</span>
                        <span><strong>Last Login:</strong> {lastLogin}</span>
                    </div>
                   
                </div>
            </div>

            <div className="profile-stats">
                <div className="profile-stat-card"><div>{totalProducts}</div><div className='data-label'>Products Managed</div></div> {/* Updated label */}
                <div className="profile-stat-card"><div>{totalSales}</div><div className='data-label'>Total Sales</div></div>
                <div className="profile-stat-card"><div>₹{totalRevenue.toLocaleString()}</div><div className='data-label'>Revenue Generated</div></div> {/* Updated label */}
            </div>

            {/* Core User Information Section (already largely covered in banner, but can add more details here) */}
            <div className="profile-section core-info-section">
                <h3>Core Information</h3>
                <div className="profile-details-grid"> {/* New class for grid layout */}
                    <div><h4>User ID</h4><div>{userId}</div></div>
                    <div><h4>Full Name</h4><div>{fullName}</div></div>
                    <div><h4>Email</h4><div>{email}</div></div>
                    <div><h4>Phone</h4><div>{phone}</div></div>
                    <div><h4>Role</h4><div>{role}</div></div>
                </div>
            </div>

            {/* Personal Details Section */}
            <div className="profile-section personal-details-section">
                <h3>Personal Details</h3>
                <div className="profile-details-grid">
                    <div><h4>Gender</h4><div>{gender}</div></div>
                    <div><h4>Date of Birth</h4><div>{dateOfBirth}</div></div>
                    <div><h4>Location</h4><div>{location}</div></div>
                </div>
            </div>

            {/* Account Management & Settings Section */}
            <div className="profile-section account-settings-section">
                <h3>Account & Settings</h3>
                <div className="profile-settings-links"> {/* New class for links layout */}
                    <a href="#" className="setting-link">Change Password</a>
                    <a href="#" className="setting-link">Notification Preferences</a>
                    <a href="#" className="setting-link">Theme/Display Settings</a>
                    <a href="#" className="setting-link">Privacy Settings</a>
                    <a href="#" className="setting-link delete-account">Deactivate/Delete Account</a>
                </div>
            </div>

            {/* Application-Specific Data Section */}
            <div className="profile-section app-data-section">
                <h3>Application Data</h3>
                <div className="profile-settings-links"> {/* Reusing link style */}
                    <a href="/admin/orders" className="setting-link">View Order History</a> {/* Example link to orders page */}
                    <a href="#" className="setting-link">Saved Addresses</a>
                    <a href="#" className="setting-link">Payment Methods</a>
                    <a href="#" className="setting-link">Wishlist / Favorites</a>
                    <a href="#" className="setting-link">My Reviews & Ratings</a>
                </div>
            </div>

            {/* Admin-Specific Details Section */}
            <div className="profile-section admin-details-section">
                <h3>Admin Details</h3>
                <div className="profile-details-grid">
                    <div><h4>Role & Permissions</h4><div>{role}</div></div>
                    {/* Placeholder for a more detailed activity log or link */}
                    <div><h4>Activity Log</h4><div>View recent admin actions <a href="#" className="inline-link">(Details)</a></div></div>
                </div>
            </div>

            {/* About Me Section (already existed, just ensuring consistent styling) */}
            <div className="profile-section about-me-section">
                <h3>About Me</h3>
                <div className="profile-details-text"> {/* New class for text block */}
                    {aboutMe}
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
