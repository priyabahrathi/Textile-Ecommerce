import React from "react";
import { IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonButton, IonIcon } from "@ionic/react";
import { IoMdAddCircle, IoMdListBox, IoMdSettings } from "react-icons/io";
// import "./AdminDashboard.css";

const AdminPage: React.FC = () => {
  return (
    <div className="admin-panel-container">
      <h2 className="admin-panel-title">Admin Panel</h2>
      <div className="admin-panel-actions">
        <IonCard className="admin-action-card">
          <IonCardHeader>
            <IonCardTitle>
              <IoMdAddCircle size={32} style={{ marginRight: 8 }} />
              Add Product
            </IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            Add new products to your store inventory.
            <br />
            <IonButton color="primary" expand="block" style={{ marginTop: 10 }}>
              Add Product
            </IonButton>
          </IonCardContent>
        </IonCard>
        <IonCard className="admin-action-card">
          <IonCardHeader>
            <IonCardTitle>
              <IoMdListBox size={32} style={{ marginRight: 8 }} />
              Manage Products
            </IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            View, edit, or remove existing products.
            <br />
            <IonButton color="secondary" expand="block" style={{ marginTop: 10 }}>
              Manage Products
            </IonButton>
          </IonCardContent>
        </IonCard>
        <IonCard className="admin-action-card">
          <IonCardHeader>
            <IonCardTitle>
              <IoMdSettings size={32} style={{ marginRight: 8 }} />
              Settings
            </IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            Configure admin preferences and store settings.
            <br />
            <IonButton color="tertiary" expand="block" style={{ marginTop: 10 }}>
              Settings
            </IonButton>
          </IonCardContent>
        </IonCard>
      </div>
    </div>
  );
};

export default AdminPage;