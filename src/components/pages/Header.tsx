import React, { useState, useEffect } from "react";
import {
  IonMenu,
  IonContent,
  IonList,
  IonItem,
  IonButton,
  IonIcon,
  IonMenuButton,
  IonLabel,
  IonAccordionGroup,
  IonAccordion,
  IonItemDivider,
  IonListHeader,
} from "@ionic/react";
import { menuController } from "@ionic/core";

import {
  IoCart,
  IoHome,
  IoMail,
  IoManSharp,
  IoMenu,
  IoWoman,
} from "react-icons/io5";
import {
  shirtOutline,
  footstepsOutline,
  bagHandleOutline,
  close,
  home,
  pricetag,
  man,
  woman,
  cart,
  mail,
} from "ionicons/icons";
import { FaTag } from "react-icons/fa";

import "./Header.css";

const Header: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMediumScreen, setIsMediumScreen] = useState(window.innerWidth <= 1057);
  const [showMen, setShowMen] = useState(false);
  const [showWomen, setShowWomen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMediumScreen(window.innerWidth <= 1057);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      {/* Ionic Side Menu */}
      <IonMenu side="end" menuId="main-menu" contentId="main-content">
        <IonContent>
          <div style={{ display: "flex", justifyContent: "flex-end", padding: "10px" }}>
            <IonButton
              fill="clear"
              onClick={async () => await menuController.close()}
            >
              <IonIcon icon={close} />
            </IonButton>
          </div>

          <IonList>
            <IonItem button>
              <IonIcon icon={home} slot="start" />
              Home
            </IonItem>

            {/* Men’s Dropdown */}
            <IonItem button onClick={() => setShowMen(!showMen)}>
              <IonIcon icon={man} slot="start" />
              Men’s
            </IonItem>
            {showMen && (
              <>
                <IonItem button style={{ paddingLeft: "2rem" }}>
                  <IonIcon icon={shirtOutline} slot="start" /> Shirts
                </IonItem>
                <IonItem button style={{ paddingLeft: "2rem" }}>
                  <IonIcon icon={footstepsOutline} slot="start" /> Shoes
                </IonItem>
                <IonItem button style={{ paddingLeft: "2rem" }}>
                  <IonIcon icon={bagHandleOutline} slot="start" /> Accessories
                </IonItem>
              </>
            )}

            {/* Women’s Dropdown */}
            <IonItem button onClick={() => setShowWomen(!showWomen)}>
              <IonIcon icon={woman} slot="start" />
              Women’s
            </IonItem>
            {showWomen && (
              <>
                <IonItem button style={{ paddingLeft: "2rem" }}>
                  <IonIcon icon={shirtOutline} slot="start" /> Tops
                </IonItem>
                <IonItem button style={{ paddingLeft: "2rem" }}>
                  <IonIcon icon={footstepsOutline} slot="start" /> Shoes
                </IonItem>
                <IonItem button style={{ paddingLeft: "2rem" }}>
                  <IonIcon icon={bagHandleOutline} slot="start" /> Accessories
                </IonItem>
              </>
            )}

            <IonItem button>
              <IonIcon icon={pricetag} slot="start" />
              On Sale
            </IonItem>
          </IonList>

          {/* Right Icons */}
          <div className="right-icons" style={{ display: "flex", justifyContent: "center", gap: "10px", marginTop: "20px" }}>
            <IonButton fill="clear">
            <IonIcon icon={cart} size="large" />
            </IonButton>
            <IonButton fill="clear">
              <IonIcon icon={mail} size="large" />
            </IonButton>
          </div>
        </IonContent>
      </IonMenu>

      <div id="main-content">
        <header className="ion-padding head">
          <div className="container">
            <div className="nav-item">
              <h3>Algo-Tex</h3>

              {isMediumScreen ? (
                <IonMenuButton menu="main-menu" className="menu-icon" />
              ) : (
                <button className="menu-icon" onClick={toggleMenu}>
                  <IoMenu />
                </button>
              )}

              {!isMediumScreen && (
                <ul className={`nav-list ${menuOpen ? "show-menu" : ""}`}>
                  <li><IoHome /> Home</li>
                  <li>
                    <IoManSharp /> Men’s
                    <ul className="dropdown">
                      <li><IonIcon icon={shirtOutline} /> Shirts</li>
                      <li><IonIcon icon={footstepsOutline} /> Shoes</li>
                      <li><IonIcon icon={bagHandleOutline} /> Accessories</li>
                    </ul>
                  </li>
                  <li>
                    <IoWoman /> Women’s
                    <ul className="dropdown">
                      <li><IonIcon icon={shirtOutline} /> Tops</li>
                      <li><IonIcon icon={footstepsOutline} /> Shoes</li>
                      <li><IonIcon icon={bagHandleOutline} /> Accessories</li>
                    </ul>
                  </li>
                  <li>On Sale <FaTag /></li>
                </ul>
              )}

              {!isMediumScreen && (
                <div className="nav-icon">
                  <button><IoCart /></button>
                  <button><IoMail /></button>
                </div>
              )}
            </div>
          </div>
        </header>
      </div>
    </>
  );
};

export default Header;
