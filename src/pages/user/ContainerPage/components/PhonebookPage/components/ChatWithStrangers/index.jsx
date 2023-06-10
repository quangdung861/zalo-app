import React, { useState, useEffect, useMemo, useRef, useContext } from "react";
import * as S from "./styles";

import { AppContext } from "Context/AppProvider";
import { doc, setDoc } from "firebase/firestore";
import { db } from "firebaseConfig";
import ModalAccount from "components/ModalAccount";
import { UserLayoutContext } from "layouts/user/UserLayout";

const ChatWithStrangers = () => {
  const [isShowDropdown, setIsShowDropdown] = useState(false);
  const [isShowOverlayModal, setIsShowOverlayModal] = useState(false);

  const { isShowBoxChat, setIsShowBoxChat } = useContext(UserLayoutContext);

  const { userInfo, strangerList, setSelectedUserMessaging } =
    useContext(AppContext);

  const handleInvitationSent = async ({ uid, id, invitationReceive }) => {
    const userInfoRef = doc(db, "users", userInfo.id);
    await setDoc(
      userInfoRef,
      {
        invitationSent: [uid, ...userInfo.invitationSent],
      },
      { merge: true }
    );
    // STRANGER
    const strangerRef = doc(db, "users", id);
    await setDoc(
      strangerRef,
      {
        invitationReceive: [userInfo.uid, ...invitationReceive],
      },
      { merge: true }
    );
  };

  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const [strangerSelected, setStrangerSelected] = useState();

  const handleWatchInfo = ({ id }) => {
    setIsShowOverlayModal(true);
    setIsShowDropdown(false);
    const newStrangerSelected = strangerList.find((item) => item.id === id);
    setStrangerSelected(newStrangerSelected);
  };

  const toogleBoxChat = ({
    uidSelected,
    photoURLSelected,
    displayNameSelected,
  }) => {
    setIsShowBoxChat(!isShowBoxChat);
    setSelectedUserMessaging({
      uidSelected,
      photoURLSelected,
      displayNameSelected,
    });
  };

  const renderStrangerList = useMemo(() => {
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
                {userInfo.invitationSent.includes(item.uid) ||
                userInfo.invitationReceive.includes(item.uid) ? (
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
  }, [strangerList, isShowDropdown]);

  return (
    <S.Wrapper>
      <S.Container>
        <div className="strangerlist">
          <div className="strangerlist-header">
            <i className="fa-solid fa-comments"></i>
            Trò chuyện với người lạ
          </div>
          <div className="strangerlist-content">
            <div className="total-strangers">
              Người lạ ({strangerList?.length})
            </div>
            <div className="filter-strangers">Filter</div>
            <div className="list-strangers">{renderStrangerList}</div>
          </div>
        </div>
        {isShowOverlayModal && (
          <ModalAccount
            setIsShowOverlayModal={setIsShowOverlayModal}
            accountSelected={strangerSelected}
          />
        )}
      </S.Container>
    </S.Wrapper>
  );
};

export default ChatWithStrangers;
