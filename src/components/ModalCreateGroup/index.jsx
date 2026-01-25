import React, { useRef, useEffect, useState, useMemo, useContext } from "react";

import * as S from "./styles";
import { AppContext } from "Context/AppProvider";
import {
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  setDoc,
  where,
  addDoc,
  getDoc,
  writeBatch,
} from "firebase/firestore";
import { db } from "firebaseConfig";
import { convertImageToBase64 } from "utils/file";
import empty from "assets/empty.png";
import { UserLayoutContext } from "layouts/user/UserLayout";
import Skeleton from "react-loading-skeleton";
import searchEmpty from "assets/searchEmpty.png";
import { uploadImage } from "services/uploadImage";
import useClickOutside from "hooks/useClickOutside";

const ModalCreateGroup = ({ setIsShowOverlayModal }) => {
  const modalContainer = useRef();

  const { userInfo, setSelectedUserMessaging, setSelectedGroupMessaging, startLoading, stopLoading } =
    useContext(AppContext);

  const { setIsShowBoxChat, setIsShowBoxChatGroup, setSidebarSelected } =
    useContext(UserLayoutContext);
  const [categorySelected, setCategorySelected] = useState("Tất cả");

  const [groupName, setGroupName] = useState("");
  const [imgPreviewAvatar, setImgPreviewAvatar] = useState(null);
  const [friendsSelected, setFriendsSelected] = useState([]);
  const [isShowMessageError, setIsShowMessageError] = useState(false);

  useClickOutside(modalContainer, () => {
    setIsShowOverlayModal(false);
  });

  const [widthCategoryList, setWidthCategoryList] = useState(0);

  useEffect(() => {
    const elementParent = document.querySelector(".category-carousel");
    const widthParent = elementParent.offsetWidth;

    const element = document.querySelector(".category-list");
    const width = element.offsetWidth;
    setWidthCategoryList(width - widthParent);
  }, []);

  const [left, setLeft] = useState(0);

  const handleMoveToLeft = () => {
    if (-left < 160) {
      setLeft(0);
      return;
    }
    setLeft((current) => current + 160);
  };

  const handleMoveToRight = () => {
    if (widthCategoryList - -left < 160) {
      setLeft(-widthCategoryList);
      return;
    }
    setLeft((current) => current - 160);
  };


  const [friends, setFriends] = useState([]);
  const [keywords, setKeywords] = useState("");
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const getFriends = async () => {
      setLoading(true);
      let friendsRef;
      if (userInfo?.friends[0]) {
        const uidFriends = userInfo.friends.map((friend) => friend.uid);
        if (keywords) {
          friendsRef = query(
            collection(db, "users"),
            where("uid", "in", uidFriends),
            where("keywords", "array-contains", keywords.toLowerCase()),
            orderBy("displayName", "asc")
          );
        } else {
          friendsRef = query(
            collection(db, "users"),
            where("uid", "in", uidFriends),
            orderBy("displayName", "asc")
          );
        }
        const response = await getDocs(friendsRef);
        const documents = response.docs.map((doc) => {
          const id = doc.id;
          const data = doc.data();
          return {
            ...data,
            id: id,
          };
        });
        setFriends(documents);
        setLoading(false);
      } else {
        setFriends([]);
        setLoading(false);
      }
    };
    getFriends();
  }, [userInfo?.friends, keywords]);

  const renderCategoryList = useMemo(() => {
    if (userInfo?.categoriesTemplate) {
      return userInfo.categoriesTemplate.map((item, index) => {
        return (
          <div
            key={index}
            className="category-tag"
            onClick={() => handlefilterCategory(item.name)}
            style={
              categorySelected === item.name
                ? { backgroundColor: "#0068FF", color: "#fff" }
                : {}
            }
          >
            {item.name}
          </div>
        );
      });
    }
  }, [categorySelected]);

  const renderFriendList = () => {
    if (friends[0]) {
      return friends.map((item, index) => {
        let categoryName;

        const infoFriend = userInfo.friends.find(
          (friend) => friend.uid === item.uid
        );

        const categoryResult = userInfo.categoriesTemplate.find(
          (item) => item.name === infoFriend.category
        );

        if (categoryResult) {
          categoryName = categoryResult.name;
        }

        if (
          categorySelected !== "Tất cả" &&
          categorySelected !== categoryName
        ) {
          return;
        }

        let friendUidList;
        if (friendsSelected[0]) {
          friendUidList = friendsSelected.map((item) => item.uid);
        }

        return (
          <div
            className="friend-item"
            key={item.uid}
            onClick={() => handleSelecteFriend(item)}
          >
            <i
              className="fa-solid fa-circle-check friend-item__checkbox"
              style={
                friendUidList?.includes(item.uid)
                  ? { color: "#005ae0", border: "none" }
                  : {}
              }
            ></i>
            <img className="friend-item__avatar" src={item.photoURL?.thumbnail} alt="" />
            <div className="friend-item__name">{item.displayName}</div>
          </div>
        );
      });
    } else {
      return (
        <div
          className="container-empty"
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            padding: "120px 0px",
          }}
        >
          <img
            src={searchEmpty}
            alt=""
            style={{
              marginBottom: "20px",
              width: "160px",
              objectFit: "cover",
            }}
          />
          <div
            style={{
              fontWeight: 500,
              marginBottom: "8px",
            }}
          >
            Không tìm thấy kết quả
          </div>
          <div className="text">Vui lòng thử lại từ khóa hoặc bộ lọc khác</div>
        </div>
      );
    }
  };

  const handleSelecteFriend = (friend) => {
    if (friendsSelected[0]) {
      const friendsSelectedIndex = friendsSelected.findIndex(
        (item) => item.uid === friend.uid
      );
      if (friendsSelectedIndex !== -1) {
        const newFriendsSelected = [...friendsSelected];
        newFriendsSelected.splice(friendsSelectedIndex, 1);
        setFriendsSelected(newFriendsSelected);
      } else {
        const newFriendsSelected = [...friendsSelected];
        newFriendsSelected.push(friend);
        setFriendsSelected(newFriendsSelected);
      }
      return;
    }

    const newFriendsSelected = [...friendsSelected];
    newFriendsSelected.push(friend);
    setFriendsSelected(newFriendsSelected);
  };

  const handleDeleteFriendSelected = (uidDelete) => {
    const friendsSelectedIndex = friendsSelected.findIndex(
      (item) => item.uid === uidDelete
    );
    const newFriendsSelected = [...friendsSelected];
    newFriendsSelected.splice(friendsSelectedIndex, 1);
    setFriendsSelected(newFriendsSelected);
  };

  const renderFriendSelected = useMemo(() => {
    return friendsSelected.map((item) => {
      return (
        <div
          className="friend-selected-item"
          key={item.uid}
          title={item.displayName}
        >
          <img
            src={item.photoURL?.thumbnail}
            alt=""
            className="friend-selected-item__avatar"
          />
          <div className="friend-selected-item__name">{item.displayName}</div>
          <i
            className="fa-solid fa-circle-xmark friend-selected-item__btn-delete"
            onClick={() => handleDeleteFriendSelected(item.uid)}
          ></i>
        </div>
      );
    });
  }, [friendsSelected]);

  const handlefilterCategory = (value) => {
    setCategorySelected(value);
  };

  /// IMAGE
  const MAX_FILE_SIZE = 10 * 1024 * 1024;   // 10MB

  const handleCoverImagePreview = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      setIsShowMessageError(true);
      setTimeout(() => setIsShowMessageError(false), 3000);
      return;
    }
    const imgPreviewCoverConvert = convertImageToBase64(file);
    imgPreviewCoverConvert.then((res) => {
      setImgPreviewAvatar({
        url: res,
        file,
      });
    });
  };

  const toogleBoxChatGroup = (room, avatars, name) => {
    setIsShowBoxChatGroup(true);
    setSelectedGroupMessaging({ room, avatars, name });
    setSidebarSelected("message");
  };

  const handleCreateGroup = async () => {
    try {
      startLoading();
      const newFriendsSelected = friendsSelected.map((item) => ({
        avatar: item.photoURL,
        name: item.displayName,
        uid: item.uid,
      }));

      const members = newFriendsSelected.map((item) => item.uid);
      const unreadCount = {};
      members.forEach((uid) => {
        unreadCount[uid] = 0;
      })

      let avatar = null;
      if (imgPreviewAvatar?.url) {
        try {
          avatar = await uploadImage(imgPreviewAvatar.file)
        } catch (error) {
          console.log(error);
        }
      }

      const data = {
        category: "group",
        members: [userInfo.uid, ...members],
        messageLastest: {
          clientCreatedAt: Date.now(),
        },
        totalMessages: 0,
        unreadCount,
        unreadMembers: [],
        name: groupName,
        avatar: avatar,
        deleted: [],
        hideTemporarily: [],
        clientCreatedAt: Date.now(),
      };

      const collectionRef = collection(db, "rooms");
      const docRef = await addDoc(collectionRef, data);
      const response = await getDoc(docRef);

      let room;
      if (response.exists()) {
        room = {
          id: response.id,
          ...response.data(),
        };
      } else {
        console.log("Tài liệu không tồn tại");
      }

      const allUserGroup = [userInfo, ...friendsSelected];

      const batch = writeBatch(db); // Automic with firestore

      allUserGroup.forEach(user => {
        const userRef = doc(db, "users", user.id);

        batch.set(
          userRef,
          {
            groups: [
              ...(user.groups || []),
              {
                id: room.id,
                category: "",
              },
            ],
          },
          { merge: true }
        );
      });

      await batch.commit();

      // await Promise.all(
      //   allUserGroup.map(user => {
      //     const userRef = doc(db, "users", user.id);

      //     return setDoc(
      //       userRef,
      //       {
      //         groups: [
      //           ...(user.groups || []),
      //           {
      //             id: room.id,
      //             category: "",
      //           },
      //         ],
      //       },
      //       { merge: true }
      //     );
      //   })
      // );

      const userRef = query(
        collection(db, "users"),
        where("uid", "in", room.members)
      );
      const responseUser = await getDocs(userRef);
      const documents = responseUser.docs.map((doc) => {
        const id = doc.id;
        const data = doc.data();
        return {
          id,
          ...data,
        };
      });

      setSelectedUserMessaging({});
      setIsShowBoxChat(false);
      setIsShowOverlayModal(false);

      const avatars = documents.map((item) => item?.photoURL);

      const name = documents.map((item) => item.displayName).join(", ");

      toogleBoxChatGroup(room, avatars, name);
    } catch (error) {
      console.error("Lỗi khi thêm tài liệu:", error);
    } finally {
      stopLoading();
    }
  };

  return (
    <S.Wrapper>
      <S.Container>
        <div className="modal-overlay">
          <div className="modal-container" ref={modalContainer}>
            <div className="modal-content">
              <div className="header">
                <div className="header__left">Tạo nhóm</div>
                <i
                  className="fa-solid fa-xmark header__right"
                  onClick={() => setIsShowOverlayModal(false)}
                ></i>
              </div>
              <div className="content">
                <div className="create-group-header">
                  <label htmlFor="myFileInput" className="custom-file-label">
                    {imgPreviewAvatar ? (
                      <img src={imgPreviewAvatar.url} alt="" />
                    ) : (
                      <i className="fa-solid fa-camera"></i>
                    )}
                  </label>
                  <input
                    type="file"
                    id="myFileInput"
                    className="custom-file-input"
                    onClick={(e) => (e.target.value = null)}
                    onChange={(e) => handleCoverImagePreview(e)}
                  />
                  <input
                    type="text"
                    className="search-keyword"
                    placeholder="Nhập tên nhóm..."
                    onChange={(e) => setGroupName(e.target.value)}
                  />
                </div>
                <div className="create-group-search">
                  <div className="label">Thêm bạn vào nhóm</div>
                  <div className="input-search-users">
                    <i className="fa-solid fa-magnifying-glass"></i>
                    <input
                      type="text"
                      placeholder="Nhập tên, số điện thoại, hoặc danh sách số điện thoại"
                      onChange={(e) => setKeywords(e.target.value)}
                    />
                  </div>
                </div>
                <div className="category-carousel">
                  {left !== 0 && (
                    <div
                      className="arrow-left"
                      onClick={() => handleMoveToLeft()}
                    >
                      <i className="fa-solid fa-chevron-left"></i>
                    </div>
                  )}

                  <div className="category-list" style={{ left: left }}>
                    <div
                      className="category-tag"
                      onClick={() => handlefilterCategory("Tất cả")}
                      style={
                        categorySelected === "Tất cả"
                          ? { backgroundColor: "#0068FF", color: "#fff" }
                          : {}
                      }
                    >
                      Tất cả
                    </div>
                    {renderCategoryList}
                  </div>

                  {-left !== widthCategoryList && widthCategoryList > 0 && (
                    <div
                      className="arrow-right"
                      onClick={() => handleMoveToRight()}
                    >
                      <i className="fa-solid fa-chevron-right"></i>
                    </div>
                  )}
                </div>

                {userInfo.friends.length >= 1 ? (
                  <div className="friends-container">
                    <div className="friend-list">
                      {loading ? (
                        <>
                          {Array.from({ length: 2 }).map((_, index) => (
                            <div
                              key={index}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                padding: "0 16px",
                                paddingBottom: "8px",
                              }}
                            >
                              <div className="left">
                                <Skeleton
                                  style={{
                                    width: "48px",
                                    height: "48px",
                                    marginRight: "12px",
                                    borderRadius: "50%",
                                  }}
                                />
                              </div>
                              <div
                                className="right"
                                style={{
                                  width: "100%",
                                }}
                              >
                                <Skeleton
                                  style={{
                                    height: "20px",
                                    width: "200px",
                                  }}
                                />
                              </div>
                            </div>
                          ))}
                        </>
                      ) : (
                        renderFriendList()
                      )}{" "}
                    </div>
                    <div
                      className={
                        friendsSelected.length > 0
                          ? "friend-selected-container friend-selected-container--active"
                          : "friend-selected-container "
                      }
                    >
                      <div className="total-selected">
                        <span className="total-selected__title">Đã chọn</span>
                        <span className="total-selected__count">
                          {friendsSelected?.length}/{friends?.length}
                        </span>
                      </div>
                      <div className="friend-selected-list">
                        {renderFriendSelected}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="container-empty">
                    <img src={empty} alt="" />
                    <div>Bạn không có bạn bè nào</div>
                  </div>
                )}
              </div>
              <div className="footer">
                <div
                  className="btn-cancel"
                  onClick={() => setIsShowOverlayModal(false)}
                >
                  Hủy
                </div>
                <div
                  className={
                    friendsSelected.length > 1
                      ? "btn-create-group btn-create-group--active"
                      : "btn-create-group"
                  }
                  onClick={() => friendsSelected.length > 1 && handleCreateGroup()}
                >
                  Tạo Nhóm
                </div>
              </div>
            </div>
            {isShowMessageError && (
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
                Hình ảnh phải có kích thước nhỏ hơn 10MB
              </div>
            )}
          </div>
        </div>
      </S.Container>
    </S.Wrapper>
  );
};

export default ModalCreateGroup;
