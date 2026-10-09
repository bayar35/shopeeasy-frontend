import React from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addItemsToCart, removeItemFromCart } from "../features/cart/cartSlice";
import { toast } from "react-toastify";
import { Trash2 } from "lucide-react";

function CartItem({ item }) {
  const { loading } = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  const increaseQuantity = () => {
    if (item.stock <= item.quantity) {
      toast.error("Нөөцөөс хэтрэхгүй байх ёстой!", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }
    dispatch(
      addItemsToCart({ id: item.product, quantity: item.quantity + 1 })
    );
  };

  const decreaseQuantity = () => {
    if (item.quantity <= 1) {
      toast.error("Тоо 1-с багагүй байх ёстой", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }
    dispatch(
      addItemsToCart({ id: item.product, quantity: item.quantity - 1 })
    );
  };

  const handleRemove = () => {
    if (loading) return;
    dispatch(removeItemFromCart(item.product));
    toast.success("Сагснаас устгагдлаа", {
      position: "top-center",
      autoClose: 2000,
    });
  };

  return (
    <div className="cart-item">
      {/* Product */}
      <div className="cart-item-product">
        <img src={item.image} alt={item.name} className="cart-item-image" />
        <div className="cart-item-info">
          <Link to={`/product/${item.product}`} className="cart-item-name">
            {item.name}
          </Link>
          <p className="cart-item-price">
            {item.price.toLocaleString()}₮
          </p>
        </div>
      </div>

      {/* Quantity */}
      <div className="cart-item-quantity">
        <button
          className="qty-btn"
          onClick={decreaseQuantity}
          disabled={loading}
          aria-label="Decrease"
        >
          −
        </button>
        <input
          type="text"
          value={item.quantity}
          className="qty-value"
          readOnly
        />
        <button
          className="qty-btn"
          onClick={increaseQuantity}
          disabled={loading}
          aria-label="Increase"
        >
          +
        </button>
      </div>

      {/* Total */}
      <div className="cart-item-total">
        <p>{(item.price * item.quantity).toLocaleString()}₮</p>
      </div>

      {/* Action */}
      <div className="cart-item-action">
        <button
          className="remove-btn"
          onClick={handleRemove}
          disabled={loading}
        >
          <Trash2 size={16} />
          Устгах
        </button>
      </div>
    </div>
  );
}

export default CartItem;