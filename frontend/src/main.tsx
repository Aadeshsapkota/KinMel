import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Toaster } from "react-hot-toast";

import "./index.css";
import App from "./App";
import { WishlistProvider } from "./contexts/WishlistContext";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <GoogleOAuthProvider
      clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}
    >
      <WishlistProvider>
        <App />
      </WishlistProvider>
    </GoogleOAuthProvider>

    <Toaster
      position="top-right"
      toastOptions={{
        duration: 3000,
      }}
    />
  </StrictMode>
);