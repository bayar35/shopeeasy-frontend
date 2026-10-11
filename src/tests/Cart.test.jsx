import { describe, it, expect } from 'vitest';
import { renderWithProviders, createTestStore } from './test-utils';
import Cart from '../Cart/Cart';   // ⭐ ЗАССАН

describe('Cart Component', () => {
  it('should render cart page', () => {
    const store = createTestStore({
      cart: { cartItems: [], loading: false, error: null },
    });
    const { container } = renderWithProviders(<Cart />, { store });
    expect(container).toBeTruthy();
  });

  it('should show empty cart message when no items', () => {
    const store = createTestStore({
      cart: { cartItems: [], loading: false, error: null },
    });
    const { container } = renderWithProviders(<Cart />, { store });
    const text = container.textContent;
    // ⭐ Cart.jsx доторх текстээр солино
    expect(text).toMatch(/empty|no items|хоосон|сагс/i);
  });
});