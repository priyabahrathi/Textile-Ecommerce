import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonItem,
  IonLabel,
  IonList,
  IonThumbnail,
  IonButton,
  IonIcon
} from "@ionic/react";
import { trash } from "ionicons/icons";
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../Store/store";
import { removeItem } from "../../../Store/Slice/cartSlice";
// import './Cart.css';

const Cart: React.FC = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => state.cart.items);

  const totalPrice = cartItems.reduce((total, item) => total + item.price, 0);

  return (
    <div className="cartcontainer">
      <IonCard>
        <IonCardHeader>
          <h1>Your Cart</h1>
        </IonCardHeader>
        <IonCardContent>
          <IonList>
            {cartItems.length > 0 ? (
              cartItems.map((item) => (
                <IonItem key={item.id}>
                  <IonThumbnail slot="start">
                    <img alt={item.title} src={item.image} />
                  </IonThumbnail>
                  <IonLabel>
                    <h2>{item.title}</h2>
                    <p>Rs {item.price}</p>
                  </IonLabel>
                  <IonButton 
                    color="danger" 
                    fill="clear" 
                    onClick={() => dispatch(removeItem(item.id))}
                  >
                    <IonIcon icon={trash} />
                  </IonButton>
                </IonItem>
              ))
            ) : (
              <IonItem>
                <IonLabel>No items in cart</IonLabel>
              </IonItem>
            )}
          </IonList>
          <h3>Total Price: Rs {totalPrice}</h3>  {/* ✅ Correct total calculation */}
        </IonCardContent>
      </IonCard>
    </div>
  );
};

export default Cart;
