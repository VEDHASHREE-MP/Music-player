import React from "react";

import { IoIosSettings } from "react-icons/io";
import logo from "../../assets/Isai-logo.png";
import "../../css/sidemenu/SideMenu.css";
import { CiUser } from "react-icons/ci";
import { IoIosHome } from "react-icons/io";
import { TbMusicSearch } from "react-icons/tb";
import { MdOutlineFavorite } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { openAuthModal } from "../../redux/slices/uiSlice";

const SideMenu = ({ setView, view, onOpenEditProfile }) => {
  const dispatch= useDispatch();
  const {user, isAuthenticated}= useSelector((state) => state.auth);
  const displayUser={
    name: user?.name || "Guest",
    avatar: user?. avatar || "",
  };

  const handleSearchClick =() =>{
    if (!isAuthenticated){
      dispatch(openAuthModal("login"));
      return;
    }
    setView("search");
  }

  
  const handleFavouriteClick =() =>{
    if (!isAuthenticated){
      dispatch(openAuthModal("login"));
      return;
    }
    setView("favourite");
  }
  const getNavBtnClass = (item) =>
    `sidemenu-nav-btn ${view === item ? "active" : ""}`;
  return (
    <>
      <aside className="sidemenu-root">
        {/* Logo */}
        <div className="sidemenu-header">
          <img src={logo} alt="Project-logo" className="sidemenu-logo-img" />
          <h2 className="sidemenu-logo-title">Isai</h2>
        </div>
        {/* Navigation */}
        <nav className="sidemenu-nav" aria-label="Main navigation">
          <ul className="sidemenu-nav-list">
            <li>
              <button
                className={getNavBtnClass("home")}
                onClick={() => setView("home")}
              >
                <IoIosHome className="sidemenu-nav-icon" size={18} />
                <span>Home</span>
              </button>
            </li>
            <li>
              <button
                onClick={handleSearchClick}
                className={getNavBtnClass("search")}
              >
                <TbMusicSearch className="sidemenu-nav-icon" size={18} />
                <span> Search</span>
              </button>
            </li>
            <li>
              <button
                className={getNavBtnClass("favourite")}
                onClick={handleFavouriteClick}
              >
                <MdOutlineFavorite className="sidemenu-nav-icon" size={18} />
                <span>Favourite</span>
              </button>
            </li>
          </ul>
        </nav>

        <div className="flex-1"></div>
        <div className="sidemenu-profile-row">
          <div className="profile-placeholder">
            <CiUser size={30} />
          </div>

          <div className="sidemenu-username-wrapper">
            <div className="sidemenu-username">{displayUser.name}</div>
          </div>
           
            {isAuthenticated && (
              <div className="settings-container">
              <button type="button" className="sidemenu-settings-btn" onClick={onOpenEditProfile}>
              <IoIosSettings size={20} />
            </button>
          </div>)}
        </div>
      </aside>
    </>
  );
};

export default SideMenu;
