import React, { useContext, useEffect, useRef, useState } from "react";

import "./styles.scss";
import { doc, setDoc } from "firebase/firestore";
import { db } from "firebaseConfig";
import { AppContext } from "Context/AppProvider";
import { UserLayoutContext } from "layouts/user/UserLayout";
import { convertImageToBase64 } from "utils/file";
import coverCloud from "assets/coverCloud.png";
import AvatarGroup from "components/AvatarGroup";

const ModalAccount = ({
  setIsShowOverlayModal,
  isShowOverlayModal,
  accountSelected,
}) => {
  const phoneNumberRef = useRef(null);

  const accountInfoRef = useRef(null);

  const { userInfo, setSelectedUserMessaging } = useContext(AppContext);
  const { setIsShowBoxChat, setIsShowBoxChatGroup } =
    useContext(UserLayoutContext);

  // PHONENUMBER
  const [updatePhoneNumber, setUpdatePhoneNumber] = useState();
  const [inputValuePhoneNumber, setInputValuePhoneNumber] = useState();
  // SEX
  const [updateSex, setUpdateSex] = useState();
  const [inputValueSex, setInputValueSex] = useState();
  // DATE OF BIRTH
  const [updateDateOfBirth, setUpdateDateOfBirth] = useState();
  const [inputValueDateOfBirth, setInputValueDateOfBirth] = useState();
  // IMAGE
  const [imgPreviewCover, setImgPreviewCover] = useState(null);

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

  // if (!accountSelected) {
  //   return <div></div>;
  // }

  const toogleBoxChat = ({
    uidSelected,
    photoURLSelected,
    displayNameSelected,
  }) => {
    setIsShowBoxChatGroup(false);
    setIsShowBoxChat(true);
    setSelectedUserMessaging({
      uidSelected,
      photoURLSelected,
      displayNameSelected,
    });
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
                    src={accountSelected?.room?.avatar}
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
                <div className="btn-texting">Nhắn tin</div>
              </div>
            </div>
            <div className="content">
              <div className="content__title">Thành viên (3)</div>
              <div className="member-list">
                {accountSelected?.avatars?.length <= 3 &&
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
                {accountSelected?.avatars?.length > 3 &&
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
