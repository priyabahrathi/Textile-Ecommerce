import React, { useEffect, useState } from 'react';
import { database } from '../../../../../Store/Slice/firebase';
import { ref, get, child, set } from 'firebase/database';
import "./profile.css"; // Ensure this CSS file is correctly linked

// Define the structure for each hero slide
interface HeroSlide {
    image: string;
    heading: string;
    paragraph: string;
}

// Utility to get the logged-in user's ID
function getCurrentUserId() {
    return localStorage.getItem('adminUserId');
}

const ProfilePage: React.FC = () => {
    const [user, setUser] = useState<any>(null); // State to store fetched user data
    const [loading, setLoading] = useState(true);

    // Hero Slide management states
    const [heroSlides, setHeroSlides] = useState<HeroSlide[]>([
        { image: '', heading: 'Fashion Trends', paragraph: 'Explore the latest styles.' },
        { image: '', heading: 'Exclusive Deals', paragraph: 'Don\'t miss out on amazing offers.' },
        { image: '', heading: 'New Arrivals', paragraph: 'Discover what\'s new in store.' },
    ]);
    const [originalHeroSlides, setOriginalHeroSlides] = useState<HeroSlide[]>([
        { image: '', heading: 'Fashion Trends', paragraph: 'Explore the latest styles.' },
        { image: '', heading: 'Exclusive Deals', paragraph: 'Don\'t miss out on amazing offers.' },
        { image: '', heading: 'New Arrivals', paragraph: 'Discover what\'s new in store.' },
    ]);

    const [uploadingImageIndex, setUploadingImageIndex] = useState<number | null>(null);
    const [isSaving, setIsSaving] = useState(false); // Used for hero slide saving
    const [saveMessage, setSaveMessage] = useState<string | null>(null); // Used for hero slide saving message


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
                setUser(userData); // Set user data for display

                // Load existing hero slides if they are stored in user data
                if (userData.heroSlides && Array.isArray(userData.heroSlides)) {
                    const loadedSlides = userData.heroSlides.map((slide: any) => ({
                        image: slide.image || '',
                        heading: slide.heading || 'Default Heading',
                        paragraph: slide.paragraph || 'Default Paragraph'
                    })).concat(Array(3).fill(null)).slice(0, 3)
                        .map((slide: HeroSlide | null, index: number) => slide || {
                            image: '',
                            heading: `Default Heading ${index + 1}`,
                            paragraph: `Default Paragraph ${index + 1}`
                        });

                    setHeroSlides(loadedSlides);
                    setOriginalHeroSlides(loadedSlides);
                } else {
                    const defaultSlides = Array(3).fill(null).map((_, index) => ({
                        image: '',
                        heading: `Default Heading ${index + 1}`,
                        paragraph: `Default Paragraph ${index + 1}`
                    }));
                    setHeroSlides(defaultSlides);
                    setOriginalHeroSlides(defaultSlides);
                }
            } else {
                // Initialize default states if user data doesn't exist
                const defaultSlides = Array(3).fill(null).map((_, index) => ({
                    image: '',
                    heading: `Default Heading ${index + 1}`,
                    paragraph: `Default Paragraph ${index + 1}`
                }));
                setHeroSlides(defaultSlides);
                setOriginalHeroSlides(defaultSlides);
            }
            setLoading(false);
        }).catch(error => {
            console.error("Error fetching user data:", error);
            setLoading(false);
        });
    }, []);

    // Functions for Hero Slide Management
   const handleSlideChange = (index: number, field: keyof HeroSlide, value: string) => {
        const updatedSlides = [...heroSlides];
        updatedSlides[index] = { ...updatedSlides[index], [field]: value };
        setHeroSlides(updatedSlides);
    };

    const handleSaveHeroSlides = async () => {
        const userId = getCurrentUserId();
        if (!userId) {
            setSaveMessage("Error: User not logged in.");
            return;
        }
        setIsSaving(true);
        setSaveMessage("Saving changes...");

        try {
            await set(ref(database, `users/${userId}/heroSlides`), heroSlides);
            setOriginalHeroSlides([...heroSlides]);
            setSaveMessage("Hero slide changes saved successfully!");
        } catch (error) {
            console.error("Error saving hero slides:", error);
            setSaveMessage("Error saving hero slide changes. Please try again.");
        } finally {
            setTimeout(() => {
                setIsSaving(false);
                setSaveMessage(null);
            }, 3000);
        }
    };

    if (loading) {
        return <div style={{ textAlign: 'center', marginTop: 40 }}>Loading...</div>;
    }

    if (!user) {
        return <div style={{ textAlign: 'center', marginTop: 40, color: 'red' }}>User data not found or loaded.</div>;
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
            {/* Banner (Non-editable) */}
            <div className="profile-banner" style={{ position: "relative" }}>
                <img
                    src={user.profilePic || 'https://i.pravatar.cc/150?img=3'}
                    alt="Avatar"
                    className="profile-avatar"
                />
                {/* Profile picture upload removed as it implies editability */}
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

            {/* General Profile Save/Cancel Buttons removed as fields are not editable */}

            {/* Stats (Non-editable) */}
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

            {/* Hero Slides */}
            <div className="profile-section">
                <h3>Hero Section Slides</h3>
                <p>Paste image URLs, update text, and save.</p>
                <div className="image-upload-cards-container">
                    {heroSlides.map((slide, index) => (
                        <div key={index} className="image-upload-card hero-slide-card">
                            <h4>Slide {index + 1}</h4>

                            <label>Image URL:</label>
                            <input
                                type="text"
                                placeholder="Paste image URL here"
                                value={slide.image}
                                onChange={(e) => handleSlideChange(index, 'image', e.target.value)}
                            />
                            {slide.image && (
                                <img
                                    src={slide.image}
                                    alt={`Slide ${index + 1}`}
                                    style={{ width: '100%', height: 'auto', marginTop: '8px' }}
                                />
                            )}

                            <label>Heading:</label>
                            <input
                                type="text"
                                value={slide.heading}
                                onChange={(e) => handleSlideChange(index, 'heading', e.target.value)}
                            />

                            <label>Paragraph:</label>
                            <textarea
                                value={slide.paragraph}
                                onChange={(e) => handleSlideChange(index, 'paragraph', e.target.value)}
                            ></textarea>
                        </div>
                    ))}
                </div>

                <button
                    onClick={handleSaveHeroSlides}
                    className="save-button"
                    disabled={isSaving}
                >
                    {isSaving ? "Saving..." : "Save Changes"}
                </button>
                {saveMessage && <p className="save-message">{saveMessage}</p>}
            </div>
            {/* My Account Section (Non-editable) */}
            <div className="profile-section">
                <h3>My Account</h3>
                <div className="profile-details">
                    <div className="profile-detail-block">
                        <h4>User ID</h4>
                        <div className="profile-detail-value">{user.userId}</div>
                    </div>
                    <div className="profile-detail-block">
                        <h4>Role</h4>
                        <div className="profile-detail-value">{user.role || "Administrator"}</div>
                    </div>
                    <div className="profile-detail-block">
                        <h4>Full Name</h4>
                        <div className="profile-detail-value">{user.fullName}</div>
                    </div>
                </div>
            </div>
            {/* Contact Information Section (Non-editable) */}
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
            {/* About Me Section (Non-editable) */}
            <div className="profile-section">
                <h3>About Me</h3>
                <div className="profile-details">
                    <div className="profile-detail-block" style={{ flex: 2 }}>
                        <h4>About Me</h4>
                        <div className="profile-detail-value" style={{ minHeight: 60 }}>
                            {user.aboutMe || <span style={{ color: "#bbb" }}>Not set</span>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;