import React, { useState } from "react";
import * as S from "./styles";

const DirectionBoard = () => {
  const [isShow, setIsshow] = useState(true);

  return (
    <S.Wrapper>
      <S.Container>
        {isShow ? (
          <div className="direction-board">
            <h2>Hướng dẫn sử dụng</h2>
            <div className="content">
              <div className="content__item">
                <div style={{ color: " rgb(240, 81, 35)" }}>
                  Tài khoản Demo đã kết bạn và tạo nhóm sẵn
                </div>
                <div>
                  <b>Email: </b> phanquangdung@gmail.com
                </div>
                <div>
                  <b>Password: </b> abcd1234
                </div>
              </div>
{/*               ----
              <div className="content__item">
                <div>
                  <b style={{ color: " rgb(240, 81, 35)" }}>Lưu ý: </b> Bạn vui
                  lòng gửi tin nhắn với các nội dung có ý nghĩa và lịch sự để mình
                  không phải đi clean nhé ạ. Chúc bạn có một ngày tốt lành.
                </div>
              </div>
              <div className="content__item">
                <b>Góp ý: </b>
                Mình rất vui nếu có được những góp ý để cải thiện sản phẩm cũng như kết bạn thông
                qua
                <div style={{ marginTop: "4px", wordBreak: "break-word" }}>
                  <b>Email: </b>
                  <span
                    style={{
                      textDecoration: "none",
                      color: " rgb(240, 81, 35)",
                    }}
                  >
                    quangdung861@gmail.com
                  </span>
                </div>
                <div>
                  <b>Zalo: </b>
                  0935411853
                </div>
              </div> */}
              <div className="btn-close" onClick={() => setIsshow(false)}>
                Tạm ẩn
              </div>
            </div>
          </div>
        ) : (
          <div className="btn-open" onClick={() => setIsshow(true)}>
            Hướng dẫn sử dụng
          </div>
        )}
      </S.Container>
    </S.Wrapper>
  );
};

export default DirectionBoard;
