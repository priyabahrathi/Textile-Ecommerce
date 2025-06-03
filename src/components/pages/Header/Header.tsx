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
  IonInput,
  IonMenuToggle,
} from "@ionic/react";
import {
  close,
  heart,
  bag,
  cart,
  search,
  home,
  bagCheck,
  shirt,
}from "ionicons/icons";
import { IoMenu, IoRemove, IoAdd } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { setPage } from '../../../Store/Slice/pageSlice';
import { RootState } from '../../../Store/store';
import { addToCart, incrementQuantity, decrementQuantity } from '../../../Store/Slice/cartSlice';
import "./Header.css";
const Header: React.FC = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1057);
  const dispatch = useDispatch();

  interface CartItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
    size?: string;
    img?: string;
    images?: string[];
  }

  const cartItems = useSelector((state: RootState) => state.cart?.items || []);
  const cartCount = cartItems.length;
  const activePage = useSelector((state: RootState) => state.page.currentPage);


  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 1057);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleMenuOpen = () => {
    if (document.activeElement && typeof (document.activeElement as HTMLElement).blur === "function") {
      (document.activeElement as HTMLElement).blur();
    }
  };

  return (
    <>
      {/* Main Left Menu */}
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
            
            <IonItem button  onClick={() => dispatch(setPage("home"))}>
              <IonIcon icon={home} slot="start" />
              Home
            </IonItem>
            <IonItem button onClick={() => dispatch(setPage("products"))}>
              <IonIcon icon={bag} slot="start" />
              Product
            </IonItem>
            <IonItem button onClick={() => dispatch(setPage("wishlist"))}>
              <IonIcon icon={heart} slot="start" />
              Wishlist
            </IonItem>
            <IonItem button onClick={() => dispatch(setPage("checkout"))}>
              <IonIcon icon={cart} slot="start" />
              Cart
            </IonItem>
            <IonItem button onClick={() => dispatch(setPage("history"))}>
              <IonIcon icon={cart} slot="start" />
              History
            </IonItem>
          </IonList>

          {/* Optional cart display */}
          {/* <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {cartItems.map((item: CartItem) => (
              <li key={item.id + (item.size || '')} style={{ borderBottom: "1px solid #eee", padding: "10px 0" }}>
                <div style={{ fontWeight: 600 }}>{item.name}</div>
                <div style={{ fontSize: 14, color: "#555", display: "flex", alignItems: "center", gap: 8 }}>
                  <button
                    style={{
                      border: "none",
                      background: "#ffebee",
                      borderRadius: "50%",
                      width: 24,
                      height: 24,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 18,
                      color: "#ff5722"
                    }}
                    onClick={() => dispatch(decrementQuantity({ id: item.id, size: item.size }))}
                  >
                    <IoRemove />
                  </button>
                  <span style={{ minWidth: 24, textAlign: "center" }}>{item.quantity}</span>
                  <button
                    style={{
                      border: "none",
                      background: "#e8f5e9",
                      borderRadius: "50%",
                      width: 24,
                      height: 24,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 18,
                      color: "#388e3c"
                    }}
                    onClick={() => dispatch(incrementQuantity({ id: item.id, size: item.size }))}
                  >
                    <IoAdd />
                  </button>
                  {item.size && <span style={{ marginLeft: 8 }}>| Size: {item.size}</span>}
                </div>
                <div style={{ fontSize: 14, color: "#ff5722" }}>
                  ₹{item.price} {item.quantity > 1 && <>x {item.quantity} = ₹{item.price * item.quantity}</>}
                </div>
              </li>
            ))}
          </ul> */}
        </IonContent>
      </IonMenu>

      {/* Right Cart Menu */}


      {/* Header */}
      <div id="main-content">
        <div className="container">
          <div className="nav-item" style={{ alignItems: "center" }}>
            <div>
              <h3 style={{ margin: 0, cursor: 'pointer' }} onClick={() => dispatch(setPage("home"))}>StyleSync</h3>
            </div>

            <div className="nav-icon">
              {!isMobile && (
                <>
                  <div className={`icon-with-label ${activePage === "home" ? "active-icon" : ""}`} onClick={() => dispatch(setPage("home"))}>
                    <IonButton fill="clear">
                      <IonIcon icon={home} size="large" />
                    </IonButton>
                    <span className="icon-label">Home</span>
                  </div>
                  <div className={`icon-with-label ${activePage === "wishlist" ? "active-icon" : ""}`} onClick={() => dispatch(setPage("wishlist"))}>
                    <IonButton fill="clear">
                      <IonIcon icon={heart} size="large" />
                    </IonButton>
                    <span className="icon-label">Wishlist</span>
                  </div>

                  <div className="icon-with-label">
                    <IonMenuButton menu="cart-menu" autoHide={false} onClick={() => dispatch(setPage("checkout"))} style={{ position: "relative", margin: "0 8px" }}>
                      <IonIcon icon={cart} size="large" />
                      {cartCount > 0 && (
                        <span className="cart-badge">{cartCount}</span>
                      )}
                    </IonMenuButton>
                    <span className="icon-label">Cart</span>
                  </div>

                  <div className={`icon-with-label ${activePage === "products" ? "active-icon" : ""}`} onClick={() => dispatch(setPage("products"))}>
                    <IonButton fill="clear">
                      <IonIcon icon={shirt} size="large" />
                    </IonButton>
                    <span className="icon-label">Products</span>
                  </div>
               
                  <div className={`icon-with-label ${activePage === "history" ? "active-icon" : ""}`} onClick={() => dispatch(setPage("history"))}>
                    <IonButton fill="clear">
                      <IonIcon icon={bagCheck} size="large" />
                    </IonButton>
                    <span className="icon-label">My Orders</span>
                  </div>   
                </>
              )}

              {isMobile && (
                <IonMenuButton menu="main-menu" className="menu-icon" onClick={handleMenuOpen}>
                  <IoMenu size={32} />
                </IonMenuButton>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
