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
} from "firebase/firestore";
import { db } from "firebaseConfig";
import { convertImageToBase64 } from "utils/file";

const ModalCreateGroup = ({ setIsShowOverlayModal }) => {
  const modalContainer = useRef();

  const { userInfo } = useContext(AppContext);
  const [categorySelected, setCategorySelected] = useState("Tất cả");

  const [groupName, setGroupName] = useState("");
  const [imgPreviewAvatar, setImgPreviewAvatar] = useState(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        modalContainer.current &&
        !modalContainer.current.contains(event.target)
      ) {
        setIsShowOverlayModal(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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

  useEffect(() => {
    const getFriends = async () => {
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
      } else {
        setFriends([]);
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
      return friends.map((item) => {
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
            <img className="friend-item__avatar" src={item.photoURL} alt="" />
            <div className="friend-item__name">{item.displayName}</div>
          </div>
        );
      });
    }
  };

  const [friendsSelected, setFriendsSelected] = useState([]);

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
            src={item.photoURL}
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
  const handleCoverImagePreview = (file) => {
    const imgPreviewCoverConvert = convertImageToBase64(file);
    imgPreviewCoverConvert.then((res) => {
      setImgPreviewAvatar({
        url: res,
      });
    });
  };

  // async function uploadImage() {
  //   if (imgPreviewCover) {
  //     const userInfoRef = doc(db, "users", userInfo.id);
  //     await setDoc(
  //       userInfoRef,
  //       {
  //         photoCover: imgPreviewCover.url,
  //       },
  //       {
  //         merge: true,
  //       }
  //     );
  //     return setImgPreviewCover("");
  //   }
  // }

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
                    onChange={(e) => handleCoverImagePreview(e.target.files[0])}
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

                <div className="friends-container">
                  <div className="friend-list">{renderFriendList()} </div>
                  <div className="friend-selected-container">
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
              </div>
              <div className="footer">
                <div className="btn-cancel">Hủy</div>
                <div className="btn-create-group">Tạo Nhóm</div>
              </div>
            </div>
          </div>
        </div>
      </S.Container>
    </S.Wrapper>
  );
};

export default ModalCreateGroup;
