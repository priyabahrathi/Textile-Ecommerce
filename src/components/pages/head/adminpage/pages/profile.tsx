import React, { useEffect, useState } from 'react';
import { database } from '../../../../../Store/Slice/firebase';
import { ref, get, child } from 'firebase/database';

// Utility to get the logged-in user's ID (you may use context, localStorage, etc.)
function getCurrentUserId() {
    // Example: return localStorage.getItem('adminUserId');
    // Replace with your actual logic for getting the logged-in user
    return localStorage.getItem('adminUserId'); // userId must match the key in /users/
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

    return (
        <div style={{ maxWidth: 400, margin: '40px auto', padding: 24, boxShadow: '0 2px 8px #eee', borderRadius: 8 }}>
            <div style={{ textAlign: 'center' }}>
                <img
                    src={user.profilePic || 'https://i.pravatar.cc/150?img=3'}
                    alt="Avatar"
                    style={{ width: 100, height: 100, borderRadius: '50%', marginBottom: 16 }}
                />
                <h2>{user.fullName}</h2>
                <p style={{ color: '#888' }}>{user.role || 'Administrator'}</p>
            </div>
            <div style={{ marginTop: 24 }}>
                <h4>Email</h4>
                <p>{user.email}</p>
                <h4 style={{ marginTop: 16 }}>Phone</h4>
                <p>{user.phone}</p>
                <h4 style={{ marginTop: 16 }}>User ID</h4>
                <p>{user.userId}</p>
            </div>
        </div>
    );
};

export default ProfilePage;

