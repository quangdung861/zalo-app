import React, { useState, useEffect, useMemo, useRef, useContext } from "react";
import * as S from "./styles";

import { AppContext } from "Context/AppProvider";
import {
  doc,
  setDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { db } from "firebaseConfig";
import ModalAccount from "components/ModalAccount";
import { UserLayoutContext } from "layouts/user/UserLayout";
import empty from "assets/empty.png";
import searchEmpty from "assets/searchEmpty.png";
import moment from "moment";
import ModalAddFriend from "components/ModalAddFriend";

async function fetchUserList(search) {
  let array = [];

  const dbRef = query(
    collection(db, "users"),
    where("keywords", "array-contains", search.toLowerCase())
  );

  const queryDocs = await getDocs(dbRef);

  queryDocs.forEach((doc) => {
    array.push({
      id: doc.id,
      ...doc.data(),
    });
  });

  return array;
}

const ChatWithStrangers = ({ setIsShowSectionRight, setIsShowSectionLeft }) => {
  const [isShowDropdown, setIsShowDropdown] = useState(false);
  const [isShowOverlayModal, setIsShowOverlayModal] = useState(false);
  console.log(
    "🚀 ~ file: index.jsx:44 ~ ChatWithStrangers ~ isShowOverlayModal:",
    isShowOverlayModal
  );

  const { isShowBoxChat, setIsShowBoxChat, setIsShowBoxChatGroup } =
    useContext(UserLayoutContext);

  const {
    userInfo,
    strangerList,
    setSelectedUserMessaging,
    keywords,
    setKeywords,
    setSelectedGroupMessaging,
  } = useContext(AppContext);

  const [loading, setLoading] = useState(false);
  const [isShowOverlayModalAddFriend, setIsShowOverlayModalAddFriend] =
    useState(false);
  const [infoAddfriend, setInfoAddFriend] = useState({});

  const handleInvitationSent = async ({ uid, id, invitationReceive }) => {
    const newStrangerSelected = strangerList.find((item) => item.id === id);
    setStrangerSelected(newStrangerSelected);
    setInfoAddFriend({ uid, id, invitationReceive });
    setIsShowOverlayModalAddFriend(true);
    setIsShowDropdown(false);
  };

  // const [messageValue, setMessageValue] =  useState(
  //   `Xin chào, mình là ${userInfo.displayName}. Mình tìm thấy bạn bằng số điện thoại. Kết bạn với mình nhé!`
  // );

  const [messageValue, setMessageValue] = useState(
    `Xin chào, mình là ${userInfo.displayName}. Mình tìm thấy bạn từ trò chuyện với người lạ. Kết bạn với mình nhé!`
  );

  const handleAddFriend = async () => {
    const { uid, id, invitationReceive } = infoAddfriend;
    // STRANGER
    const nowDate = moment().unix() * 1000;
    const strangerRef = doc(db, "users", id);
    await setDoc(
      strangerRef,
      {
        invitationReceive: [
          ...invitationReceive,
          {
            uid: userInfo.uid,
            message: messageValue,
            from: "Từ trò chuyện với người lạ",
            createdAt: nowDate,
          },
        ],
      },
      { merge: true }
    );
    // ME
    const userInfoRef = doc(db, "users", userInfo.id);
    await setDoc(
      userInfoRef,
      {
        invitationSent: [
          ...userInfo.invitationSent,
          {
            uid,
            message: messageValue,
            from: "Từ trò chuyện với người lạ",
            createdAt: nowDate,
          },
        ],
      },
      { merge: true }
    );
    setIsShowOverlayModalAddFriend(false);
  };

  const dropdownRef = useRef(null);
  const orderByRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsShowDropdown(false);
      }
      if (orderByRef.current && !orderByRef.current.contains(event.target)) {
        setDropdownOrderBy(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const [strangerSelected, setStrangerSelected] = useState();
  console.log(
    "🚀 ~ file: index.jsx:138 ~ ChatWithStrangers ~ strangerSelected:",
    strangerSelected
  );

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

  const [orderBy, setOderBy] = useState("asc");
  const [dropdownOrderBy, setDropdownOrderBy] = useState(false);

  const renderStrangerList = useMemo(() => {
    setLoading(true);
    if (strangerList[0]) {
      setLoading(false);
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
              <img src={item.photoURL} alt="" />
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
              minHeight: `calc(100vh - 65px - 64px - 68px)`,
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

  const handleSearch = async (value) => {
    // const usersResult = await fetchUserList(value);
    setKeywords(value);
  };

  const handleComeBack = () => {
    setIsShowBoxChat(false);
    setIsShowSectionRight(false);
    setIsShowSectionLeft(true);
  };

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
          />
        )}
        {isShowOverlayModalAddFriend && (
          <ModalAddFriend
            setIsShowOverlayModalAddFriend={setIsShowOverlayModalAddFriend}
            fullInfoUser={strangerSelected}
            userInfo={userInfo}
            handleAddFriend={handleAddFriend}
            setMessageValue={setMessageValue}
            messageValue={messageValue}
            handleWatchInfo={handleWatchInfo}
            setIsShowOverlayModal={setIsShowOverlayModal}
          />
        )}
      </S.Container>
    </S.Wrapper>
  );
};

export default ChatWithStrangers;
