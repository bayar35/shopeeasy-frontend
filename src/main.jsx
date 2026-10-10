import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { Provider } from "react-redux";
import { store } from "./features/store.js";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

// ⭐ Бүх axios хүсэлтэд production URL
axios.defaults.baseURL = "https://shopeeasy-backend.onrender.com";
axios.defaults.withCredentials = true;

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        <App />
        <ToastContainer position="top-center" autoClose={3000} />
      </GoogleOAuthProvider>
    </Provider>
  </React.StrictMode>
);