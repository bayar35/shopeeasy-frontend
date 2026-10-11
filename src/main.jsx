import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { Provider } from "react-redux";
import { store } from "./features/store.js";
import { GoogleOAuthProvider } from "@react-oauth/google"; // ✅ 1. Google OAuth импортлох
import "./index.css";

console.log("👉 MAIN.JSX: GoogleOAuthProvider холбогдож байна...");

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/* ✅ 2. Бүх апп-аа GoogleOAuthProvider-оор ороож, Client ID-аа онооно */}
    <GoogleOAuthProvider clientId="://googleusercontent.com">
      <Provider store={store}>
        <App />
      </Provider>
    </GoogleOAuthProvider>
  </React.StrictMode>
);
