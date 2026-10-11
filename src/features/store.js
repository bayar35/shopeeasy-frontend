import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./user/userSlice";
import productReducer from "./products/productSlice";
import adminReducer from "./admin/adminSlice";
import cartReducer from "./cart/cartSlice";
import wishlistReducer from "./wishlist/wishlistSlice";
import aiReducer from "./ai/aiSlice";
import orderReducer from "./order/orderSlice";
import analyticsReducer from "./analytics/analyticsSlice";

console.log("⚡ STORE: Слайсуудыг уншиж эхэллээ...");

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

// ✅ Аюулгүй консол шалгалт
try {
  console.log("✅ STORE: Амжилттай угсрагдлаа. Санах ойн түлхүүрүүд:", Object.keys(store.getState()));
} catch (storeError) {
  console.error("💥 STORE АЖИЛЛАХАД АЛДАА ГАРЛАА:", storeError);
}
