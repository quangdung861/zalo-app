import React, { useEffect, useRef } from "react";

import * as S from "./styles";
import useClickOutside from "hooks/useClickOutside";
const ModalConfirm = ({
  setIsShowModalConfirm,
  callback,
  title = "Xác nhận",
  text = "",
  btnFirst = "Hủy",
  btnSecond = "Đồng ý"
}) => {
  const modalContainer = useRef(null);

  useClickOutside(modalContainer, () => setIsShowModalConfirm(false))

  return (
    <S.Wrapper>
      <S.Container>
        <div className="modal-overlay">
          <div className="modal-container" ref={modalContainer}>
            <div className="modal-content">
              <div className="modal-content__header">
                <div className="title">{title}</div>
                <div className="icon-close">
                  <i
                    className="fa-solid fa-xmark"
                    onClick={() => setIsShowModalConfirm(false)}
                  ></i>
                </div>
              </div>
              <div className="modal-content__text">
                {text}
              </div>
              <div className="modal-content__action">
                <div
                  className="btn-cancel"
                  onClick={() => setIsShowModalConfirm(false)}
                >
                  {btnFirst}
                </div>
                <div
                  className="btn-accept"
                  onClick={() => {
                    callback();
                    setIsShowModalConfirm(false);
                  }}
                >
                  {btnSecond}
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
