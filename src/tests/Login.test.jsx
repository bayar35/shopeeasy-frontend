import { describe, it, expect } from 'vitest';
import { renderWithProviders } from './test-utils';
import Login from '../User/Login';   // ⭐ ЗАССАН

describe('Login Component', () => {
  it('should render login form', () => {
    const { container } = renderWithProviders(<Login />);
    const form = container.querySelector('form');
    expect(form).toBeTruthy();
  });

  it('should have email input', () => {
    const { container } = renderWithProviders(<Login />);
    const emailInput = container.querySelector('input[type="email"]');
    expect(emailInput).toBeTruthy();
  });

  it('should have password input', () => {
    const { container } = renderWithProviders(<Login />);
    const passwordInput = container.querySelector('input[type="password"]');
    expect(passwordInput).toBeTruthy();
  });

  it('should have submit button', () => {
    const { container } = renderWithProviders(<Login />);
    const submitButton = container.querySelector('button[type="submit"]');
    expect(submitButton).toBeTruthy();
  });
});