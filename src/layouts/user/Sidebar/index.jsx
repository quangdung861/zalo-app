import React, { useContext } from "react";

import { ROUTES } from "routes";
import { useNavigate, useLocation } from "react-router-dom";
import { auth } from "firebaseConfig";
import { signOut } from "firebase/auth";
import { AppContext } from "App";
import * as S from "./styles";
import { useDispatch, useSelector } from "react-redux";
import { logoutAction } from "redux/user/actions";
import { UserLayoutContext } from "../UserLayout";

const Sidebar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.userReducer);

  const { setIsShowDropdown, isShowDropdown, dropdownRef } =
    useContext(AppContext);

  const { sidebarSelected, setSidebarSelected } = useContext(UserLayoutContext);

  const listItemTop = [
    {
      id: "message",
      name: "Tin nhắn",
      icon: <i className="fa-solid fa-comment"></i>,
    },
    {
      id: "phonebook",
      name: "Danh bạ",
      icon: <i className="fa-solid fa-book"></i>,
    },
  ];

  const renderActionList = (list) => {
    return list.map((item, index) => {
      return (
        <div
          key={index}
          className={
            sidebarSelected === item.id
              ? "action-item action-item--active"
              : "action-item"
          }
          title={item.name}
          onClick={() => setSidebarSelected(item.id)}
        >
          {item.icon}
        </div>
      );
    });
  };

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        dispatch(logoutAction());
      })
      .catch((error) => {
        // An error happened.
      });
  };

  return (
    <S.Wrapper>
      <div className="header">
        <div className="avatar">
          <img src={userInfo.data.photoURL} alt="" />
        </div>
      </div>
      <div className="action-list">
        <div className="action-top">{renderActionList(listItemTop)}</div>
        {/*  */}
        <div className="action-bottom">
          <div
            className="action-item action-cloud"
            title="Cloud"
            ref={dropdownRef}
          >
            <i className="fa-solid fa-cloud"></i>
          </div>
          <div
            className="action-item action-setting"
            title="Cài đặt"
            ref={dropdownRef}
            style={isShowDropdown ? { backgroundColor: "#006edc" } : {}}
          >
            <i
              className="fa-solid fa-gear"
              onClick={() => setIsShowDropdown(!isShowDropdown)}
            ></i>
            {isShowDropdown && (
              <div className="dropdown-setting">
                <div className="dropdown-setting__item ">
                  <div className="content-left">
                    <i className="fa-regular fa-user"></i>
                    Thông tin tài khoản
                  </div>
                </div>
                <div className="dropdown-setting__item ">
                  <div className="content-left">
                    <i className="fa-solid fa-gear"></i>
                    Cài đặt
                  </div>
                </div>
                <div className="dividing-line" />
                <div className="dropdown-setting__item ">
                  <div className="content-left">
                    <i className="fa-regular fa-floppy-disk"></i>
                    Lưu trữ
                  </div>
                  <div className="content-right">
                    <i className="fa-solid fa-angle-right"></i>
                  </div>
                  <div className="dropdown-second">
                    <div className="dropdown-second__item">Quản lý File</div>
                  </div>
                </div>
                <div className="dropdown-setting__item ">
                  <div className="content-left">
                    <i className="fa-solid fa-screwdriver-wrench"></i>
                    Công cụ
                  </div>
                  <div className="content-right">
                    <i className="fa-solid fa-angle-right"></i>
                  </div>
                </div>
                <div className="dropdown-setting__item ">
                  <div className="content-left">
                    <i className="fa-solid fa-globe"></i>
                    Ngôn ngữ
                  </div>
                  <div className="content-right">
                    <i className="fa-solid fa-angle-right"></i>
                  </div>
                </div>
                <div className="dropdown-setting__item ">
                  <div className="content-left">
                    <i className="fa-solid fa-circle-info"></i>
                    Giới thiệu
                  </div>
                  <div className="content-right">
                    <i className="fa-solid fa-angle-right"></i>
                  </div>
                </div>
                <div className="dividing-line" />
                <div
                  className="dropdown-setting__item logout"
                  onClick={() => {
                    handleLogout();
                    setIsShowDropdown(!isShowDropdown);
                  }}
                >
                  Đăng xuất
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </S.Wrapper>
  );
};

export default Sidebar;
