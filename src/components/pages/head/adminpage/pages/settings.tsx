import React, { useEffect, useState } from "react";
import { database } from '../../../../../Store/Slice/firebase';
import { ref, get, child, update } from "firebase/database";
import { IoMdCreate, IoMdCheckmark, IoMdClose, IoMdCamera, IoIosArrowDown } from "react-icons/io"; // Added IoIosArrowDown for consistency, though not used for accordion here
import "./profile.css"; // Assuming profile.css contains the necessary styles for these elements

function getCurrentUserId() {
    return localStorage.getItem('adminUserId');
}

// Define a comprehensive UserProfile interface
interface UserProfile {
    userId: string;
    fullName: string;
    email: string;
    phone: string;
    profilePic: string;
    role: string;
    aboutMe: string;
    gender: string;
    dateOfBirth: string;
    location: string;
    totalProducts: number;
    totalSales: number;
    totalRevenue: number;
    joinDate: string;
    lastLogin: string;
}

const Settings: React.FC = () => {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [editingField, setEditingField] = useState<keyof UserProfile | null>(null); // Use keyof UserProfile
    const [editValue, setEditValue] = useState<string>("");
    const [pendingEdits, setPendingEdits] = useState<Partial<UserProfile>>({}); // Track all edits as Partial<UserProfile>
    const [isEditing, setIsEditing] = useState(false); // Track if any field is being edited

    useEffect(() => {
        const userId = getCurrentUserId();
        if (!userId) {
            setLoading(false);
            return;
        }
        const dbRef = ref(database);
        const userPath = `users/${userId}`;

        get(child(dbRef, userPath)).then(snapshot => {
            if (snapshot.exists()) {
                const userData = snapshot.val();
                const currentTime = new Date().toLocaleString(); // For dynamic last login

                // Update lastLogin in Firebase
                update(ref(database, userPath), {
                    lastLogin: currentTime
                }).then(() => {
                    console.log("Last login updated in Firebase successfully to:", currentTime);
                }).catch(error => {
                    console.error("Error updating last login in Firebase:", error);
                });

                setProfile({
                    userId: userId,
                    fullName: userData.fullName || "Admin User",
                    email: userData.email || "admin@example.com",
                    phone: userData.phone || "N/A",
                    profilePic: userData.profilePic || 'https://i.pravatar.cc/150?img=3',
                    role: userData.role || 'Administrator',
                    aboutMe: userData.aboutMe || "Dedicated administrator overseeing operations.",
                    gender: userData.gender || "Not specified",
                    dateOfBirth: userData.dateOfBirth || "Not set",
                    location: userData.location || "Not set",
                    totalProducts: userData.totalProducts || 0, // Default to 0 for numbers
                    totalSales: userData.totalSales || 0,
                    totalRevenue: userData.totalRevenue || 0,
                    joinDate: userData.joinDate || "Not set",
                    lastLogin: currentTime // Set to current time
                });
            } else {
                console.warn("No user data found for ID:", userId);
                setProfile(null);
            }
            setLoading(false);
        }).catch(error => {
            console.error("Error fetching user data:", error);
            setLoading(false);
            setProfile(null);
        });
    }, []);

    const handleEdit = (field: keyof UserProfile, value: string | number) => {
        setEditingField(field);
        setEditValue(String(value)); // Ensure editValue is always a string
        setIsEditing(true);
    };

    const handleCancel = () => {
        setEditingField(null);
        setEditValue("");
        // Check if there are other pending edits to keep isEditing true
        setIsEditing(Object.keys(pendingEdits).length > 0);
    };

    // Save a single field edit to pendingEdits, not to Firebase yet
    const handleFieldSave = () => {
        if (!editingField) return;

        let valueToSave: string | number = editValue;
        // Convert to number if the field is expected to be a number
        if (['totalProducts', 'totalSales', 'totalRevenue'].includes(editingField)) {
            valueToSave = Number(editValue);
            if (isNaN(valueToSave)) {
                console.error(`Invalid number for ${editingField}. Please enter a valid number.`);
                // Optionally, revert the edit or show an error to the user
                return;
            }
        }

        setPendingEdits({ ...pendingEdits, [editingField]: valueToSave });
        setProfile(prevProfile => prevProfile ? { ...prevProfile, [editingField]: valueToSave as any } : null); // Type assertion for flexibility
        setEditingField(null);
        setEditValue("");
        setIsEditing(true); // Keep isEditing true as there's a pending change
    };

    // Save all pending edits to Firebase
    const handleSaveAll = async () => {
        if (!profile || Object.keys(pendingEdits).length === 0) return;
        const userId = profile.userId;
        try {
            await update(ref(database, `users/${userId}`), pendingEdits);
            console.log("Profile updated successfully!");
            setPendingEdits({});
            setIsEditing(false);
        } catch (error) {
            console.error("Error updating profile:", error);
            // Optionally, revert local changes or show an error message
        }
    };

    // Cancel all edits
    const handleCancelAll = () => {
        setPendingEdits({});
        setIsEditing(false);
        setEditingField(null);
        setEditValue("");
        // Reload profile from DB to discard local changes
        const userId = getCurrentUserId();
        if (userId) {
            const dbRef = ref(database);
            get(child(dbRef, `users/${userId}`)).then(snapshot => {
                if (snapshot.exists()) {
                    const userData = snapshot.val();
                    const currentTime = new Date().toLocaleString(); // Re-fetch current time for lastLogin
                    setProfile({
                        userId: userId,
                        fullName: userData.fullName || "Admin User",
                        email: userData.email || "admin@example.com",
                        phone: userData.phone || "N/A",
                        profilePic: userData.profilePic || 'https://i.pravatar.cc/150?img=3',
                        role: userData.role || 'Administrator',
                        aboutMe: userData.aboutMe || "Dedicated administrator overseeing operations.",
                        gender: userData.gender || "Not specified",
                        dateOfBirth: userData.dateOfBirth || "Not set",
                        location: userData.location || "Not set",
                        totalProducts: userData.totalProducts || 0,
                        totalSales: userData.totalSales || 0,
                        totalRevenue: userData.totalRevenue || 0,
                        joinDate: userData.joinDate || "Not set",
                        lastLogin: userData.lastLogin || currentTime // Revert to DB value or current if not in DB
                    });
                }
            });
        }
    };

    // Handle profile picture upload (converts to base64 string)
    const handleProfilePicChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!profile) return;

        const file = e.target.files && e.target.files[0];
        if (!file) return;

        const reader = new FileReader();

        reader.onloadend = () => {
            const base64String = reader.result as string;

            setPendingEdits({ ...pendingEdits, profilePic: base64String });
            setProfile({ ...profile, profilePic: base64String });
            setIsEditing(true);
        };

        reader.readAsDataURL(file); // This converts image to base64
    };


    if (loading) {
        return <div style={{ textAlign: 'center', marginTop: 40 }}>Loading...</div>;
    }

    if (!profile) {
        return <div style={{ textAlign: 'center', marginTop: 40, color: 'red' }}>User not found.</div>;
    }

    const renderField = (label: string, field: keyof UserProfile, value: string | number, multiline = false, inputType: string = "text") => (
        <div className="profile-detail-block" style={multiline ? { flex: 2 } : {}}>
            <h4>{label}</h4>
            <div className="profile-detail-value" style={multiline ? { minHeight: 60 } : {}}>
                {editingField === field ? (
                    <span style={{ display: "flex", alignItems: "center", gap: 8, width: "100%" }}>
                        {multiline ? (
                            <textarea
                                value={editValue}
                                onChange={e => setEditValue(e.target.value)}
                                style={{ width: "100%", minHeight: 60, resize: "vertical", padding: "8px", border: "1px solid #ccc", borderRadius: "4px" }}
                            />
                        ) : (
                            <input
                                type={inputType}
                                value={editValue}
                                onChange={e => setEditValue(e.target.value)}
                                style={{ width: "100%", padding: "8px", border: "1px solid #ccc", borderRadius: "4px" }}
                            />
                        )}
                        <button onClick={handleFieldSave} title="Save" style={{ background: "none", border: "none", color: "#2dce89", fontSize: 20, cursor: "pointer" }}>
                            <IoMdCheckmark />
                        </button>
                        <button onClick={handleCancel} title="Cancel" style={{ background: "none", border: "none", color: "#f5365c", fontSize: 20, cursor: "pointer" }}>
                            <IoMdClose />
                        </button>
                    </span>
                ) : (
                    <span style={{ display: "flex", alignItems: "center", gap: 8, width: "100%" }}>
                        <span style={{ flexGrow: 1 }}>{value || <span style={{ color: "#bbb" }}>Not set</span>}</span>
                        <button
                            onClick={() => handleEdit(field, value)}
                            title="Edit"
                            style={{ background: "none", border: "none", color: "#1171ef", fontSize: 18, cursor: "pointer" }}
                        >
                            <IoMdCreate />
                        </button>
                    </span>
                )}
            </div>
        </div>
    );

    return (
        <div className="profile-container">
            <div className="profile-banner" style={{ position: "relative" }}>
                <img
                    src={profile.profilePic || 'https://i.pravatar.cc/150?img=3'}
                    alt="Avatar"
                    className="profile-avatar"
                />
                {/* Edit Profile Picture Button */}
                <label
                    htmlFor="profile-pic-upload"
                    style={{
                        position: "absolute",
                        left: 90,
                        bottom: 30,
                        background: "#fff",
                        borderRadius: "50%",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                        width: 36,
                        height: 36,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        border: "1px solid #eee"
                    }}
                    title="Change Profile Picture"
                >
                    <IoMdCamera color="#1171ef" size={22} />
                    <input
                        id="profile-pic-upload"
                        type="file"
                        accept="image/*"
                        style={{ display: "none" }}
                        onChange={handleProfilePicChange}
                    />
                </label>
                <div className="profile-info">
                    <h2 className="profile-name">{profile.fullName}</h2>
                    <div className="profile-role">{profile.role || 'Administrator'}</div>
                    <div className="profile-contact-info">
                        <span><strong>Email:</strong> {profile.email}</span>
                        <span><strong>Phone:</strong> {profile.phone}</span>
                    </div>
                    <div className="profile-dates-info">
                        <span><strong>Joined:</strong> {profile.joinDate || "Not set"}</span>
                        <span><strong>Last Login:</strong> {profile.lastLogin || "Not set"}</span>
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

            {/* Statistics Section (Display Only) */}
            <div className="profile-section">
                <h3>Admin Statistics</h3>
                <div className="profile-details">
                    <div><h4>Products Managed</h4><div>{profile.totalProducts.toLocaleString()}</div></div>
                    <div><h4>Total Sales</h4><div>{profile.totalSales.toLocaleString()}</div></div>
                    <div><h4>Total Revenue</h4><div>₹{profile.totalRevenue.toLocaleString()}</div></div>
                </div>
            </div>

            {/* My Account Section (Editable) */}
            <div className="profile-section">
                <h3>My Account</h3>
                <div className="profile-details">
                    {renderField("User ID", "userId", profile.userId)}
                    {renderField("Role", "role", profile.role)}
                    {renderField("Full Name", "fullName", profile.fullName)}
                </div>
            </div>

            {/* Contact Information Section (Editable) */}
            <div className="profile-section">
                <h3>Contact Information</h3>
                <div className="profile-details">
                    {renderField("Email", "email", profile.email, false, "email")}
                    {renderField("Phone", "phone", profile.phone, false, "tel")}
                </div>
            </div>

            {/* Personal Details Section (Editable) */}
            <div className="profile-section">
                <h3>Personal Details</h3>
                <div className="profile-details">
                    {renderField("Gender", "gender", profile.gender)}
                    {renderField("Date of Birth", "dateOfBirth", profile.dateOfBirth)}
                    {renderField("Location", "location", profile.location)}
                </div>
            </div>

            {/* About Me Section (Editable) */}
            <div className="profile-section">
                <h3>About Me</h3>
                <div className="profile-details">
                    {renderField("About Me", "aboutMe", profile.aboutMe, true)}
                </div>
            </div>

            {/* Save/Cancel All Edits Buttons */}
            {isEditing && !editingField && (
                <div style={{ display: "flex", justifyContent: "center", gap: 16, margin: "32px 0" }}>
                    <button
                        onClick={handleSaveAll}
                        style={{
                            background: "#1171ef",
                            color: "#fff",
                            border: "none",
                            borderRadius: 6,
                            padding: "10px 28px",
                            fontWeight: 600,
                            fontSize: 16,
                            cursor: "pointer"
                        }}
                    >
                        Save Changes
                    </button>
                    <button
                        onClick={handleCancelAll}
                        style={{
                            background: "#fff",
                            color: "#1171ef",
                            border: "1.5px solid #1171ef",
                            borderRadius: 6,
                            padding: "10px 28px",
                            fontWeight: 600,
                            fontSize: 16,
                            cursor: "pointer"
                        }}
                    >
                        Cancel
                    </button>
                </div>
            )}
        </div>
    );
};

export default Settings;
