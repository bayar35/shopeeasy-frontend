import React, { useEffect, useState, useMemo } from "react";
import "../pageStyles/Products.css";
import PageTitle from "../components/PageTitle";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { useDispatch, useSelector } from "react-redux";
import Product from "../components/Product";
import { getProduct, removeErrors } from "../features/products/productSlice";
import Loader from "../components/Loader";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import NoProducts from "../components/NoProducts";
import Pagination from "../components/Pagination";

function Products() {
  const { loading, error, products, resultsPerPage, productCount } = useSelector(
    (state) => state.product
  );
  const dispatch = useDispatch();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const keyword = searchParams.get("keyword");
  const category = searchParams.get("category");
  const pageFromURL = parseInt(searchParams.get("page"), 10) || 1;
  const [currentPage, setCurrentPage] = useState(pageFromURL);
  const navigate = useNavigate();

  // MongoDB-с ирсэн бүтээгдэхүүнүүдээс категориудыг автоматаар шүүж авах
  const categories = useMemo(() => {
    if (!products || products.length === 0) return [];
    const uniqueCategories = [
      ...new Set(products.map((p) => p.category).filter(Boolean)),
    ];
    return uniqueCategories;
  }, [products]);

  useEffect(() => {
    dispatch(getProduct({ keyword, page: currentPage, category }));
  }, [dispatch, keyword, currentPage, category]);

  useEffect(() => {
    if (error) {
      toast.error(error.message || error, {
        position: "top-center",
        autoClose: 3000,
      });
      dispatch(removeErrors());
    }
  }, [dispatch, error]);

  const handlePageChange = (page) => {
    if (page !== currentPage) {
      setCurrentPage(page);
      const newSearchParams = new URLSearchParams(location.search);
      if (page === 1) {
        newSearchParams.delete("page");
      } else {
        newSearchParams.set("page", page);
      }
      navigate(`?${newSearchParams.toString()}`);
    }
  };

  const handleCategoryClick = (cat) => {
    const newSearchParams = new URLSearchParams(location.search);
    if (category === cat) {
      newSearchParams.delete("category");
    } else {
      newSearchParams.set("category", cat);
    }
    newSearchParams.delete("page");
    navigate(`?${newSearchParams.toString()}`);
  };

  const handleClearCategory = () => {
    const newSearchParams = new URLSearchParams(location.search);
    newSearchParams.delete("category");
    newSearchParams.delete("page");
    navigate(`?${newSearchParams.toString()}`);
  };

  const totalPages = Math.ceil(productCount / resultsPerPage) || 1;

  return (
    <>
      <PageTitle title="Бүх бүтээгдэхүүн — ShopEasy" />
      <Navbar />

      {loading ? (
        <Loader />
      ) : (
        <div className="products-page-wrapper">
          <div className="products-layout">
            {/* Зүүн талын категори шүүлтүүр */}
            <aside className="filter-section">
              <h3 className="filter-heading">АНГИЛАЛ</h3>
              <ul>
                {category && (
                  <li
                    onClick={handleClearCategory}
                    className="filter-clear-item"
                  >
                    ✕ Бүгдийг харах
                  </li>
                )}
                {categories.length > 0 ? (
                  categories.map((cat) => (
                    <li
                      key={cat}
                      onClick={() => handleCategoryClick(cat)}
                      className={`filter-item ${category === cat ? "active" : ""}`}
                    >
                      {cat}
                    </li>
                  ))
                ) : (
                  <li className="no-category">Ангилал байхгүй</li>
                )}
              </ul>
            </aside>

            {/* Баруун талын бүтээгдэхүүнүүдийн жагсаалт */}
            <main className="products-section">
              {products && products.length > 0 ? (
                <div className="products-product-container">
                  {products.map((product) => (
                    <Product key={product._id} product={product} />
                  ))}
                </div>
              ) : (
                <NoProducts keyword={keyword} />
              )}

              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </main>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}

export default Products;