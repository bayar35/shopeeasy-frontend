import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { Provider } from "react-redux";
import { store } from "./features/store.js"; // Замаа зөв эсэхийг нягтлаарай
import "./index.css";

console.log("👉 [2/4] MAIN.JSX: Уншиж эхэллээ. Redux Provider-ийг угсарч байна...");

try {
  const rootElement = document.getElementById("root");
  if (!rootElement) {
    console.error("💥 MAIN.JSX АЛДАА: HTML дотор 'root' элемент олдсонгүй!");
  }
  
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <Provider store={store}>
        <App />
      </Provider>
    </React.StrictMode>
  );
  console.log("✅ MAIN.JSX: Төгсгөл хүртэл амжилттай ажиллалаа.");
} catch (err) {
  console.error("💥 MAIN.JSX ДОТОР РЕНДЕР ХИЙХЭД АЛДАА ГАРЛАА:", err);
}
