import React, { useState, useEffect } from "react";
import "../componentStyles/Navbar.css";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../features/user/userSlice";
import {
  Search,
  ShoppingBag,
  User,
  Menu,
  X,
  Heart,
  ChevronDown,
} from "lucide-react";

function Navbar() {
  const { isAuthenticated, user } = useSelector((state) => state.user);
  const { cartItems } = useSelector((state) => state.cart);
  const { products: wishlistItems } = useSelector((state) => state.wishlist);

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsUserMenuOpen(false);
  }, [location.pathname]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?keyword=${searchQuery}`);
      setSearchQuery("");
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    setIsUserMenuOpen(false);
    navigate("/login");
  };

  const cartCount =
    cartItems?.reduce((acc, item) => acc + item.quantity, 0) || 0;
  const wishlistCount = wishlistItems?.length || 0;

  return (
    <header className={`navbar ${isScrolled ? "scrolled" : ""}`}>
      <div className="navbar-container">
        {/* Logo */}
        <Link to="/" className="navbar-logo">
          <div className="logo-mark">
            <ShoppingBag size={20} />
          </div>
          <span className="logo-text">ShopEasy</span>
        </Link>

        {/* Navigation Links */}
        <nav className="navbar-links">
          <Link to="/" className="nav-link">Нүүр</Link>
          <Link to="/products" className="nav-link">Бүтээгдэхүүн</Link>
          <Link to="/about" className="nav-link">Бидний тухай</Link>
          <Link to="/contact" className="nav-link">Холбоо барих</Link>
        </nav>

        {/* Search */}
        <form className="navbar-search" onSubmit={handleSearch}>
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Хайх..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>

        {/* Actions */}
        <div className="navbar-actions">
          <Link to="/wishlist" className="nav-icon-btn" aria-label="Wishlist">
            <Heart size={20} />
            {wishlistCount > 0 && (
              <span className="wishlist-badge">
                {wishlistCount > 99 ? "99+" : wishlistCount}
              </span>
            )}
          </Link>

          <Link to="/cart" className="nav-icon-btn" aria-label="Cart">
            <ShoppingBag size={20} />
            {cartCount > 0 && (
              <span className="cart-badge">
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            )}
          </Link>

          {isAuthenticated ? (
            <div className="user-menu-wrapper">
              <button
                className="user-menu-btn"
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              >
                <img
                  src={user?.avatar?.url || "https://via.placeholder.com/32"}
                  alt={user?.name}
                  className="user-avatar"
                />
                <span className="user-name">{user?.name?.split(" ")[0]}</span>
                <ChevronDown
                  size={16}
                  className={`chevron ${isUserMenuOpen ? "open" : ""}`}
                />
              </button>

              {isUserMenuOpen && (
                <div className="user-dropdown">
                  <Link to="/profile" className="dropdown-item">
                    <User size={16} /> Профайл
                  </Link>
                  <Link to="/orders/user" className="dropdown-item">
                    <ShoppingBag size={16} /> Миний захиалгууд
                  </Link>
                  <Link to="/wishlist" className="dropdown-item">
                    <Heart size={16} /> Хүслийн жагсаалт
                  </Link>
                  {user?.role === "admin" && (
                    <>
                      <div className="dropdown-divider" />
                      <Link to="/admin/dashboard" className="dropdown-item">
                        ⚡ Admin Dashboard
                      </Link>
                    </>
                  )}
                  <div className="dropdown-divider" />
                  <button
                    className="dropdown-item logout-btn"
                    onClick={handleLogout}
                  >
                    Гарах
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="btn-ghost-sm">Нэвтрэх</Link>
              <Link to="/register" className="btn-primary-sm">Бүртгүүлэх</Link>
            </div>
          )}

          <button
            className="mobile-toggle"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="mobile-menu">
          <Link to="/" className="mobile-nav-link">Нүүр</Link>
          <Link to="/products" className="mobile-nav-link">Бүтээгдэхүүн</Link>
          <Link to="/about" className="mobile-nav-link">Бидний тухай</Link>
          <Link to="/contact" className="mobile-nav-link">Холбоо барих</Link>
          {!isAuthenticated && (
            <div className="mobile-auth">
              <Link to="/login" className="btn-primary">Нэвтрэх</Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}

export default Navbar;