import React, { useEffect, useRef } from "react";

import * as S from "./styles";
const ModalConfirm = ({
  setIsShowModalConfirm,
  callback,
  title = "Xác nhận",
  text = "",
  btnFirst = "Hủy",
  btnSecond = "Đồng ý"
}) => {
  const modalContainer = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        modalContainer.current &&
        !modalContainer.current.contains(event.target)
      ) {
        setIsShowModalConfirm(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
