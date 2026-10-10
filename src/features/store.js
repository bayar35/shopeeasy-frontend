import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./user/userSlice";
import productReducer from "./products/productSlice";
import adminReducer from "./admin/adminSlice";
import cartReducer from "./cart/cartSlice";
import wishlistReducer from "./wishlist/wishlistSlice";
import aiReducer from "./ai/aiSlice";
import orderReducer from "./order/orderSlice";
import analyticsReducer from "./analytics/analyticsSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    product: productReducer,
    admin: adminReducer,
    cart: cartReducer,
    wishlist: wishlistReducer,
    ai: aiReducer,
    order: orderReducer,
    analytics: analyticsReducer,
  },
  devTools: true,
});

// ⭐ Debug: Store эхэлсэн эсэхийг шалгах
console.log("✅ STORE INITIALIZED");
console.log("✅ STORE KEYS:", Object.keys(store.getState()));

// ⭐ window.__REDUX_STATE__ - Debug-д зориулж
if (typeof window !== "undefined") {
  window.__REDUX_STATE__ = store.getState();
  console.log("✅ window.__REDUX_STATE__ SET:", window.__REDUX_STATE__);

  store.subscribe(() => {
    window.__REDUX_STATE__ = store.getState();
  });
} else {
  console.log("⚠️ window is undefined");
}