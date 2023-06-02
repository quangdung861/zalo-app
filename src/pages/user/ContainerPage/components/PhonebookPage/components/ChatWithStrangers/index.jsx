import React, { useState, useEffect, useMemo, useRef, useContext } from "react";
import * as S from "./styles";

import { AppContext } from "Context/AppProvider";
import { doc, setDoc } from "firebase/firestore";
import { db } from "firebaseConfig";

const ChatWithStrangers = () => {
  const [isShowDropdown, setIsShowDropdown] = useState(false);
  const [isShowOverlayModal, setIsShowOverlayModal] = useState(false);

  const { userInfo, strangerList } = useContext(AppContext);

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
  const accountInfoRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsShowDropdown(false);
      }
      //
      if (
        accountInfoRef.current &&
        !accountInfoRef.current.contains(event.target)
      ) {
        setIsShowOverlayModal(false);
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
    const strangerSelected = strangerList.find((item) => item.id === id);
    setStrangerSelected(strangerSelected);
  };

  const renderStrangerList = useMemo(() => {
    return strangerList.map((item, index) => {
      return (
        <div className="item-stranger" key={index}>
          <div className="item-stranger__left">
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
                <div className="dropdown-menu__item">phân loại</div>
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
            <div className="total-strangers">Bạn bè {strangerList.length}</div>
            <div className="filter-strangers">Filter</div>
            <div className="list-strangers">{renderStrangerList}</div>
          </div>
        </div>
        {isShowOverlayModal && (
          <div className="modal-overlay">
            <div className="container-account-info" ref={accountInfoRef}>
              <div className="account-info">
                <div className="title">
                  Thông tin tài khoản
                  <i
                    className="fa-solid fa-xmark"
                    onClick={() => setIsShowOverlayModal(false)}
                  ></i>
                </div>
                <div className="box-account-info">
                  <div className="header">
                    <img
                      src={strangerSelected.photoCover}
                      alt=""
                      className="photo-cover"
                    />
                    <div className="box-image">
                      <img
                        src={strangerSelected.photoURL}
                        alt=""
                        className="photo-avatar"
                      />
                      <div className="display-name">
                        {strangerSelected.displayName}
                      </div>
                      <div className="btn-texting">Nhắn tin</div>
                    </div>
                  </div>
                  <div className="content">
                    <div className="title">Thông tin cá nhân</div>
                    <div className="content-detail">
                      <div className="content-detail__item">
                        <div className="label">Điện thoại</div>
                        <div className="value">0935 411 853</div>
                      </div>
                      <div className="content-detail__item">
                        <div className="label">Giới tính</div>
                        <div className="value">Nam</div>
                      </div>
                      <div className="content-detail__item">
                        <div className="label">Ngày sinh</div>
                        <div className="value">01/12/1996</div>
                      </div>
                    </div>
                  </div>
                  <div className="footer">
                    <div className="action-list">
                      <div className="action-item">
                        <i className="fa-solid fa-users"></i>
                        <span>Nhóm chung (0)</span>
                      </div>
                      <div className="action-item">
                        <i className="fa-regular fa-address-card"></i>
                        <span>Chia sẻ danh thiếp</span>
                      </div>
                      <div className="action-item">
                        <i className="fa-solid fa-ban"></i>
                        <span>Chặn tin nhắn</span>
                      </div>
                      <div className="action-item">
                        <i className="fa-solid fa-triangle-exclamation"></i>
                        <span>Báo xấu</span>
                      </div>
                      <div className="action-item">
                        <i className="fa-regular fa-trash-can"></i>
                        <span>Xóa khỏi danh sách bạn bè</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </S.Container>
    </S.Wrapper>
  );
};

export default ChatWithStrangers;
