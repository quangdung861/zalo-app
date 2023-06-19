import React, { useContext, useEffect, useState } from "react";

import { auth, db } from "firebaseConfig";
import { DropdownContext } from "App";
import * as S from "./styles";
import { UserLayoutContext } from "../UserLayout";
import { AppContext } from "Context/AppProvider";
import ModalAccount from "components/ModalAccount";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";

const Sidebar = () => {
  const [isShowOverlayModal, setIsShowOverlayModal] = useState(false);

  const { setIsShowDropdown, isShowDropdown, dropdownRef } =
    useContext(DropdownContext);

  const {
    sidebarSelected,
    setSidebarSelected,
    totalUnSeenMessage,
    setIsShowBoxChatGroup,
  } = useContext(UserLayoutContext);
  const { userInfo, rooms, setSelectedUserMessaging } = useContext(AppContext);

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

  const handleOpenBoxChat = (id) => {
    if (id === "phonebook") {
      setIsShowBoxChatGroup(false);
      setIsShowBoxChat(false);
    }
  };

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
          onClick={() => {
            handleOpenBoxChat(item.id);
            setSidebarSelected(item.id);
          }}
        >
          {item.icon}
          {totalUnSeenMessage > 0 && item.id === "message" && (
            <div className="unseen-messages">
              {totalUnSeenMessage > 5 ? "N" : totalUnSeenMessage}
            </div>
          )}
        </div>
      );
    });
  };

  const handleLogout = async () => {
    const docRef = doc(db, "users", userInfo.id);
    await setDoc(
      docRef,
      {
        isOnline: {
          value: false,
          updatedAt: serverTimestamp(),
        },
      },
      {
        merge: true,
      }
    );
    await auth.signOut();
    window.location.reload();
  };

  const { setIsShowBoxChat } = useContext(UserLayoutContext);

  const [roomCloud, setRoomCloud] = useState();
  const getRoomCloud = () => {
    const roomCloudResult = rooms?.find((item) => item.category === "my cloud");
    const cloudInfo = roomCloudResult.info.find(
      (item) => item.uid === "my-cloud"
    );
    setRoomCloud(cloudInfo);
  };

  useEffect(() => {
    if (rooms[0]) {
      getRoomCloud();
    }
  }, [rooms]);

  const toogleBoxChat = () => {
    setIsShowBoxChatGroup(false);
    setIsShowBoxChat(true);
    setSelectedUserMessaging({
      uidSelected: roomCloud.uid,
      photoURLSelected: roomCloud.avatar,
      displayNameSelected: roomCloud.name,
    });
  };

  return (
    <S.Wrapper>
      <div className="sidebar">
        <div className="header">
          <div className="avatar">
            <img
              src={userInfo?.photoURL}
              alt=""
              onClick={() => setIsShowOverlayModal(true)}
            />
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
              onClick={() => toogleBoxChat()}
            >
              <i className="fa-solid fa-cloud icon-cloud"></i>
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
      </div>

      {isShowOverlayModal && (
        <ModalAccount
          setIsShowOverlayModal={setIsShowOverlayModal}
          accountSelected={userInfo}
        />
      )}
    </S.Wrapper>
  );
};

export default Sidebar;
