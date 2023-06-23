import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  useRef,
} from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import * as S from "./styles";
import { UserLayoutContext } from "layouts/user/UserLayout";
import { AppContext } from "Context/AppProvider";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
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
import { generateKeywords } from "services";

const MessagePage = () => {
  const {
    isShowBoxChat,
    setIsShowBoxChat,
    setTotalUnseenMessage,
    isShowBoxChatGroup,
    setIsShowBoxChatGroup,
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

  const toogleBoxChat = ({
    uidSelected,
    photoURLSelected,
    displayNameSelected,
  }) => {
    setIsShowBoxChatGroup(false);
    setSelectedGroupMessaging(false);
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

  const handleFilterOption = (value) => {
    setFilterOption(value);
  };

  const [infoPartner, setInfoPartner] = useState([]);

  useEffect(() => {
    if (rooms[0]) {
      const fetchDataAsync = async () => {
        const fetchedData = await fetchData();
        setInfoPartner(fetchedData);
      };

      fetchDataAsync();
    }
  }, [rooms]);

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
          response.docs.map((doc) => {
            const id = doc.id;
            const data = doc.data();
            infoPartner.push({
              id: id,
              displayName: data.displayName,
              photoURL: data.photoURL,
              uid: data.uid,
            });
          });
        } else if (room.category === "group") {
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

          infoPartner.push({
            id: room.id,
            photoURL: avatars,
            displayName: name,
          });
        }
      } else {
        infoPartner.push({
          photoURL:
            "https://res-zalo.zadn.vn/upload/media/2021/6/4/2_1622800570007_369788.jpg",
          displayName: "Cloud của tôi",
          id: "my-cloud",
        });
      }
    }
    return infoPartner;
  };

  const [keywords, setKeywords] = useState("");

  const renderRooms = useMemo(() => {
    setTotalUnseenMessageRef(0);

    if (!infoPartner[0]) {
      return <></>;
    }

    return rooms?.map((room, index) => {
      if (room.category === "single" || room.category === "my cloud") {
        const formatDate = moment(
          room.messageLastest?.createdAt?.seconds * 1000
        )?.fromNow();
        const uidSelected = room.members.filter(
          (member) => member !== userInfo.uid
        )[0];

        let keywordsName;

        if (room.category === "single") {
          const displayName = infoPartner.find(
            (item) => item.uid === uidSelected
          ).displayName;
          keywordsName = generateKeywords(displayName.toLowerCase());
        } else if (room.category === "my cloud") {
          const displayName = infoPartner.find(
            (item) => item.id === "my-cloud"
          ).displayName;
          keywordsName = generateKeywords(displayName.toLowerCase());
        }

        if (keywords) {
          const isKeywords = keywordsName.includes(keywords.toLowerCase());
          if (!isKeywords) {
            return;
          }
        }

        const infoMyself = room.messagesViewed.find(
          (item) => item.uid === userInfo.uid
        );

        const unseenMessages = room.totalMessages - infoMyself.count;

        setTotalUnseenMessageRef((current) => current + unseenMessages);

        if (filterOption === "unseen") {
          if (unseenMessages <= 0) {
            return;
          }
        }

        return (
          <div
            key={room.id}
            className={
              uidSelected === selectedUserMessaging.uidSelected
                ? "room-item room-item--active"
                : "room-item"
            }
            onClick={() =>
              toogleBoxChat({
                uidSelected: uidSelected,
                photoURLSelected: infoPartner[index].photoURL,
                displayNameSelected: infoPartner[index].displayName,
              })
            }
          >
            <div className="room-item__left">
              <img src={infoPartner[index]?.photoURL} alt="" />
              <div className="info">
                <div className="room-name">
                  {infoPartner[index]?.displayName}
                </div>
                <div className="new-message">
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
          </div>
        );
      }
      if (room.category === "group") {
        const infoGroup = infoPartner.find((item) => item.id === room.id);

        const formatDate = moment(
          room.messageLastest?.createdAt?.seconds * 1000
        )?.fromNow();

        const infoMyself = room.messagesViewed.find(
          (item) => item.uid === userInfo.uid
        );

        const unseenMessages = room.totalMessages - infoMyself.count;

        setTotalUnseenMessageRef((current) => current + unseenMessages);

        if (filterOption === "unseen") {
          if (unseenMessages <= 0) {
            return;
          }
        }

        return (
          <div
            key={room.id}
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
              {room.avatar?.url && <img src={room.avatar?.url} alt="" />}

              {!room.avatar?.url && (
                <AvatarGroup props={{ room, avatars: infoGroup?.photoURL }} />
              )}

              <div className="info">
                <div className="room-name">
                  {room.name || infoGroup?.displayName}
                </div>
                <div className="new-message">
                  <span className="new-message__author">
                    {room.messageLastest?.uid === userInfo.uid
                      ? "Bạn: "
                      : room?.messageLastest?.displayName &&
                        `${room?.messageLastest?.displayName}:`}
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
                <div className="unseen">
                  {unseenMessages < 5 ? unseenMessages : "N"}
                </div>
              )}
            </div>
          </div>
        );
      }
    });
  }, [
    selectedUserMessaging.uidSelected,
    selectedGroupMessaging.room?.id,
    filterOption,
    infoPartner,
    keywords,
  ]);

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

  return (
    <S.Wrapper>
      <S.Container>
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
              <div className="add-friend">
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
                    className="menu-left__item"
                    onClick={() => handleFilterOption("all")}
                  >
                    Tất cả
                  </div>
                  <div
                    className="menu-left__item"
                    onClick={() => handleFilterOption("unseen")}
                  >
                    Chưa đọc
                  </div>
                </div>
                <div className="menu__right">
                  <div className="menu-right__item">
                    Phân loại &nbsp;{" "}
                    <i className="fa-solid fa-chevron-down"></i>
                  </div>
                  <div
                    className="menu-right__item"
                    style={{ marginRight: "8px", marginLeft: "4px" }}
                  >
                    <i className="fa-solid fa-ellipsis"></i>
                  </div>
                </div>
              </div>
              <div className="room-list">
                {/* <RenderRooms /> */}
                {renderRooms}
                {renderRooms?.length > 0 &&
                  renderRooms?.every((item) => item === undefined) &&
                  filterOption === "unseen" && (
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
                  filterOption === "all" && (
                    <div className="empty-message">
                      <img
                        src={emptyMessageUnssenImage}
                        alt=""
                        className="empty-message__img"
                      />
                      <span>Không có tin nhắn</span>
                    </div>
                  )}
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
                    khám phá tiện ích hổ trợ làm việc và trò chuyện cùng người
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
    </S.Wrapper>
  );
};

export default MessagePage;
