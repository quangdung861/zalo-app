import React, { useState, useContext } from "react";
import * as S from "./styles";
import { AppContext } from "Context/AppProvider";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "firebaseConfig";

const DirectionBoard = () => {
  const { startLoading, stopLoading } = useContext(AppContext)
  const [isShow, setIsshow] = useState(true);

  const accounts = [
    {
      email: "quangdung@gmail.com",
      password: "abcd1234"
    },
    {
      email: "thaonguyen@gmail.com",
      password: "abcd1234"
    }
  ]

  const handleSubmit = async (index) => {
    try {
      startLoading();
      await signInWithEmailAndPassword(
        auth,
        accounts[index].email,
        accounts[index].password
      );
    } catch (error) {
      console.error(error);
    } finally {
      stopLoading();
    };
  }

  return (
    <S.Wrapper>
      <S.Container>
        {isShow ? (
          <div className="direction-board">
            <h2>Hướng dẫn sử dụng</h2>
            <div className="content">
              <div className="content__item">
                <div style={{ color: " rgb(240, 81, 35)", marginBottom: 8 }}>
                  Tài khoản đã kết bạn và tạo nhóm sẵn
                </div>
                <div style={{ color: "#7d7b7b", fontWeight: 500, fontSize: 13 }}>Tài khoản 1</div>
                <div className="info">
                  <div>
                    <div>
                      <b>Email: </b> quangdung@gmail.com
                    </div>
                    <div>
                      <b>Password: </b> abcd1234
                    </div>
                  </div>
                  <div>
                    <i class="fa-solid fa-arrow-right-to-bracket" onClick={() => handleSubmit(0)}></i>
                  </div>
                </div>
                <div style={{ marginTop: "4px", color: "#7d7b7b", fontWeight: 500, fontSize: 13 }}>Tài khoản 2</div>
                <div className="info">
                  <div>
                    <div>
                      <b>Email: </b> thaonguyen@gmail.com
                    </div>
                    <div>
                      <b>Password: </b> abcd1234
                    </div>
                  </div>
                  <div>
                    <i class="fa-solid fa-arrow-right-to-bracket" onClick={() => handleSubmit(1)}></i>
                  </div>
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
