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
  IonMenuToggle,
  IonInput,
} from "@ionic/react";
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
  person,
  search,
  heart,
  personCircle,
  bag,
} from "ionicons/icons";
import {
  IoCart,
  IoHeart,
  IoHome,
  IoMail,
  IoManSharp,
  IoMenu,
  IoPerson,
  IoWoman,
} from "react-icons/io5";
import { FaTag } from "react-icons/fa";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setPage } from "../../Store/Slice/pageSlice"; // adjust path as needed
import "./Header.css";

const Header: React.FC = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1057);
  const history = useHistory();
  const dispatch = useDispatch();

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 1057);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      {/* Side Menu for Mobile */}
      <IonMenu side="start" menuId="main-menu" contentId="main-content">
        <IonContent style={{ background: "white" }}>
          <div style={{ display: "flex", justifyContent: "flex-end", padding: "10px" }}>
            <IonMenuToggle>
              <IonButton fill="clear" size="large">
                <IonIcon icon={close} />
              </IonButton>
            </IonMenuToggle>
          </div>
          <IonList>
            <IonItem>
              <IonInput placeholder="Search..." clearInput />
              <IonIcon icon={search} slot="end" />
            </IonItem>
            <IonItem button>
              <IonIcon icon={personCircle} slot="start" />
              Log In
            </IonItem>
            <IonItem button onClick={() => dispatch(setPage("wishlist"))}>
              <IonIcon icon={heart} slot="start" />
              Wishlist
            </IonItem>
            <IonItem button>
              <IonIcon icon={cart} slot="start" />
              Cart
            </IonItem>
          </IonList>
        </IonContent>
      </IonMenu>

      {/* Main Header */}
      <div id="main-content">
        <header className="container">
          <div className="nav-item" style={{ alignItems: "center" }}>
            {/* Logo */}
            <div>
              <h3 style={{ margin: 0 }}>StyleSync</h3>
            </div>

            {/* Search Bar Centered */}
            {!isMobile && (
              <div className="pro-header-search" >
                <IonInput placeholder="Search for products..." clearInput />
                <IonButton fill="clear" size="small">
                  <IonIcon icon={search} />
                </IonButton>
              </div>
            )}

            {/* Actions Right */}
            <div className="nav-icon" >
              {!isMobile && (
                <>
                  <IonButton fill="clear" onClick={() => dispatch(setPage("wishlist"))}>
                    <IonIcon icon={heart} size="large" title="Wishlist" />
                  </IonButton>
                  <IonButton fill="clear" >
                    <IonIcon icon={cart} size="large" title="Cart" />
                  </IonButton>
                  <IonButton fill="clear" onClick={() => dispatch(setPage("products"))}>
                    <IonIcon icon={bag} size="large" title="products" />
                  </IonButton>
                </>
              )}
              {isMobile && (
                <IonMenuButton menu="main-menu" className="menu-icon">
                  <IoMenu size={32} />
                </IonMenuButton>
              )}
            </div>
          </div>
        </header>
      </div>
    </>
  );
};

export default Header;
