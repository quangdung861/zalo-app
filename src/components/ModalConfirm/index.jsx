import React, { useEffect, useRef } from "react";

import * as S from "./styles";
import useClickOutside from "hooks/useClickOutside";
const ModalConfirm = ({
  setIsShowOverlayModalConfirmDelete,
  handleDeleteRoomChat,
}) => {
  const modalContainer = useRef(null);

  useClickOutside(modalContainer, () => {
    setIsShowOverlayModalConfirmDelete(false);
  });

  return (
    <S.Wrapper>
      <S.Container>
        <div className="modal-overlay">
          <div className="modal-container" ref={modalContainer}>
            <div className="modal-content">
              <div className="modal-content__header">
                <div className="title">Xác nhận</div>
                <div className="icon-close">
                  <i
                    className="fa-solid fa-xmark"
                    onClick={() => setIsShowOverlayModalConfirmDelete(false)}
                  ></i>
                </div>
              </div>
              <div className="modal-content__text">
                Toàn bộ nội dung trò chuyện sẽ bị xoá vĩnh viễn. Bạn có chắc
                chắn muốn xoá?
              </div>
              <div className="modal-content__action">
                <div
                  className="btn-cancel"
                  onClick={() => setIsShowOverlayModalConfirmDelete(false)}
                >
                  Không
                </div>
                <div
                  className="btn-accept"
                  onClick={() => {
                    setIsShowOverlayModalConfirmDelete(false);
                    handleDeleteRoomChat();
                  }}
                >
                  Xoá
                </div>
              </div>
            </div>
          </div>
        </div>
      </S.Container>
    </S.Wrapper>
  );
};

export default ModalConfirm;
