import React, { useState } from "react";
import { IonIcon, IonButton } from "@ionic/react";
import { addCircle, statsChart, cart, settings,personCircle, people } from "ionicons/icons";
import ManageProduct from "./pages/ManageProduct";
import ViewSales from "./pages/ViewSales";
import CheckoutAdminPage from "./pages/checkout";
import ProfilePage from "./pages/profile";
import Settings from "./pages/settings";

const tabs = [
  {name:"profile", icon:personCircle},
  { name: "Add Products", icon: addCircle },
  { name: "View Sales", icon: statsChart },
  { name: "Chekouts", icon: cart },
  { name: "Settings", icon: settings },
];

const AdminDashboard: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState("profile");

  const renderContent = () => {
    switch (selectedTab) {
      case "profile":
        return <div><ProfilePage/></div>;
      case "Add Products":
        return <div><ManageProduct /></div>;
      case "View Sales":
        return <div><ViewSales/></div>;
      case "Chekouts":
        return <div><CheckoutAdminPage/></div>;
      case "Settings":
        return <div><Settings/></div>;
      default:
        return null;
    }
  };

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <div style={{
        width: 220,
        background: "#f4f4f4",
        padding: 20,
        boxShadow: "2px 0 5px rgba(0,0,0,0.05)"
      }}>
        <h2>Admin</h2>
        {tabs.map(tab => (
          <IonButton
            key={tab.name}
            fill={selectedTab === tab.name ? "solid" : "clear"}
            expand="block"
            onClick={() => setSelectedTab(tab.name)}
            style={{ marginBottom: 10, textAlign: "left" }}
          >
            <IonIcon icon={tab.icon} slot="start" />
            {tab.name}
          </IonButton>
        ))}
      </div>
      <div style={{ flex: 1, padding: 32,  maxHeight: "100vh", overflowY: "auto" }}>
        {renderContent()}
      </div>
    </div>
  );
};

export default AdminDashboard;