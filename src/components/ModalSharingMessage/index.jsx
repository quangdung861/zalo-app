import React, { useRef, useEffect, useState, useMemo, useContext } from "react";

import * as S from "./styles";
import { AppContext } from "Context/AppProvider";
import {
  collection,
  query,
  where,
  serverTimestamp,
  addDoc,
  onSnapshot,
  doc,
  orderBy,
  getDoc,
  setDoc,
  getDocs,
} from "firebase/firestore";
import { db } from "firebaseConfig";
import { addDocument } from "services";
import { convertImageToBase64 } from "utils/file";
import empty from "assets/empty.png";
import { UserLayoutContext } from "layouts/user/UserLayout";
import Skeleton from "react-loading-skeleton";
import AvatarGroup from "components/AvatarGroup";
import messageSend from "assets/audio/messageSend.wav";

const ModalSharingMessage = ({
  setIsShowOverlayModalSharingMessage,
  infoMessageSharing,
}) => {
  const audio = new Audio(messageSend);

  const { userInfo, rooms } = useContext(AppContext);

  const [categorySelected, setCategorySelected] = useState("Tất cả");
  const [conversationsSelected, setConversationsSelected] = useState([]);
  const [isShowMessageError, setIsShowMessageError] = useState(false);
  const [isShowEditArea, setIsShowEditArea] = useState(false);
  const [textAreaValue, setTextAreaValue] = useState(infoMessageSharing.text);

  const modalContainer = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        modalContainer.current &&
        !modalContainer.current.contains(event.target)
      ) {
        setIsShowOverlayModalSharingMessage(false);
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
  const [loading, setLoading] = useState(false);
  const [loadingGroupList, setLoadingGroupList] = useState(false);

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

  const handleClickSharingMessage = () => {
    if (textAreaValue) {
      audio.play();
      conversationsSelected.forEach((converstation) => {
        if (converstation.category) {
          if (converstation.category === "single") {
            // Trò chuyện gần đây với nhóm và bạn bè => hiện tại chưa phát triển
          }
          if (converstation.category === "group") {
            // Trò chuyện với group
            const createMes = async () => {
              const roomRef = doc(db, "rooms", converstation.id);

              const messagesViewedIndex =
                converstation.messagesViewed.findIndex(
                  (item) => item.uid === userInfo.uid
                );
              const messagesViewed = converstation.messagesViewed.find(
                (item) => item.uid === userInfo.uid
              );

              const newMessageViewed = [...converstation.messagesViewed];

              newMessageViewed.splice(messagesViewedIndex, 1, {
                ...messagesViewed,
                count: messagesViewed.count + 1,
              });

              await setDoc(
                roomRef,
                {
                  messageLastest: {
                    text: textAreaValue,
                    displayName: userInfo.displayName,
                    uid: userInfo.uid,
                    createdAt: serverTimestamp(),
                  },
                  totalMessages: converstation.totalMessages + 1,
                  messagesViewed: newMessageViewed,
                },
                {
                  merge: true,
                }
              );

              addDocument("messages", {
                category: "group",
                roomId: converstation.id,
                uid: userInfo.uid,
                displayName: userInfo.displayName,
                photoURL: userInfo.photoURL,
                text: textAreaValue,
                images: [],
                infoReply: {},
              });
            };
            createMes();
          }
        }

        if (!converstation.category) {
          // Trò chuyền với bạn bè
          // kiểm tra xem đã có hội thoại chưa, nếu chưa có thì tạo room
          const room = rooms.filter(
            (room) =>
              room.category === "single" &&
              room.members.includes(converstation.uid)
          )[0];

          if (room?.id) {
            const createMes = async () => {
              const roomRef = doc(db, "rooms", room.id);

              const messagesViewedIndex = room.messagesViewed.findIndex(
                (item) => item.uid === userInfo.uid
              );
              const messagesViewed = room.messagesViewed.find(
                (item) => item.uid === userInfo.uid
              );

              const newMessageViewed = [...room.messagesViewed];

              newMessageViewed.splice(messagesViewedIndex, 1, {
                ...messagesViewed,
                count: messagesViewed.count + 1,
              });

              await setDoc(
                roomRef,
                {
                  messageLastest: {
                    text: textAreaValue,
                    displayName: userInfo.displayName,
                    uid: userInfo.uid,
                    createdAt: serverTimestamp(),
                  },
                  totalMessages: room.totalMessages + 1,
                  messagesViewed: newMessageViewed,
                },
                {
                  merge: true,
                }
              );

              addDocument("messages", {
                category: "single",
                roomId: room.id,
                uid: userInfo.uid,
                text: textAreaValue,
                images: [],
                infoReply: {},
              });
            };
            createMes();
          } else {
            const createRoomAndMes = async () => {
              try {
                const roomRef = await addDoc(collection(db, "rooms"), {
                  category: "single",
                  members: [userInfo.uid, converstation.uid],
                  messageLastest: {
                    text: textAreaValue,
                    displayName: userInfo.displayName,
                    uid: userInfo.uid,
                    createdAt: serverTimestamp(),
                  },
                  createdAt: serverTimestamp(),
                  totalMessages: 1,
                  messagesViewed: [
                    { uid: userInfo.uid, count: 1 },
                    { uid: converstation.uid, count: 0 },
                  ],
                });

                const response = await getDoc(roomRef);

                if (roomRef && roomRef.id) {
                  addDocument("messages", {
                    category: "single",
                    roomId: response.id,
                    uid: userInfo.uid,
                    text: textAreaValue,
                    images: [],
                    infoReply: {},
                  });
                } else {
                  console.log("false");
                }
              } catch (error) {
                console.error("Error creating room:", error);
              }
            };

            createRoomAndMes();
          }
        }
      });

      // if (room.id) {
      //   audio.play();

      //   const createMes = async () => {
      //     const roomRef = doc(db, "rooms", room.id);

      //     const messagesViewedIndex = room.messagesViewed.findIndex(
      //       (item) => item.uid === userInfo.uid
      //     );
      //     const messagesViewed = room.messagesViewed.find(
      //       (item) => item.uid === userInfo.uid
      //     );

      //     const newMessageViewed = [...room.messagesViewed];

      //     newMessageViewed.splice(messagesViewedIndex, 1, {
      //       ...messagesViewed,
      //       count: messagesViewed.count + 1,
      //     });

      //     await setDoc(
      //       roomRef,
      //       {
      //         messageLastest: {
      //           text: inputValue,
      //           displayName: userInfo.displayName,
      //           uid: userInfo.uid,
      //           createdAt: serverTimestamp(),
      //         },
      //         totalMessages: room.totalMessages + 1,
      //         messagesViewed: newMessageViewed,
      //       },
      //       {
      //         merge: true,
      //       }
      //     );

      //     addDocument("messages", {
      //       category: "single",
      //       roomId: room.id,
      //       uid: userInfo.uid,
      //       text: inputValue,
      //       images: [],
      //       infoReply: infoReply,
      //     });
      //   };
      //   createMes();
      // } else {
      //   const createRoomAndMes = async () => {
      //     try {
      //       const roomRef = await addDoc(collection(db, "rooms"), {
      //         category: "single",
      //         members: [userInfo.uid, selectedUserMessaging.uidSelected],
      //         messageLastest: {
      //           text: inputValue,
      //           displayName: userInfo.displayName,
      //           uid: userInfo.uid,
      //           createdAt: serverTimestamp(),
      //         },
      //         createdAt: serverTimestamp(),
      //         totalMessages: 1,
      //         messagesViewed: [
      //           { uid: userInfo.uid, count: 1 },
      //           { uid: selectedUserMessaging.uidSelected, count: 0 },
      //         ],
      //       });

      //       const response = await getDoc(roomRef);

      //       if (roomRef && roomRef.id) {
      //         setRoom({ id: response.id, ...response.data() });
      //         addDocument("messages", {
      //           category: "single",
      //           roomId: response.id,
      //           uid: userInfo.uid,
      //           text: inputValue,
      //           infoReply: infoReply,
      //         });
      //       } else {
      //         console.log("false");
      //       }
      //     } catch (error) {
      //       console.error("Error creating room:", error);
      //     }
      //   };

      //   createRoomAndMes();
      // }
    }
    setIsShowOverlayModalSharingMessage(false);
  };

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
        if (conversationsSelected[0]) {
          friendUidList = conversationsSelected.map((item) => item.uid);
        }

        return (
          <div
            className="conversation-item"
            key={item.uid}
            onClick={() => handleSelectedConversation(item)}
          >
            <i
              className="fa-solid fa-circle-check conversation-item__checkbox"
              style={
                friendUidList?.includes(item.uid)
                  ? { color: "#005ae0", border: "none" }
                  : {}
              }
            ></i>
            <img
              className="conversation-item__avatar"
              src={item.photoURL}
              alt=""
            />
            <div className="conversation-item__name">{item.displayName}</div>
          </div>
        );
      });
    }
  };

  const handleSelectedConversation = (conversation) => {
    if (conversationsSelected[0]) {
      let friendsSelectedIndex;
      if (conversation.uid) {
        friendsSelectedIndex = conversationsSelected.findIndex(
          (item) => item.uid === conversation.uid
        );
      }

      if (conversation.category === "group") {
        friendsSelectedIndex = conversationsSelected.findIndex(
          (item) => item.id === conversation.id && conversation.category
        );
      }

      if (friendsSelectedIndex !== -1) {
        const newFriendsSelected = [...conversationsSelected];
        newFriendsSelected.splice(friendsSelectedIndex, 1);
        setConversationsSelected(newFriendsSelected);
      } else {
        const newFriendsSelected = [...conversationsSelected];
        newFriendsSelected.push(conversation);
        setConversationsSelected(newFriendsSelected);
      }
      return;
    }

    const newFriendsSelected = [...conversationsSelected];
    newFriendsSelected.push(conversation);
    setConversationsSelected(newFriendsSelected);
  };

  const handleDeleteConversationSelected = (param) => {
    let friendsSelectedIndex;
    if (param.uid) {
      friendsSelectedIndex = conversationsSelected.findIndex(
        (item) => item.uid === param.uid
      );
    }

    if (param.id) {
      friendsSelectedIndex = conversationsSelected.findIndex(
        (item) => item.id === param.id && item.category === "group"
      );
    }

    // if (friendsSelectedIndex !== -1) {
    //   const newFriendsSelected = [...conversationsSelected];
    //   newFriendsSelected.splice(friendsSelectedIndex, 1);
    //   setConversationsSelected(newFriendsSelected);
    // } else {
    //   const newFriendsSelected = [...conversationsSelected];
    //   newFriendsSelected.push(conversation);
    //   setConversationsSelected(newFriendsSelected);
    // }

    const newFriendsSelected = [...conversationsSelected];
    newFriendsSelected.splice(friendsSelectedIndex, 1);
    setConversationsSelected(newFriendsSelected);
  };

  const renderConversationSelected = useMemo(() => {
    return conversationsSelected.map((item) => {
      // Loại bỏ trường 'infoParnerData' và truyền đi
      const { infoParnerData, ...room } = item;
      return (
        <div
          className="friend-selected-item"
          key={item.id}
          title={item.displayName || item.name || item.nameSearch}
        >
          {!item.category ? (
            <img
              src={item.photoURL}
              alt=""
              className="friend-selected-item__avatar"
            />
          ) : (
            <>
              {item.avatar?.url ? (
                <img
                  className="friend-selected-item__avatar"
                  src={item.avatar?.url}
                  alt=""
                />
              ) : (
                <div className="friend-selected-item__avatar">
                  <AvatarGroup
                    props={{ avatars: item.infoParnerData.photoURL, room }}
                    styleBox={{
                      width: "24px",
                      height: "24px",
                    }}
                    styleIcon={{
                      width: "13px",
                      height: "13px",
                      fontSize: "10px",
                    }}
                  />
                </div>
              )}
            </>
          )}

          <div className="friend-selected-item__name">
            {item.displayName || item.name || item.infoParnerData?.displayName}
          </div>
          <i
            className="fa-solid fa-circle-xmark friend-selected-item__btn-delete"
            onClick={() =>
              handleDeleteConversationSelected(
                !item.category ? { uid: item.uid } : { id: item.id }
              )
            }
          ></i>
        </div>
      );
    });
  }, [conversationsSelected]);

  const handlefilterCategory = (value) => {
    setCategorySelected(value);
  };

  //

  const [infoPartner, setInfoPartner] = useState([]);

  const [newRooms, setNewRoom] = useState([]);

  useEffect(() => {
    if (rooms[0]) {
      setLoadingGroupList(true);
      const fetchDataAsync = async () => {
        const fetchedData = await fetchData();
        setNewRoom(fetchedData.newRooms);
        setInfoPartner(fetchedData.infoPartner);
        setLoadingGroupList(false);
      };
      fetchDataAsync();
    }
  }, [rooms]);

  const fetchData = async () => {
    let infoPartner = [];
    let newRooms = [];
    for (const room of rooms) {
      if (room.category === "group") {
        const partnerRef = query(
          collection(db, "users"),
          where("uid", "in", room.members)
        );

        const response = await getDocs(partnerRef);
        const documents = response.docs.map((doc) => {
          const id = doc.id;
          const data = doc.data();
          return {
            id: id,
            displayName: data.displayName,
            photoURL: data.photoURL,
          };
        });

        const avatars = documents.map((item) => item.photoURL);

        const name = documents.map((item) => item.displayName).join(", ");

        // let keywordsName;

        // if (room.name) {
        //   keywordsName = generateKeywords(room.name.toLowerCase());
        // } else {
        //   keywordsName = generateKeywords(name.toLowerCase());
        // }

        infoPartner.push({
          id: room.id,
          photoURL: avatars,
          displayName: name,
          keywordsName: room.name.toLowerCase() || name.toLowerCase(),
        });

        newRooms.push({
          ...room,
          nameSearch: room.name || name,
        });
      }
    }
    return { infoPartner, newRooms };
  };

  const renderGroupList = useMemo(() => {
    if (infoPartner[0]) {
      return newRooms?.map((room) => {
        if (room.category === "group") {
          const infoParnerData = infoPartner.find(
            (item) => room.id === item.id
          );
          if (keywords) {
            const isKeywords = infoParnerData.keywordsName.includes(
              keywords.toLowerCase()
            );
            if (!isKeywords) {
              return;
            }
          }

          let conventionIdList;
          if (conversationsSelected[0]) {
            conventionIdList = conversationsSelected
              .filter((conversation) => conversation.category)
              .map((item) => item.id);
          }

          return (
            <div
              className="conversation-item"
              key={room.id}
              onClick={() =>
                handleSelectedConversation({ ...room, infoParnerData })
              }
            >
              <i
                className="fa-solid fa-circle-check conversation-item__checkbox"
                style={
                  conventionIdList?.includes(room.id)
                    ? { color: "#005ae0", border: "none" }
                    : {}
                }
              ></i>
              <div style={{ margin: "0px 10px 0px 12px" }}>
                {room.avatar?.url ? (
                  <img
                    className="conversation-item__avatar"
                    src={room.avatar?.url}
                    alt=""
                    style={{ marginLeft: "0px", marginRight: "0px" }}
                  />
                ) : (
                  <AvatarGroup
                    props={{ avatars: infoParnerData.photoURL, room }}
                    styleBox={{
                      width: "40px",
                      height: "40px",
                    }}
                    styleIcon={{
                      width: "22px",
                      height: "22px",
                      fontSize: "12px",
                    }}
                  />
                )}
              </div>

              <div className="conversation-item__name">
                <span>{room.name || infoParnerData.displayName}</span>
              </div>
            </div>
          );
        }
      });
    }
  }, [infoPartner, keywords, newRooms, conversationsSelected]);

  return (
    <S.Wrapper>
      <S.Container>
        <div className="modal-overlay">
          <div className="modal-container" ref={modalContainer}>
            <div className="modal-content">
              <div className="header">
                <div className="header__left">Chia sẻ</div>
                <i
                  className="fa-solid fa-xmark header__right"
                  onClick={() => setIsShowOverlayModalSharingMessage(false)}
                ></i>
              </div>
              <div className="content">
                <div className="sharing-message-search">
                  <div className="input-search-users">
                    <i className="fa-solid fa-magnifying-glass"></i>
                    <input
                      type="text"
                      placeholder="Tìm kiếm hội thoại cần chia sẻ"
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

                <div className="conversations-container">
                  <div className="conversations-container__left">
                    <div
                      className="title"
                      style={{
                        fontWeight: 500,
                        fontSize: "14px",
                        margin: "8px 4px",
                      }}
                    >
                      Bạn bè
                    </div>
                    {userInfo.friends?.length >= 1 ? (
                      <div className="conversation-list">
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
                          <>{renderFriendList()}</>
                        )}{" "}
                      </div>
                    ) : (
                      <div className="container-empty">
                        <img src={empty} alt="" />
                        <div>Bạn không có bạn bè nào</div>
                      </div>
                    )}

                    <div
                      className="title"
                      style={{
                        fontWeight: 500,
                        fontSize: "14px",
                        margin: "8px 4px",
                      }}
                    >
                      Nhóm
                    </div>
                    {loadingGroupList ? (
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
                      <>
                        {newRooms?.length >= 1 ? (
                          <div className="conversation-list">
                            <>{renderGroupList}</>
                          </div>
                        ) : (
                          <div className="container-empty">
                            <img src={empty} alt="" />
                            <div>Bạn không có nhóm nào</div>
                          </div>
                        )}
                      </>
                    )}
                  </div>

                  <div
                    className={
                      conversationsSelected.length > 0
                        ? "friend-selected-container friend-selected-container--active"
                        : "friend-selected-container "
                    }
                  >
                    <div className="total-selected">
                      <span className="total-selected__title">Đã chọn</span>
                      <span className="total-selected__count">
                        {conversationsSelected?.length}/
                        {friends?.length + newRooms?.length}
                      </span>
                    </div>
                    <div className="friend-selected-list">
                      {renderConversationSelected}
                    </div>
                  </div>
                </div>
              </div>
              <div
                className="container-message-preview"
                style={{
                  borderTop: isShowEditArea
                    ? "1px solid var(--boder-dividing-color)"
                    : "",
                }}
              >
                <div className="label-message-preview">Nội dung chia sẻ</div>
                <div className="box-message-preview">
                  {isShowEditArea ? (
                    <textarea
                      className="area-edit"
                      autoComplete="off"
                      spellCheck="false"
                      value={textAreaValue}
                      onChange={(e) => setTextAreaValue(e.target.value)}
                    />
                  ) : (
                    <>
                      <div className="preview-content">{textAreaValue}</div>
                      <div
                        className="btn-edit-content"
                        onClick={() => {
                          setIsShowEditArea(true);
                        }}
                      >
                        Sửa
                      </div>
                    </>
                  )}
                </div>
              </div>
              <div className="footer">
                <div
                  className="btn-cancel"
                  onClick={() => {
                    setIsShowOverlayModalSharingMessage(false);
                  }}
                >
                  Hủy
                </div>
                <div
                  className={
                    conversationsSelected.length > 0
                      ? "btn-sharing-message btn-sharing-message--active"
                      : "btn-sharing-message"
                  }
                  onClick={() => handleClickSharingMessage()}
                >
                  Chia sẻ
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
                Hình ảnh phải có kích thước nhỏ hơn 0.5MB
              </div>
            )}
          </div>
        </div>
      </S.Container>
    </S.Wrapper>
  );
};

export default ModalSharingMessage;
