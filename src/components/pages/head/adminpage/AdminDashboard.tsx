import React, { useState } from "react";
import { IonIcon } from "@ionic/react";
import { addCircle, statsChart, cart, settings, personCircle, camera, chevronBack, chevronForward } from "ionicons/icons";
import ManageProduct from "./pages/ManageProduct";
import ViewSales from "./pages/ViewSales";
import CheckoutAdminPage from "./pages/checkoutDetails";
import ProfilePage from "./pages/profile";
import Settings from "./pages/settings";
import BannerImg from "./pages/BannerImg";
import "./AdminDashboard.css";

const tabs = [
  { name: "profile", label: "Profile", icon: personCircle },
  { name: "Add Products", label: "Add Products", icon: addCircle },
  { name: "View Sales", label: "View Sales", icon: statsChart },
  { name: "Orders", label: "Orders", icon: cart },
  { name: "Settings", label: "Settings", icon: settings },
  { name: "banner", label: "Banners", icon: camera }
];

const AdminDashboard: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState("profile");
  const [collapsed, setCollapsed] = useState(false);

  const renderContent = () => {
    switch (selectedTab) {
      case "profile":
        return <ProfilePage />;
      case "Add Products":
        return <ManageProduct />;
      case "View Sales":
        return <ViewSales />;
      case "Orders":
        return <CheckoutAdminPage />;
      case "Settings":
        return <Settings />;
      case "banner":
        return <BannerImg />;
      default:
        return null;
    }
  };

  return (
    <>
    
    <div className="dashboard-container">
      <div className={`dashboard-sidebar ${collapsed ? "collapsed" : ""}`}>
        <button
          className="sidebar-toggle"
          onClick={() => setCollapsed(!collapsed)}
        >
          <IonIcon icon={collapsed ? chevronForward : chevronBack} />
        </button>

        <div className="sidebar-title">Admin</div>

        {tabs.map(tab => (
          <button
            key={tab.name}
            className={`sidebar-button ${selectedTab === tab.name ? "sidebar-button-active" : ""}`}
            onClick={() => setSelectedTab(tab.name)}
            title={collapsed ? tab.label : ""}
          >
            <IonIcon icon={tab.icon} slot="start" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="dashboard-content">{renderContent()}</div>
    </div>
    </>
  );
};

export default AdminDashboard;
