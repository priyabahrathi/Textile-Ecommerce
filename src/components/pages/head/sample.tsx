import React, { useState, useEffect } from "react";
import {
  IonHeader,
  IonToolbar,
  IonButtons,
  IonMenuButton,
  IonTitle,
  IonMenu,
  IonContent,
  IonList,
  IonItem,
  IonButton,
  IonPopover,
  IonIcon,
} from "@ionic/react";

import { menuController } from "@ionic/core"; // ✅ Required for manual menu control
import { personCircle, cart, home, pricetag, man, woman, close } from "ionicons/icons";

import "./sample.css"; // Your custom styling

const Header: React.FC = () => {
  const [dropdown1Event, setDropdown1Event] = useState<MouseEvent | null>(null);
  const [dropdown2Event, setDropdown2Event] = useState<MouseEvent | null>(null);
  const [isMediumScreen, setIsMediumScreen] = useState(window.innerWidth <= 991);

  useEffect(() => {
    const handleResize = () => {
      setIsMediumScreen(window.innerWidth <= 991);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      {/* Side Menu */}
      <IonMenu side="end" menuId="main-menu" contentId="main-content">
        <IonContent>
          {/* Close Button */}
          <div style={{ display: "flex", justifyContent: "flex-end", padding: "10px" }}>
            <IonButton
              fill="clear"
              className="custom-close-btn"
              onClick={async () => await menuController.close()}
            >
              <IonIcon icon={close} />
            </IonButton>
          </div>

          {/* Menu Items */}
          <IonList>
            <IonItem button routerLink="/home">Home</IonItem>
            <IonItem button>Men’s</IonItem>
            <IonItem button>Women’s</IonItem>
            <IonItem button routerLink="/sale">On Sale</IonItem>
          </IonList>

          {/* Right Icons Inside Menu */}
          <div className="right-icons" style={{ display: "flex", justifyContent: "center", gap: "10px", marginTop: "20px" }}>
            <IonButton fill="clear">
              <IonIcon icon={cart} size="large" />
            </IonButton>
            <IonButton fill="clear">
              <IonIcon icon={personCircle} size="large" />
            </IonButton>
          </div>
        </IonContent>
      </IonMenu>

      <div id="main-content">
        {/* Header */}
        <IonHeader className="head">
          <IonToolbar className="custom-header">
            <div className="header-flex">
              {/* Brand */}
              <IonTitle className="brand">Algo-tex</IonTitle>

              {/* Centered Menus */}
              {!isMediumScreen && (
                <div className="menu-items">
                  <IonButton fill="clear" routerLink="/home">
                    <IonIcon icon={home} /> Home
                  </IonButton>
                  <IonButton fill="clear" onClick={(e) => setDropdown1Event(e.nativeEvent)}>
                    <IonIcon icon={man} /> Men’s
                  </IonButton>
                  <IonButton fill="clear" onClick={(e) => setDropdown2Event(e.nativeEvent)}>
                    <IonIcon icon={woman} /> Women’s
                  </IonButton>
                  <IonButton fill="clear" routerLink="/sale">
                    <IonIcon icon={pricetag} /> On Sale
                  </IonButton>
                </div>
              )}

              {/* Menu Button for Mobile */}
              {isMediumScreen && (
                <IonButtons slot="end">
                  <IonMenuButton menu="main-menu" />
                </IonButtons>
              )}
            </div>
          </IonToolbar>
        </IonHeader>
      </div>

      {/* Dropdown Menus */}
      <IonPopover
        isOpen={!!dropdown1Event}
        event={dropdown1Event!}
        onDidDismiss={() => setDropdown1Event(null)}
      >
        <IonContent>
          <IonList>
            <IonItem button>Shirts</IonItem>
            <IonItem button>Pants</IonItem>
          </IonList>
        </IonContent>
      </IonPopover>

      <IonPopover
        isOpen={!!dropdown2Event}
        event={dropdown2Event!}
        onDidDismiss={() => setDropdown2Event(null)}
      >
        <IonContent>
          <IonList>
            <IonItem button>Dresses</IonItem>
            <IonItem button>Skirts</IonItem>
          </IonList>
        </IonContent>
      </IonPopover>
    </>
  );
};

export default Header;
