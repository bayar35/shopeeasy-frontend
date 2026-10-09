import React from "react";
import "../componentStyles/Product.css";
import { Link } from "react-router-dom";
import Rating from "./Rating";
import { useDispatch, useSelector } from "react-redux";
import { Heart } from "lucide-react"; 
import {
  addToWishlist,
  removeFromWishlist,
} from "../features/wishlist/wishlistSlice";

function Product({ product }) {
  const dispatch = useDispatch();
  
  const wishlistState = useSelector((state) => state.wishlist);
  const wishlistItems = wishlistState && Array.isArray(wishlistState.wishlistItems) 
    ? wishlistState.wishlistItems 
    : [];

  const isWishlisted = product ? wishlistItems.some((item) => item.product === product._id) : false;

  // 🎯 БОДИТ ЗУРГИЙН ФАЙЛ РУУ ЗААСАН НАЙДВАРТАЙ PLACEHOLDER ХАЯГ
  const defaultPlaceholder = "https://unsplash.com"; 
  const errorPlaceholder = "https://unsplash.com";

  // 🔥 ЭЦСИЙН НАЙДВАРТАЙ ШАЛГУУР: Хэрэв зургийн хаяг нь "http" гэж эхлээгүй л бол шууд хуурамч гэж үзнэ!
  // Ингэснээр баазаас ирж буй алдаатай "data:image..." эсвэл Fabric-ийн дутуу объектууд 100% хаагдана.
  let imageUrl = defaultPlaceholder;
  
  if (product && product.images) {
    let rawUrl = "";
    if (Array.isArray(product.images) && product.images.length > 0 && product.images[0]) {
      rawUrl = product.images[0].url || "";
    } else if (typeof product.images === "object") {
      rawUrl = product.images.url || "";
    } else if (typeof product.images === "string") {
      rawUrl = product.images;
    }

    if (rawUrl && typeof rawUrl === "string" && rawUrl.startsWith("http")) {
      imageUrl = rawUrl;
    }
  }

  const handleWishlistClick = (e) => {
    e.preventDefault(); 
    if (!product) return;
    
    if (isWishlisted) {
      dispatch(removeFromWishlist(product._id));
    } else {
      dispatch(addToWishlist(product));
    }
  };

  if (!product) return null;

  return (
    <Link className="product-card" to={`/product/${product._id}`} style={{ textDecoration: "none", position: "relative" }}>
      {/* Wishlist зүрхэн товч */}
      <button 
        className={`wishlist-btn ${isWishlisted ? "active" : ""}`} 
        onClick={handleWishlistClick}
        style={styles.wishlistBtn}
      >
        <Heart size={18} fill={isWishlisted ? "#ff4d4f" : "none"} color={isWishlisted ? "#ff4d4f" : "#888"} />
      </button>

      {/* Бүтээгдэхүүний зураг */}
      <img 
        src={imageUrl} 
        alt={product.name} 
        className="product-image-card"
        onError={(e) => {
          e.target.onerror = null; 
          e.target.src = errorPlaceholder; 
        }}
      />

      {/* Мэдээлэл */}
      <div className="product-details">
        <h3 className="product-title">{product.name}</h3>
        
        {/* Рэйтинг */}
        <div className="product-rating-box" style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          <Rating rating={product.ratings || 0} />
          <span className="review-count" style={{ fontSize: "12px", color: "#888" }}>
            ({product.numOfReviews || 0} сэтгэгдэл)
          </span>
        </div>

        {/* Үнэ */}
        <p className="home-price" style={{ margin: "4px 0 0 0", fontWeight: "700", color: "#ff6b35", fontSize: "16px" }}>
          {product.price ? product.price.toLocaleString() : 0} ₮
        </p>

        {/* Үзэх товч */}
        <span className="view-details-text" style={styles.viewDetails}>
          Үзэх
        </span>
      </div>
    </Link>
  );
}

const styles = {
  wishlistBtn: {
    position: "absolute",
    top: "12px",
    right: "12px",
    background: "#ffffff",
    border: "none",
    borderRadius: "50%",
    width: "34px",
    height: "34px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    zIndex: 10,
    transition: "transform 0.2s ease"
  },
  viewDetails: {
    display: "block",
    textAlign: "center",
    padding: "8px 0",
    marginTop: "12px",
    background: "#f5f5f7",
    color: "#1a1a1a",
    fontSize: "13px",
    fontWeight: "600",
    borderRadius: "8px",
    transition: "all 0.2s ease"
  }
};

export default Product;
