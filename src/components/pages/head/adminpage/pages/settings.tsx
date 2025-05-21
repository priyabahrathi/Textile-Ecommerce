import React, { useEffect, useState } from "react";
import { database } from '../../../../../Store/Slice/firebase';
import { ref, get, child, update } from "firebase/database";
import { IoMdCreate, IoMdCheckmark, IoMdClose, IoMdCamera } from "react-icons/io";
import "./profile.css";

function getCurrentUserId() {
    return localStorage.getItem('adminUserId');
}

const Settings: React.FC = () => {
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [editingField, setEditingField] = useState<string | null>(null);
    const [editValue, setEditValue] = useState<string>("");
    const [pendingEdits, setPendingEdits] = useState<any>({}); // Track all edits
    const [isEditing, setIsEditing] = useState(false); // Track if any field is being edited

    useEffect(() => {
        const userId = getCurrentUserId();
        if (!userId) {
            setLoading(false);
            return;
        }
        const dbRef = ref(database);
        get(child(dbRef, `users/${userId}`)).then(snapshot => {
            if (snapshot.exists()) {
                setProfile(snapshot.val());
            }
            setLoading(false);
        });
    }, []);

    const handleEdit = (field: string, value: string) => {
        setEditingField(field);
        setEditValue(value);
        setIsEditing(true);
    };

    const handleCancel = () => {
        setEditingField(null);
        setEditValue("");
        setIsEditing(Object.keys(pendingEdits).length > 0);
    };

    // Save a single field edit to pendingEdits, not to Firebase yet
    const handleFieldSave = () => {
        setPendingEdits({ ...pendingEdits, [editingField!]: editValue });
        setProfile({ ...profile, [editingField!]: editValue });
        setEditingField(null);
        setEditValue("");
        setIsEditing(true);
    };

    // Save all pending edits to Firebase
    const handleSaveAll = async () => {
        if (!profile || Object.keys(pendingEdits).length === 0) return;
        const userId = profile.userId;
        await update(ref(database, `users/${userId}`), pendingEdits);
        setProfile({ ...profile, ...pendingEdits });
        setPendingEdits({});
        setIsEditing(false);
    };

    // Cancel all edits
    const handleCancelAll = () => {
        setPendingEdits({});
        setIsEditing(false);
        setEditingField(null);
        setEditValue("");
        // Optionally, reload profile from DB to discard local changes
        const userId = getCurrentUserId();
        if (userId) {
            const dbRef = ref(database);
            get(child(dbRef, `users/${userId}`)).then(snapshot => {
                if (snapshot.exists()) {
                    setProfile(snapshot.val());
                }
            });
        }
    };

    // Handle profile picture upload (URL only for simplicity)
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

    const renderField = (label: string, field: string, value: string, multiline = false) => (
        <div className="profile-detail-block" style={multiline ? { flex: 2 } : {}}>
            <h4>{label}</h4>
            <div className="profile-detail-value" style={multiline ? { minHeight: 60 } : {}}>
                {editingField === field ? (
                    <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        {multiline ? (
                            <textarea
                                value={editValue}
                                onChange={e => setEditValue(e.target.value)}
                                style={{ width: "100%", minHeight: 60, resize: "vertical" }}
                            />
                        ) : (
                            <input
                                type="text"
                                value={editValue}
                                onChange={e => setEditValue(e.target.value)}
                                style={{ width: "100%" }}
                            />
                        )}
                        <button onClick={handleFieldSave} title="Save" style={{ background: "none", border: "none", color: "#2dce89", fontSize: 20 }}>
                            <IoMdCheckmark />
                        </button>
                        <button onClick={handleCancel} title="Cancel" style={{ background: "none", border: "none", color: "#f5365c", fontSize: 20 }}>
                            <IoMdClose />
                        </button>
                    </span>
                ) : (
                    <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span>{value || <span style={{ color: "#bbb" }}>Not set</span>}</span>
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
                </div>
            </div>
            {/* My Account Section */}
            <div className="profile-section">
                <h3>My Account</h3>
                <div className="profile-details">
                    {renderField("User ID", "userId", profile.userId)}
                    {renderField("Role", "role", profile.role || "Administrator")}
                    {renderField("Full Name", "fullName", profile.fullName)}
                </div>
            </div>
            {/* Contact Information Section */}
            <div className="profile-section">
                <h3>Contact Information</h3>
                <div className="profile-details">
                    {renderField("Email", "email", profile.email)}
                    {renderField("Phone", "phone", profile.phone)}
                </div>
            </div>
            {/* About Me Section */}
            <div className="profile-section">
                <h3>About Me</h3>
                <div className="profile-details">
                    {renderField("About Me", "aboutMe", profile.aboutMe || "", true)}
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