import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
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
import RoomItem from "./RoomItem";
import InfiniteScroll from "react-infinite-scroll-component";
import RoomItemSkeleton from "./RoomItemSkeleton";

const MessagePage = () => {
  const {
    isShowBoxChat,
    setIsShowBoxChat,
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
    loadMoreRooms,
    hasMore,
    setHasMore,
    startLoading, stopLoading
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

  const [categorySelected, setCategorySelected] = useState("");
  const [isShowDropdownOption, setIsShowDropdownOption] = useState(false);
  const [isShowOverlayModalConfirmDelete, setIsShowOverlayModalConfirmDelete] =
    useState(false);



  const toogleBoxChat = useCallback(({
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
  }, [setIsShowBoxChat, setIsShowBoxChatGroup, setSelectedGroupMessaging, setSelectedUserMessaging]);

  const toogleBoxChatGroup = useCallback(({ room, avatars, name }) => {
    setIsShowBoxChat(false);
    setSelectedUserMessaging(false);
    setIsShowBoxChatGroup(true);

    setSelectedGroupMessaging({ room, avatars, name });
  }, [setIsShowBoxChat,
    setSelectedUserMessaging,
    setIsShowBoxChatGroup,
    setSelectedGroupMessaging]);

  const [filterOption, setFilterOption] = useState("all");
  const [categoryDropdown, setCategoryDropdown] = useState(false);

  const [infoPartner, setInfoPartner] = useState([]);

  useEffect(() => {
    if (!rooms.length || !userInfo?.uid) return;

    const fetchDataAsync = async () => {
      try {
        startLoading();
        const infoPartnerArray = await Promise.all(rooms.map(async (room) => {
          const uidSelected = room.members.find(m => m !== userInfo.uid);

          if (uidSelected === "my-cloud") {
            return {
              photoURL: avatarCloud,
              displayName: "Cloud của tôi",
              id: "my-cloud",
              uid: "my-cloud",
              keywordsName: "cloud của tôi",
            };
          }

          const partnerRef = query(
            collection(db, "users"),
            where("uid", room.category === "single" ? "==" : "in",
              room.category === "single" ? uidSelected : room.members)
          );

          const response = await getDocs(partnerRef);
          const docsData = response.docs.map(doc => ({ id: doc.id, ...doc.data() }));

          if (room.category === "single") {
            const user = docsData[0];
            return {
              id: user?.id,
              displayName: user?.displayName,
              photoURL: user?.photoURL,
              uid: user?.uid,
              keywordsName: user?.displayName?.toLowerCase(),
            };
          } else {
            const names = docsData.map(d => d.displayName).join(", ");
            return {
              id: room.id,
              photoURL: docsData.map(d => d.photoURL),
              displayName: names,
              keywordsName: (room.name || names).toLowerCase(),
            };
          }
        }));

        setInfoPartner(infoPartnerArray);
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        stopLoading();
      }
    };

    fetchDataAsync();
  }, [rooms, userInfo?.uid]); // Chỉ phụ thuộc vào uid thay vì cả object userInfo

  const [keywords, setKeywords] = useState("");

  const [roomDelete, setRoomDelete] = useState(null);

  const handleDeleteRoomChat = async () => {
    const now = moment().valueOf();
    const newDeleted = [...roomDelete.deleted].filter(
      (item) => item.uid !== userInfo.uid
    );
    newDeleted.push({ uid: userInfo.uid, clientCreatedAt: now });

    if (
      roomDelete.category === "single" ||
      roomDelete.category === "my cloud"
    ) {
      const roomRef = doc(db, "rooms", roomDelete.id);
      startLoading();
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
      stopLoading();

      const uidDeleted = roomDelete.members.filter(
        (item) => item !== userInfo.uid
      )[0];

      if (uidDeleted === selectedUserMessaging?.uidSelected) {
        setSelectedUserMessaging({});
        setSelectedGroupMessaging({});
        setIsShowBoxChat(false);
        setIsShowBoxChatGroup(false);
      }
    }

    if (roomDelete.category === "group") {
      const roomRef = doc(db, "rooms", roomDelete.id);
      startLoading();
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
      stopLoading();

      if (roomDelete?.id === selectedGroupMessaging?.room?.id) {
        setSelectedUserMessaging({});
        setSelectedGroupMessaging({});
        setIsShowBoxChat(false);
        setIsShowBoxChatGroup(false);
      }
    }
    setIsShowDropdownOption(false);
    setRoomDelete(null);
  };

  const filterRoom = infoPartner.length >= 1 && rooms.length >= 1 ? rooms?.map((room) => {
    if (room.hideTemporarily?.includes(userInfo.uid)) return null;
    if (room.category === "single" || room.category === "my cloud") {

      const type = "single";

      const infoPartnerResult = infoPartner.find((item) => {
        return room.members.includes(item.uid);
      });

      const formatDate = moment(
        room.messageLastest?.clientCreatedAt
      )?.fromNow();

      const uidSelected = room.members.filter(
        (member) => member !== userInfo.uid
      )[0];

      let categoryData;
      const friendData = userInfo?.friends?.find(
        (item) => item.uid === uidSelected
      );
      if (friendData) {
        categoryData = userInfo?.categoriesTemplate?.find(
          (item) => item.name === friendData.category
        );
      }

      const unseenMessages = room.unreadCount && room.unreadCount[userInfo.uid];

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
          return null;
        }
      }

      if (categorySelected) {
        if (!categoryData?.name) {
          return null;
        }
        if (categorySelected !== categoryData?.name) {
          return null;
        }
      }

      if (filterOption === "unseen") {
        if (unseenMessages <= 0) {
          return null;
        }
      }

      const roomItemRenderData = {
        // key & so sánh active
        type,
        roomId: room.id,
        uidSelected,
        selectedUid: selectedUserMessaging?.uidSelected,

        // handlers
        onSelectRoom: () =>
          toogleBoxChat({
            uidSelected: uidSelected,
            photoURLSelected: infoPartnerResult?.photoURL,
            displayNameSelected: infoPartnerResult?.displayName,
          }),

        onToggleDropdown: () =>
          setIsShowDropdownOption({ id: room.id }),

        onDeleteRoom: () => {
          setIsShowDropdownOption(false);
          setRoomDelete(room);
          setIsShowOverlayModalConfirmDelete(true);
        },

        // user
        currentUserUid: userInfo.uid,

        // partner info
        partner: {
          photoURL: infoPartnerResult?.photoURL,
          displayName: infoPartnerResult?.displayName,
        },

        // message
        lastMessage: {
          uid: room.messageLastest?.uid,
          text: room.messageLastest?.text,
          createdAtText: formatDate,
        },

        // category
        category: categoryData
          ? {
            name: categoryData.name,
            color: categoryData.color,
          }
          : null,

        // unseen
        unseenMessages,

        // dropdown
        isDropdownOpen: isShowDropdownOption?.id === room.id,

        // assets
        avatarFallback: avatarDefault,
      };

      return roomItemRenderData;
    }

    if (room.category === "group") {
      if (room.deleted) {
        if (room.deleted.includes(userInfo.uid)) {
          return null;
        }
      }
      const type = "group";

      const infoGroup = infoPartner.find((item) => item.id === room.id);

      const formatDate = moment(
        room.messageLastest?.clientCreatedAt
      )?.fromNow();

      const unseenMessages = room.unreadCount && room.unreadCount[userInfo.uid];

      if (keywords) {
        const isKeywords = infoGroup.keywordsName.includes(
          keywords.toLowerCase()
        );
        if (!isKeywords) {
          return null;
        }
      }

      if (room.mentioned) {
        if (room.mentioned[0] && unseenMessages === 0) {
          const mentionIndex = room.mentioned.findIndex(
            (item) => item === userInfo.id
          );
          if (mentionIndex !== -1) {
            const newMentiond = [...room.mentioned];
            newMentiond.splice(mentionIndex, 1);

            const updateMentionRoom = async () => {
              const docRef = doc(db, "rooms", room.id);
              startLoading();
              await setDoc(
                docRef,
                {
                  mentioned: newMentiond,
                },
                {
                  merge: true,
                }
              );
              stopLoading();
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
          return null;
        }
        if (categorySelected !== categoryData?.name) {
          return null;
        }
      }

      if (filterOption === "unseen") {
        if (unseenMessages <= 0) {
          return null;
        }
      }

      const handleImageError = () => {
        // Xử lý khi hình ảnh không tải được (ví dụ: hiển thị biểu tượng thay thế)
        const iconImage = document.querySelector(".icon-image");
        iconImage.style.display = "block";
      };

      const roomItemRenderProps = {
        // ===== DATA =====
        type,
        room, // object room hiện tại
        userInfo, // thông tin user đang đăng nhập
        infoGroup, // thông tin group (photoURL, displayName)
        categoryData, // category của room (color, name)
        unseenMessages, // số tin nhắn chưa đọc
        formatDate, // string ngày đã format

        // ===== STATE =====
        selectedGroupMessaging, // room đang được chọn
        isShowDropdownOption, // { id } hoặc false
        roomDelete, // room cần xoá
        isShowOverlayModalConfirmDelete, // boolean

        // ===== HANDLERS =====
        toogleBoxChatGroup, // function click chọn room
        setIsShowDropdownOption, // set dropdown option
        setRoomDelete, // set room delete
        setIsShowOverlayModalConfirmDelete, // show modal confirm delete

        // ===== COMPONENT / ASSET =====
        AvatarGroup, // component avatar group
        avatarDefault, // ảnh fallback
      };

      return roomItemRenderProps;
    }

  }).filter((room) => room !== null) : [];


  const roomlist = filterRoom.map(({
    type,
    roomId,
    uidSelected,
    partner,
    category,
    lastMessage,
    unseenMessages,
    onDeleteRoom,
    room,
    infoGroup,
    formatDate,
    categoryData,
  }) => {
    const roomItemProps = {
      type,
      roomId,
      uidSelected,
      partner,
      category,
      lastMessage,
      unseenMessages,
      onDeleteRoom,
      room,
      infoGroup,
      formatDate,
      categoryData,
      //
      selectedUserMessaging,
      toogleBoxChat,
      avatarDefault,
      userInfo,
      isShowDropdownOption,
      setIsShowDropdownOption,
      toogleBoxChatGroup,
      selectedGroupMessaging,
      setRoomDelete,
      setIsShowOverlayModalConfirmDelete
    }

    const key =
      type === "group"
        ? room.id
        : roomId;

    return <RoomItem {...roomItemProps} key={key} />;
  });


  useEffect(() => {
    if (roomlist.length < 1) setHasMore(false);
  }, [roomlist?.length]);

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
    startLoading();
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
    stopLoading();
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

  const fetchMoreData = async () => {
    if (!hasMore) return;
    startLoading();
    await loadMoreRooms();
    stopLoading();
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
                    onClick={() => setFilterOption("all")}
                    style={filterOption === "all" ? { color: "#005ae0" } : {}}
                  >
                    Tất cả
                  </div>
                  <div
                    className="menu-left__item menu-left__item--unseen"
                    onClick={() => setFilterOption("unseen")}
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
              <div className="room-list" id="parentScrollDiv">
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

                <InfiniteScroll
                  dataLength={rooms.length}
                  next={fetchMoreData}
                  hasMore={hasMore}
                  loader={<RoomItemSkeleton />}
                  scrollableTarget="parentScrollDiv"
                >
                  {roomlist}
                </InfiniteScroll>

                {
                  !filterRoom[0] &&
                  filterOption === "unseen" && !categorySelected && (
                    <div className="empty-message">
                      <img
                        src={emptyMessageUnssenImage}
                        alt=""
                        className="empty-message__img"
                      />
                      <span>Không có tin nhắn chưa đọc</span>
                    </div>
                  )
                }

                {!filterRoom[0] &&
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

      {
        isShowOverlayModal && (
          <ModalCreateGroup setIsShowOverlayModal={setIsShowOverlayModal} />
        )
      }

      {
        isShowOverlayModalConfirmDelete && (
          <ModalConfirm
            setIsShowOverlayModalConfirmDelete={
              setIsShowOverlayModalConfirmDelete
            }
            handleDeleteRoomChat={handleDeleteRoomChat}
          />
        )
      }
    </S.Wrapper >
  );
};

export default MessagePage;
