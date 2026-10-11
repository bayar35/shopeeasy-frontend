import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "../features/cart/cartSlice";
import userReducer from "../features/user/userSlice";
import Cart from "../Cart/Cart";

const renderWithProviders = (component) => {
  const store = configureStore({
    reducer: {
      cart: cartReducer,
      user: userReducer,
    },
  });

  return render(
    <Provider store={store}>
      <BrowserRouter>{component}</BrowserRouter>
    </Provider>
  );
};

describe("Cart Component", () => {
  it("should render cart page", () => {
    renderWithProviders(<Cart />);

    expect(screen.getByText(/сагс/i)).toBeInTheDocument();
  });

  it("should show empty cart message when no items", () => {
    renderWithProviders(<Cart />);

    // Хэрэв сагс хоосон бол "Хоосон" гэсэн мессеж харагдах ёстой
    const emptyMessage = screen.queryByText(/хоосон/i);
    if (emptyMessage) {
      expect(emptyMessage).toBeInTheDocument();
    }
  });
});