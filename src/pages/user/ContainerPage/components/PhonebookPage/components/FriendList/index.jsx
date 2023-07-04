import React, { useContext, useEffect, useState, useRef, useMemo } from "react";
import * as S from "./styles";
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { db } from "firebaseConfig";
import empty from "assets/empty.png";
import { AppContext } from "Context/AppProvider";
import { UserLayoutContext } from "layouts/user/UserLayout";
import searchEmpty from "assets/searchEmpty.png";
import Skeleton from "react-loading-skeleton";
import ModalAccount from "components/ModalAccount";

const FriendList = ({ setIsShowSectionRight, setIsShowSectionLeft }) => {
  const { userInfo, setSelectedUserMessaging, setSelectedGroupMessaging } =
    useContext(AppContext);
  const { isShowBoxChat, setIsShowBoxChat, setIsShowBoxChatGroup } =
    useContext(UserLayoutContext);
  const [keywords, setKeywords] = useState("");

  const [loading, setLoading] = useState(false);

  const [friends, setFriends] = useState([]);
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
            where("keywords", "array-contains", keywords.toLowerCase())
          );
        } else {
          friendsRef = query(
            collection(db, "users"),
            where("uid", "in", uidFriends)
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

  const [isShowDropdown, setIsShowDropdown] = useState(false);
  const [isShowOverlayModal, setIsShowOverlayModal] = useState(false);
  const [isShowDropdownCategories, setIsShowDropdownCategories] =
    useState(false);
  const [dropdownOrderBy, setDropdownOrderBy] = useState(false);
  const [dropdownCategorySecond, setDropdownCategorySecond] = useState(false);
  const [categorySelected, setCategorySelected] = useState("Tất cả");

  const dropdownRef = useRef(null);
  const orderByRef = useRef(null);
  const categoriesRef = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsShowDropdown(false);
      }
      if (
        categoriesRef.current &&
        !categoriesRef.current.contains(event.target)
      ) {
        setIsShowDropdownCategories(false);
        setDropdownCategorySecond(false);
      }
      if (orderByRef.current && !orderByRef.current.contains(event.target)) {
        setDropdownOrderBy(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const [friendSelected, setFriendSelected] = useState();

  const handleWatchInfo = ({ id, uid }) => {
    setIsShowOverlayModal(true);
    setIsShowDropdown(false);
    const friendSelected = friends.find((item) => item.id === id);
    setFriendSelected(friendSelected);
  };

  const handleUnfriend = async ({ id, uid, friends }) => {
    // USER_INFO
    const newUserInfoFriend = userInfo.friends.filter((item) => item !== uid);
    const userInfoRef = doc(db, "users", userInfo.id);
    await setDoc(
      userInfoRef,
      {
        friends: newUserInfoFriend,
      },
      {
        merge: true,
      }
    );
    // FRIEND
    const newFriendsOfFriend = friends.filter((item) => item !== userInfo.uid);
    const FriendRef = doc(db, "users", id);
    await setDoc(
      FriendRef,
      {
        friends: newFriendsOfFriend,
      },
      {
        merge: true,
      }
    );
  };

  const toogleBoxChat = ({
    uidSelected,
    photoURLSelected,
    displayNameSelected,
  }) => {
    setIsShowBoxChatGroup(false);
    setSelectedGroupMessaging({});
    setIsShowBoxChat(true);
    setSelectedUserMessaging({
      uidSelected,
      photoURLSelected,
      displayNameSelected,
    });
  };

  const [orderBy, setOderBy] = useState("asc");

  const [totalFriends, setTotalFriends] = useState(0);

  const renderFriendlist = useMemo(() => {
    setTotalFriends(0);

    if (friends[0]) {
      if (orderBy === "desc") {
        friends.sort((a, b) => b.displayName.localeCompare(a.displayName)); //desc
      } else {
        friends.sort((a, b) => a.displayName.localeCompare(b.displayName)); //asc
      }

      return friends.map((item) => {
        let categoryName;
        let color;

        const infoFriend = userInfo.friends.find(
          (friend) => friend.uid === item.uid
        );

        const categoryResult = userInfo.categoriesTemplate.find(
          (item) => item.name === infoFriend.category
        );

        if (categoryResult) {
          categoryName = categoryResult.name;
          color = categoryResult.color;
        }

        if (
          categorySelected !== "Tất cả" &&
          categorySelected !== categoryName
        ) {
          return;
        }

        setTotalFriends((preven) => preven + 1);

        return (
          <div className="item-friend" key={item.id}>
            <div
              className="item-friend__left"
              onClick={() =>
                toogleBoxChat({
                  uidSelected: item.uid,
                  photoURLSelected: item.photoURL,
                  displayNameSelected: item.displayName,
                })
              }
            >
              <img src={item.photoURL} alt="" />
              <div className="box-info">
                <span>{item.displayName}</span>
                {categoryResult && (
                  <div>
                    <i
                      className="fa-solid fa-bookmark category-icon"
                      style={{
                        color: color,
                        fontSize: "12px",
                        marginRight: "6px",
                      }}
                    ></i>
                    <span style={{ fontSize: "12px", color: "#7589a3" }}>
                      {categoryName}
                    </span>
                  </div>
                )}{" "}
              </div>
            </div>
            <div className="item-friend__right">
              <i
                className="fa-solid fa-ellipsis"
                onClick={() => {
                  setIsShowDropdown(item.id);
                }}
              ></i>
              {isShowDropdown === item.id && (
                <div className="dropdown-menu" ref={dropdownRef}>
                  <div
                    className="dropdown-menu__item"
                    onClick={() =>
                      handleWatchInfo({ id: item.id, uid: item.uid })
                    }
                  >
                    Xem Thông tin
                  </div>
                  <div className="divding-line" />
                  <div className="dropdown-menu__item">Phân loại</div>
                  <div className="dropdown-menu__item">Đặt tên gợi nhớ</div>
                  <div className="divding-line" />
                  <div className="dropdown-menu__item">Chặn người này</div>
                  {userInfo.invitationSent.includes(item.uid) ||
                  userInfo.invitationReceive.includes(item.uid) ? (
                    <></>
                  ) : (
                    <>
                      <div className="divding-line" />
                      <div
                        className="dropdown-menu__item unfriend"
                        onClick={() =>
                          handleUnfriend({
                            uid: item.uid,
                            id: item.id,
                            friends: item.friends,
                          })
                        }
                      >
                        Hủy kết bạn
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      });
    } else {
      if (keywords || (categorySelected && categorySelected !== "Tất cả")) {
        return (
          <div
            className="container-empty"
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              padding: "62px 0px",
              minHeight: `calc(100vh - 65px - 64px - 68px)`,
              backgroundColor: "#fff",
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
                color: "#081c36",
              }}
            >
              Không tìm thấy kết quả
            </div>
            <div
              className="text"
              style={{
                color: "#081c36",
                fontWeight: 400,
              }}
            >
              Vui lòng thử lại từ khóa hoặc bộ lọc khác
            </div>
          </div>
        );
      }
      return (
        <div className="container-empty">
          <img src={empty} alt="" />
          <div>Bạn không có bạn bè nào</div>
        </div>
      );
    }
  }, [orderBy, friends, categorySelected, isShowDropdown]);

  const handleSearch = async (value) => {
    // const usersResult = await fetchUserList(value);
    setKeywords(value);
  };

  const handleHoverEnter = () => {
    setDropdownCategorySecond(true);
  };

  const handlefilterCategory = (value) => {
    setCategorySelected(value);
    setIsShowDropdownCategories(false);
    setDropdownCategorySecond(false);
  };

  const handleComeBack = () => {
    setIsShowBoxChat(false);
    setIsShowSectionRight(false);
    setIsShowSectionLeft(true);
  };

  return (
    <S.Wrapper>
      <S.Container>
        <div className="friendlist">
          <div className="friendlist-header">
            <div className="btn-come-back" onClick={() => handleComeBack()}>
              <i className="fa-solid fa-chevron-left"></i>
            </div>
            <i className="fa-solid fa-user-group"></i>
            Danh sách bạn bè
          </div>
          <div className="friendlist-content">
            <div className="total-friends">Bạn bè ({totalFriends})</div>
            <div className="filter-friends">
              <div className="filter-item search">
                <i className="fa-solid fa-magnifying-glass"></i>
                <input
                  value={keywords}
                  type="text"
                  className="input-search"
                  placeholder="Tìm bạn"
                  onChange={(e) => handleSearch(e.target.value)}
                />
                {keywords?.length > 0 && (
                  <i
                    className="fa-solid fa-circle-xmark"
                    onClick={() => handleSearch("")}
                    style={{ cursor: "pointer" }}
                  ></i>
                )}
              </div>
              <div className="filter-item asc-desc-order">
                <div
                  className={
                    dropdownOrderBy
                      ? "asc-desc-order__current asc-desc-order__current--active"
                      : "asc-desc-order__current"
                  }
                  onClick={() => setDropdownOrderBy(!dropdownOrderBy)}
                >
                  <i className="fa-solid fa-arrows-up-down"></i>
                  <span>Tên {orderBy === "asc" ? "(A-Z)" : "(Z-A)"}</span>
                  <i className="fa-solid fa-chevron-down"></i>
                </div>
                {dropdownOrderBy && (
                  <div className="asc-desc-order__dropdown" ref={orderByRef}>
                    <div
                      className="asc-filter"
                      onClick={() => {
                        setOderBy("asc");
                        setDropdownOrderBy(false);
                      }}
                    >
                      <span className="pick">
                        {orderBy === "asc" && (
                          <i className="fa-solid fa-check"></i>
                        )}
                      </span>

                      <span>Tên (A-Z)</span>
                    </div>
                    <div
                      className="desc-filter"
                      onClick={() => {
                        setOderBy("desc");
                        setDropdownOrderBy(false);
                      }}
                    >
                      <span className="pick">
                        {orderBy === "desc" && (
                          <i className="fa-solid fa-check"></i>
                        )}
                      </span>
                      <span>Tên (Z-A)</span>
                    </div>
                  </div>
                )}
              </div>
              <div className="filter-item category-order">
                <div
                  className={
                    isShowDropdownCategories
                      ? "category-order__current category-order__current--active"
                      : "category-order__current"
                  }
                  onClick={() => setIsShowDropdownCategories(true)}
                >
                  <i className="fa-solid fa-filter"></i>
                  <span>{categorySelected}</span>
                </div>
                {isShowDropdownCategories && (
                  <div className="category-order__dropdown" ref={categoriesRef}>
                    <div
                      className="filter-all"
                      onMouseEnter={() => setDropdownCategorySecond(false)}
                      onClick={() => handlefilterCategory("Tất cả")}
                    >
                      {categorySelected === "Tất cả" && (
                        <i
                          className="fa-solid fa-check"
                          style={{ color: "#005ae0" }}
                        ></i>
                      )}

                      <span
                        style={
                          categorySelected !== "Tất cả"
                            ? {
                                paddingLeft: "26px",
                              }
                            : {}
                        }
                      >
                        Tất cả
                      </span>
                    </div>
                    <div
                      className="filter-category"
                      onMouseEnter={() => handleHoverEnter()}
                    >
                      <span style={{ paddingLeft: "26px" }}>Phân loại</span>
                      <i className="fa-solid fa-chevron-right"></i>
                      <div
                        className={
                          dropdownCategorySecond
                            ? "filter-category__dropdown filter-category__dropdown--active"
                            : "filter-category__dropdown"
                        }
                      >
                        {userInfo.categoriesTemplate.map((item, index) => (
                          <div
                            className="category-dropdown-item"
                            key={index}
                            onClick={() => handlefilterCategory(item.name)}
                          >
                            <i
                              className="fa-solid fa-bookmark category-icon"
                              style={{ color: item.color }}
                            ></i>
                            {item.name}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="list-friends">
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
                renderFriendlist
              )}
            </div>
          </div>
        </div>
        {isShowOverlayModal && (
          <ModalAccount
            setIsShowOverlayModal={setIsShowOverlayModal}
            accountSelected={friendSelected}
          />
        )}
      </S.Container>
    </S.Wrapper>
  );
};

export default FriendList;
