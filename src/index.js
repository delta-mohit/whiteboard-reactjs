import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { store } from "./store/store";
import { Provider } from "react-redux";
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  //Strick mode
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>

  //Without strict mode, because useEffect is running twice. So, there is different behaviour of undo in local host running. So, without strict mode, I will get correct undo functionality in local host. But using strictmode is recommended. Issliye undo me abho=i local host me thoda problem hoga, so bear with it. It will rsolve once project deployed
  // <Provider store={store}>
  //   <App />
  // </Provider>
);
