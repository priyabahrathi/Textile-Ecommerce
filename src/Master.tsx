import React from "react";
import { IonApp, IonContent } from "@ionic/react";
import { Provider } from "react-redux";
import store from "./Store/store";

import Hero from "./components/pages/Hero";
import "@ionic/react/css/core.css";
import "./Master.css"
import Arrival from "./components/pages/arrival";

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <IonApp >
        <IonContent>
          
          <Hero />
          <Arrival />
          
        </IonContent>
      </IonApp>
    </Provider>
  );
};

export default App;
