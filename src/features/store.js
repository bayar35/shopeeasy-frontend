import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./user/userSlice";
import productReducer from "./products/productSlice";  // ⭐ ЗАССАН
import adminReducer from "./admin/adminSlice";
import cartReducer from "./cart/cartSlice";
import wishlistReducer from "./wishlist/wishlistSlice";
import aiReducer from "./ai/aiSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    product: productReducer,
    admin: adminReducer,
    cart: cartReducer,
    wishlist: wishlistReducer,
    ai: aiReducer,
  },
});