import React, { useContext, useEffect, useRef, useState } from "react";
import { db } from "firebaseConfig";
import { doc, updateDoc } from "firebase/firestore";
import moment from "moment";
import { AppContext } from "Context/AppProvider";
import * as S from "./styles";
import useClickOutside from "hooks/useClickOutside";
const ModalAddFriend = ({
  setIsShowOverlayModalAddFriend,
  fullInfoUser,
  setIsShowOverlayModal,
}) => {
  const { userInfo, startLoading, stopLoading } = useContext(AppContext);

  const [isViewLogs, setIsViewLogs] = useState(false);

  const textAreaRef = useRef(null);
  const modalContainer = useRef(null);

  const [messageValue, setMessageValue] = useState(
    `Xin chào, mình là ${userInfo.displayName}. Mình tìm thấy bạn từ trò chuyện với người lạ. Kết bạn với mình nhé!`
  );

  useEffect(() => {
    if (textAreaRef) {
      textAreaRef.current.focus();
      const length = messageValue.length;
      textAreaRef.current.setSelectionRange(length, length);
    }
  }, []);

  useClickOutside(modalContainer, () => {
    setIsShowOverlayModalAddFriend(false);
  });

  const handleFocus = () => {
    Object.assign(textAreaRef.current.style, {
      border: "1px solid #0068FF",
    });
  };

  const handleBlur = () => {
    Object.assign(textAreaRef.current.style, {
      border: "1px solid var(--boder-dividing-color)",
    });
  };

  const handleAddFriend = async () => {
    const { uid, id, invitationReceive } = fullInfoUser;
    // STRANGER
    const nowDate = moment().unix() * 1000;
    const strangerRef = doc(db, "users", id);
    startLoading();
    await updateDoc(
      strangerRef,
      {
        invitationReceive: [
          ...invitationReceive,
          {
            uid: userInfo.uid,
            message: messageValue,
            from: "Từ trò chuyện với người lạ",
            clientCreatedAt: nowDate,
          },
        ],
      }
    );
    // ME
    const userInfoRef = doc(db, "users", userInfo.id);
    await updateDoc(
      userInfoRef,
      {
        invitationSent: [
          ...userInfo.invitationSent,
          {
            uid,
            message: messageValue,
            from: "Từ trò chuyện với người lạ",
            clientCreatedAt: nowDate,
          },
        ],
      }
    );
    stopLoading();
    setIsShowOverlayModalAddFriend(false);
  };

  return (
    <S.Wraper>
      <S.Container>
        <div className="modal-overlay">
          <div className="modal-container" ref={modalContainer}>
            <div className="modal-content">
              <div className="modal-content__header">
                <div className="title">Gửi lời mời kết bạn</div>
                <div className="icon-close">
                  <i
                    className="fa-solid fa-xmark"
                    onClick={() => setIsShowOverlayModalAddFriend(false)}
                  ></i>
                </div>
              </div>
              <div className="modal-content__content">
                <img
                  src={fullInfoUser.photoCover.thumbnail}
                  alt=""
                  className="photo-cover"
                />
                {/*  */}
                <div className="box-image">
                  <div className="box-image__item">
                    <img
                      src={fullInfoUser.photoURL.thumbnail}
                      alt=""
                      className="photo-avatar"
                    />
                  </div>

                  {/*  */}
                  <div className="display-name">{fullInfoUser.displayName}</div>
                </div>
                <div className="box-area-edit">
                  <textarea
                    ref={textAreaRef}
                    className="area-edit"
                    autoComplete="off"
                    spellCheck="false"
                    maxLength="150"
                    value={messageValue}
                    onChange={(e) => setMessageValue(e.target.value)}
                    onFocus={() => handleFocus()}
                    onBlur={() => handleBlur()}
                  />
                  <div className="tracking-text-length">
                    {messageValue.length}/150 ký tự
                  </div>
                </div>
                <div className="block-view-logs">
                  <span>Chặn người này xem nhật ký của tôi</span>
                  {!isViewLogs ? (
                    <i
                      className="fa-solid fa-toggle-on fa-rotate-180 btn-off"
                      onClick={() => setIsViewLogs(true)}
                    ></i>
                  ) : (
                    <i
                      className="fa-solid fa-toggle-on btn-on"
                      onClick={() => setIsViewLogs(false)}
                    ></i>
                  )}
                </div>
              </div>
              <div className="modal-content__footer">
                <div
                  className="btn-view-info"
                  onClick={() => {
                    setIsShowOverlayModalAddFriend(false);
                    setIsShowOverlayModal && setIsShowOverlayModal(true);
                  }}
                >
                  Thông tin
                </div>
                <div
                  className={"btn-add-friend"}
                  onClick={() => handleAddFriend()}
                >
                  Kết bạn
                </div>
              </div>
            </div>
          </div>
        </div>
      </S.Container>
    </S.Wraper>
  );
};

export default ModalAddFriend;
