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
  IoAdd,
  IoRemove,
} from "react-icons/io5";
import { FaTag } from "react-icons/fa";
// import { useNavigate } from "react-router-dom"; // REMOVED: No longer using useNavigate
import { useDispatch, useSelector } from "react-redux";
import { setPage } from '../../../Store/Slice/pageSlice';
import { RootState } from '../../../Store/store';
import { addToCart, incrementQuantity, decrementQuantity } from '../../../Store/Slice/cartSlice';
import "./Header.css";

const Header: React.FC = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1057);
  // const navigate = useNavigate(); // REMOVED: No longer using useNavigate
  const dispatch = useDispatch();

  // Define CartItem interface clearly
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

const cartCount = useSelector((state: RootState) =>
  state.cart?.items?.length || 0
);


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
            <IonItem button onClick={() => dispatch(setPage("products"))}>
              <IonIcon icon={bag} slot="start" />
              Product
            </IonItem>
            <IonItem button onClick={() => dispatch(setPage("wishlist"))}>
              <IonIcon icon={heart} slot="start" />
              Wishlist
            </IonItem>
            {/* The Cart item in the main menu is redundant if there's a dedicated cart menu */}
            {/* You might want to remove this or make it open the cart menu directly */}
            <IonItem button>
              <IonIcon icon={cart} slot="start" />
              Cart
            </IonItem>
          </IonList>
          {/* Cart items display in the main menu (if you want it here) */}
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {cartItems.map((item: CartItem, idx: number) => (
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
          </ul>
        </IonContent>
      </IonMenu>

      {/* Cart Right Menu */}
      <IonMenu side="end" menuId="cart-menu" contentId="main-content">
        <IonContent style={{ background: "white", paddingBottom: "60px" }}>
          <div style={{ padding: "20px" }}>
            <h2 style={{ margin: 0, marginBottom: 16 }}>My Cart</h2>
            <div>
              <p>You have <b>{cartCount}</b> product(s) in your cart.</p>
              {cartItems.length === 0 ? (
                <div style={{ color: "#888", marginTop: 16 }}>Your cart is empty.</div>
              ) : (
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  {cartItems.map((item: CartItem, idx: number) => (
                    <li key={item.id + (item.size || '')} style={{ borderBottom: "1px solid #eee", padding: "10px 0" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <img
                          src={item.img || (item.images && item.images[0])}
                          alt={item.name}
                          style={{ width: 50, height: 50, objectFit: "cover", borderRadius: 4 }}
                        />
                        <div>
                          <div style={{ fontWeight: 600 }}>{item.name}</div>
                          <div style={{ fontSize: 14, color: "#555" }}>
                            Qty: {item.quantity} {item.size && <>| Size: {item.size}</>}
                          </div>
                        </div>
                      </div>
                      <div style={{ fontSize: 14, color: "#555", display: "flex", alignItems: "center", gap: 8, marginTop: 5 }}>
                        <button
                          style={{ background: "#ffebee", borderRadius: "50%", width: 24, height: 24, border: "none", color: "#ff5722", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                          onClick={() => dispatch(decrementQuantity({ id: item.id, size: item.size }))}
                        >
                          <IoRemove />
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          style={{ background: "#e8f5e9", borderRadius: "50%", width: 24, height: 24, border: "none", color: "#388e3c", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                          onClick={() => dispatch(incrementQuantity({ id: item.id, size: item.size }))}
                        >
                          <IoAdd />
                        </button>
                        {item.size && <span>| Size: {item.size}</span>}
                      </div>
                      <div style={{ fontSize: 14, color: "#ff5722", marginTop: 5 }}>
                        ₹{item.price * item.quantity}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </IonContent>

        {/* Proceed Button at Bottom */}
        <div style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: "100%",
          borderTop: "1px solid #ddd",
          background: "#fff",
          padding: "16px",
          boxShadow: "0 -2px 4px rgba(0,0,0,0.05)"
        }}>
          <IonButton
            onClick={() => {
              dispatch(setPage("checkout")); // Changed: Dispatching setPage directly
            }}
            expand="full"
            fill="solid"
            disabled={cartItems.length === 0} // Disable button if cart is empty
          >
            Proceed ({cartCount} items)
          </IonButton>
        </div>
      </IonMenu>

      <div id="main-content">
        <header className="container">
          <div className="nav-item" style={{ alignItems: "center" }}>
            <div>
              <h3 style={{ margin: 0, cursor: 'pointer' }} onClick={() => dispatch(setPage("home"))}>StyleSync</h3>
            </div>

            <div className="nav-icon">
              {/* Desktop Icons */}
              {!isMobile && (
                <>
                  <IonButton fill="clear" onClick={() => dispatch(setPage("wishlist"))}>
                    <IonIcon icon={heart} size="large" title="Wishlist" />
                  </IonButton>
                  <IonMenuButton menu="cart-menu" autoHide={false} style={{ position: "relative", margin: "0 8px" }}>
                    <IonIcon icon={cart} size="large" title="Cart" />
                    {cartCount > 0 && (
                      <span
                        style={{
                          position: "absolute",
                          top: 2,
                          right: 2,
                          background: "#ff5722",
                          color: "#fff",
                          borderRadius: "50%",
                          fontSize: 12,
                          width: 20,
                          height: 20,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontWeight: 700,
                          boxShadow: "0 1px 4px #fbeee6"
                        }}
                      >
                        {cartCount}
                      </span>
                    )}
                  </IonMenuButton>
                  <IonButton fill="clear" onClick={() => dispatch(setPage("products"))}>
                    <IonIcon icon={bag} size="large" title="products" />
                  </IonButton>
                </>
              )}
              {/* Mobile Menu Button */}
              {isMobile && (
                <IonMenuButton menu="main-menu" className="menu-icon" onClick={handleMenuOpen}>
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