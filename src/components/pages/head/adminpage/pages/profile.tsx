import React, { useEffect, useState } from 'react';
import { database } from '../../../../../Store/Slice/firebase';
import { ref, get, child, set } from 'firebase/database'; // Import 'set' for saving data
import "./profile.css"; // Ensure this CSS file is correctly linked

// Utility to get the logged-in user's ID
function getCurrentUserId() {
    return localStorage.getItem('adminUserId');
}

const ProfilePage: React.FC = () => {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    // State to store background images (initially empty or fetched from user data)
    const [backgroundImages, setBackgroundImages] = useState<string[]>(['', '', '']);
    // State to keep track of original images for comparison
    const [originalBackgroundImages, setOriginalBackgroundImages] = useState<string[]>(['', '', '']);
    const [uploadingImageIndex, setUploadingImageIndex] = useState<number | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [saveMessage, setSaveMessage] = useState<string | null>(null);

    useEffect(() => {
        const userId = getCurrentUserId();
        if (!userId) {
            setLoading(false);
            return;
        }
        const dbRef = ref(database);
        get(child(dbRef, `users/${userId}`)).then(snapshot => {
            if (snapshot.exists()) {
                const userData = snapshot.val();
                setUser(userData);
                // Load existing background images if they are stored in user data
                if (userData.heroBackgrounds && Array.isArray(userData.heroBackgrounds)) {
                    // Ensure we have exactly 3 slots, filling with empty strings if less
                    const loadedImages = userData.heroBackgrounds.concat(Array(3).fill('')).slice(0, 3);
                    setBackgroundImages(loadedImages);
                    setOriginalBackgroundImages(loadedImages); // Set original images on load
                } else {
                    setBackgroundImages(['', '', '']);
                    setOriginalBackgroundImages(['', '', '']);
                }
            } else {
                setBackgroundImages(['', '', '']);
                setOriginalBackgroundImages(['', '', '']);
            }
            setLoading(false);
        }).catch(error => {
            console.error("Error fetching user data:", error);
            setLoading(false);
        });
    }, []);

    // Function to handle image upload
    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const file = event.target.files?.[0];
        if (file) {
            setUploadingImageIndex(index);
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                const newBackgroundImages = [...backgroundImages];
                newBackgroundImages[index] = base64String;
                setBackgroundImages(newBackgroundImages);
                setUploadingImageIndex(null);
                setSaveMessage(null); // Clear any previous save messages
            };
            reader.readAsDataURL(file);
        }
    };

    // Function to remove an image
    const handleRemoveImage = (index: number) => {
        const newBackgroundImages = [...backgroundImages];
        newBackgroundImages[index] = ''; // Set to empty string to clear the image
        setBackgroundImages(newBackgroundImages);
        setSaveMessage(null); // Clear any previous save messages
    };

    // Check if there are any changes to save
    const hasChanges = JSON.stringify(backgroundImages) !== JSON.stringify(originalBackgroundImages);

    // Function to save all changes to Firebase
    const handleSaveChanges = async () => {
        const userId = getCurrentUserId();
        if (!userId) {
            setSaveMessage("Error: User not logged in.");
            return;
        }
        setIsSaving(true);
        setSaveMessage("Saving changes...");

        try {
            await set(ref(database, `users/${userId}/heroBackgrounds`), backgroundImages);
            setOriginalBackgroundImages([...backgroundImages]); // Update original images after saving
            setSaveMessage("Changes saved successfully!");
        } catch (error) {
            console.error("Error saving background images:", error);
            setSaveMessage("Error saving changes. Please try again.");
        } finally {
            setIsSaving(false);
            // Clear message after a short delay
            setTimeout(() => setSaveMessage(null), 3000);
        }
    };


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

            {/* NEW: Swiper Background Image Upload Section */}
            <div className="profile-section">
                <h3>Hero Background Images (Swiper)</h3>
                <p>Upload up to 3 images for your hero section background. Image should be maximum 5MB.</p>
                <div className="image-upload-cards-container">
                    {backgroundImages.map((image, index) => (
                        <div key={index} className="image-upload-card">
                            <h4>Image {index + 1}</h4>
                            {image ? (
                                <div className="uploaded-image-preview">
                                    <img src={image} alt={`Uploaded ${index + 1}`} />
                                    <button
                                        className="remove-image-btn"
                                        onClick={() => handleRemoveImage(index)}
                                        disabled={uploadingImageIndex === index || isSaving}
                                    >
                                        Remove
                                    </button>
                                </div>
                            ) : (
                                <div className="upload-placeholder">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        id={`image-upload-${index}`}
                                        style={{ display: 'none' }}
                                        onChange={(e) => handleImageUpload(e, index)}
                                        disabled={uploadingImageIndex === index || isSaving}
                                    />
                                    <label htmlFor={`image-upload-${index}`} className="upload-button">
                                        {uploadingImageIndex === index ? 'Uploading...' : 'Upload Image'}
                                    </label>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
                {/* Save button and message */}
                <div className="save-changes-area">
                    <button
                        className="save-button"
                        onClick={handleSaveChanges}
                        disabled={!hasChanges || isSaving}
                    >
                        {isSaving ? 'Saving...' : 'Save Changes'}
                    </button>
                    {saveMessage && <span className="save-message">{saveMessage}</span>}
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