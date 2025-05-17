import React, { useState } from "react";

interface Profile {
    name: string;
    email: string;
    phone: string;
}

const initialProfile: Profile = {
    name: "",
    email: "",
    phone: "",
};

const Settings: React.FC = () => {
    const [profile, setProfile] = useState<Profile>(initialProfile);
    const [editing, setEditing] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setProfile((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleEdit = () => setEditing(true);

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        // Here you would typically send the updated profile to your backend
        setEditing(false);
        alert("Profile updated!");
    };

    return (
        <div style={{ maxWidth: 400, margin: "2rem auto", padding: 24, border: "1px solid #eee", borderRadius: 8 }}>
            <h2>Profile Settings</h2>
            <form onSubmit={handleSave}>
                <div style={{ marginBottom: 16 }}>
                    <label>
                        Name:
                        <input
                            type="text"
                            name="name"
                            value={profile.name}
                            onChange={handleChange}
                            disabled={!editing}
                            style={{ width: "100%", padding: 8, marginTop: 4 }}
                            required
                        />
                    </label>
                </div>
                <div style={{ marginBottom: 16 }}>
                    <label>
                        Email:
                        <input
                            type="email"
                            name="email"
                            value={profile.email}
                            onChange={handleChange}
                            disabled={!editing}
                            style={{ width: "100%", padding: 8, marginTop: 4 }}
                            required
                        />
                    </label>
                </div>
                <div style={{ marginBottom: 16 }}>
                    <label>
                        Phone:
                        <input
                            type="tel"
                            name="phone"
                            value={profile.phone}
                            onChange={handleChange}
                            disabled={!editing}
                            style={{ width: "100%", padding: 8, marginTop: 4 }}
                        />
                    </label>
                </div>
                {editing ? (
                    <button type="submit" style={{ padding: "8px 16px" }}>
                        Save
                    </button>
                ) : (
                    <button type="button" onClick={handleEdit} style={{ padding: "8px 16px" }}>
                        Edit Profile
                    </button>
                )}
            </form>
        </div>
    );
};

export default Settings;