import React, { useState, useEffect, useMemo, useRef, useContext } from "react";

import { AppContext } from "Context/AppProvider";
import { UserLayoutContext } from "layouts/user/UserLayout";
import ModalAccount from "components/ModalAccount";
import empty from "assets/empty.png";
import searchEmpty from "assets/searchEmpty.png";
import ModalAddFriend from "components/ModalAddFriend";
import * as S from "./styles";
import useClickOutside from "hooks/useClickOutside";

const ChatWithStrangers = () => {

  const {
    userInfo,
    strangerList,
    setSelectedUserMessaging,
    keywords,
    setKeywords,
    setSelectedGroupMessaging,
  } = useContext(AppContext);

  const { isShowBoxChat, setIsShowBoxChat, setIsShowBoxChatGroup, handleComeBack } =
    useContext(UserLayoutContext);

  const dropdownRef = useRef(null);
  const orderByRef = useRef(null);

  const [isShowDropdown, setIsShowDropdown] = useState(false);
  const [isShowOverlayModal, setIsShowOverlayModal] = useState(false);
  const [isShowOverlayModalAddFriend, setIsShowOverlayModalAddFriend] =
    useState(false);

  const [orderBy, setOderBy] = useState("asc");
  const [dropdownOrderBy, setDropdownOrderBy] = useState(false);
  const [strangerSelected, setStrangerSelected] = useState();

  useClickOutside(dropdownRef, () => {
    setIsShowDropdown(false);
  });
  useClickOutside(orderByRef, () => {
    setDropdownOrderBy(false);
  });

  const handleWatchInfo = ({ id }) => {
    setIsShowOverlayModal(true);
    setIsShowDropdown(false);
    setIsShowOverlayModalAddFriend(false);
    const newStrangerSelected = strangerList.find((item) => item.id === id);
    setStrangerSelected(newStrangerSelected);
  };

  const toogleBoxChat = ({
    uidSelected,
    photoURLSelected,
    displayNameSelected,
  }) => {
    setSelectedGroupMessaging({});
    setIsShowBoxChatGroup(false);
    setIsShowBoxChat(!isShowBoxChat);
    setSelectedUserMessaging({
      uidSelected,
      photoURLSelected,
      displayNameSelected,
    });
  };

  const handleInvitationSent = async ({ uid, id, invitationReceive }) => {
    const newStrangerSelected = strangerList.find((item) => item.id === id);
    setStrangerSelected(newStrangerSelected);
    setIsShowOverlayModalAddFriend(true);
    setIsShowDropdown(false);
  };

  const handleSearch = async (value) => {
    setKeywords(value);
  };

  const renderStrangerList = useMemo(() => {
    if (strangerList[0]) {
      if (orderBy === "desc") {
        strangerList.sort((a, b) =>
          b.displayName?.localeCompare(a.displayName)
        ); //desc
      } else {
        strangerList.sort((a, b) =>
          a.displayName?.localeCompare(b.displayName)
        ); //asc
      }

      return strangerList?.map((item, index) => {
        return (
          <div className="item-stranger" key={index}>
            <div
              className="item-stranger__left"
              onClick={() =>
                toogleBoxChat({
                  uidSelected: item.uid,
                  photoURLSelected: item.photoURL,
                  displayNameSelected: item.displayName,
                })
              }
            >
              <img src={item.photoURL?.thumbnail} alt="" />
              <span>{item.displayName}</span>
            </div>
            <div className="item-stranger__right">
              <i
                className="fa-solid fa-ellipsis"
                onClick={() => {
                  setIsShowDropdown(item.id);
                }}
              ></i>
              {isShowDropdown === item.id && (
                <div className="dropdown-menu" ref={dropdownRef}>
                  <div
                    className="dropdown-menu__item"
                    onClick={() => handleWatchInfo({ id: item.id })}
                  >
                    Xem Thông tin
                  </div>
                  <div className="divding-line" />
                  <div className="dropdown-menu__item">Phân loại</div>
                  <div className="dropdown-menu__item">Đặt tên gợi nhớ</div>
                  <div className="divding-line" />
                  <div className="dropdown-menu__item">Chặn người này</div>
                  {userInfo.invitationSent.find(
                    (element) => element.uid === item.uid
                  ) ||
                    userInfo.invitationReceive.find(
                      (element) => element.uid === item.uid
                    ) ? (
                    <></>
                  ) : (
                    <>
                      <div className="divding-line" />
                      <div
                        className="dropdown-menu__item add-friend"
                        onClick={() =>
                          handleInvitationSent({
                            uid: item.uid,
                            id: item.id,
                            invitationReceive: item.invitationReceive,
                          })
                        }
                      >
                        Thêm bạn
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      });
    } else {
      if (keywords) {
        return (
          <div
            className="container-empty"
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              padding: "62px 0px",
              minHeight: `calc(100dvh - 65px - 64px - 68px)`,
            }}
          >
            <img
              src={searchEmpty}
              alt=""
              style={{
                marginBottom: "20px",
                width: "160px",
                objectFit: "cover",
              }}
            />
            <div
              style={{
                fontWeight: 500,
                marginBottom: "8px",
              }}
            >
              Không tìm thấy kết quả
            </div>
            <div className="text">
              Vui lòng thử lại từ khóa hoặc bộ lọc khác
            </div>
          </div>
        );
      }
      return (
        <div
          className="container-empty"
          style={{
            backgroundColor: "#F1F1F1",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            padding: "62px 0px",
          }}
        >
          <img src={empty} alt="" style={{ marginBottom: "12px" }} />
          <div style={{ color: "rgb(151, 164, 181)", fontWeight: 500 }}>
            Không có người lạ nào
          </div>
        </div>
      );
    }
  }, [strangerList, isShowDropdown, orderBy]);

  return (
    <S.Wrapper>
      <S.Container>
        <div className="strangerlist">
          <div className="strangerlist-header">
            <div className="btn-come-back" onClick={() => handleComeBack()}>
              <i className="fa-solid fa-chevron-left"></i>
            </div>
            <i className="fa-solid fa-comments"></i>
            Trò chuyện với người lạ
          </div>
          <div className="strangerlist-content">
            <div className="total-strangers">
              Người lạ ({strangerList?.length})
            </div>
            <div className="filter-strangers">
              <div className="filter-item search">
                <i className="fa-solid fa-magnifying-glass"></i>
                <input
                  value={keywords}
                  type="text"
                  className="input-search"
                  placeholder="Tìm bạn"
                  onChange={(e) => handleSearch(e.target.value)}
                />
                {keywords?.length > 0 && (
                  <i
                    className="fa-solid fa-circle-xmark"
                    onClick={() => handleSearch("")}
                    style={{ cursor: "pointer" }}
                  ></i>
                )}
              </div>
              <div className="filter-item asc-desc-order">
                <div
                  className={
                    dropdownOrderBy
                      ? "asc-desc-order__current asc-desc-order__current--active"
                      : "asc-desc-order__current"
                  }
                  onClick={() => setDropdownOrderBy(!dropdownOrderBy)}
                >
                  <i className="fa-solid fa-arrows-up-down"></i>
                  <span>Tên {orderBy === "asc" ? "(A-Z)" : "(Z-A)"}</span>
                  <i className="fa-solid fa-chevron-down"></i>
                </div>
                {dropdownOrderBy && (
                  <div className="asc-desc-order__dropdown" ref={orderByRef}>
                    <div
                      className="asc-filter"
                      onClick={() => {
                        setOderBy("asc");
                        setDropdownOrderBy(false);
                      }}
                    >
                      <span className="pick">
                        {orderBy === "asc" && (
                          <i className="fa-solid fa-check"></i>
                        )}
                      </span>

                      <span>Tên (A-Z)</span>
                    </div>
                    <div
                      className="desc-filter"
                      onClick={() => {
                        setOderBy("desc");
                        setDropdownOrderBy(false);
                      }}
                    >
                      <span className="pick">
                        {orderBy === "desc" && (
                          <i className="fa-solid fa-check"></i>
                        )}
                      </span>
                      <span>Tên (Z-A)</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="list-strangers"> {renderStrangerList}</div>
          </div>
        </div>
        {isShowOverlayModal && (
          <ModalAccount
            setIsShowOverlayModal={setIsShowOverlayModal}
            accountSelected={strangerSelected}
            setIsShowOverlayModalAddFriend={setIsShowOverlayModalAddFriend}
          />
        )}
        {isShowOverlayModalAddFriend && (
          <ModalAddFriend
            setIsShowOverlayModalAddFriend={setIsShowOverlayModalAddFriend}
            fullInfoUser={strangerSelected}
            userInfo={userInfo}
            handleWatchInfo={handleWatchInfo}
            setIsShowOverlayModal={setIsShowOverlayModal}
          />
        )}
      </S.Container>
    </S.Wrapper>
  );
};

export default ChatWithStrangers;
