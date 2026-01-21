import React, { useContext, useState } from "react";

import * as S from "./styles";
import { Link, useNavigate } from "react-router-dom";
import { ROUTES } from "routes";
import EmailFormLogin from "./components/EmailFormLogin";
import { signInWithPopup, getAdditionalUserInfo } from "firebase/auth";
import { auth, googleProvider, githubProvider } from "firebaseConfig";
import { addDocument, generateKeywords } from "services";
import { serverTimestamp } from "firebase/firestore";
import avatarDefault from "assets/avatar-mac-dinh-1.png";
import avatarCloud from "assets/avatarCloudjpg.jpg";
import DirectionBoard from "components/DirectionBoard";
import imgPhotocover from "assets/photocover/photocover.jpg"

const LoginPage = () => {
  const navigate = useNavigate();

  const [dropdownContries, setDropdownContries] = useState(false);

  const [loginWay, setLoginWay] = useState("");

  const renderLoginWay = () => {
    switch (loginWay) {
      case "email":
        return <EmailFormLogin setLoginWay={setLoginWay} loginWay={loginWay} />;

      default:
        break;
    }
  };


  const handleGoogleSignIn = async () => {
    try {
      const data = await signInWithPopup(auth, googleProvider);
      if (data) {
        const { isNewUser } = getAdditionalUserInfo(data);
        if (isNewUser) {
          addDocument("users", {
            displayName: data.user.displayName,
            email: data.user.email,
            photoURL: data.user.photoURL ? data.user.photoURL : avatarDefault,
            photoCover: imgPhotocover,
            uid: data.user.uid,
            providerId: data.providerId,
            friends: [],
            groups: [],
            invitationSent: [],
            invitationReceive: [],
            keywords: generateKeywords(data.user.displayName.toLowerCase()),
            phoneNumber: "",
            sex: "",
            dateOfBirth: "",
            categoriesTemplate: [
              {
                name: "Công việc",
                color: "#FF6905",
              },
              {
                name: "Khách hàng",
                color: "#D91B1B",
              },
              {
                name: "Gia đình",
                color: "#F31BC8",
              },
              {
                name: "Bạn bè",
                color: "#FAC000",
              },
              {
                name: "Trả lời sau",
                color: "#4BC377",
              },
              {
                name: "Đồng nghiệp",
                color: "#0068FF",
              },
            ],
            notificationDowloadZaloPc: {
              value: true,
              updatedAt: serverTimestamp(),
            },
            isOnline: {
              value: true,
              updatedAt: serverTimestamp(),
            },
          });
          addDocument("rooms", {
            category: "my cloud",
            members: [data.user.uid, "my-cloud"],
            info: [
              {
                avatar: avatarCloud,
                name: "Cloud của tôi",
                uid: "my-cloud",
              },
              {
                avatar: data.user.photoURL ? data.user.photoURL : avatarDefault,
                name: data.user.displayName,
                uid: data.user.uid,
              },
            ],
            messageLastest: {
              createdAt: serverTimestamp(),
              clientCreatedAt: Date.now(),
            },
            totalMessages: 0,
            unreadCount: { [data.user.uid]: 0 },
            unreadMembers: [],
            deleted: [],
            hideTemporarily: [],
          });
        }
      }
    } catch (error) {
      if (error.code === "auth/cancelled-popup-request") {
        // Yêu cầu xác thực bằng cửa sổ popup bị hủy
        // Xử lý tương ứng, ví dụ: thông báo cho người dùng
      } else {
        // Xử lý lỗi khác
      }
    }
  };

  const handleGithubSignIn = async () => {
    try {
      const data = await signInWithPopup(auth, githubProvider);
      if (data) {
        const { isNewUser } = getAdditionalUserInfo(data);
        if (isNewUser) {
          addDocument("users", {
            displayName: data.user.displayName,
            email: data.user.email,
            photoURL: data.user.photoURL ? data.user.photoURL : avatarDefault,
            photoCover: imgPhotocover,
            uid: data.user.uid,
            providerId: data.providerId,
            friends: [],
            groups: [],
            invitationSent: [],
            invitationReceive: [],
            keywords: generateKeywords(data.user.displayName.toLowerCase()),
            phoneNumber: "",
            sex: "",
            dateOfBirth: "",
            categoriesTemplate: [
              {
                name: "Công việc",
                color: "#FF6905",
              },
              {
                name: "Khách hàng",
                color: "#D91B1B",
              },
              {
                name: "Gia đình",
                color: "#F31BC8",
              },
              {
                name: "Bạn bè",
                color: "#FAC000",
              },
              {
                name: "Trả lời sau",
                color: "#4BC377",
              },
              {
                name: "Đồng nghiệp",
                color: "#0068FF",
              },
            ],
            notificationDowloadZaloPc: {
              value: true,
              updatedAt: serverTimestamp(),
            },
            isOnline: {
              value: true,
              updatedAt: serverTimestamp(),
            },
          });
          addDocument("rooms", {
            category: "my cloud",
            members: [data.user.uid, "my-cloud"],
            info: [
              {
                avatar: avatarCloud,
                name: "Cloud của tôi",
                uid: "my-cloud",
              },
              {
                avatar: data.user.photoURL ? data.user.photoURL : avatarDefault,
                name: data.user.displayName,
                uid: data.user.uid,
              },
            ],
            messageLastest: {
              createdAt: serverTimestamp(),
              clientCreatedAt: Date.now(),
            },
            totalMessages: 0,
            unreadCount: { [data.user.uid]: 0 },
            unreadMembers: [],
            deleted: [],
            hideTemporarily: [],
          });
        }
      }
    } catch (error) {
      if (error.code === "auth/cancelled-popup-request") {
        // Yêu cầu xác thực bằng cửa sổ popup bị hủy
        // Xử lý tương ứng, ví dụ: thông báo cho người dùng
      } else {
        // Xử lý lỗi khác
      }
    }
  };

  return (
    <S.Wrapper>
      <S.Container>
        <DirectionBoard />
        <div className="login">
          <div className="login-container">
            {loginWay ? (
              <>{renderLoginWay()}</>
            ) : (
              <>
                <div className="login-header">
                  <img
                    src="https://stc-zaloid.zdn.vn/zaloid/client/images/zlogo.png"
                    alt=""
                    onClick={() => navigate(ROUTES.USER.HOME)}
                  />
                  <h1>Chào mừng bạn đến với Zalo</h1>
                </div>
                <div className="login-content">
                  <ul className="list">
                    <li className="item">
                      <button
                        className="--btn-default btn-custome"
                        onClick={() => setLoginWay("email")}
                      >
                        <img
                          src={require("assets/logo/Sample_User_Icon.png")}
                          alt=""
                        />
                        <span>Sử dụng email/ số điện thoại</span>
                      </button>
                    </li>
                    <li className="item">
                      <button
                        className="--btn-default btn-custome "
                        onClick={() => handleGoogleSignIn()}
                      >
                        <img
                          src={require("assets/logo/Google_Icons-09-512.webp")}
                          alt=""
                        />
                        <span>Tiếp tục với Google</span>
                      </button>
                    </li>
                    <li className="item">
                      <button
                        className="--btn-default btn-custome "
                        onClick={() => handleGithubSignIn()}
                      >
                        <img
                          src={require("assets/logo/25231.png")}
                          alt=""
                        />
                        <span>Tiếp tục với Github</span>
                      </button>
                    </li>
                  </ul>
                  <div style={{ color: "#35414c" }}>
                    Bạn chưa có tài khoản?{" "}
                    <Link
                      style={{ color: "#f05123", fontWeight: 500 }}
                      to={ROUTES.REGISTER}
                    >
                      Đăng ký
                    </Link>
                  </div>
                </div>{" "}
              </>
            )}

            <div className="login-footer">
              <p style={{ color: "#4f5a64", fontSize: "12px" }}>
                Việc bạn tiếp tục sử dụng trang web này đồng nghĩa bạn đồng ý
                với <br />
                <Link style={{ textDecoration: "underline" }}>
                  Điều khoản sử dụng
                </Link>{" "}
                của chúng tôi.
              </p>
            </div>
          </div>
        </div>
      </S.Container>
    </S.Wrapper>
  );
};

export default LoginPage;
