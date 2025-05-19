import { IonApp, IonContent, IonPage } from "@ionic/react";
import Home from "./pages/Home";

const Master: React.FC = () => (
  <IonApp>
    <IonPage>
      <div >
        <Home />
      </div>
    </IonPage>
  </IonApp>
);

export default Master;
