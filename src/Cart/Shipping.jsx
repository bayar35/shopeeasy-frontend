import React, { useState } from "react";
import "../CartStyles/Shipping.css";
import PageTitle from "../components/PageTitle";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CheckoutPath from "./CheckoutPath";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { saveShippingInfo } from "../features/cart/cartSlice";
import { ArrowRight, ArrowLeft } from "lucide-react";

function Shipping() {
  const { shippingInfo } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Монгол улсын 21 аймаг + Улаанбаатар
  const mongolianProvinces = [
    "Улаанбаатар",
    "Архангай",
    "Баян-Өлгий",
    "Баянхонгор",
    "Булган",
    "Говь-Алтай",
    "Говьсүмбэр",
    "Дархан-Уул",
    "Дорноговь",
    "Дорнод",
    "Дундговь",
    "Завхан",
    "Орхон",
    "Өвөрхангай",
    "Өмнөговь",
    "Сүхбаатар",
    "Сэлэнгэ",
    "Төв",
    "Увс",
    "Ховд",
    "Хөвсгөл",
    "Хэнтий",
  ];

  const ulaanbaatarDistricts = [
    "Багануур",
    "Багахангай",
    "Баянгол",
    "Баянзүрх",
    "Налайх",
    "Сонгинохайрхан",
    "Сүхбаатар",
    "Хан-Уул",
    "Чингэлтэй",
  ];

  const khoroosByDistrict = {
    Багануур: Array.from({ length: 5 }, (_, i) => `${i + 1}-р хороо`),
    Багахангай: Array.from({ length: 3 }, (_, i) => `${i + 1}-р хороо`),
    Баянгол: Array.from({ length: 26 }, (_, i) => `${i + 1}-р хороо`),
    Баянзүрх: Array.from({ length: 43 }, (_, i) => `${i + 1}-р хороо`),
    Налайх: Array.from({ length: 8 }, (_, i) => `${i + 1}-р хороо`),
    Сонгинохайрхан: Array.from({ length: 43 }, (_, i) => `${i + 1}-р хороо`),
    Сүхбаатар: Array.from({ length: 20 }, (_, i) => `${i + 1}-р хороо`),
    "Хан-Уул": Array.from({ length: 27 }, (_, i) => `${i + 1}-р хороо`),
    Чингэлтэй: Array.from({ length: 24 }, (_, i) => `${i + 1}-р хороо`),
  };

  // ✨ БҮХ утгуудыг shippingInfo-с урьдчилан бөглөх
  const [name, setName] = useState(shippingInfo?.name || "");
  const [province, setProvince] = useState(shippingInfo?.province || "");
  const [district, setDistrict] = useState(shippingInfo?.district || "");
  const [khoroo, setKhoroo] = useState(shippingInfo?.khoroo || "");
  const [building, setBuilding] = useState(shippingInfo?.building || "");
  const [entrance, setEntrance] = useState(shippingInfo?.entrance || "");
  const [floor, setFloor] = useState(shippingInfo?.floor || "");
  const [door, setDoor] = useState(shippingInfo?.door || "");
  const [pinCode, setPinCode] = useState(shippingInfo?.pincode || "");
  const [phoneNumber, setPhoneNumber] = useState(
    shippingInfo?.phoneNumber || ""
  );

  const isFormValid =
    name.trim() !== "" &&
    province !== "" &&
    district !== "" &&
    khoroo !== "" &&
    building.trim() !== "" &&
    pinCode.toString().trim() !== "" &&
    phoneNumber.toString().trim() !== "";

  const shippingInfoSubmit = (e) => {
    e.preventDefault();

    if (!isFormValid) {
      toast.error("Бүх шаардлагатай талбарыг бөглөнө үү", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }

    if (phoneNumber.length !== 8) {
      toast.error("Утасны дугаар 8 оронтой байх ёстой", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }

    if (pinCode.toString().length < 4) {
      toast.error("Шуудангийн код хамгийн багадаа 4 оронтой байх ёстой", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }

    const fullAddress = `${province}, ${district}, ${khoroo}, ${building}${
      entrance ? `, ${entrance}-р орц` : ""
    }${floor ? `, ${floor}-р давхар` : ""}${door ? `, ${door}-р хаалга` : ""}, ${pinCode}`;

    dispatch(
      saveShippingInfo({
        name: name.trim(),
        address: fullAddress,
        province,
        district,
        khoroo,
        building,
        entrance,
        floor,
        door,
        pincode: pinCode.toString().trim(),
        phoneNumber: phoneNumber.toString().trim(),
        country: "MN",
        state: province,
        city: district,
      })
    );

    toast.success("Хүргэлтийн мэдээлэл хадгалагдлаа", {
      position: "top-center",
      autoClose: 2000,
    });

    navigate("/order/confirm");
  };

  return (
    <>
      <PageTitle title="Хүргэлтийн мэдээлэл" />
      <Navbar />
      <CheckoutPath activePath={0} />

      <div className="shipping-form-container">
        <h1 className="shipping-form-header">Хүргэлтийн мэдээлэл</h1>

        <form className="shipping-form" onSubmit={shippingInfoSubmit}>
          <div className="shipping-section">
            {/* Хүлээн авагчийн нэр */}
            <div className="shipping-form-group">
              <label htmlFor="name">
                Хүлээн авагчийн нэр <span className="required-mark">*</span>
                <span className="required-hint">(бөглөх шаардлагатай)</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Таны нэр"
                required
              />
            </div>

            {/* Утасны дугаар */}
            <div className="shipping-form-group">
              <label htmlFor="phoneNumber">
                Утасны дугаар <span className="required-mark">*</span>
                <span className="required-hint">(бөглөх шаардлагатай)</span>
              </label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="99215231"
                maxLength="8"
                required
              />
              <small className="input-hint">{phoneNumber.length}/8 орон</small>
            </div>

            {/* Аймаг/Хот */}
            <div className="shipping-form-group">
              <label htmlFor="province">
                Аймаг/Хот <span className="required-mark">*</span>
                <span className="required-hint">(бөглөх шаардлагатай)</span>
              </label>
              <select
                name="province"
                id="province"
                value={province}
                onChange={(e) => {
                  setProvince(e.target.value);
                  setDistrict("");
                  setKhoroo("");
                }}
                required
              >
                <option value="">Аймаг/Хот сонгох</option>
                {mongolianProvinces.map((p) => (
                  <option value={p} key={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>

            {/* Дүүрэг/Сум */}
            {province && (
              <div className="shipping-form-group">
                <label htmlFor="district">
                  Дүүрэг/Сум <span className="required-mark">*</span>
                  <span className="required-hint">(бөглөх шаардлагатай)</span>
                </label>
                <select
                  name="district"
                  id="district"
                  value={district}
                  onChange={(e) => {
                    setDistrict(e.target.value);
                    setKhoroo("");
                  }}
                  required
                >
                  <option value="">Дүүрэг/Сум сонгох</option>
                  {province === "Улаанбаатар" &&
                    ulaanbaatarDistricts.map((d) => (
                      <option value={d} key={d}>
                        {d}
                      </option>
                    ))}
                </select>
              </div>
            )}

            {/* Хороо */}
            {district && khoroosByDistrict[district] && (
              <div className="shipping-form-group">
                <label htmlFor="khoroo">
                  Хороо <span className="required-mark">*</span>
                  <span className="required-hint">(бөглөх шаардлагатай)</span>
                </label>
                <select
                  name="khoroo"
                  id="khoroo"
                  value={khoroo}
                  onChange={(e) => setKhoroo(e.target.value)}
                  required
                >
                  <option value="">Хороо сонгох</option>
                  {khoroosByDistrict[district].map((k) => (
                    <option value={k} key={k}>
                      {k}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Байшин/Байр */}
            <div className="shipping-form-group">
              <label htmlFor="building">
                Байшин/Байр <span className="required-mark">*</span>
                <span className="required-hint">(бөглөх шаардлагатай)</span>
              </label>
              <input
                type="text"
                id="building"
                name="building"
                placeholder="Байшингийн дугаар"
                value={building}
                onChange={(e) => setBuilding(e.target.value)}
                required
              />
            </div>

            {/* Орц */}
            <div className="shipping-form-group">
              <label htmlFor="entrance">
                Орц <span className="optional-hint">(сонголтоор)</span>
              </label>
              <input
                type="text"
                id="entrance"
                name="entrance"
                placeholder="Орцны дугаар"
                value={entrance}
                onChange={(e) => setEntrance(e.target.value)}
              />
            </div>

            {/* Давхар */}
            <div className="shipping-form-group">
              <label htmlFor="floor">
                Давхар <span className="optional-hint">(сонголтоор)</span>
              </label>
              <input
                type="text"
                id="floor"
                name="floor"
                placeholder="Давхрын дугаар"
                value={floor}
                onChange={(e) => setFloor(e.target.value)}
              />
            </div>

            {/* Хаалга */}
            <div className="shipping-form-group">
              <label htmlFor="door">
                Хаалга <span className="optional-hint">(сонголтоор)</span>
              </label>
              <input
                type="text"
                id="door"
                name="door"
                placeholder="Хаалганы дугаар"
                value={door}
                onChange={(e) => setDoor(e.target.value)}
              />
            </div>

            {/* Шуудангийн код */}
            <div className="shipping-form-group">
              <label htmlFor="pinCode">
                Шуудангийн код <span className="required-mark">*</span>
                <span className="required-hint">(бөглөх шаардлагатай)</span>
              </label>
              <input
                type="number"
                id="pinCode"
                name="pinCode"
                value={pinCode}
                onChange={(e) => setPinCode(e.target.value)}
                placeholder="1402"
                required
              />
            </div>
          </div>

          {/* CONTINUE + BACK ТОВЧ */}
          <div className="shipping-buttons">
            <button
              type="button"
              className="back-btn-shipping"
              onClick={() => navigate("/cart")}
            >
              <ArrowLeft size={18} />
              Буцах
            </button>
            <button
              type="submit"
              className="shipping-submit-btn"
              disabled={!isFormValid}
            >
              Үргэлжлүүлэх <ArrowRight size={18} />
            </button>
          </div>

          {!isFormValid && (
            <p className="form-warning">
              ⚠️ Улаан одтой бүх талбарыг бөглөсний дараа товч идэвхжинэ
            </p>
          )}
        </form>
      </div>

      <Footer />
    </>
  );
}

export default Shipping;