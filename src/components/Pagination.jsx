import React from "react";
import "../componentStyles/Pagination.css";
import { useSelector } from "react-redux";

function Pagination({
  currentPage,
  onPageChange,
  activeClass = "active",
  nextPageText = "Next",
  prevPageText = "Prev",
  firstPageText = "1st",
  lastPageText = "Last",
}) {
  // 1. Redux-ийн state-ийг бүхлээр нь унших
  const productState = useSelector((state) => state.product);
  
  // 2. Хөтчийн Console дээр Redux-д яг ямар нэртэй хувьсагч ирж байгааг харах
  console.log("Бүх Product Статүүд:", productState); 

  // 3. Баазаас ирж болох бүх хувьсагчийн нэрийг шалгах (Давхардуулахгүйгээр нэг удаа зарлав)
  const products = productState.products || [];
  const productCount = productState.productCount || productState.filteredProductsCount || productState.productsCount || 14; 
  const resultsPerPage = productState.resultsPerPage || 8;

  // 4. Нийт хуудасны тоог тооцоолох
  const calculatedTotalPages = Math.ceil(productCount / resultsPerPage) || 1;
  
  console.log("Нийт тооцоолсон хуудас:", calculatedTotalPages);

  // Одоогоор 2-р хуудасны товчлуурыг харахын тулд null буцаадаг нөхцөлийг түр хаав
  // if (!products || products.length === 0 || calculatedTotalPages <= 1) return null;

  const getPageNumbers = () => {
    const pageNumbers = [];
    const pageWindow = 2;
    for (
      let i = Math.max(1, currentPage - pageWindow);
      i <= Math.min(calculatedTotalPages, currentPage + pageWindow);
      i++
    ) {
      pageNumbers.push(i);
    }
    return pageNumbers;
  };

  return (
    <div className="pagination" style={{ display: "flex", justifyContent: "center", gap: "5px", margin: "30px 0" }}>
      {currentPage > 1 && (
        <>
          <button
            className="pagination-btn"
            onClick={() => onPageChange(1)}
          >
            {firstPageText}
          </button>
          <button
            className="pagination-btn"
            onClick={() => onPageChange(currentPage - 1)}
          >
            {prevPageText}
          </button>
        </>
      )}

      {getPageNumbers().map((number) => (
        <button
          className={`pagination-btn ${
            currentPage === number ? activeClass : ""
          }`}
          key={number}
          onClick={() => onPageChange(number)}
        >
          {number}
        </button>
      ))}

      {currentPage < calculatedTotalPages && (
        <>
          <button
            className="pagination-btn"
            onClick={() => onPageChange(currentPage + 1)}
          >
            {nextPageText}
          </button>
          <button
            className="pagination-btn"
            onClick={() => onPageChange(calculatedTotalPages)}
          >
            {lastPageText}
          </button>
        </>
      )}
    </div>
  );
}

export default Pagination;
