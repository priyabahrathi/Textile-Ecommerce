import React, { useState } from "react";
import { IonIcon, IonButton } from "@ionic/react";
import { addCircle, statsChart, people, settings } from "ionicons/icons";

const tabs = [
  { name: "Add Products", icon: addCircle },
  { name: "View Sales", icon: statsChart },
  { name: "Users", icon: people },
  { name: "Settings", icon: settings },
];

const AdminDashboard: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState("Add Products");

  const renderContent = () => {
    switch (selectedTab) {
      case "Add Products":
        return <div>Add Products Content</div>;
      case "View Sales":
        return <div>View Sales Content</div>;
      case "Users":
        return <div>Users Management Content</div>;
      case "Settings":
        return <div>Settings Content</div>;
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
      <div style={{ flex: 1, padding: 32 }}>
        {renderContent()}
      </div>
    </div>
  );
};

export default AdminDashboard;