import React, { useState } from "react";

import * as S from "./styles";
import { Link } from "react-router-dom";
import { ROUTES } from "routes";
import { useNavigate } from "react-router-dom";
import FormEmail from "./components/FormEmail";
import { auth, githubProvider, googleProvider } from "firebaseConfig";
import {
  signInWithPopup,
  getAdditionalUserInfo,
} from "firebase/auth";
import { addDocument, generateKeywords } from "../../../services";
import { serverTimestamp } from "firebase/firestore";
import avatarDefault from "assets/avatar-mac-dinh-1.png";
import avatarCloud from "assets/avatarCloudjpg.jpg";
import imgPhotocover from "assets/photocover/photocover.jpg"


const LoginPage = () => {
  const navigate = useNavigate();
  const [registerWay, setRegisterWay] = useState("");
  

  const handleGoogleSignIn = async () => {
    try {
      const data = await signInWithPopup(auth, googleProvider);
      if (data) {
        const { isNewUser } = getAdditionalUserInfo(data);
        if (isNewUser) {
          await addDocument("users", {
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
              clientCreatedAt: Date.now(),
              clientCreatedAt: Date.now(),
            },
            totalMessages: 0,
            unreadCount: {[data.user.uid]: 0},
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
              clientCreatedAt: Date.now(),
              clientCreatedAt: Date.now(),
            },
            totalMessages: 0,
            unreadCount: {[data.user.uid]: 0},
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

  const renderRegisterWay = () => {
    switch (registerWay) {
      case "email":
        return (
          <FormEmail
            setRegisterWay={setRegisterWay}
            registerWay={registerWay}
          />
        );

      default:
        break;
    }
  };

  return (
    <S.Wrapper>
      <S.Container>
        <div className="login">
          <div className="login-container">
            {registerWay && (
              <div className="btn-back">
                <i
                  className="fa-solid fa-chevron-left"
                  style={{
                    fontSize: "20px",
                    cursor: "pointer",
                    padding: "16px 24px 16px 0px",
                  }}
                  onClick={() => setRegisterWay("")}
                ></i>
              </div>
            )}

            <div className="login-header">
              <img
                src="https://stc-zaloid.zdn.vn/zaloid/client/images/zlogo.png"
                alt=""
                onClick={() => navigate(ROUTES.USER.HOME)}
              />
              <h1>Đăng ký tài khoản Zalo</h1>
            </div>
            <div className="login-content">
              {registerWay ? (
                renderRegisterWay()
              ) : (
                <>
                  <ul className="list">
                    <li className="item">
                      <button
                        className="--btn-default btn-custome"
                        onClick={() => setRegisterWay("email")}
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
                        onClick={handleGoogleSignIn}
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
                        onClick={handleGithubSignIn}
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
                    Bạn đã có tài khoản?{" "}
                    <Link
                      style={{ color: "#f05123", fontWeight: 500 }}
                      to={ROUTES.LOGIN}
                    >
                      Đăng nhập
                    </Link>
                  </div>
                </>
              )}
              {/*  */}
            </div>
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
