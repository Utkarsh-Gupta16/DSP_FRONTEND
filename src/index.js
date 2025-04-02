import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { NextUIProvider } from "@nextui-org/react";
import "./index.css";

// Replace YOUR_GOOGLE_CLIENT_ID with your actual Google OAuth client ID
const GOOGLE_CLIENT_ID = "1085041803396-6b3fjsu79hdqc3eljmln9g9ceg55pm69.apps.googleusercontent.com";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
    <NextUIProvider>
      <App />
    </NextUIProvider>
  </GoogleOAuthProvider>
);