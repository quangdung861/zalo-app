import React, { useContext, useEffect, useRef } from "react";

import "./styles.scss";

import { AppContext } from "Context/AppProvider";
import { UserLayoutContext } from "layouts/user/UserLayout";
import AvatarGroup from "components/AvatarGroup";

const ModalAccount = ({
  setIsShowOverlayModal,
  isShowOverlayModal,
  accountSelected,
}) => {
  const accountInfoRef = useRef(null);

  const { setSelectedUserMessaging, setSelectedGroupMessaging } =
    useContext(AppContext);
  const { setIsShowBoxChat, setIsShowBoxChatGroup } =
    useContext(UserLayoutContext);

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

  const toogleBoxChat = () => {
    setSelectedUserMessaging({});
    setIsShowBoxChat(false);
    setIsShowBoxChatGroup(true);

    setSelectedGroupMessaging(accountSelected);
    setIsShowOverlayModal(!isShowOverlayModal);
  };

  return (
    <div className="modal-overlay-group">
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
              <div className="header-right"></div>

              {/*  */}
              <div className="box-image">
                {accountSelected?.room?.avatar ? (
                  <img
                    src={accountSelected?.room?.avatar?.url}
                    alt=""
                    className="photo-avatar"
                  />
                ) : (
                  <AvatarGroup
                    props={{
                      avatars: accountSelected.avatars,
                      room: accountSelected.room,
                    }}
                    styleBox={{ width: "72px", height: "72px" }}
                    styleIcon={{ width: "38px", height: "38px" }}
                  />
                )}

                {/* <label htmlFor="inputFileAvatar" className="box-avatar__icon">
                  <i className="fa-solid fa-camera"></i>
                </label>
                <input
                  type="file"
                  id="inputFileAvatar"
                  className="custom-file-input"
                /> */}
                {/*  */}
                <div className="display-name">
                  {accountSelected?.room?.name || accountSelected.name}
                </div>
                <div className="btn-texting" onClick={() => toogleBoxChat()}>
                  Nhắn tin
                </div>
              </div>
            </div>
            <div className="content">
              <div className="content__title">
                Thành viên ({accountSelected?.room?.members?.length})
              </div>
              <div className="member-list">
                {accountSelected?.avatars?.length <= 6 &&
                  accountSelected?.avatars.map((item, index) => (
                    <img
                      src={item}
                      alt=""
                      className="member-item"
                      style={{
                        zIndex: accountSelected?.avatars?.length - index,
                      }}
                    />
                  ))}
                {accountSelected?.avatars?.length > 6 && (
                  <>
                    {accountSelected?.avatars.map(
                      (item, index) =>
                        index < 6 && (
                          <img
                            src={item}
                            alt=""
                            className="member-item"
                            style={{
                              zIndex: accountSelected?.avatars?.length - index,
                            }}
                            title={[...accountSelected.name.split(", ")][index]}
                          />
                        )
                    )}
                    <div
                      className="view-more"
                    >
                      <i class="fa-solid fa-ellipsis"></i>
                    </div>
                  </>
                )}
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalAccount;
