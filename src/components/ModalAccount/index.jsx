import React, { useContext, useEffect, useRef, useState } from "react";

import "./styles.scss";
import { doc, setDoc } from "firebase/firestore";
import { db } from "firebaseConfig";
import { AppContext } from "Context/AppProvider";
import { UserLayoutContext } from "layouts/user/UserLayout";
import { convertImageToBase64 } from "utils/file";
import coverCloud from "assets/coverCloud.png";
import { generateKeywords } from "services";
import UpdateProfile from "./UpdateProfile";
import { GENDER_LABEL } from "constants/backend/gender.enum";
import { formatISOToVN } from "utils/date";
import { formatPhoneVN } from "utils/phone";

const ModalAccount = ({
  setIsShowOverlayModal,
  isShowOverlayModal,
  accountSelected,
  setIsShowOverlayModalAddFriend,
}) => {

  const accountInfoRef = useRef(null);
  const dropdownResponseRef = useRef(null);

  const { userInfo, setSelectedUserMessaging, startLoading, stopLoading } =
    useContext(AppContext);
  const { setIsShowBoxChat, setIsShowBoxChatGroup } =
    useContext(UserLayoutContext);

  const [imgPreviewCover, setImgPreviewCover] = useState(null);
  const [isShowMessageError, setIsShowMessageError] = useState(false);
  const [isDropdownResponse, setIsDropdownResponse] = useState(false);
  const [isShowUpdateProfile, setIsShowUpdateProfile] = useState(false);

  const [profile, setProfile] = useState({
    displayName: accountSelected.displayName ?? "",
    status: accountSelected.status ?? "",
    phoneNumber: accountSelected.phoneNumber ?? "",
    sex: accountSelected.sex ?? "",
    dateOfBirth: accountSelected.dateOfBirth ?? "",
  });

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        accountInfoRef.current &&
        !accountInfoRef.current.contains(event.target)
      ) {
        setIsShowOverlayModal(false);
      }
      if (
        dropdownResponseRef.current &&
        !dropdownResponseRef.current.contains(event.target)
      ) {
        setIsDropdownResponse(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (!accountSelected) {
    return <div></div>;
  }

  const toogleBoxChat = ({
    uidSelected,
    photoURLSelected,
    displayNameSelected,
  }) => {
    setIsShowBoxChatGroup(false);
    setIsShowBoxChat(true);
    setSelectedUserMessaging({
      uidSelected,
      photoURLSelected,
      displayNameSelected,
    });
    setIsShowOverlayModal(!isShowOverlayModal);
  };

  /// IMAGE

  const handleCoverImagePreview = (file) => {
    if (file.size >= 500000) {
      setIsShowMessageError(true);
      setTimeout(function () {
        setIsShowMessageError(false);
      }, 3000);
      return;
    }
    const imgPreviewCoverConvert = convertImageToBase64(file);
    imgPreviewCoverConvert.then((res) => {
      setImgPreviewCover({
        url: res,
      });
    });
  };

  async function uploadImage() {
    if (imgPreviewCover) {
      const userInfoRef = doc(db, "users", userInfo.id);
      startLoading();
      await setDoc(
        userInfoRef,
        {
          photoCover: imgPreviewCover.url,
        },
        {
          merge: true,
        }
      );
      stopLoading();
      return setImgPreviewCover("");
    }
  }

  const handleAvatarImage = (file) => {
    if (file) {
      if (file.size >= 500000) {
        setIsShowMessageError(true);
        setTimeout(function () {
          setIsShowMessageError(false);
        }, 3000);
        return;
      }
      let imageAvatar = convertImageToBase64(file);
      imageAvatar.then((res) => {
        const userInfoRef = doc(db, "users", userInfo.id);
        return setDoc(
          userInfoRef,
          {
            photoURL: res,
          },
          {
            merge: true,
          }
        );
      });
    }
  };

  const isFriend = userInfo.friends.findIndex(
    (item) => item.uid === accountSelected.uid
  );

  const isReceive = userInfo.invitationReceive.find(
    (item) => item.uid === accountSelected.uid
  );
  const isSent = userInfo.invitationSent.find(
    (item) => item.uid === accountSelected.uid
  );

  //

  const handleInvitationApprove = async () => {
    const { uid, invitationSent, id, friends } = accountSelected;
    const newInvitationSent = invitationSent.filter(
      (item) => item.uid !== userInfo.uid
    );
    const strangerRef = doc(db, "users", id);
    startLoading();
    await setDoc(
      strangerRef,
      {
        friends: [{ uid: userInfo.uid, category: "" }, ...friends],
        invitationSent: newInvitationSent,
      },
      {
        merge: true,
      }
    );
    //
    const newInvitationReceive = userInfo.invitationReceive.filter(
      (item) => item.uid !== uid
    );
    const userInfoRef = doc(db, "users", userInfo.id);
    await setDoc(
      userInfoRef,
      {
        friends: [{ uid, category: "" }, ...userInfo.friends],
        invitationReceive: newInvitationReceive,
      },
      {
        merge: true,
      }
    );
    stopLoading();
  };

  const handleInvitationRecall = async () => {
    const { uid, invitationReceive, id } = accountSelected;
    // STRANGER
    const newInvitationReceive = invitationReceive.filter(
      (item) => item.uid !== userInfo.uid
    );
    const strangerRef = doc(db, "users", id);
    startLoading();
    await setDoc(
      strangerRef,
      {
        invitationReceive: newInvitationReceive,
      },
      {
        merge: true,
      }
    );
    // ME
    const newInvitationSent = userInfo.invitationSent.filter(
      (item) => item.uid !== uid
    );
    const userInfoRef = doc(db, "users", userInfo.id);
    await setDoc(
      userInfoRef,
      {
        invitationSent: newInvitationSent,
      },
      {
        merge: true,
      }
    );
    stopLoading();
  };

  const handleInvitationReject = async () => {
    const { uid, invitationSent, id } = accountSelected;
    const newInvitationSent = invitationSent.filter(
      (item) => item.uid !== userInfo.uid
    );
    const strangerRef = doc(db, "users", id);
    startLoading();
    await setDoc(
      strangerRef,
      {
        invitationSent: newInvitationSent,
      },
      {
        merge: true,
      }
    );
    //
    const newInvitationReceive = userInfo.invitationReceive.filter(
      (item) => item.uid !== uid
    );
    const userInfoRef = doc(db, "users", userInfo.id);
    await setDoc(
      userInfoRef,
      {
        invitationReceive: newInvitationReceive,
      },
      {
        merge: true,
      }
    );
    stopLoading();
  };

  const MessageError = () =>
    isShowMessageError && (
      <div
        className="message-error"
        style={{
          position: "absolute",
          top: "80px",
          left: "0px",
          right: "0px",
          margin: "0 auto",
          backgroundColor: "#fff",
          width: "320px",
          height: "40px",
          padding: "12px",
          borderRadius: "4px",
          boxShadow: "var(--box-shadow-default)",
          textAlign: "center",
          fontWeight: "500",
          zIndex: 999,
          userSelect: "none",
        }}
      >
        Hình ảnh phải có kích thước nhỏ hơn 0.5MB
      </div>
    );

  return accountSelected.uid === userInfo.uid ? (
    <div className="modal-overlay">
      <div className="container-account-info" ref={accountInfoRef}>
        {!isShowUpdateProfile ? (
          <div className="account-info">
            <div className="title">
              Thông tin tài khoản
              <i
                className="fa-solid fa-xmark"
                onClick={() => setIsShowOverlayModal(false)}
              ></i>
            </div>
            <div className="box-account-info">
              <div className="header">
                <img
                  src={imgPreviewCover?.url || accountSelected.photoCover}
                  alt=""
                  className="photo-cover"
                />
                <div className="header-right">
                  {imgPreviewCover ? (
                    <>
                      <button
                        className=" btn-default--custome"
                        onClick={() => setImgPreviewCover("")}
                      >
                        Hủy
                      </button>
                      <button
                        className=" btn-default--custome"
                        onClick={() => uploadImage()}
                      >
                        Lưu
                      </button>
                    </>
                  ) : (
                    <>
                      <label
                        htmlFor="myFileInput"
                        className="custom-file-label"
                      >
                        <i className="fa-solid fa-camera"></i>
                      </label>
                      <input
                        type="file"
                        id="myFileInput"
                        className="custom-file-input"
                        onClick={(e) => (e.target.value = null)}
                        onChange={(e) =>
                          handleCoverImagePreview(e.target.files[0])
                        }
                      />
                    </>
                  )}
                </div>
                <div className="box-image">
                  <div className="box-image__item">
                    <img
                      src={accountSelected.photoURL}
                      alt=""
                      className="photo-avatar"
                    />
                    <label
                      htmlFor="inputFileAvatar"
                      className="box-avatar__icon"
                    >
                      <i className="fa-solid fa-camera"></i>
                    </label>
                    <input
                      type="file"
                      id="inputFileAvatar"
                      className="custom-file-input"
                      onClick={(e) => (e.target.value = null)}
                      onChange={(e) => handleAvatarImage(e.target.files[0])}
                    />
                  </div>
                  <div className="display-name">
                    <div className="value">
                      {
                        accountSelected.displayName || <span>Tiểu sử</span>
                      }
                    </div>
                  </div>
                  <div className="status">
                    <div className="value">
                      {accountSelected.status || <span>Tiểu sử</span>}
                    </div>
                  </div>
                </div>
              </div>
              <div className="content">
                <div className="title">Thông tin cá nhân</div>
                <div className="content-detail">
                  <div className="content-detail__item">
                    <div className="label">Điện thoại</div>
                    <div className="value">{formatPhoneVN(accountSelected.phoneNumber)}</div>
                  </div>
                  <div className="content-detail__item">
                    <div className="label">Giới tính</div>
                    <div className="value">  {GENDER_LABEL[accountSelected.sex] ?? ""}</div>
                  </div>
                  <div className="content-detail__item">
                    <div className="label">Ngày sinh</div>
                    <div className="value"> {formatISOToVN(accountSelected.dateOfBirth)}</div>
                  </div>
                </div>
              </div>
              <div className="division"></div>
              <div
                className="btn-edit-profile"
                onClick={() => setIsShowUpdateProfile(true)}
              >
                <i className="fa-solid fa-pen icon-edit"></i>
                <span>Cập nhật</span>
              </div>
            </div>
          </div>
        ) : (
          <UpdateProfile
            setIsShowUpdateProfile={setIsShowUpdateProfile}
            setIsShowOverlayModal={setIsShowOverlayModal}
            profile={profile}
            setProfile={setProfile}
            userId={userInfo.id}
            accountSelected={accountSelected}
          />
        )}
      </div>
      <MessageError />
    </div>
  ) : accountSelected.myCloud ? (
    <div className="modal-overlay">
      <div className="container-account-info" ref={accountInfoRef}>
        <div className="account-info">
          <div className="title">
            Thông tin tài khoản
            <i
              className="fa-solid fa-xmark"
              onClick={() => setIsShowOverlayModal(false)}
            ></i>
          </div>
          <div className="box-account-info">
            <div className="header">
              <img src={coverCloud} alt="" className="photo-cover" />
              <div className="box-image">
                <img
                  src={accountSelected.myCloud.photoURLSelected}
                  alt=""
                  className="photo-avatar"
                />
                <div className="display-name">
                  {accountSelected.myCloud.displayNameSelected}
                </div>
                <div
                  className="btn-texting"
                  onClick={() =>
                    toogleBoxChat({
                      uidSelected: accountSelected.myCloud.uidSelected,
                      photoURLSelected:
                        accountSelected.myCloud.photoURLSelected,
                      displayNameSelected:
                        accountSelected.myCloud.displayNameSelected,
                    })
                  }
                >
                  Nhắn tin
                </div>
              </div>
            </div>
            <div className="content-cloud">
              <span className="name">Mô tả</span>
              <div className="value">
                Dễ dàng lưu trử và đồng bộ dữ liệu giữa các thiết bị của bạn.
              </div>
            </div>
          </div>
        </div>
      </div>
      <MessageError />
    </div>
  ) : (
    <div className="modal-overlay">
      <div className="container-account-info" ref={accountInfoRef}>
        <div className="account-info">
          <div className="title">
            Thông tin tài khoản
            <i
              className="fa-solid fa-xmark"
              onClick={() => setIsShowOverlayModal(false)}
            ></i>
          </div>
          <div className="box-account-info">
            <div className="header">
              <img
                src={accountSelected.photoCover}
                alt=""
                className="photo-cover"
              />
              <div className="box-image">
                <img
                  src={accountSelected.photoURL}
                  alt=""
                  className="photo-avatar"
                />
                <div className="display-name">
                  {accountSelected.displayName}
                </div>
                <div className="status">{accountSelected.status}</div>
                {isReceive && (
                  <div style={{ fontWeight: 500, marginTop: "8px" }}>
                    Đã gửi cho bạn một lời mời kết bạn
                  </div>
                )}
                {accountSelected.uid !== userInfo?.uid && (
                  <div className="box-action">
                    <div
                      className="btn-texting"
                      onClick={() =>
                        toogleBoxChat({
                          uidSelected: accountSelected.uid,
                          photoURLSelected: accountSelected.photoURL,
                          displayNameSelected: accountSelected.displayName,
                        })
                      }
                    >
                      Nhắn tin
                    </div>
                    {isFriend === -1 && !isSent && !isReceive ? (
                      <div
                        className="btn-texting"
                        onClick={() => {
                          setIsShowOverlayModal(false);
                          setIsShowOverlayModalAddFriend &&
                            setIsShowOverlayModalAddFriend(true);
                        }}
                      >
                        Kết bạn
                      </div>
                    ) : isSent ? (
                      <div
                        className="btn-texting"
                        onClick={() => handleInvitationRecall()}
                      >
                        Huỷ lời mời
                      </div>
                    ) : (
                      isReceive && (
                        <div className="box-response">
                          <div
                            className="btn-texting response"
                            onClick={() => setIsDropdownResponse(true)}
                          >
                            Trả lời
                          </div>
                          {isDropdownResponse && (
                            <div
                              className="dropdown-response"
                              ref={dropdownResponseRef}
                            >
                              <div
                                className="btn-texting"
                                onClick={() => handleInvitationApprove()}
                              >
                                Xác nhận lời mời
                              </div>
                              <div
                                className="btn-texting"
                                onClick={() => handleInvitationReject()}
                              >
                                Xoá lời mời
                              </div>
                            </div>
                          )}
                        </div>
                      )
                    )}
                  </div>
                )}
              </div>
            </div>
            <div className="content">
              <div className="title">Thông tin cá nhân</div>
              <div className="content-detail">
                <div className="content-detail__item">
                  <div className="label">Điện thoại</div>
                  <div className="value">
                    {formatPhoneVN(accountSelected.phoneNumber)}
                  </div>
                </div>
                <div className="content-detail__item">
                  <div className="label">Giới tính</div>
                  <div className="value">  {GENDER_LABEL[accountSelected.sex] ?? ""}</div>
                </div>
                <div className="content-detail__item">
                  <div className="label">Ngày sinh</div>
                  <div className="value"> {formatISOToVN(accountSelected.dateOfBirth)}</div>
                </div>
              </div>
            </div>
            <div className="footer">
              <div className="action-list">
                <div className="action-item">
                  <i className="fa-solid fa-users"></i>
                  <span>Nhóm chung (0)</span>
                </div>
                <div className="action-item">
                  <i className="fa-regular fa-address-card"></i>
                  <span>Chia sẻ danh thiếp</span>
                </div>
                <div className="action-item">
                  <i className="fa-solid fa-ban"></i>
                  <span>Chặn tin nhắn</span>
                </div>
                <div className="action-item">
                  <i className="fa-solid fa-triangle-exclamation"></i>
                  <span>Báo xấu</span>
                </div>
                <div className="action-item">
                  <i className="fa-regular fa-trash-can"></i>
                  <span>Xóa khỏi danh sách bạn bè</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <MessageError />
    </div>
  );
};

export default ModalAccount;
