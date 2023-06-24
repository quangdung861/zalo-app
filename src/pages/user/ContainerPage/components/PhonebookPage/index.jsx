import React, { useState, useContext, useEffect, useLayoutEffect } from "react";
import * as S from "./styles";
import FriendList from "./components/FriendList";
import ChatWithStrangers from "./components/ChatWithStrangers";
import Invitations from "./components/Invitations/Index";
import GroupList from "./components/GroupList";
import { UserLayoutContext } from "layouts/user/UserLayout";
import ModalCreateGroup from "components/ModalCreateGroup";

const PhonebookPage = () => {
  const {
    isShowBoxChat,
    setIsShowBoxChat,
    isShowBoxChatGroup,
    setIsShowBoxChatGroup,
    sectionSelected,
    setSectionSelected,
    isShowSectionLeft,
    setIsShowSectionLeft,
    isShowSectionRight,
    setIsShowSectionRight,
  } = useContext(UserLayoutContext);

  const renderSectionSelected = () => {
    switch (sectionSelected) {
      case "friend-list":
        return (
          <FriendList
            setIsShowSectionRight={setIsShowSectionRight}
            setIsShowSectionLeft={setIsShowSectionLeft}
          />
        );
      case "chat-with-strangers":
        return (
          <ChatWithStrangers
            setIsShowSectionRight={setIsShowSectionRight}
            setIsShowSectionLeft={setIsShowSectionLeft}
          />
        );
      case "invitations":
        return (
          <Invitations
            setIsShowSectionRight={setIsShowSectionRight}
            setIsShowSectionLeft={setIsShowSectionLeft}
          />
        );
      case "group-list":
        return (
          <GroupList
            setIsShowSectionRight={setIsShowSectionRight}
            setIsShowSectionLeft={setIsShowSectionLeft}
          />
        );
      default:
        break;
    }
  };

  const [isShowOverlayModal, setIsShowOverlayModal] = useState(false);

  const switchOverStranger = () => {
    setIsShowBoxChatGroup(false);
    setIsShowBoxChat(false);
    if (isShowSectionLeft) {
      setIsShowSectionLeft(false);
    }
    if (!isShowSectionRight) {
      setIsShowSectionRight(true);
    }
    setSectionSelected("chat-with-strangers");
  };

  return (
    <S.Wrapper isShowBoxChat={isShowBoxChat}>
      <S.Container
        isShowSectionLeft={isShowSectionLeft}
        setIsShowSectionRight={setIsShowSectionRight}
      >
        <div className="phonebook">
          <div className="section-left">
            <div className="section-left__header">
              <div className="search">
                <i className="fa-solid fa-magnifying-glass"></i>
                <input placeholder="Tìm kiếm" />
              </div>
              <div className="add-friend" onClick={() => switchOverStranger()}>
                <i className="fa-solid fa-user-plus icon"></i>
              </div>
              <div
                className="create-groud"
                onClick={() => setIsShowOverlayModal(true)}
              >
                <i className="fa-solid fa-users icon"></i>
              </div>
            </div>
            <div className="section-left__content">
              <div className="content-list">
                <div
                  className={
                    sectionSelected === "friend-list"
                      ? "content-item content-item--active"
                      : "content-item"
                  }
                  onClick={() => {
                    setIsShowBoxChat(false);
                    setIsShowBoxChatGroup(false);
                    setSectionSelected("friend-list");
                    setIsShowSectionRight(true);
                    setIsShowSectionLeft(!isShowSectionLeft);
                  }}
                >
                  <i className="fa-solid fa-user-group"></i>
                  Danh sách bạn bè
                </div>
                <div
                  className={
                    sectionSelected === "group-list"
                      ? "content-item content-item--active"
                      : "content-item"
                  }
                  onClick={() => {
                    setIsShowBoxChat(false);
                    setIsShowBoxChatGroup(false);
                    setSectionSelected("group-list");
                    setIsShowSectionRight(true);
                    setIsShowSectionLeft(!isShowSectionLeft);
                  }}
                >
                  <i className="fa-solid fa-users"></i>
                  Danh sách nhóm
                </div>
                <div
                  className={
                    sectionSelected === "invitations"
                      ? "content-item content-item--active"
                      : "content-item"
                  }
                  onClick={() => {
                    setIsShowBoxChat(false);
                    setIsShowBoxChatGroup(false);
                    setSectionSelected("invitations");
                    setIsShowSectionRight(true);
                    setIsShowSectionLeft(!isShowSectionLeft);
                  }}
                >
                  <i className="fa-regular fa-envelope-open"></i>
                  Lời mời kết bạn
                </div>
                <div
                  className={
                    sectionSelected === "chat-with-strangers"
                      ? "content-item content-item--active"
                      : "content-item"
                  }
                  onClick={() => {
                    setIsShowBoxChat(false);
                    setIsShowBoxChatGroup(false);
                    setSectionSelected("chat-with-strangers");
                    setIsShowSectionRight(true);
                    setIsShowSectionLeft(!isShowSectionLeft);
                  }}
                >
                  <i className="fa-solid fa-comments"></i>
                  Trò chuyện với người lạ
                </div>
              </div>
            </div>
          </div>

          {isShowSectionRight && !isShowBoxChat && !isShowBoxChatGroup && (
            <div className="section-right">{renderSectionSelected()}</div>
          )}
        </div>
        {isShowOverlayModal && (
          <ModalCreateGroup setIsShowOverlayModal={setIsShowOverlayModal} />
        )}
      </S.Container>
    </S.Wrapper>
  );
};

export default PhonebookPage;
