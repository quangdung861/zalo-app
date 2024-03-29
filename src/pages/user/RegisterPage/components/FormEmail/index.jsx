import React, { useEffect, useState } from "react";

import * as S from "./styles";

import { Link } from "react-router-dom";
import { ROUTES } from "routes";
import { auth } from "firebaseConfig";
import {
  createUserWithEmailAndPassword,
  getAdditionalUserInfo,
} from "firebase/auth";
import { addDocument, generateKeywords } from "services";
import { serverTimestamp } from "firebase/firestore";
import avatarDefault from "assets/avatar-mac-dinh-1.png";
import avatarCloud from "assets/avatarCloudjpg.jpg";

const FormEmail = ({ setRegisterWay }) => {
  const [formData, setFormData] = useState({
    fullName: {
      value: undefined,
      error: "",
    },
    email: {
      value: undefined,
      error: "",
    },
    password: {
      value: undefined,
      error: "",
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: {
        ...prevData[name],
        value: value,
      },
    }));
  };

  useEffect(() => {
    if (formData.fullName.value === "") {
      setFormData((prevData) => ({
        ...prevData,
        fullName: {
          ...prevData.fullName,
          error: "Tên của bạn không hợp lệ",
        },
      }));
    }

    if (formData.fullName.value) {
      setFormData((prevData) => ({
        ...prevData,
        fullName: {
          ...prevData.fullName,
          error: "",
        },
      }));
    }
  }, [formData.fullName.value]);

  useEffect(() => {
    if (formData.email.value === "") {
      setFormData((prevData) => ({
        ...prevData,
        email: {
          ...prevData.email,
          error: "Email của bạn không hợp lệ",
        },
      }));
    }
    if (formData.email.value) {
      const emailRegex =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if (!emailRegex.test(formData.email.value)) {
        setFormData((prevData) => ({
          ...prevData,
          email: {
            ...prevData.email,
            error: "Email của bạn không đúng định dạng",
          },
        }));
      } else {
        setFormData((prevData) => ({
          ...prevData,
          email: {
            ...prevData.email,
            error: "",
          },
        }));
      }
    }
  }, [formData.email.value]);

  useEffect(() => {
    if (formData.password.value === "") {
      setFormData((prevData) => ({
        ...prevData,
        password: {
          ...prevData.password,
          error: "Mật khẩu của bạn không hợp lệ",
        },
      }));
    }

    if (formData.password.value) {
      setFormData((prevData) => ({
        ...prevData,
        password: {
          ...prevData.password,
          error: "",
        },
      }));
    }
  }, [formData.password.value]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      !formData.fullName.error &&
      !formData.email.error &&
      !formData.password.error &&
      formData.fullName.value &&
      formData.email.value &&
      formData.password.value &&
      formData.password.value?.length >= 8
    ) {
      createRegister();
    } else {
      if (formData.password.value === undefined) {
        setFormData((prevData) => ({
          ...prevData,
          password: {
            ...prevData.password,
            error: "Mật khẩu của bạn không hợp lệ",
          },
        }));
      }

      if (formData.email.value === undefined) {
        setFormData((prevData) => ({
          ...prevData,
          email: {
            ...prevData.email,
            error: "Email của bạn không hợp lệ",
          },
        }));
      }
      if (formData.fullName.value === undefined) {
        setFormData((prevData) => ({
          ...prevData,
          fullName: {
            ...prevData.fullName,
            error: "Tên của bạn không hợp lệ",
          },
        }));
      }
      if (formData.password.value?.length <= 8) {
        setFormData((prevData) => ({
          ...prevData,
          password: {
            ...prevData.password,
            error: "Mật khẩu cần có ít nhất 8 ký tự",
          },
        }));
      }
    }
  };

  const [isRegisterSuccess, setIsRegisterSuccess] = useState(false);

  const createRegister = async () => {
    try {
      const data = await createUserWithEmailAndPassword(
        auth,
        formData.email.value,
        formData.password.value
      );
      if (data) {
        const { isNewUser } = getAdditionalUserInfo(data);
        if (isNewUser) {
          addDocument("users", {
            displayName: formData.fullName.value,
            email: data.user.email,
            photoURL: data.user.photoURL ? data.user.photoURL : avatarDefault,
            photoCover:
              "https://fullstack.edu.vn/static/media/cover-profile.3fb9fed576da4b28386a.png",
            uid: data.user.uid,
            providerId: data.providerId,
            friends: [],
            groups: [],
            invitationSent: [],
            invitationReceive: [],
            keywords: generateKeywords(formData.fullName.value.toLowerCase()),
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
            },
            totalMessages: 0,
            messagesViewed: [{ uid: data.user.uid, count: 0 }],
            deleted: [],
            hideTemporarily: [],
          });
        }
      }
    } catch (error) {
      if (error.code === "auth/email-already-in-use")
        setFormData((prevData) => ({
          ...prevData,
          email: {
            ...prevData.email,
            error: "Email đã tồn tại",
          },
        }));
    }
  };

  return (
    <S.Wrapper>
      <div className="register-container">
        {!isRegisterSuccess ? (
          <>
            <form
              name="register-form-email"
              id="register-form-email"
              onSubmit={handleSubmit}
            >
              <div style={{ fontWeight: "500", margin: "0px 8px 8px 8px" }}>
                Tên của bạn?
              </div>
              <div className="box-fullName">
                <input
                  type="text"
                  placeholder="Họ và tên của bạn"
                  name="fullName"
                  className="fullName"
                  onChange={(e) => handleChange(e)}
                />
              </div>
              <div className="error-fullname">{formData.fullName.error}</div>
              {/*  */}

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  fontWeight: "500",
                  margin: "16px 8px 8px 8px",
                }}
              >
                <span>Email</span>
                <span
                // style={{ cursor: "pointer" }}
                // onClick={() => setRegisterWay("phoneNumber")}
                >
                  {/* Đăng ký với SĐT */}
                </span>
              </div>

              <div className="box-email">
                <input
                  type="text"
                  placeholder="Địa chỉ email"
                  name="email"
                  className="email"
                  onChange={(e) => handleChange(e)}
                />
              </div>
              <div className="error-fullname error-fullname--custome">
                {formData.email.error}
              </div>

              <div className="box-password">
                <input
                  type="password"
                  placeholder="Mật khẩu"
                  name="password"
                  className="password"
                  onChange={(e) => handleChange(e)}
                />
              </div>
              <div className="error-fullname">{formData.password.error}</div>

              <div
                style={{
                  margin: "8px 0px 20px 8px",
                  fontSize: "12px",
                  color: "#6b6f74",
                }}
              >
                Gợi ý: Mật khẩu cần có ít nhất 8 ký tự
              </div>

              <div className="box-confirm">
                <input
                  type="text"
                  className="confirm"
                  placeholder="Nhập mã xác minh"
                  disabled
                  autoComplete="off"
                />
                <div className="btn-sendCode">Gửi mã</div>
              </div>

              {/*  */}
              <button className="btn-submit btn-submit--active" type="submit">
                Đăng ký
              </button>
            </form>
            <div
              style={{ color: "#35414c", margin: "16px", textAlign: "center" }}
            >
              Bạn đã có tài khoản?{" "}
              <Link
                style={{ color: "#f05123", fontWeight: 500 }}
                to={ROUTES.USER.LOGIN}
              >
                Đăng nhập
              </Link>
            </div>
          </>
        ) : (
          <div className="register-success">
            <i className="fa-regular fa-circle-check"></i>
            <div className="register-success-title">
              Đăng ký tài khoản thành công{" "}
              <span>
                <Link to={ROUTES.USER.LOGIN}>Đăng nhập</Link>
              </span>
            </div>
          </div>
        )}
      </div>
    </S.Wrapper>
  );
};

export default FormEmail;
