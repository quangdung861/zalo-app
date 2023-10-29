import React, { useEffect, useRef, useState } from "react";

import * as S from "./styles";
const ModalAddFriend = ({
  setIsShowOverlayModalAddFriend,
  fullInfoUser,
  userInfo,
  handleAddFriend,
  setMessageValue,
  messageValue,
  setIsShowOverlayModal,
}) => {
  const [isViewLogs, setIsViewLogs] = useState(false);

  const textAreaRef = useRef(null);
  const modalContainer = useRef(null);

  useEffect(() => {
    if (textAreaRef) {
      textAreaRef.current.focus();
      const length = messageValue.length;
      textAreaRef.current.setSelectionRange(length, length);
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        modalContainer.current &&
        !modalContainer.current.contains(event.target)
      ) {
        setIsShowOverlayModalAddFriend(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
                  src={fullInfoUser.photoCover}
                  alt=""
                  className="photo-cover"
                />
                {/*  */}
                <div className="box-image">
                  <div className="box-image__item">
                    <img
                      src={fullInfoUser.photoURL}
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
