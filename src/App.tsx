import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

// import the ariable.css
import './theme/variables.css';
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
// Removed Redux imports as currentPage logic will now be handled within Master.tsx
// import { useDispatch, useSelector } from 'react-redux';
// import { RootState } from './Store/store';

// Import the Admin components
import AdminAuth from './components/pages/head/admin';
import AdminDashboard from './components/pages/head/adminpage/AdminDashboard';

setupIonicReact();

const App: React.FC = () => {
  // The currentPage and dispatch logic, along with the conditional rendering,
  // should now be moved inside your Master component, as it's the one
  // rendered at the root path and will handle the internal "page" display.
  // console.log("Current Page", currentPage); // This line is now irrelevant here.

  return (
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet>
          {/* Master component will now handle rendering Home, Products, Wishlist etc. based on Redux state */}
          <Route exact path="/" component={Master} />
          {/* Admin routes remain as traditional URL routes */}
          <Route exact path="/admin" component={AdminAuth} />
          <Route exact path="/admin/dashboard" component={AdminDashboard} />
          {/* Fallback route */}
          <Route render={() => <Redirect to="/" />} />
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;