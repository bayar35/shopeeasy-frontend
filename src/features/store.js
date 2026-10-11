import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./user/userSlice";
import productReducer from "./products/productSlice";
import adminReducer from "./admin/adminSlice";
import cartReducer from "./cart/cartSlice";
import wishlistReducer from "./wishlist/wishlistSlice";
import aiReducer from "./ai/aiSlice";
import orderReducer from "./order/orderSlice";
import analyticsReducer from "./analytics/analyticsSlice";

console.log("👉 [3/4] STORE.JS: Санах ойн слайсуудыг ачаалж эхэллээ...");

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

try {
  console.log("✅ STORE.JS: Санах ой амжилттай бэлэн боллоо. Keys:", Object.keys(store.getState()));
} catch (err) {
  console.error("💥 STORE.JS РЕДЮСЕРҮҮДИЙГ УНШИХАД АЛДАА ГАРЛАА:", err);
}
