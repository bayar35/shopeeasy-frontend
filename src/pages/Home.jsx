import React, { useEffect, useMemo } from "react";
import "../pageStyles/Home.css";

import Hero from "../components/Hero";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Product from "../components/Product";
import PageTitle from "../components/PageTitle";
import Loader from "../components/Loader";

import { useDispatch, useSelector } from "react-redux";
import {
  getProduct,
  removeErrors,
} from "../features/products/productSlice";

import { toast } from "react-toastify";
import { Link } from "react-router-dom";

import {
  ArrowRight,
  Sparkles,
  TrendingUp,
  Award,
  Package,
  ShoppingBag,
} from "lucide-react";

function Home() {
  const dispatch = useDispatch();

  const {
    loading,
    error,
    products = [],
  } = useSelector((state) => state.product);

  // =====================================================
  // GET PRODUCTS
  // =====================================================
  useEffect(() => {
    dispatch(
      getProduct({
        keyword: "",
        page: 1,
      })
    );
  }, [dispatch]);

  // =====================================================
  // ERROR
  // =====================================================
  useEffect(() => {
    if (error) {
      toast.error(error.message || error, {
        position: "top-center",
        autoClose: 3000,
      });

      dispatch(removeErrors());
    }
  }, [dispatch, error]);

  // =====================================================
  // CATEGORIES
  // =====================================================
  const categories = useMemo(() => {
    if (!Array.isArray(products) || products.length === 0) {
      return [];
    }

    const categoryMap = {};

    products.forEach((product) => {
      if (!product || !product.category) {
        return;
      }

      const category = String(product.category).trim();

      if (!category) {
        return;
      }

      if (!categoryMap[category]) {
        categoryMap[category] = 0;
      }

      categoryMap[category] += 1;
    });

    const emojiMap = {
      electronics: "⚡",
      electronic: "⚡",
      fashion: "👕",
      clothing: "👕",
      clothes: "👕",
      home: "🏠",
      kitchen: "🍳",
      sports: "⚽",
      sport: "⚽",
      books: "📚",
      book: "📚",
      toys: "🧸",
      toy: "🧸",
      fruits: "🍎",
      fruit: "🍎",
      vegetables: "🥦",
      vegetable: "🥦",
      glass: "🥛",
      glassware: "🥛",
      laptop: "💻",
      laptops: "💻",
      mobile: "📱",
      mobiles: "📱",
      smartphone: "📱",
      smartphones: "📱",
      tv: "📺",
      television: "📺",
      beauty: "💄",
      cosmetics: "💄",
      shoes: "👟",
      footwear: "👟",
      watches: "⌚",
      watch: "⌚",
      jewelry: "💎",
      jewellery: "💎",
      groceries: "🛒",
      grocery: "🛒",
      automotive: "🚗",
      car: "🚗",
      furniture: "🛋️",
      pet: "🐶",
      pets: "🐶",
    };

    return Object.keys(categoryMap)
      .map((name) => {
        const emojiKey = name.toLowerCase();

        return {
          name: name,
          count: categoryMap[name],
          emoji: emojiMap[emojiKey] || "📦",
        };
      })
      .sort((a, b) => b.count - a.count);
  }, [products]);

  // =====================================================
  // TRENDING PRODUCTS
  // =====================================================
  const trendingProducts = useMemo(() => {
    if (!Array.isArray(products)) {
      return [];
    }

    return products.slice(0, 8);
  }, [products]);

  // =====================================================
  // PAGE
  // =====================================================
  return (
    <div className="home-page">
      <PageTitle title="ShopEasy — Онлайн дэлгүүр" />

      <Navbar />

      {loading ? (
        <Loader />
      ) : (
        <main>
          {/* =================================================
              HERO
          ================================================== */}
          <Hero />

          {/* =================================================
              CATEGORIES
          ================================================== */}
          {categories.length > 0 && (
            <section className="home-section categories-section">
              <div className="home-container">
                <div className="home-section-header">
                  <div className="home-heading-group">
                    <span className="home-section-eyebrow">
                      <Package size={15} />
                      АНГИЛАЛ
                    </span>

                    <h2 className="home-section-title">
                      Ангилалаар үзэх
                    </h2>

                    <p className="home-section-description">
                      Өөрт хэрэгтэй бүтээгдэхүүнээ ангиллаар хурдан
                      олоорой.
                    </p>
                  </div>

                  <Link
                    to="/products"
                    className="home-btn-ghost"
                  >
                    Бүгдийг харах
                    <ArrowRight size={17} />
                  </Link>
                </div>

                <div className="home-categories-grid">
                  {categories.map((category) => (
                    <Link
                      key={category.name}
                      to={
                        "/products?category=" +
                        encodeURIComponent(category.name)
                      }
                      className="home-category-card"
                    >
                      <div className="home-category-icon">
                        {category.emoji}
                      </div>

                      <div className="home-category-info">
                        <h3>{category.name}</h3>

                        <p>
                          {category.count} бүтээгдэхүүн
                        </p>
                      </div>

                      <ArrowRight
                        className="home-category-arrow"
                        size={18}
                      />
                    </Link>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* =================================================
              TRENDING PRODUCTS
          ================================================== */}
          <section className="home-section trending-section">
            <div className="home-container">
              <div className="home-section-header">
                <div className="home-heading-group">
                  <span className="home-section-eyebrow">
                    <TrendingUp size={15} />
                    ОДОО ТРЕНД
                  </span>

                  <h2 className="home-section-title">
                    Тренд бүтээгдэхүүн
                  </h2>

                  <p className="home-section-description">
                    Манай дэлгүүрийн хамгийн сонирхолтой
                    бүтээгдэхүүнүүд.
                  </p>
                </div>

                <Link
                  to="/products"
                  className="home-btn-ghost"
                >
                  Бүх бүтээгдэхүүн
                  <ArrowRight size={17} />
                </Link>
              </div>

              {trendingProducts.length > 0 ? (
                <div className="home-products-grid">
                  {trendingProducts.map((product) => (
                    <Product
                      key={product._id}
                      product={product}
                    />
                  ))}
                </div>
              ) : (
                <div className="home-empty-products">
                  <ShoppingBag size={42} />

                  <h3>Бүтээгдэхүүн олдсонгүй</h3>

                  <p>
                    Одоогоор харуулах бүтээгдэхүүн байхгүй байна.
                  </p>
                </div>
              )}
            </div>
          </section>

          {/* =================================================
              PROMOTION
          ================================================== */}
          <section className="home-section promo-section">
            <div className="home-container">
              <div className="home-promo-banner">
                <div className="home-promo-glow"></div>

                <div className="home-promo-content">
                  <span className="home-promo-badge">
                    <Sparkles size={15} />
                    ШИНЭ ХЭРЭГЛЭГЧДЭД
                  </span>

                  <h2>
                    Анхны захиалгад
                    <br />
                    <strong>10% хямдрал</strong>
                  </h2>

                  <p>
                    Бүртгүүлээд эхний захиалгадаа 10% хямдрал
                    аваарай.
                  </p>

                  <Link
                    to="/register"
                    className="home-btn-primary"
                  >
                    Бүртгүүлэх
                    <ArrowRight size={18} />
                  </Link>
                </div>

                <div className="home-promo-visual">
                  <div className="home-promo-circle">
                    <Award
                      size={100}
                      strokeWidth={1.2}
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* =================================================
              BOTTOM CTA
          ================================================== */}
          <section className="home-bottom-section">
            <div className="home-container">
              <div className="home-bottom-content">
                <span className="home-section-eyebrow">
                  SHOP EASY
                </span>

                <h2>
                  Хайсан бүтээгдэхүүнээ
                  <br />
                  <span>хялбархан олоорой.</span>
                </h2>

                <p>
                  Олон төрлийн бүтээгдэхүүнээс сонголтоо хийж,
                  захиалгаа хурдан өгөөрэй.
                </p>

                <Link
                  to="/products"
                  className="home-btn-primary home-btn-dark"
                >
                  Худалдан авалт эхлүүлэх
                  <ArrowRight size={18} />
                </Link>
              </div>
            </div>
          </section>
        </main>
      )}

      <Footer />
    </div>
  );
}

export default Home;