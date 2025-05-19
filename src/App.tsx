import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* import '@ionic/react/css/palettes/dark.always.css'; */
/* import '@ionic/react/css/palettes/dark.class.css'; */
import '@ionic/react/css/palettes/dark.system.css';

/* Theme variables */
import './theme/variables.css';
import Master from './Master';
import "./App.css";
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from './Store/store';

// Import the AdminPanel component
import AdminAuth from './components/pages/head/admin';
import AdminDashboard from './components/pages/head/adminpage/AdminDashboard';
import AdminPanel from './components/pages/head/admin';

setupIonicReact();

const App: React.FC = () => {
  const currentPage = useSelector((state: RootState) => state.page.currentPage);
  const dispatch = useDispatch();
  console.log("Current Page", currentPage);

  return (
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet>
          <Route exact path="/" component={Master} />
          <Route exact path="/admin" component={AdminPanel} />
          <Route exact path="/admin/dashboard" component={AdminDashboard} />
          <Route render={() => <Redirect to="/" />} />
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
