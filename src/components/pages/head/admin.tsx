import React, { useState, useEffect } from "react";
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

// Sign Up Form Component
const SignUpForm: React.FC<{
  userId: string;
  setUserId: (v: string) => void;
  password: string;
  setPassword: (v: string) => void;
  fullName: string;
  setFullName: (v: string) => void;
  email: string;
  setEmail: (v: string) => void;
  phone: string;
  setPhone: (v: string) => void;
  role: string;
  setRole: (v: string) => void;
  profilePic: string;
  setProfilePic: (v: string) => void;
  error: string;
  onSubmit: (e: React.FormEvent) => void;
  userIdEditable: boolean;
  setUserIdEditable: (v: boolean) => void;
}> = ({
  userId,
  setUserId,
  password,
  setPassword,
  fullName,
  setFullName,
  email,
  setEmail,
  phone,
  setPhone,
  role,
  setRole,
  profilePic,
  setProfilePic,
  error,
  onSubmit,
  userIdEditable,
  setUserIdEditable,
}) => {
  // Auto-generate userId when fullName changes and userId is not manually edited
  useEffect(() => {
    if (!userIdEditable && fullName) {
      (async () => {
        const newId = await generateUserId(fullName);
        setUserId(newId);
      })();
    }
    // eslint-disable-next-line
  }, [fullName]);

  // Generate a base userId from the full name
  async function generateUserId(fullName: string) {
    let base = fullName.trim().toLowerCase().replace(/\s+/g, "");
    if (!base) base = "seller";
    let userId = base;
    let counter = 1;
    const dbRef = ref(database);
    let snapshot = await get(child(dbRef, `users/${userId}`));
    // If exists, try seller0001, seller0002, etc.
    while (snapshot.exists()) {
      userId = `${base}${String(counter).padStart(4, "0")}`;
      snapshot = await get(child(dbRef, `users/${userId}`));
      counter++;
    }
    return userId;
  }

  return (
    <form onSubmit={onSubmit} style={{ width: "100%" }}>
      <IonItem>
        <IonLabel position="stacked">Full Name</IonLabel>
        <IonInput value={fullName} onIonChange={e => setFullName(e.detail.value!)} required />
      </IonItem>
      <IonItem>
        <IonLabel position="stacked">User ID</IonLabel>
        <IonInput
          value={userId}
          onIonChange={e => {
            setUserId(e.detail.value!);
            setUserIdEditable(true);
          }}
          required
          readonly={!userIdEditable}
        />
        {!userIdEditable && (
          <IonButton
            size="small"
            fill="clear"
            slot="end"
            onClick={e => {
              e.preventDefault();
              setUserIdEditable(true);
            }}
          >
            Edit
          </IonButton>
        )}
      </IonItem>
      <IonItem>
        <IonLabel position="stacked">Password</IonLabel>
        <IonInput type="password" value={password} onIonChange={e => setPassword(e.detail.value!)} required />
      </IonItem>
      <IonItem>
        <IonLabel position="stacked">Email</IonLabel>
        <IonInput type="email" value={email} onIonChange={e => setEmail(e.detail.value!)} required />
      </IonItem>
      <IonItem>
        <IonLabel position="stacked">Phone Number</IonLabel>
        <IonInput type="tel" value={phone} onIonChange={e => setPhone(e.detail.value!)} required />
      </IonItem>
      <IonItem>
        <IonLabel position="stacked">Role</IonLabel>
        <IonInput value={role} onIonChange={e => setRole(e.detail.value!)} placeholder="Admin, Manager, etc." />
      </IonItem>
      <IonItem>
        <IonLabel position="stacked">Profile Picture URL</IonLabel>
        <IonInput value={profilePic} onIonChange={e => setProfilePic(e.detail.value!)} placeholder="Optional" />
      </IonItem>
      {error && <div style={{ color: "red", marginTop: 8 }}>{error}</div>}
      <IonButton expand="block" type="submit" style={{ marginTop: 16 }}>
        Sign Up
      </IonButton>
    </form>
  );
};

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
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("");
  const [profilePic, setProfilePic] = useState("");
  const [userIdEditable, setUserIdEditable] = useState(false);
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
        setFullName("");
        setEmail("");
        setPhone("");
        setRole("");
        setProfilePic("");
      }, 400);
    }
  };

  // Generate a base userId from the full name
  const generateUserId = async (fullName: string) => {
    let base = fullName.trim().toLowerCase().replace(/\s+/g, "");
    if (!base) base = "seller";
    let userId = base;
    let counter = 1;
    const dbRef = ref(database);
    let snapshot = await get(child(dbRef, `users/${userId}`));
    // If exists, try seller0001, seller0002, etc.
    while (snapshot.exists()) {
      userId = `${base}${String(counter).padStart(4, "0")}`;
      snapshot = await get(child(dbRef, `users/${userId}`));
      counter++;
    }
    return userId;
  };

  // Sign Up: Store user in Firebase
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId || !password || !fullName || !email || !phone) {
      setError("Please fill all required fields.");
      return;
    }
    try {
      const dbRef = ref(database);
      const snapshot = await get(child(dbRef, `users/${userId}`));
      if (snapshot.exists()) {
        setError("User ID already exists. Please choose another or edit the User ID.");
        setUserIdEditable(true);
        return;
      }
      await set(ref(database, `users/${userId}`), {
        userId,
        password,
        fullName,
        email,
        phone,
        role: role || "Admin",
        profilePic: profilePic || "",
      });
      setError("");
      alert("Sign up successful! Please sign in.");
      setMode("signin");
      setUserId("");
      setPassword("");
      setFullName("");
      setEmail("");
      setPhone("");
      setRole("");
      setProfilePic("");
      setUserIdEditable(false);
    } catch (err) {
      setError("Error signing up. Please try again.");
    }
  };

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
        localStorage.setItem('adminUserId', userId); // <-- Store userId for profile page
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
            localStorage.setItem('adminUserId', user.userId); // <-- Store the actual userId
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
                  setUserId={setUserId}
                  password={password}
                  setPassword={setPassword}
                  fullName={fullName}
                  setFullName={setFullName}
                  email={email}
                  setEmail={setEmail}
                  phone={phone}
                  setPhone={setPhone}
                  role={role}
                  setRole={setRole}
                  profilePic={profilePic}
                  setProfilePic={setProfilePic}
                  error={error}
                  onSubmit={handleSignUp}
                  userIdEditable={userIdEditable}
                  setUserIdEditable={setUserIdEditable}
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