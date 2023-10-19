import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import * as S from "./styles";
import { UserLayoutContext } from "layouts/user/UserLayout";
import { AppContext } from "Context/AppProvider";
import {
  collection,
  doc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "firebase/firestore";
import { db } from "firebaseConfig";
import moment from "moment";
import notificationDowloadZaloPc from "assets/notificationDowloadZaloPc.jpg";
import ModalCreateGroup from "components/ModalCreateGroup";
import AvatarGroup from "components/AvatarGroup";
import emptyMessageUnssenImage from "assets/emptyMessageUnseen.png";
import slideList from "./slideList";
import searchEmpty2 from "assets/searchEmpty2.png";
import avatarDefault from "assets/avatar-mac-dinh-1.png";
import avatarCloud from "assets/avatarCloudjpg.jpg";
import ModalConfirm from "components/ModalConfirm";

const MessagePage = () => {
  const {
    isShowBoxChat,
    setIsShowBoxChat,
    setTotalUnseenMessage,
    isShowBoxChatGroup,
    setIsShowBoxChatGroup,
    setSidebarSelected,
    setSectionSelected,
    isShowSectionLeft,
    setIsShowSectionLeft,
    isShowSectionRight,
    setIsShowSectionRight,
  } = useContext(UserLayoutContext);
  const {
    rooms,
    userInfo,
    selectedUserMessaging,
    setSelectedUserMessaging,
    setSelectedGroupMessaging,
    selectedGroupMessaging,
  } = useContext(AppContext);

  var settings = {
    dots: true,
    infinite: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };

  function NextArrow(props) {
    const { onClick } = props;
    return (
      <div className="next-arrow-slide" onClick={onClick}>
        <i className="fa-solid fa-chevron-right"></i>
      </div>
    );
  }

  function PrevArrow(props) {
    const { onClick } = props;
    return (
      <div className="prev-arrow-slide" onClick={onClick}>
        <i className="fa-solid fa-chevron-left"></i>
      </div>
    );
  }

  const categoryRef = useRef(null);
  const dropdownRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [categorySelected, setCategorySelected] = useState("");
  const [isShowDropdownOption, setIsShowDropdownOption] = useState(false);
  const [isShowOverlayModalConfirmDelete, setIsShowOverlayModalConfirmDelete] =
    useState(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsShowDropdownOption(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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

  const [totalUnSeenMessageRef, setTotalUnseenMessageRef] = useState(0);

  useEffect(() => {
    setTotalUnseenMessage(totalUnSeenMessageRef);
  }, [totalUnSeenMessageRef]);

  const toogleBoxChatGroup = ({ room, avatars, name }) => {
    setIsShowBoxChat(false);
    setSelectedUserMessaging(false);
    setIsShowBoxChatGroup(true);

    setSelectedGroupMessaging({ room, avatars, name });
  };

  const [filterOption, setFilterOption] = useState("all");
  const [categoryDropdown, setCategoryDropdown] = useState(false);

  const handleFilterOption = (value) => {
    setFilterOption(value);
  };

  const [infoPartner, setInfoPartner] = useState([]);

  const fetchData = async () => {
    let infoPartner = [];
    for (const room of rooms) {
      const uidSelected = room.members.filter(
        (member) => member !== userInfo.uid
      )[0];

      if (uidSelected !== "my-cloud") {
        if (room.category === "single") {
          const partnerRef = query(
            collection(db, "users"),
            where("uid", "==", uidSelected)
          );
          const response = await getDocs(partnerRef);
          response.docs.forEach((doc) => {
            const id = doc.id;
            const data = doc.data();
            // const keywordsName = generateKeywords(
            //   data.displayName.toLowerCase()
            // );

            infoPartner.push({
              id: id,
              displayName: data.displayName,
              photoURL: data.photoURL,
              uid: data.uid,
              keywordsName: data.displayName.toLowerCase(),
            });
          });
        } else if (room.category === "group") {
          const partnerRef = query(
            collection(db, "users"),
            where("uid", "in", room.members)
          );

          const response = await getDocs(partnerRef);
          const documents = response.docs
            .map((doc) => {
              const id = doc.id;
              const data = doc.data();
              return {
                id: id,
                displayName: data.displayName,
                photoURL: data.photoURL,
              };
            })
            .reverse();

          const avatars = documents.map((item) => item.photoURL);

          const name = documents.map((item) => item.displayName).join(", ");

          let keywordsName;

          // if (room.name) {
          // keywordsName = generateKeywords(room.name.toLowerCase());
          // } else {
          // keywordsName = generateKeywords(name.toLowerCase());
          // }

          infoPartner.push({
            id: room.id,
            photoURL: avatars,
            displayName: name,
            keywordsName: room.name.toLowerCase() || name.toLowerCase(),
          });
        }
      } else {
        // const keywordsName = generateKeywords("Cloud của tôi".toLowerCase());
        infoPartner.push({
          photoURL: avatarCloud,
          displayName: "Cloud của tôi",
          id: "my-cloud",
          uid: "my-cloud",
          keywordsName: "Cloud của tôi".toLowerCase(),
        });
      }
    }
    return infoPartner;
  };

  useEffect(() => {
    if (rooms[0]) {
      setLoading(true);
      const fetchDataAsync = async () => {
        const fetchedData = await fetchData();
        setInfoPartner(fetchedData);
        setLoading(false);
      };

      fetchDataAsync();
    }
  }, [rooms, userInfo]);

  const [keywords, setKeywords] = useState("");

  const [roomDelete, setRoomDelete] = useState();
  console.log("🚀 ~ file: index.jsx:238 ~ MessagePage ~ roomDelete:", roomDelete)

  const handleDeleteRoomChat = async () => {
    const now = moment().valueOf();
    const newDeleted = [...roomDelete.deleted].filter(
      (item) => item.uid !== userInfo.uid
    );
    newDeleted.push({ uid: userInfo.uid, createdAt: now });

    console.log(newDeleted);

    if (roomDelete.category === "single" || roomDelete.category === "my cloud") {
      const roomRef = doc(db, "rooms", roomDelete.id);
      await setDoc(
        roomRef,
        {
          deleted: newDeleted,
          hideTemporarily: [
            ...new Set([...roomDelete.hideTemporarily, userInfo.uid]),
          ],
        },
        {
          merge: true,
        }
      );
    }

    if (roomDelete.category === "group") {
      const roomRef = doc(db, "rooms", roomDelete.id);

      await setDoc(
        roomRef,
        {
          deleted: newDeleted,
          hideTemporarily: [
            ...new Set([...roomDelete.hideTemporarily, userInfo.uid]),
          ],
        },
        {
          merge: true,
        }
      );
    }

    setIsShowDropdownOption(false);
    setRoomDelete();
    setIsShowBoxChat(false);
    setIsShowBoxChatGroup(false);
  };

  const renderRooms = useMemo(() => {
    setTotalUnseenMessageRef(0);

    if (!infoPartner[0]) {
      return;
    }

    return rooms?.map((room) => {
      if (room.hideTemporarily?.includes(userInfo.uid)) return;

      if (room.category === "single" || room.category === "my cloud") {
        const infoPartnerResult = infoPartner.find((item) => {
          return room.members.includes(item.uid);
        });

        const formatDate = moment(
          room.messageLastest?.createdAt?.seconds * 1000
        )?.fromNow();

        const uidSelected = room.members.filter(
          (member) => member !== userInfo.uid
        )[0];

        let categoryData;
        const friendData = userInfo.friends.find(
          (item) => item.uid === uidSelected
        );
        if (friendData) {
          categoryData = userInfo.categoriesTemplate.find(
            (item) => item.name === friendData.category
          );
        }

        const infoMyself = room.messagesViewed.find(
          (item) => item.uid === userInfo.uid
        );

        const unseenMessages = room.totalMessages - infoMyself.count;

        setTotalUnseenMessageRef((current) => current + unseenMessages);

        let keywordsName;

        if (room.category === "single") {
          keywordsName = infoPartner.find(
            (item) => item.uid === uidSelected
          )?.keywordsName;
        } else if (room.category === "my cloud") {
          keywordsName = infoPartner.find(
            (item) => item.id === "my-cloud"
          )?.keywordsName;
        }

        if (keywords) {
          // const isKeywords = keywordsName.includes(keywords.toLowerCase());

          let ind = keywordsName.indexOf(keywords.toLowerCase());

          if (ind < 0) {
            return;
          }
        }

        if (categorySelected) {
          if (!categoryData?.name) {
            return;
          }
          if (categorySelected !== categoryData?.name) {
            return;
          }
        }

        if (filterOption === "unseen") {
          if (unseenMessages <= 0) {
            return;
          }
        }

        return (
          <div className="container-room-item " key={room.id}>
            <div
              className={
                uidSelected === selectedUserMessaging.uidSelected
                  ? "room-item room-item--active"
                  : "room-item"
              }
              onClick={() =>
                toogleBoxChat({
                  uidSelected: uidSelected,
                  photoURLSelected: infoPartnerResult?.photoURL,
                  displayNameSelected: infoPartnerResult?.displayName,
                })
              }
            >
              <div className="room-item__left">
                <img
                  // className="image-with-replacement"
                  src={infoPartnerResult?.photoURL}
                  alt=""
                  onError={(e) => {
                    e.target.src = avatarDefault;
                  }}
                />

                <div className="info">
                  <div className="room-name">
                    {infoPartnerResult?.displayName}
                  </div>
                  <div className="new-message">
                    {categoryData && (
                      <i
                        className="fa-solid fa-bookmark category-icon"
                        style={{
                          color: categoryData.color,
                          marginRight: "8px",
                        }}
                        title={categoryData.name}
                      ></i>
                    )}
                    <span className="new-message__author">
                      {room.messageLastest?.uid === userInfo.uid && "Bạn: "}
                    </span>
                    <span className="new-message__text">
                      {room.messageLastest?.text}
                    </span>
                  </div>
                </div>
              </div>
              <div className="room-item__right">
                <div className="date">
                  {formatDate !== "Invalid date" ? formatDate : "..."}
                </div>

                {!!unseenMessages && (
                  <div className="unseen">
                    {unseenMessages < 5 ? unseenMessages : "N"}
                  </div>
                )}
              </div>
              {isShowDropdownOption?.id === room.id && (
                <div className="dropdown-menu" ref={dropdownRef}>
                  <div
                    className="menu-item"
                    style={{ color: "#d91b1b" }}
                    onClick={() => {
                      setIsShowDropdownOption(false);
                      setRoomDelete(room);
                      setIsShowOverlayModalConfirmDelete(true);
                    }}
                  >
                    <i
                      className="fa-regular fa-trash-can"
                      style={{ color: "#d91b1b" }}
                    ></i>
                    Xoá hội thoại
                  </div>
                </div>
              )}
            </div>
            <div
              className={
                uidSelected === selectedUserMessaging.uidSelected
                  ? "btn-show-option btn-show-option--active"
                  : "btn-show-option"
              }
              onClick={() => setIsShowDropdownOption({ id: room.id })}
            >
              <i className="fa-solid fa-ellipsis"></i>
            </div>
          </div>
        );
      }
      if (room.category === "group") {
        if (room.deleted) {
          if (room.deleted.includes(userInfo.uid)) {
            return;
          }
        }

        const infoGroup = infoPartner.find((item) => item.id === room.id);

        const formatDate = moment(
          room.messageLastest?.createdAt?.seconds * 1000
        )?.fromNow();

        const infoMyself = room.messagesViewed.find(
          (item) => item.uid === userInfo.uid
        );

        const unseenMessages = room.totalMessages - infoMyself.count;

        setTotalUnseenMessageRef((current) => current + unseenMessages);

        if (keywords) {
          const isKeywords = infoGroup.keywordsName.includes(
            keywords.toLowerCase()
          );
          if (!isKeywords) {
            return;
          }
        }

        if (room.mentioned) {
          if (room.mentioned[0] && unseenMessages === 0) {
            const mentionIndex = room.mentioned.findIndex(
              (item) => item === userInfo.uid
            );
            if (mentionIndex !== -1) {
              const newMentiond = [...room.mentioned];
              newMentiond.splice(mentionIndex, 1);

              const updateMentionRoom = async () => {
                const docRef = doc(db, "rooms", room.id);
                await setDoc(
                  docRef,
                  {
                    mentioned: newMentiond,
                  },
                  {
                    merge: true,
                  }
                );
              };
              updateMentionRoom();
            }
          }
        }

        let categoryData;
        const groupData = userInfo?.groups?.find(
          (item) => item.id === infoGroup?.id
        );

        if (groupData) {
          categoryData = userInfo.categoriesTemplate.find(
            (item) => item.name === groupData.category
          );
        }

        if (categorySelected) {
          if (!categoryData?.name) {
            return;
          }
          if (categorySelected !== categoryData?.name) {
            return;
          }
        }

        if (filterOption === "unseen") {
          if (unseenMessages <= 0) {
            return;
          }
        }

        const handleImageError = () => {
          // Xử lý khi hình ảnh không tải được (ví dụ: hiển thị biểu tượng thay thế)
          const iconImage = document.querySelector(".icon-image");
          iconImage.style.display = "block";
        };

        return (
          <div className="container-room-item " key={room.id}>
            <div
              className={
                room.id === selectedGroupMessaging?.room?.id
                  ? "room-item room-item--active"
                  : "room-item"
              }
              onClick={() =>
                toogleBoxChatGroup({
                  room,
                  avatars: infoGroup.photoURL,
                  name: infoGroup.displayName,
                })
              }
            >
              <div className="room-item__left">
                {room.avatar?.url && (
                  <img
                    // className="image-with-replacement"
                    src={room.avatar?.url}
                    alt=""
                    onError={(e) => {
                      e.target.src = avatarDefault;
                    }}
                  />
                )}

                {!room.avatar?.url && infoGroup?.photoURL && (
                  <AvatarGroup props={{ room, avatars: infoGroup?.photoURL }} />
                )}

                <div className="info">
                  <div className="room-name">
                    {room.name || infoGroup?.displayName}
                  </div>
                  <div className="new-message">
                    {categoryData && (
                      <i
                        className="fa-solid fa-bookmark category-icon"
                        style={{
                          color: categoryData.color,
                          marginRight: "8px",
                        }}
                        title={categoryData.name}
                      ></i>
                    )}
                    <span className="new-message__author">
                      {room.messageLastest?.uid === userInfo.uid
                        ? "Bạn: "
                        : room?.messageLastest?.displayName &&
                          `${room?.messageLastest?.displayName}: `}
                    </span>
                    <span className="new-message__text">
                      {room?.messageLastest?.text}
                    </span>
                  </div>
                </div>
              </div>
              <div className="room-item__right">
                <div className="date">
                  {formatDate !== "Invalid date" ? formatDate : "..."}
                </div>
                {!!unseenMessages && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    {room?.mentioned?.includes(userInfo.uid) && (
                      <div className="icon-tagname">@</div>
                    )}
                    <div className="unseen">
                      {unseenMessages < 5 ? unseenMessages : "N"}
                    </div>
                  </div>
                )}
              </div>

              {isShowDropdownOption?.id === room.id && (
                <div className="dropdown-menu" ref={dropdownRef}>
                  <div
                    className="menu-item"
                    style={{ color: "#d91b1b" }}
                    onClick={() => {
                      setIsShowDropdownOption(false);
                      setRoomDelete(room);
                      setIsShowOverlayModalConfirmDelete(true);
                    }}
                  >
                    <i
                      className="fa-regular fa-trash-can"
                      style={{ color: "#d91b1b" }}
                    ></i>
                    Xoá hội thoại
                  </div>
                </div>
              )}
            </div>
            <div
              className={
                room.id === selectedGroupMessaging?.room?.id
                  ? "btn-show-option btn-show-option--active"
                  : "btn-show-option"
              }
              onClick={() => setIsShowDropdownOption({ id: room.id })}
            >
              <i className="fa-solid fa-ellipsis"></i>
            </div>
          </div>
        );
      }
    });
  }, [
    filterOption,
    infoPartner,
    keywords,
    categorySelected,
    selectedUserMessaging,
    selectedGroupMessaging,
    isShowDropdownOption,
  ]);

  // useEffect(() => {
  //   let searcharray = [];
  //   let x = 0;
  //   if ()
  // }, [])

  const renderSlideList = () => {
    return slideList.map((item, index) => {
      return (
        <div className="slide-item" key={index}>
          <div className="slide-item__image">
            <img src={item.imageSrc} alt="" />
          </div>
          <div className="slide-item__text">
            <div className="title">{item.title}</div>
            <div className="description">{item.description}</div>
          </div>
        </div>
      );
    });
  };

  const handleRemindLater = async () => {
    const docRef = doc(db, "users", userInfo.id);

    await setDoc(
      docRef,
      {
        notificationDowloadZaloPc: {
          value: false,
          updatedAt: serverTimestamp(),
        },
      },
      {
        merge: true,
      }
    );
  };

  const [isShowOverlayModal, setIsShowOverlayModal] = useState(false);

  const [width, setWidth] = useState(0);
  const [left, setLeft] = useState(0);

  useEffect(() => {
    if (filterOption === "all") {
      const element = document.querySelector(".menu-left__item--all");
      const width = element.offsetWidth;
      setWidth(width);
      setLeft(16);
    }
    if (filterOption === "unseen") {
      const element = document.querySelector(".menu-left__item--unseen");
      const width = element.offsetWidth;
      setWidth(width);
      setLeft(64);
    }
  }, [filterOption]);

  const handlefilterCategory = (value) => {
    setCategorySelected(value);
    setCategoryDropdown(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (categoryRef.current && !categoryRef.current.contains(event.target)) {
        setCategoryDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const switchOverStranger = () => {
    setSidebarSelected("phonebook");
    setSectionSelected("chat-with-strangers");
    setIsShowBoxChatGroup(false);
    setIsShowBoxChat(false);
    if (isShowSectionLeft) {
      setIsShowSectionLeft(false);
    }
    if (!isShowSectionRight) {
      setIsShowSectionRight(true);
    }
  };

  return (
    <S.Wrapper>
      <S.Container
        width={width}
        left={left}
        isShowBoxChat={isShowBoxChat}
        isShowBoxChatGroup={isShowBoxChatGroup}
      >
        <div className="message">
          <div className="section-left">
            <div className="section-left__header">
              <div className="search">
                <i className="fa-solid fa-magnifying-glass"></i>
                <input
                  value={keywords}
                  placeholder="Tìm kiếm"
                  onChange={(e) => setKeywords(e.target.value)}
                />
              </div>
              <div className="add-friend" onClick={() => switchOverStranger()}>
                <i className="fa-solid fa-user-plus icon"></i>
              </div>
              <div
                className="create-groud"
                onClick={() => setIsShowOverlayModal(true)}
              >
                <i className="fa-solid fa-users icon"></i>
              </div>
            </div>
            <div className="section-left__content">
              <div className="menu">
                <div className="menu__left">
                  <div
                    className="menu-left__item menu-left__item--all"
                    onClick={() => handleFilterOption("all")}
                    style={filterOption === "all" ? { color: "#005ae0" } : {}}
                  >
                    Tất cả
                  </div>
                  <div
                    className="menu-left__item menu-left__item--unseen"
                    onClick={() => handleFilterOption("unseen")}
                    style={
                      filterOption === "unseen" ? { color: "#005ae0" } : {}
                    }
                  >
                    Chưa đọc
                  </div>
                </div>
                <div className="menu__right">
                  <div
                    className="menu-right__item"
                    onClick={() => setCategoryDropdown(true)}
                    style={
                      categorySelected
                        ? { backgroundColor: "#E5EFFF", color: "#005ae0" }
                        : {}
                    }
                  >
                    {categorySelected ? categorySelected : "Phân loại"}
                    &nbsp;{" "}
                    {categorySelected ? (
                      <i
                        className="fa-solid fa-circle-xmark "
                        onClick={() => handlefilterCategory("")}
                        style={{ color: "#005ae0" }}
                      ></i>
                    ) : (
                      <i className="fa-solid fa-chevron-down"></i>
                    )}
                  </div>

                  {categoryDropdown && (
                    <div className="category-dropdown" ref={categoryRef}>
                      {userInfo?.categoriesTemplate?.map((item, index) => (
                        <div
                          key={index}
                          className="category-dropdown__item"
                          onClick={() => handlefilterCategory(item.name)}
                        >
                          <i
                            className="fa-solid fa-bookmark"
                            style={{ color: item.color }}
                          ></i>
                          {item.name}
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="menu-right__item menu-right__item--more">
                    <i className="fa-solid fa-ellipsis"></i>
                  </div>
                </div>
                <div className="dividing-selected"></div>
              </div>
              <div className="room-list">
                {/* {loading && (
                  <div className="room-item">
                    <div className="room-item__left">
                      <Skeleton
                        circle={true}
                        style={{
                          width: "48px",
                          height: "48px",
                          borderRadius: "50%",
                        }}
                      />
                      <div className="info">
                        <div className="room-name">
                          <Skeleton />
                        </div>
                        <div className="new-message">
                          <span className="new-message__text">
                            <Skeleton />
                          </span>
                        </div>
                      </div>
                    </div>
                    <div
                      className="room-item__right"
                      style={{ width: "100%" }}
                    ></div>
                  </div>
                )} */}

                {/*  */}

                {renderRooms}
                {renderRooms?.length > 0 &&
                  renderRooms?.every((item) => item === undefined) &&
                  filterOption === "unseen" &&
                  !categorySelected && (
                    <div className="empty-message">
                      <img
                        src={emptyMessageUnssenImage}
                        alt=""
                        className="empty-message__img"
                      />
                      <span>Không có tin nhắn chưa đọc</span>
                    </div>
                  )}
                {renderRooms?.length > 0 &&
                  renderRooms?.every((item) => item === undefined) &&
                  (!categorySelected ? (
                    filterOption === "all" && (
                      <div className="empty-message">
                        <img
                          src={emptyMessageUnssenImage}
                          alt=""
                          className="empty-message__img"
                        />
                        <span>Không có tin nhắn</span>
                      </div>
                    )
                  ) : (
                    <div className="empty-message">
                      <img
                        src={searchEmpty2}
                        alt=""
                        className="empty-message__img"
                      />
                      <span style={{ color: "#081C36" }}>
                        Không có kết quả phù hợp
                      </span>
                      <div
                        style={{
                          width: "248px",
                          textAlign: "center",
                          margin: "16px 0px",
                          color: "#7589a3",
                        }}
                      >
                        Phân loại hội thoại để ghi nhớ và nhận biết dễ dàng hơn
                      </div>
                      <div
                        className="btn-tag"
                        style={{
                          height: "32px",
                          lineHeight: "32px",
                          fontSize: "16px",
                          fontWeight: "600",
                          padding: "0 16px",
                          color: "#005ae0",
                          borderRadius: "4px",
                          cursor: "pointer",
                        }}
                      >
                        Gắn thẻ trò chuyện
                      </div>
                    </div>
                  ))}

                {userInfo?.notificationDowloadZaloPc.value && (
                  <div className="notification-compatible">
                    <div className="notification-compatible__header">
                      <img src={notificationDowloadZaloPc} alt="" />
                    </div>
                    <div className="notification-compatible__content">
                      <div className="title">
                        Tải và cài đặt ngay ứng dụng Zalo PC
                      </div>
                      <div className="description">
                        Tăng khả năng bảo mật thông tin và trải nghiệm nhiều
                        tính năng độc quyền chỉ có trên Zalo PC
                      </div>
                      <div className="footer">
                        <div
                          className="remind-me-later-btn"
                          onClick={() => handleRemindLater()}
                        >
                          Nhắc tôi sau
                        </div>
                        <div className="dowload-now">
                          <span>Tải ngay</span>
                          <i className="fa-solid fa-download"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          {!isShowBoxChatGroup && !isShowBoxChat && (
            <div className="section-right">
              <div className="content-welcome">
                <div className="content-welcome__header">
                  <h2>Chào mừng đến với Zalo PC!</h2>
                  <div>
                    Khám phá tiện ích hổ trợ làm việc và trò chuyện cùng người
                    thân, bạn bè được tối ưu hóa cho máy tính của bạn.
                  </div>
                </div>
                <Slider {...settings} className="slide-list">
                  {renderSlideList()}
                </Slider>
              </div>
            </div>
          )}
        </div>
      </S.Container>

      {isShowOverlayModal && (
        <ModalCreateGroup setIsShowOverlayModal={setIsShowOverlayModal} />
      )}

      {isShowOverlayModalConfirmDelete && (
        <ModalConfirm
          setIsShowOverlayModalConfirmDelete={
            setIsShowOverlayModalConfirmDelete
          }
          handleDeleteRoomChat={handleDeleteRoomChat}
        />
      )}
    </S.Wrapper>
  );
};

export default MessagePage;
