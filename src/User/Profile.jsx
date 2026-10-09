import React, { useEffect } from "react";
import "../UserStyles/Profile.css";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import PageTitle from "../components/PageTitle";
import Loader from "../components/Loader";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function Profile() {
  const { loading, isAuthenticated, user } = useSelector(
    (state) => state.user
  );
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated === false) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  if (loading || !user) {
    return (
      <>
        <PageTitle title="Уншиж байна..." />
        <Navbar />
        <Loader />
        <Footer />
      </>
    );
  }

  return (
    <>
      <PageTitle title={`${user.name} - Профайл`} />
      <Navbar />
      <div className="profile-container">
        <div className="profile-image">
          <h1 className="profile-heading">Миний профайл</h1>
          <img
            src={
              user?.avatar?.url
                ? user.avatar.url
                : "./images/profile.png"
            }
            alt="User Profile"
            className="profile-avatar-img"
          />
          <Link to="/profile/update" className="profile-edit-btn">
            Профайл засах
          </Link>
        </div>
        <div className="profile-details">
          <div className="profile-detail">
            <h2>Хэрэглэгчийн нэр: </h2>
            <p>{user.name}</p>
          </div>
          <div className="profile-detail">
            <h2>И-мэйл: </h2>
            <p>{user.email}</p>
          </div>
          <div className="profile-detail">
            <h2>Бүртгүүлсэн: </h2>
            <p>
              {user.createdAt
                ? String(user.createdAt).substring(0, 10)
                : "N/A"}
            </p>
          </div>
          <div className="profile-buttons">
            <Link to="/orders/user">Миний захиалгууд</Link>
            <Link to="/password/update">Нууц үг солих</Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Profile;