import React from "react";
import "../componentStyles/Hero.css";
import { Link } from "react-router-dom";
import { ArrowRight, Truck, Shield, Zap, RotateCcw } from "lucide-react";

function Hero() {
  return (
    <section className="hero-section">
      <div className="hero-bento">
        {/* Main Banner */}
        <div className="hero-main">
          <div className="hero-main-bg"></div>
          <div className="hero-main-content">
            <span className="hero-badge">
              <Zap size={14} /> Хязгаарлагдмал хугацаа
            </span>
            <h1 className="hero-title">
              Cyber Monday
              <span className="hero-title-accent">Super Sale</span>
            </h1>
            <p className="hero-subtitle">
              Бүх бүтээгдэхүүн 70% хүртэл хямдарлаа. Бүү алдаарай!
            </p>
            <div className="hero-actions">
              <Link to="/products" className="btn-accent">
                Худалдан авах <ArrowRight size={18} />
              </Link>
              <Link to="/products" className="btn-ghost-light">
                Бүх бараа
              </Link>
            </div>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="hero-side">
          <div className="hero-card hero-card-light">
            <div className="hero-card-icon">
              <Truck size={24} />
            </div>
            <div className="hero-card-content">
              <h3>Үнэгүй хүргэлт</h3>
              <p>50,000₮-с дээш захиалгад</p>
            </div>
          </div>

          <div className="hero-card hero-card-dark">
            <div className="hero-card-icon">
              <Shield size={24} />
            </div>
            <div className="hero-card-content">
              <h3>Аюулгүй төлбөр</h3>
              <p>100% хамгаалагдсан</p>
            </div>
          </div>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="trust-badges">
        <div className="trust-item">
          <Truck size={20} />
          <span>Хурдан хүргэлт</span>
        </div>
        <div className="trust-item">
          <RotateCcw size={20} />
          <span>30 хоногийн буцаалт</span>
        </div>
        <div className="trust-item">
          <Shield size={20} />
          <span>Аюулгүй төлбөр</span>
        </div>
        <div className="trust-item">
          <Zap size={20} />
          <span>24/7 дэмжлэг</span>
        </div>
      </div>
    </section>
  );
}

export default Hero;