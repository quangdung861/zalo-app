import React, { useState } from "react";
import * as S from "./styles";
import FriendList from "./components/FriendList";
import ChatWithStrangers from "./components/ChatWithStrangers";

const PhonebookPage = () => {
  const [sectionSelected, setSectionSelected] = useState("friend-list");

  const renderSectionSelected = () => {
    switch (sectionSelected) {
      case "friend-list":
        return <FriendList />;
      case "chat-with-strangers":
        return <ChatWithStrangers />;
      default:
        break;
    }
  };

  return (
    <S.Wrapper>
      <S.Container>
        <div className="phonebook">
          <div className="section-left">
            <div className="section-left__header">
              <div className="search">
                <i className="fa-solid fa-magnifying-glass"></i>
                <input placeholder="Tìm kiếm" />
              </div>
              <div className="add-friend">
                <i className="fa-solid fa-user-plus icon"></i>
              </div>
              <div className="create-groud">
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
                  onClick={() => setSectionSelected("friend-list")}
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
                  onClick={() => setSectionSelected("group-list")}
                >
                  <i className="fa-solid fa-users"></i>
                  Danh sách nhóm
                </div>
                <div
                  className={
                    sectionSelected === "friend-request"
                      ? "content-item content-item--active"
                      : "content-item"
                  }
                  onClick={() => setSectionSelected("friend-request")}
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
                  onClick={() => setSectionSelected("chat-with-strangers")}
                >
                  <i className="fa-solid fa-comments"></i>
                  Trò chuyện với người lạ
                </div>
              </div>
            </div>
          </div>
          <div className="section-right">{renderSectionSelected()}</div>
        </div>
      </S.Container>
    </S.Wrapper>
  );
};

export default PhonebookPage;
