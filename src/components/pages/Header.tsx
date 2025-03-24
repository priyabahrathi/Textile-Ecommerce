import { IonIcon } from "@ionic/react";
import React from "react";
import { bagHandleOutline, cart, footstepsOutline, logoIonic, mail, man, pricetag, shirtOutline, woman, womanOutline } from 'ionicons/icons';
import "./Header.css"
import { IoCart, IoHome, IoMail, IoManSharp, IoWoman } from "react-icons/io5";
import { FaTag } from "react-icons/fa";

const Header: React.FC = () => {
  return (
    <header className="ion-padding head">
      <div className="container">
        <div className="nav-item">
          <h3>Textile-Ecommerce</h3>

          <ul className="nav-list">
            <li><IoHome />Home</li>
            <li>
            <IoManSharp />Men’s
              <ul className="dropdown">
                <li><IonIcon icon={shirtOutline} /> Shirts</li>
                <li><IonIcon icon={footstepsOutline} /> Shoes</li>
                <li><IonIcon icon={bagHandleOutline} /> Accessories</li>
              </ul>
            </li>
            <li>
            <IoWoman />Women’s 
              <ul className="dropdown">
                <li><IonIcon icon={shirtOutline} /> Dresses</li>
                <li> <IonIcon icon={footstepsOutline} />Shoes</li>
                <li><IonIcon icon={bagHandleOutline} /> Accessories</li>
              </ul>
            </li>
            <li>on sale <FaTag /></li>
          </ul>

          <div className="nav-icon">
            <button><IoCart /></button>
            <button><IoMail /></button>



          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
