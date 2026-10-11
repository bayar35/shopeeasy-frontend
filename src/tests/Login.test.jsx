import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../features/user/userSlice";
import Login from "../User/Login";

const renderWithProviders = (component) => {
  const store = configureStore({
    reducer: {
      user: userReducer,
    },
  });

  return render(
    <Provider store={store}>
      <BrowserRouter>{component}</BrowserRouter>
    </Provider>
  );
};

describe("Login Component", () => {
  it("should render login form", () => {
    renderWithProviders(<Login />);

    expect(screen.getByText(/нэвтрэх/i)).toBeInTheDocument();
  });

  it("should have email input", () => {
    renderWithProviders(<Login />);

    const emailInput = screen.getByPlaceholderText(/и-мэйл/i);
    expect(emailInput).toBeInTheDocument();
    expect(emailInput.type).toBe("email");
  });

  it("should have password input", () => {
    renderWithProviders(<Login />);

    const passwordInput = screen.getByPlaceholderText(/нууц үг/i);
    expect(passwordInput).toBeInTheDocument();
    expect(passwordInput.type).toBe("password");
  });

  it("should have submit button", () => {
    renderWithProviders(<Login />);

    const submitButton = screen.getByRole("button", { name: /нэвтрэх/i });
    expect(submitButton).toBeInTheDocument();
  });
});