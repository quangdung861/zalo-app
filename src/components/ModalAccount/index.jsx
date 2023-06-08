import React, { useContext, useEffect, useRef } from "react";

import "./styles.scss";
import { AppContext } from "Context/AppProvider";

const ModalAccount = ({ setIsShowOverlayModal, accountSelected }) => {
  console.log(
    "🚀 ~ file: index.jsx:6 ~ ModalAccount ~ accountSelected:",
    accountSelected
  );
  const accountInfoRef = useRef(null);

  const { userInfo } = useContext(AppContext);

  useEffect(() => {
    const handleClickOutside = (event) => {
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

  return (
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
                src={accountSelected.photoCover}
                alt=""
                className="photo-cover"
              />
              <div className="box-image">
                <img
                  src={accountSelected.photoURL}
                  alt=""
                  className="photo-avatar"
                />
                <div className="display-name">
                  {accountSelected.displayName}
                </div>

                {accountSelected.uid !== userInfo?.uid && (
                  <div className="btn-texting"> Nhắn tin </div>
                )}
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
  );
};

export default ModalAccount;
