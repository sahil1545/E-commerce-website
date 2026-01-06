import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { UIProvider } from "./context/UiContext";
import { AuthProvider } from "./context/Authcontext";
import { CartProvider } from "./context/CartContext";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <UIProvider>
      <AuthProvider>
        <CartProvider>
          <App />
        </CartProvider>
      </AuthProvider>
    </UIProvider>
  </React.StrictMode>
);
