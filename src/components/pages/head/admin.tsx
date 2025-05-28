import React, { useState } from "react";
import {
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonButton,
  IonInput,
  IonLabel,
  IonItem,
} from "@ionic/react";
import { useHistory } from "react-router-dom";
import { database } from "../../../Store/Slice/firebase";
import { ref, set, get, child } from "firebase/database";
import "./admin.css"; // Import the CSS file

// Sign In Form Component
const SignInForm: React.FC<{
  userId: string;
  setUserId: (v: string) => void;
  password: string;
  setPassword: (v: string) => void;
  error: string;
  onSubmit: (e: React.FormEvent) => void;
}> = ({ userId, setUserId, password, setPassword, error, onSubmit }) => (
  <form onSubmit={onSubmit} style={{ width: "100%" }}>
    <IonItem>
      <IonLabel position="stacked">User ID / Email / Phone</IonLabel>
      <IonInput
        value={userId}
        onIonChange={e => setUserId(e.detail.value!)}
        required
        placeholder="Enter User ID, Email, or Phone"
      />
    </IonItem>
    <IonItem>
      <IonLabel position="stacked">Password</IonLabel>
      <IonInput
        type="password"
        value={password}
        onIonChange={e => setPassword(e.detail.value!)}
        required
      />
    </IonItem>
    {error && <div style={{ color: "red", marginTop: 8 }}>{error}</div>}
    <IonButton expand="block" type="submit" style={{ marginTop: 16 }}>
      Sign In
    </IonButton>
  </form>
);

const signInContent = {
  img: "https://cdn-icons-png.flaticon.com/512/3064/3064197.png",
  title: "Welcome Back!",
  desc: "Sign in to access your admin dashboard and manage your textile e-commerce platform efficiently.",
};

const AdminPanel: React.FC = () => {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const history = useHistory();

  // Sign In: Check user in Firebase with 3 options
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId || !password) {
      setError("Please enter your User ID, Email, or Phone and Password.");
      return;
    }
    try {
      const dbRef = ref(database);
      // Try User ID first
      let snapshot = await get(child(dbRef, `users/${userId}`));
      if (snapshot.exists() && snapshot.val().password === password) {
        setError("");
        localStorage.setItem('adminUserId', userId);
        history.push("/admin/dashboard");
        return;
      }

      // If not found, search by email or phone
      const usersSnap = await get(child(dbRef, "users"));
      if (usersSnap.exists()) {
        const users = usersSnap.val();
        for (const key in users) {
          const user = users[key];
          if (
            (user.email === userId || user.phone === userId) &&
            user.password === password
          ) {
            setError("");
            localStorage.setItem('adminUserId', user.userId);
            history.push("/admin/dashboard");
            return;
          }
        }
      }

      setError("Invalid credentials. Please try again.");
    } catch (err) {
      setError("Error signing in. Please try again.");
    }
  };

  return (
    <div className="admin-auth-root">
      <div className="admin-auth-header">
        <h1 className="ad-name">Admin Panel</h1>
        <p>Manage your textile e-commerce platform efficiently.</p>
      </div>

      <div className="admin-auth-top-btns">
        <IonButton color="primary">Sign In</IonButton>
      </div>

      <div className="admin-auth-anim">
        <div className="admin-auth-panel show" style={{ zIndex: 2 }}>
          <div className="admin-auth-form-side">
            <IonCard className="admin-auth-card">
              <IonCardHeader>
                <IonCardTitle className="admin-auth-title">
                  Admin Sign In
                </IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                <SignInForm
                  userId={userId}
                  password={password}
                  setUserId={setUserId}
                  setPassword={setPassword}
                  error={error}
                  onSubmit={handleSignIn}
                />
              </IonCardContent>
            </IonCard>
          </div>
          <div className="admin-auth-image-side">
            <img src={signInContent.img} alt="Sign In" />
            <h2 className="admin-auth-img-title">{signInContent.title}</h2>
            <p className="admin-auth-img-desc">{signInContent.desc}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
