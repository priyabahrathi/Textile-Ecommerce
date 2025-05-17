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
  password: string;
  setUserId: (v: string) => void;
  setPassword: (v: string) => void;
  error: string;
  onSubmit: (e: React.FormEvent) => void;
}> = ({ userId, password, setUserId, setPassword, error, onSubmit }) => (
  <form onSubmit={onSubmit} style={{ width: "100%" }}>
    <IonItem>
      <IonLabel position="stacked">User ID</IonLabel>
      <IonInput
        value={userId}
        onIonChange={e => setUserId(e.detail.value!)}
        required
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

// Sign Up Form Component
const SignUpForm: React.FC<{
  userId: string;
  password: string;
  setUserId: (v: string) => void;
  setPassword: (v: string) => void;
  error: string;
  onSubmit: (e: React.FormEvent) => void;
}> = ({ userId, password, setUserId, setPassword, error, onSubmit }) => (
  <form onSubmit={onSubmit} style={{ width: "100%" }}>
    <IonItem>
      <IonLabel position="stacked">User ID</IonLabel>
      <IonInput
        value={userId}
        onIonChange={e => setUserId(e.detail.value!)}
        required
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
      Sign Up
    </IonButton>
  </form>
);

const signInContent = {
  img: "https://cdn-icons-png.flaticon.com/512/3064/3064197.png",
  title: "Welcome Back!",
  desc: "Sign in to access your admin dashboard and manage your textile e-commerce platform efficiently.",
};
const signUpContent = {
  img: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
  title: "Create Admin Account",
  desc: "Sign up to become an admin and start managing your textile e-commerce store with powerful tools.",
};

const AdminPanel: React.FC = () => {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [animating, setAnimating] = useState(false);
  const history = useHistory();

  // Animation handler
  const switchMode = (newMode: "signin" | "signup") => {
    if (mode !== newMode) {
      setAnimating(true);
      setTimeout(() => {
        setMode(newMode);
        setAnimating(false);
        setError("");
        setUserId("");
        setPassword("");
      }, 400);
    }
  };

  // Sign Up: Store user in Firebase
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId || !password) {
      setError("Please enter both User ID and Password.");
      return;
    }
    try {
      const dbRef = ref(database);
      const snapshot = await get(child(dbRef, `users/${userId}`));
      if (snapshot.exists()) {
        setError("User ID already exists.");
        return;
      }
      await set(ref(database, `users/${userId}`), { password });
      setError("");
      alert("Sign up successful! Please sign in.");
      setMode("signin");
      setUserId("");
      setPassword("");
    } catch (err) {
      setError("Error signing up. Please try again.");
    }
  };

  // Sign In: Check user in Firebase
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId || !password) {
      setError("Please enter both User ID and Password.");
      return;
    }
    try {
      const dbRef = ref(database);
      const snapshot = await get(child(dbRef, `users/${userId}`));
      if (snapshot.exists() && snapshot.val().password === password) {
        setError("");
        history.push("/admin/dashboard");
      } else {
        setError("Invalid ID or Password");
      }
    } catch (err) {
      setError("Error signing in. Please try again.");
    }
  };

  // Select content based on mode
  const content = mode === "signin" ? signInContent : signUpContent;

  return (
    <div className="admin-auth-root">
      <div className="admin-auth-header">
        <h1 className="ad-name">Admin Panel</h1>
        <p>Manage your textile e-commerce platform efficiently.</p>
      </div>
      {/* Top Buttons */}
      <div className="admin-auth-top-btns">
        <IonButton
          color={mode === "signin" ? "primary" : "medium"}
          onClick={() => switchMode("signin")}
        >
          Sign In
        </IonButton>
        <IonButton
          color={mode === "signup" ? "primary" : "medium"}
          onClick={() => switchMode("signup")}
        >
          Sign Up
        </IonButton>
      </div>

      {/* Centered Form + Image/Text */}
      <div className="admin-auth-anim">
        {/* Sign In Panel */}
        <div
          className={`admin-auth-panel ${mode === "signin" && !animating ? "show" : "hide"}`}
          style={{ zIndex: mode === "signin" ? 2 : 1 }}
        >
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
        {/* Sign Up Panel */}
        <div
          className={`admin-auth-panel signup ${mode === "signup" && !animating ? "show" : "hide"}`}
          style={{ zIndex: mode === "signup" ? 2 : 1 }}
        >
          <div className="admin-auth-image-side">
            <img src={signUpContent.img} alt="Sign Up" />
            <h2 className="admin-auth-img-title">{signUpContent.title}</h2>
            <p className="admin-auth-img-desc">{signUpContent.desc}</p>
          </div>
          <div className="admin-auth-form-side">
            <IonCard className="admin-auth-card">
              <IonCardHeader>
                <IonCardTitle className="admin-auth-title">
                  Admin Sign Up
                </IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                <SignUpForm
                  userId={userId}
                  password={password}
                  setUserId={setUserId}
                  setPassword={setPassword}
                  error={error}
                  onSubmit={handleSignUp}
                />
              </IonCardContent>
            </IonCard>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;