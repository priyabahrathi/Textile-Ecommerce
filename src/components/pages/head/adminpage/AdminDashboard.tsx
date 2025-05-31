import React, { useState } from "react";
import { IonIcon } from "@ionic/react";
import { addCircle, statsChart, cart, settings, personCircle, camera, chevronBack, chevronForward, logOutOutline } from "ionicons/icons";
import CheckoutAdminPage from "./pages/checkoutDetails";
import ProfilePage from "./pages/profile";
import Settings from "./pages/settings";
import BannerImg from "./pages/BannerImg";
import "./AdminDashboard.css";
import ProductManage from "./pages/productmanage";
import Dashboard from "./pages/Dashboard";
import "./pages/global css/adminGlobal.css"
const tabs = [
  { name: "Dashboard", label: "Dashboard", icon: statsChart },
  { name: "ManageProduct", label: "Manage Products", icon: addCircle },
  { name: "Orders", label: "Orders", icon: cart },
  { name: "banner", label: "Banners", icon: camera },
  { name: "profile", label: "Profile", icon: personCircle },
{ name: "Settings", label: "Settings", icon: settings },
{ name:"Logout", label: "Logout", icon: logOutOutline },
];

const AdminDashboard: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState("Dashboard");
  const [collapsed, setCollapsed] = useState(false);
const removeItem = (key: string) => {
  localStorage.removeItem(key);
};
  const renderContent = () => {
    switch (selectedTab) {
      case "profile":
        return <ProfilePage />;
      
     case "ManageProduct":
        return <ProductManage />;
      case "Dashboard":
        return <Dashboard />;
      case "Orders":
        return <CheckoutAdminPage />;
      case "Settings":
        return <Settings />;
      case "banner":
        return <BannerImg />;
        case "Logout":
          removeItem('adminUserId');
          window.location.href = '/admin'; // Redirect to admin login page
        return null; // No content for logout, just redirect
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
