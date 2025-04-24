import React from "react";
import ReactDOM from "react-dom/client";
// import App from "./App";
import "@ionic/react/css/core.css"; // Ionic Core CSS
import "@ionic/react/css/core.css"; // Required for Ionic components to work

// Optional basic style resets
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

// Optional utility styles
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

import Master from "./Master";

const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(<Master />);
