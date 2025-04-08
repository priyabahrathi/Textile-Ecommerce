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
  
  close,
  home,
  pricetag,
  man,
  woman,
  cart,
  mail,
  bagHandle,
  footsteps,
  shirt,
} from "ionicons/icons";
import { FaTag } from "react-icons/fa";
import { IonMenuToggle } from "@ionic/react";
import "./Header.css";

const Header: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMediumScreen, setIsMediumScreen] = useState(window.innerWidth <= 1057);


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
      <IonMenu side="end" menuId="main-menu" contentId="main-content"  >
        <IonContent style={{ background: "white" }} className="menu-menu">
          <div style={{ display: "flex", justifyContent: "flex-end", padding: "10px" }}>
            <IonMenuToggle>
              <IonButton fill="clear">
                <IonIcon icon={close} />
              </IonButton>
            </IonMenuToggle>
          </div>

          <IonList className="head-list">
            <IonItem button className="head-item custom-item">
              <IonIcon className="ion-icon" icon={home} slot="start" />
              Home
            </IonItem>

            <IonAccordionGroup className="head-item " >
              <IonAccordion value="men"  >
                <IonItem slot="header" className="head-item custom-item">
                  <IonIcon className="ion-icon" icon={man} slot="start" />
                  <IonLabel>Men's</IonLabel>
                </IonItem>
                <div className="ion-padding item" slot="content">
                  <IonItem button className="color custom-item"><IonIcon className="ion-icon" icon={shirt} slot="start" /> Shirts</IonItem>
                  <IonItem button className="color custom-item"><IonIcon className="ion-icon" icon={footsteps} slot="start" /> Shoes</IonItem>
                  <IonItem button className="color custom-item"><IonIcon className="ion-icon" icon={bagHandle} slot="start" /> Accessories</IonItem>
                </div>
              </IonAccordion>

              <IonAccordion value="women">
                <IonItem slot="header" className="head-item custom-item">
                  <IonIcon className="ion-icon" icon={woman} slot="start" />
                  <IonLabel>Women's</IonLabel>
                </IonItem>
                <div className="ion-padding " slot="content">
                  <div className="drop-btn">
                  <IonItem button className="color custom-item"><IonIcon className="ion-icon"  icon={shirt} slot="start" /> Tops</IonItem>

                  </div>
                  <IonItem button className="color custom-item" ><IonIcon className="ion-icon" icon={footsteps} slot="start" /> Shoes</IonItem>
                  <IonItem button className="color custom-item"><IonIcon className="ion-icon" icon={bagHandle} slot="start" /> Accessories</IonItem>
                </div>
              </IonAccordion>
            </IonAccordionGroup>


            <IonItem button className="head-item custom-item">
              <IonIcon className="ion-icon" icon={pricetag} slot="start" />
              On Sale
            </IonItem>
          </IonList>

          {/* Right Icons */}
          <div className="right-icons" style={{ display: "flex", gap: "1px", marginTop: "5px", marginLeft:"30px" }}>
            <IonButton  className="custom-item " fill="clear">
              <IonIcon className="ion-icon" icon={cart} size="medium" />
            </IonButton>
            <IonButton className="custom-item" fill="clear">
              <IonIcon className="ion-icon" icon={mail} size="medium" />
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
                  <li style={{ color: 'white' }} ><IoHome /> Home</li>
                  <li>
                    <IoManSharp /> Men’s
                    <ul className="dropdown">
                      <li><IonIcon icon={shirt} /> Shirts</li>
                      <li><IonIcon icon={footsteps} /> Shoes</li>
                      <li><IonIcon icon={bagHandle} /> Accessories</li>
                    </ul>
                  </li>
                  <li>
                    <IoWoman /> Women’s
                    <ul className="dropdown">
                      <li><IonIcon icon={shirt} /> Tops</li>
                      <li><IonIcon icon={footsteps} /> Shoes</li>
                      <li><IonIcon icon={bagHandle} /> Accessories</li>
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
