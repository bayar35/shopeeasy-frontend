import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { configureStore } from '@reduxjs/toolkit';

// ⭐ store.js-тэй ЯГ ижил замууд
import userReducer from '../features/user/userSlice';
import productReducer from '../features/products/productSlice';
import adminReducer from '../features/admin/adminSlice';
import cartReducer from '../features/cart/cartSlice';
import wishlistReducer from '../features/wishlist/wishlistSlice';
import aiReducer from '../features/ai/aiSlice';
import orderReducer from '../features/order/orderSlice';
import analyticsReducer from '../features/analytics/analyticsSlice';

// ⭐ store.js-тэй ЯГ ижил reducer бүтэц
export const createTestStore = (preloadedState = {}) => {
  return configureStore({
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
    preloadedState,
  });
};

export const renderWithProviders = (
  ui,
  { store = createTestStore(), ...options } = {}
) => {
  return render(
    <GoogleOAuthProvider clientId="test-client-id">
      <Provider store={store}>
        <BrowserRouter>{ui}</BrowserRouter>
      </Provider>
    </GoogleOAuthProvider>,
    options
  );
};

// Re-export everything from testing-library
export * from '@testing-library/react';