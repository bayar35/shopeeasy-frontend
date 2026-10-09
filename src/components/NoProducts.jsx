import React from "react";
import "../componentStyles/NoProducts.css";

function NoProduct({ keyword }) {
  return (
    <div className="no-products-content">
      <div className="no-products-icon">Icon</div>
      <p className="no-products-message">
        {keyword
          ? `We couldn't find any products matching "${keyword}". Try using different keywords or browse our complete catalog.`
          : "No products are currently available. Please check back later."}
      </p>
    </div>
  );
}

export default NoProduct;
